// Fonctions pures, utilisables côté client comme côté serveur.

export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** L'adresse d'un article : son nom lisible, puis son identifiant ERP après « -- ». */
export function productSlug(name: string, id: string) {
  return `${slugify(name) || "article"}--${id}`;
}

/** L'identifiant ERP dans l'adresse ; null si l'adresse n'en porte pas. */
export function idFromSlug(slug: string) {
  const id = slug.split("--").pop() ?? "";
  return /^[0-9a-f-]{36}$/i.test(id) ? id : null;
}

export function productPath(product: { slug: string }) {
  return `/catalogue/${product.slug}`;
}

/**
 * Les références ERP s'affichent pendant le travail en local (npm run dev), pour retrouver les articles,
 * et jamais sur le site en ligne : les clients n'en ont pas besoin.
 */
export const showReferences = process.env.NODE_ENV === "development";
