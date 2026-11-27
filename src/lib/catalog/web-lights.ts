// Appliques LED : un même luminaire existe en plusieurs teintes de lumière (3000K jaune, 6500K blanc…),
// chacune sous sa propre référence ERP, ou une seule référence qui change de teinte (interrupteur 3 couleurs).
// Sur le site, une seule fiche par luminaire : le client choisit la teinte et le décor (intérieur, extérieur), et
// la mise en scène change en fondu. La référence affichée (et demandée en devis) suit la teinte choisie.
// Provisoire, comme web-images.ts : ces regroupements rejoindront l'ERP avant la mise en ligne.

export type Cct = 3000 | 4000 | 4500 | 6000 | 6500;
export type Decor = "interieur" | "exterieur";

export const decorLabels: Record<Decor, string> = { interieur: "Intérieur", exterieur: "Extérieur" };

export function cctLabel(cct: Cct) {
  return `${cct}K`;
}

/** Comme on le dit en magasin : 3000K « jaune », 4000K ou 4500K « neutre », 6500K « blanc ». */
export function cctHint(cct: Cct) {
  return cct <= 3000 ? "jaune" : cct <= 4500 ? "neutre" : "blanc";
}

export type LightGroup = {
  /** Une ligne par teinte, dans l'ordre d'affichage. Plusieurs teintes peuvent partager la même référence. */
  lights: { cct: Cct; ref: string }[];
  /** Mises en scène générées : décor → teinte → image (public/catalogue/scenes/). */
  scenes: Partial<Record<Decor, Partial<Record<Cct, string>>>>;
};

export const lightGroups: LightGroup[] = [
  {
    lights: [
      { cct: 3000, ref: "2348/WW/MH62-1" },
      { cct: 6500, ref: "2348/WH" },
    ],
    // Applique LED Volute : entrée avec console, façade de villa au crépuscule.
    scenes: {
      interieur: { 3000: "/catalogue/scenes/led-2348-interieur-3000.webp", 6500: "/catalogue/scenes/led-2348-interieur-6500.webp" },
      exterieur: { 3000: "/catalogue/scenes/led-2348-exterieur-3000.webp", 6500: "/catalogue/scenes/led-2348-exterieur-6500.webp" },
    },
  },
  {
    lights: [
      { cct: 3000, ref: "2824J" },
      { cct: 6500, ref: "2824B" },
    ],
    // Applique LED Prisme (double faisceau haut et bas) : coin salon, terrasse de villa au crépuscule.
    scenes: {
      interieur: { 3000: "/catalogue/scenes/led-2824-interieur-3000.webp", 6500: "/catalogue/scenes/led-2824-interieur-6500.webp" },
      exterieur: { 3000: "/catalogue/scenes/led-2824-exterieur-3000.webp", 6500: "/catalogue/scenes/led-2824-exterieur-6500.webp" },
    },
  },
  {
    // Une seule référence, trois teintes : la couleur change à chaque coup d'interrupteur.
    lights: [
      { cct: 3000, ref: "5915/2" },
      { cct: 4500, ref: "5915/2" },
      { cct: 6500, ref: "5915/2" },
    ],
    // Applique LED Pendentifs cristal : salon en soirée, intérieur seulement.
    scenes: {
      interieur: {
        3000: "/catalogue/scenes/led-5915-2-interieur-3000.webp",
        4500: "/catalogue/scenes/led-5915-2-interieur-4500.webp",
        6500: "/catalogue/scenes/led-5915-2-interieur-6500.webp",
      },
    },
  },
  {
    // Une seule teinte : pas de choix d'éclairage, seulement le décor.
    lights: [{ cct: 3000, ref: "78-21" }],
    // Applique LED Galet (faisceaux haut et bas) : chambre le soir, entrée de maison au crépuscule.
    scenes: {
      interieur: { 3000: "/catalogue/scenes/led-78-21-interieur-3000.webp" },
      exterieur: { 3000: "/catalogue/scenes/led-78-21-exterieur-3000.webp" },
    },
  },
  {
    lights: [{ cct: 3000, ref: "AD-WR406-6W" }],
    // Applique LED Ailettes (spot vers le bas) : couloir, façade de villa la nuit.
    scenes: {
      interieur: { 3000: "/catalogue/scenes/led-ad-wr406-6w-interieur-3000.webp" },
      exterieur: { 3000: "/catalogue/scenes/led-ad-wr406-6w-exterieur-3000.webp" },
    },
  },
];

const byRef = new Map<string, LightGroup>();
for (const group of lightGroups) for (const light of group.lights) byRef.set(light.ref, group);

export function lightGroupFor(reference: string): LightGroup | undefined {
  return byRef.get(reference);
}

/** Nom du site suivi du nombre de couleurs de lumière : « Applique LED Volute (2 couleurs dispo) ». */
export function withColourCount(name: string, group: LightGroup | undefined): string {
  const count = group ? new Set(group.lights.map((l) => l.cct)).size : 0;
  return count > 1 ? `${name} (${count} couleurs dispo)` : name;
}

/** Le nom sans « (2 couleurs dispo) », pour y mettre la couleur choisie (devis, WhatsApp). */
export function withoutColourCount(name: string): string {
  return name.replace(/ \(\d+ couleurs dispo\)$/, "");
}

/** Un seul article dont la couleur change avec l'interrupteur (toutes les teintes sous la même référence). */
export function isSwitchable(group: { lights: { ref: string }[] } | { options: { reference: string }[] }): boolean {
  const refs = "lights" in group ? group.lights.map((l) => l.ref) : group.options.map((o) => o.reference);
  return refs.length > 1 && new Set(refs).size === 1;
}

/** La fiche du luminaire porte la première référence du groupe : les autres teintes n'ont pas de carte à elles. */
export function isSecondaryLight(reference: string): boolean {
  const group = byRef.get(reference);
  return Boolean(group && group.lights[0].ref !== reference);
}
