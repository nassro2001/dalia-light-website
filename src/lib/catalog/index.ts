// Ce qui sert au client comme au serveur. Les lectures de l'ERP sont dans ./erp (serveur seulement).

export type { Category, Product, ProductPage, RoomSlug, Showroom } from "./types";
export { idFromSlug, productPath, productSlug, slugify } from "./slug";
export { categoryLabel, families, familyOf, groupByFamily, shortLabel } from "./families";
export type { Family, FamilyGroup } from "./families";

import type { Category, RoomSlug } from "./types";

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

/**
 * La catégorie demandée dans l'URL (?categorie=lustres). Les catégories viennent de l'ERP : on accepte
 * le nom exact, le singulier ou le pluriel (« lustre », « lustres »), pour que les liens du site
 * (pied de page, showrooms) retrouvent la catégorie même si son nom bouge un peu dans l'ERP.
 */
export function findCategory(categories: Category[], slug: string | null | undefined) {
  if (!slug) return null;
  const want = slug.replace(/s$/, "");
  return (
    categories.find((c) => c.slug === slug) ??
    categories.find((c) => c.slug.replace(/s$/, "") === want) ??
    categories.find((c) => c.slug.startsWith(want) || want.startsWith(c.slug.replace(/s$/, ""))) ??
    null
  );
}
