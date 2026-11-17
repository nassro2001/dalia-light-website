import { cacheLife, cacheTag } from "next/cache";
import { productSlug, slugify } from "./slug";
import type { Category, Product, ProductPage, Showroom } from "./types";

// Lecture du catalogue publié dans l'ERP (routes /api/site, réservées au serveur du site par une clé).
// Variables : ERP_API_URL (ex. http://dalia-light-inventory.railway.internal:3001 sur le réseau privé Railway)
// et SITE_API_KEY (la même valeur que dans l'ERP).
//
// Les lectures sont mises en cache quelques minutes : un article coché dans l'ERP apparaît sur le site
// au plus tard après ce délai, sans redéploiement. Sans ERP joignable (build local, panne), le catalogue
// est simplement vide : le site reste en ligne.

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

function toProduct(p: ErpProduct): Product {
  return {
    id: p.id,
    slug: productSlug(p.name, p.id),
    reference: p.reference,
    name: p.name,
    description: p.description,
    category: { ...p.category, slug: slugify(p.category.name) },
    images: p.images,
    available: p.available,
  };
}

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalogue");
  const rows = await readJson<Omit<Category, "slug">[]>("/categories", []);
  return rows.map((c) => ({ ...c, slug: slugify(c.name) }));
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
  cacheLife("minutes");
  cacheTag("catalogue");
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (q.trim()) params.set("search", q.trim());
  if (categoryId) params.set("categoryId", categoryId);
  const res = await readJson<{ data: ErpProduct[]; pagination: { total: number; totalPages: number; page: number } }>(
    `/products?${params}`,
    { data: [], pagination: { total: 0, totalPages: 0, page } },
  );
  return {
    products: res.data.map(toProduct),
    total: res.pagination.total,
    page: res.pagination.page,
    totalPages: res.pagination.totalPages,
  };
}

export async function getProduct(id: string): Promise<Product | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalogue", `produit-${id}`);
  const row = await readJson<ErpProduct | null>(`/products/${encodeURIComponent(id)}`, null);
  return row ? toProduct(row) : null;
}

/** Les showrooms où l'on peut demander un devis, tels que l'ERP les connaît. */
export async function getShowrooms(): Promise<Showroom[]> {
  "use cache";
  cacheLife("hours");
  return readJson<Showroom[]>("/stores", []);
}
