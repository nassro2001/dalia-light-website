import { cacheLife, cacheTag } from "next/cache";
import { categoryLabel, productLabel } from "./families";
import { markScenes } from "./photo-kind";
import { webImages } from "./web-images";
import { webNames } from "./web-names";
import { isSecondaryLight, lightGroupFor, type LightGroup } from "./web-lights";
import { productSlug, slugify } from "./slug";
import type { Category, LightOption, Product, ProductPage, Showroom } from "./types";

// Lecture du catalogue publié dans l'ERP (routes /api/site, réservées au serveur du site par une clé).
// Variables : ERP_API_URL (ex. http://dalia-light-inventory.railway.internal:3001 sur le réseau privé Railway)
// et SITE_API_KEY (la même valeur que dans l'ERP).
//
// Les lectures sont mises en cache quelques minutes : un article coché dans l'ERP apparaît sur le site
// au plus tard après ce délai, sans redéploiement. Sans ERP joignable (build local, panne), le catalogue
// est simplement vide : le site reste en ligne.

// En ligne, le catalogue est relu toutes les quelques minutes. En local (npm run dev), presque tout de suite :
// un article masqué ou modifié dans l'ERP disparaît ou change au rafraîchissement suivant.
// Pas moins de stale 30 s et expire 5 min : en dessous, Next.js traite le cache comme « court », le retire du
// prérendu et exige un <Suspense> autour de chaque lecture (erreur « uncached data during prerendering »).
const CATALOGUE_CACHE =
  process.env.NODE_ENV === "development"
    ? { stale: 30, revalidate: 1, expire: 300 }
    : { stale: 300, revalidate: 60, expire: 3600 }; // = profil « minutes »

type ErpProduct = {
  id: string;
  name: string;
  reference: string;
  description: string | null;
  images: string[];
  available: boolean;
  category: { id: string; name: string };
};

export function erpConfigured() {
  return Boolean(process.env.ERP_API_URL && process.env.SITE_API_KEY);
}

export async function erpFetch(path: string, init?: RequestInit & { visitorIp?: string }) {
  const base = process.env.ERP_API_URL?.replace(/\/+$/, "");
  const key = process.env.SITE_API_KEY;
  if (!base || !key) throw new Error("ERP non configuré (ERP_API_URL, SITE_API_KEY)");
  const { visitorIp, ...rest } = init ?? {};
  return fetch(`${base}/api/site${path}`, {
    ...rest,
    headers: {
      "content-type": "application/json",
      "x-site-key": key,
      ...(visitorIp ? { "x-visitor-ip": visitorIp } : {}),
      ...rest.headers,
    },
    signal: rest.signal ?? AbortSignal.timeout(8000),
  });
}

async function readJson<T>(path: string, fallback: T): Promise<T> {
  if (!erpConfigured()) return fallback;
  try {
    const res = await erpFetch(path);
    if (!res.ok) {
      console.error(`ERP ${path} : ${res.status}`);
      return fallback;
    }
    return (await res.json()) as T;
  } catch (error) {
    console.error(`ERP ${path} injoignable`, error);
    return fallback;
  }
}

/** Mise en scène d'ouverture d'une applique LED : intérieur dans sa teinte, sinon la première qui existe. */
function leadScene(group: LightGroup, reference: string): string | undefined {
  const cct = group.lights.find((l) => l.ref === reference)?.cct ?? group.lights[0].cct;
  const decors = Object.values(group.scenes);
  return group.scenes.interieur?.[cct] ?? decors.map((d) => d?.[cct]).find(Boolean) ?? decors.flatMap((d) => Object.values(d ?? {})).find(Boolean);
}

function toProduct(p: ErpProduct): Product {
  const group = lightGroupFor(p.reference);
  const images = webImages(p.id, p.reference, p.images);
  const lead = group && leadScene(group, p.reference);
  return {
    id: p.id,
    slug: productSlug(p.name, p.id),
    reference: p.reference,
    name: webNames[p.id] ?? webNames[p.reference] ?? productLabel(p.name),
    description: p.description,
    // Le nom s'écrit comme dans une phrase ; l'adresse garde le nom de l'ERP, pour que les liens restent stables.
    category: { id: p.category.id, name: categoryLabel(p.category.name), slug: slugify(p.category.name) },
    images: lead ? [lead, ...images.filter((src) => src !== lead)] : images,
    available: p.available,
    // Les autres teintes (autres références) sont retrouvées par la fiche produit : voir withLightOptions.
    lights: group
      ? {
          options: group.lights
            .filter((l) => l.ref === p.reference)
            .map((l) => ({ cct: l.cct, reference: p.reference, id: p.id, image: p.images[0] })),
          scenes: group.scenes,
        }
      : undefined,
  };
}

/** Fiche d'une applique LED : retrouve dans l'ERP les références des autres teintes (celles publiées seulement). */
async function withLightOptions(product: Product): Promise<Product> {
  const group = lightGroupFor(product.reference);
  if (!group || !product.lights) return product;
  const empty: ErpProductPage = { data: [], pagination: { total: 0, totalPages: 0, page: 1 } };
  const options: LightOption[] = [];
  for (const light of group.lights) {
    const own = product.lights.options.find((o) => o.reference === light.ref);
    if (own) {
      options.push({ ...own, cct: light.cct });
      continue;
    }
    const res = await readJson<ErpProductPage>(`/products?${new URLSearchParams({ search: light.ref, limit: "10" })}`, empty);
    const row = res.data.find((r) => r.reference === light.ref);
    if (row) options.push({ cct: light.cct, reference: row.reference, id: row.id, image: row.images[0] });
  }
  return { ...product, lights: { ...product.lights, options } };
}

