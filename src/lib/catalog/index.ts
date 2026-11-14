import { categories } from "@/lib/site";
import { products } from "./products";
import type { CategorySlug, Product, RoomSlug } from "./types";

export type { Product, CategorySlug, RoomSlug } from "./types";

export const rooms: { slug: RoomSlug; label: string }[] = [
  { slug: "salon", label: "Salon" },
  { slug: "salle-a-manger", label: "Salle à manger" },
  { slug: "chambre", label: "Chambre" },
  { slug: "cuisine", label: "Cuisine" },
  { slug: "salle-de-bain", label: "Salle de bain" },
  { slug: "exterieur", label: "Extérieur" },
  { slug: "commerce", label: "Commerce et hôtel" },
  { slug: "boite-de-nuit", label: "Boîte de nuit et bar" },
];

export const colorTemperatures = [
  { value: 2700, label: "2700 K", hint: "blanc très chaud, ambiance" },
  { value: 3000, label: "3000 K", hint: "blanc chaud, polyvalent" },
  { value: 4000, label: "4000 K", hint: "blanc neutre, travail" },
] as const;

export const sockets = ["E27", "E14", "GU10", "LED intégrée"] as const;

export function getAllProducts() {
  return products;
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function categoryLabel(slug: CategorySlug) {
  return categories.find((category) => category.slug === slug)?.label ?? slug;
}

export function roomLabel(slug: RoomSlug) {
  return rooms.find((room) => room.slug === slug)?.label ?? slug;
}

export function relatedProducts(product: Product, limit = 4) {
  const sameCategory = products.filter((p) => p.slug !== product.slug && p.category === product.category);
  const sameRoom = products.filter(
    (p) => p.slug !== product.slug && p.category !== product.category && p.rooms.some((r) => product.rooms.includes(r)),
  );
  return [...sameCategory, ...sameRoom].slice(0, limit);
}

// ── Filtres du catalogue (reflétés dans l'URL) ─────────────────

export type CatalogFilters = {
  q: string;
  categorie: CategorySlug | null;
  piece: RoomSlug | null;
  temperature: number | null;
  culot: string | null;
  tri: "pertinence" | "nouveautes" | "nom";
};

export const emptyFilters: CatalogFilters = {
  q: "",
  categorie: null,
  piece: null,
  temperature: null,
  culot: null,
  tri: "pertinence",
};

function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

export function filterProducts(list: Product[], filters: CatalogFilters) {
  const query = normalize(filters.q.trim());

  const result = list.filter((product) => {
    if (filters.categorie && product.category !== filters.categorie) return false;
    if (filters.piece && !product.rooms.includes(filters.piece)) return false;
    if (filters.temperature && !product.colorTemps.includes(filters.temperature)) return false;
    if (filters.culot && product.socket !== filters.culot) return false;
    if (query) {
      const haystack = normalize(
        [product.name, product.reference, product.summary, product.material, categoryLabel(product.category)].join(" "),
      );
      if (!query.split(/\s+/).every((word) => haystack.includes(word))) return false;
    }
    return true;
  });

  if (filters.tri === "nouveautes") result.sort((a, b) => Number(b.badge === "Nouveau") - Number(a.badge === "Nouveau"));
  if (filters.tri === "nom") result.sort((a, b) => a.name.localeCompare(b.name, "fr"));
  return result;
}

export function parseFilters(params: URLSearchParams): CatalogFilters {
  const categorie = params.get("categorie");
  const piece = params.get("piece");
  const temperature = Number(params.get("temperature"));
  const tri = params.get("tri");
  return {
    q: params.get("q") ?? "",
    categorie: categories.some((c) => c.slug === categorie) ? (categorie as CategorySlug) : null,
    piece: rooms.some((r) => r.slug === piece) ? (piece as RoomSlug) : null,
    temperature: colorTemperatures.some((t) => t.value === temperature) ? temperature : null,
    culot: sockets.some((s) => s === params.get("culot")) ? params.get("culot") : null,
    tri: tri === "nouveautes" || tri === "nom" ? tri : "pertinence",
  };
}

export function filtersToSearch(filters: CatalogFilters) {
  const params = new URLSearchParams();
  if (filters.q.trim()) params.set("q", filters.q.trim());
  if (filters.categorie) params.set("categorie", filters.categorie);
  if (filters.piece) params.set("piece", filters.piece);
  if (filters.temperature) params.set("temperature", String(filters.temperature));
  if (filters.culot) params.set("culot", filters.culot);
  if (filters.tri !== "pertinence") params.set("tri", filters.tri);
  const search = params.toString();
  return search ? `?${search}` : "";
}

export function activeFilterCount(filters: CatalogFilters) {
  return [filters.piece, filters.temperature, filters.culot].filter(Boolean).length;
}
