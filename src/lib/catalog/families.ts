// Les catégories de l'ERP sont nombreuses et en capitales (« LUSTRE 10 AMP »). Sur le site, on les range en
// quelques familles et on les écrit comme dans une phrase (« Lustre 10 ampoules »). Fonctions pures,
// utilisables côté client comme côté serveur. Une nouvelle catégorie créée dans l'ERP rejoint la famille
// dont elle reprend le premier mot ; sinon elle apparaît dans « Autres ».

import type { Category } from "./types";

export type Family = {
  slug: string;
  label: string;
  /** Repère la famille d'une catégorie, sur son nom en minuscules et sans accents. */
  match: RegExp;
  /** Mot retiré du nom de la catégorie quand elle s'affiche dans sa famille (« Lustre 10 ampoules » → « 10 ampoules »). */
  prefix?: RegExp;
};

export const families: Family[] = [
  { slug: "lustres", label: "Lustres et suspensions", match: /^(lustre|suspension)/, prefix: /^lustres?\s+/i },
  { slug: "appliques", label: "Appliques", match: /^applique/, prefix: /^appliques?\s+/i },
  { slug: "plafonniers", label: "Plafonniers", match: /^(globe|plafonnier|led hexagonale|pannel|panneau|reglette)/ },
  { slug: "spots", label: "Spots", match: /^spot/, prefix: /^spots?\s+/i },
  { slug: "exterieur", label: "Extérieur", match: /^(projecteur|lampadaire|boule|solaire|guirlande|borne|hublot)|jardin/ },
  { slug: "ampoules", label: "Ampoules et rubans LED", match: /^(ampoule|ruban|neon)/ },
  {
    slug: "maison",
    label: "Maison et électricité",
    match:
      /^(interrupteur|prise|dpn|disjoncteur|stabilisateur|automatique|cable|interphone|videophone|sonnerie|detecteur|coffre|robot|aspirateur|ventilateur|climatiseur)/,
  },
];

const OTHERS: Family = { slug: "autres", label: "Autres", match: /$^/ };

function plain(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/\s+/g, " ").trim();
}

// Mots que l'ERP écrit sans accent, en abrégé ou qui doivent rester en capitales.
const WORDS: Record<string, string> = {
  led: "LED",
  dpn: "DPN",
  detecteur: "détecteur",
  encastre: "encastré",
  encastres: "encastrés",
  reglette: "réglette",
  reglettes: "réglettes",
  videophone: "vidéophone",
  pannel: "panneau",
  exterieur: "extérieur",
  electrique: "électrique",
  etanche: "étanche",
  plaque: "plaqué",
  metal: "métal",
};

/** « LUSTRE 10 AMP » → « Lustre 10 ampoules » ; « PANNEL 60 X 60 » → « Panneau 60 × 60 ». */
export function categoryLabel(raw: string) {
  const text = raw
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b(\d+)\s*amp\b\.?/g, (_, n: string) => `${n} ampoule${n === "1" ? "" : "s"}`)
    .replace(/\b(\d+)\s*x\s*(\d+)\b/g, "$1 × $2")
    .replace(/\bcoffre fort\b/g, "coffre-fort")
    .replace(/\bboules jardin\b/g, "boules de jardin")
    .replace(/[\p{L}]+/gu, (word) => WORDS[word] ?? word);
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Le nom ERP d'un article, écrit comme dans une phrase : « AMPOULE 11W B22 JAUNE » → « Ampoule 11W B22 jaune ».
 * Les codes techniques (11W, B22, GU10) restent en capitales.
 */
export function productLabel(raw: string) {
  return categoryLabel(raw).replace(/\b(?=[\p{L}\d]*\d)(?=[\p{L}\d]*\p{L})[\p{L}\d]+\b/gu, (token) => token.toUpperCase());
}

export function familyOf(category: { name: string }): Family {
  const name = plain(category.name);
  return families.find((f) => f.match.test(name)) ?? OTHERS;
}

/** Le nom d'une catégorie affiché dans sa famille, sans le mot de la famille. */
export function shortLabel(category: { name: string }, family: Family) {
  const label = categoryLabel(category.name);
  if (!family.prefix) return label;
  const short = label.replace(family.prefix, "");
  return short === label || !short ? label : short.charAt(0).toUpperCase() + short.slice(1);
}

export type FamilyGroup = Family & { categories: Category[]; productCount: number };

/** Les familles qui ont des articles, dans l'ordre du site, chacune avec ses catégories triées. */
export function groupByFamily(categories: Category[]): FamilyGroup[] {
  const groups = [...families, OTHERS].map((f) => ({ ...f, categories: [] as Category[], productCount: 0 }));
  for (const category of categories) {
    if (category.productCount <= 0) continue;
    const group = groups.find((g) => g.slug === familyOf(category).slug)!;
    group.categories.push(category);
    group.productCount += category.productCount;
  }
  for (const group of groups) {
    group.categories.sort((a, b) =>
      shortLabel(a, group).localeCompare(shortLabel(b, group), "fr", { numeric: true, sensitivity: "base" }),
    );
  }
  return groups.filter((g) => g.categories.length > 0);
}