/**
 * Une seule carte par applique LED : les autres teintes se choisissent sur sa fiche. Dans une catégorie, la carte
 * est celle de la première référence du groupe. Dans une recherche, on garde la première du groupe trouvée (la
 * recherche « 2348/WH » mène quand même à la fiche, où l'on choisit la teinte).
 */
function oneCardPerLight(rows: ErpProduct[], searching: boolean) {
  if (!searching) return rows.filter((r) => !isSecondaryLight(r.reference));
  const seen = new Set<LightGroup>();
  const primaries = new Set(rows.map((r) => r.reference).filter((ref) => lightGroupFor(ref) && !isSecondaryLight(ref)));
  return rows.filter((r) => {
    const group = lightGroupFor(r.reference);
    if (!group) return true;
    if (seen.has(group) || (isSecondaryLight(r.reference) && primaries.has(group.lights[0].ref))) return false;
    seen.add(group);
    return true;
  });
}

/** Les photos entières (mises en scène ajoutées dans l'ERP) remplissent leur cadre : on les repère ici. */
async function withPhotoKinds(products: Product[]): Promise<Product[]> {
  return Promise.all(products.map(async (p) => ({ ...p, images: await markScenes(p.images) })));
}

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife(CATALOGUE_CACHE);
  cacheTag("catalogue");
  const rows = await readJson<Omit<Category, "slug">[]>("/categories", []);
  return rows.map((c) => ({ ...c, name: categoryLabel(c.name), slug: slugify(c.name) }));
}

export async function getProducts({
  q = "",
  categoryId,
  page = 1,
  limit = 24,
}: {
  q?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}): Promise<ProductPage> {
  "use cache";
  cacheLife(CATALOGUE_CACHE);
  cacheTag("catalogue");
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (q.trim()) params.set("search", q.trim());
  if (categoryId) params.set("categoryId", categoryId);
  const res = await readJson<{ data: ErpProduct[]; pagination: { total: number; totalPages: number; page: number } }>(
    `/products?${params}`,
    { data: [], pagination: { total: 0, totalPages: 0, page } },
  );
  const rows = oneCardPerLight(res.data, Boolean(q.trim()));
  return {
    products: await withPhotoKinds(rows.map(toProduct)),
    total: res.pagination.total - (res.data.length - rows.length),
    page: res.pagination.page,
    totalPages: res.pagination.totalPages,
  };
}

type ErpProductPage = { data: ErpProduct[]; pagination: { total: number; totalPages: number; page: number } };

/**
 * Les articles de plusieurs catégories à la fois (une famille : « Lustres et lampadaires »). L'ERP filtre une
 * catégorie par appel : on lit chacune en entier, on fusionne par nom, puis on découpe la page ici.
 */
export async function getFamilyProducts({
  categoryIds,
  q = "",
  page = 1,
  limit = 24,
}: {
  categoryIds: string[];
  q?: string;
  page?: number;
  limit?: number;
}): Promise<ProductPage> {
  "use cache";
  cacheLife(CATALOGUE_CACHE);
  cacheTag("catalogue");
  const empty: ErpProductPage = { data: [], pagination: { total: 0, totalPages: 0, page: 1 } };
  const readAll = async (categoryId: string) => {
    const rows: ErpProduct[] = [];
    for (let p = 1; p <= 20; p++) {
      const params = new URLSearchParams({ page: String(p), limit: "100", categoryId });
      if (q.trim()) params.set("search", q.trim());
      const res = await readJson<ErpProductPage>(`/products?${params}`, empty);
      rows.push(...res.data);
      if (p >= res.pagination.totalPages) break;
    }
    return rows;
  };
  const rows = (await Promise.all(categoryIds.map(readAll))).flat();
  const all = oneCardPerLight(rows, Boolean(q.trim()))
    .map(toProduct)
    .sort((a, b) => a.name.localeCompare(b.name, "fr", { numeric: true, sensitivity: "base" }));
  const totalPages = Math.ceil(all.length / limit);
  const current = Math.min(page, Math.max(1, totalPages));
  return {
    products: await withPhotoKinds(all.slice((current - 1) * limit, current * limit)),
    total: all.length,
    page: current,
    totalPages,
  };
}

export async function getProduct(id: string): Promise<Product | null> {
  "use cache";
  cacheLife(CATALOGUE_CACHE);
  cacheTag("catalogue", `produit-${id}`);
  const row = await readJson<ErpProduct | null>(`/products/${encodeURIComponent(id)}`, null);
  return row ? withLightOptions((await withPhotoKinds([toProduct(row)]))[0]) : null;
}

/** Les showrooms où l'on peut demander un devis, tels que l'ERP les connaît. */
export async function getShowrooms(): Promise<Showroom[]> {
  "use cache";
  cacheLife("hours");
  return readJson<Showroom[]>("/stores", []);
}
