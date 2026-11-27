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
  /** Ampoule changeable : la teinte dépend de l'ampoule ; la scène est montrée en blanc chaud. */
  bulb?: boolean;
  /** Texte de la ligne Éclairage de la fiche, quand la teinte seule ne suffit pas (ampoule changeable, orientable…). */
  lighting?: string;
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
  {
    lights: [{ cct: 3000, ref: "8184GY" }],
    bulb: true,
    // Applique LED Lanterne opale (ampoule changeable, montrée en blanc chaud) : salle de bain, mur de jardin au crépuscule.
    scenes: {
      interieur: { 3000: "/catalogue/scenes/led-8184gy-interieur-3000.webp" },
      exterieur: { 3000: "/catalogue/scenes/led-8184gy-exterieur-3000.webp" },
    },
  },
  {
    lights: [{ cct: 6500, ref: "DF1108/MH62-15" }],
    // Applique LED Demi-lune (V vers le bas, blanc froid) : bureau, abri de voiture la nuit.
    scenes: {
      interieur: { 6500: "/catalogue/scenes/led-df1108-interieur-6500.webp" },
      exterieur: { 6500: "/catalogue/scenes/led-df1108-exterieur-6500.webp" },
    },
  },
  {
    lights: [{ cct: 6500, ref: "DF1110/62-13WH" }],
    // Applique LED Caisson (deux V, haut et bas, blanc froid) : salle à manger, mur de piscine la nuit.
    scenes: {
      interieur: { 6500: "/catalogue/scenes/led-df1110-interieur-6500.webp" },
      exterieur: { 6500: "/catalogue/scenes/led-df1110-exterieur-6500.webp" },
    },
  },
  {
    lights: [
      { cct: 3000, ref: "DF2380/62-11" },
      { cct: 6500, ref: "DF2380/62-20" },
    ],
    // Applique LED Coussin (boîtier blanc, deux V haut et bas) : salon au mur vert sauge, balcon d'appartement le soir.
    scenes: {
      interieur: { 3000: "/catalogue/scenes/led-df2380-interieur-3000.webp", 6500: "/catalogue/scenes/led-df2380-interieur-6500.webp" },
      exterieur: { 3000: "/catalogue/scenes/led-df2380-exterieur-3000.webp", 6500: "/catalogue/scenes/led-df2380-exterieur-6500.webp" },
    },
  },
  {
    lights: [
      { cct: 3000, ref: "DF8018/5WW" },
      { cct: 6500, ref: "DF8018/5WH" },
    ],
    // Applique LED Sablier (tube noir, deux faisceaux étroits haut et bas) : cage d'escalier, entrée d'immeuble la nuit.
    scenes: {
      interieur: { 3000: "/catalogue/scenes/led-df8018-interieur-3000.webp", 6500: "/catalogue/scenes/led-df8018-interieur-6500.webp" },
      exterieur: { 3000: "/catalogue/scenes/led-df8018-exterieur-3000.webp", 6500: "/catalogue/scenes/led-df8018-exterieur-6500.webp" },
    },
  },
  {
    lights: [{ cct: 6500, ref: "DF8018/M" }],
    // Applique LED Sablier blanche (même modèle, corps blanc, deux faisceaux haut et bas, blanc froid) : salon au mur bleu nuit, façade en briques la nuit.
    scenes: {
      interieur: { 6500: "/catalogue/scenes/led-df8018-m-interieur-6500.webp" },
      exterieur: { 6500: "/catalogue/scenes/led-df8018-m-exterieur-6500.webp" },
    },
  },
  {
    lights: [{ cct: 6500, ref: "DF8116" }],
    // Applique LED Tube opale (deux V haut et bas, bande opale allumée au milieu, blanc froid) : cuisine ouverte, mur en bardage bois la nuit.
    scenes: {
      interieur: { 6500: "/catalogue/scenes/led-df8116-interieur-6500.webp" },
      exterieur: { 6500: "/catalogue/scenes/led-df8116-exterieur-6500.webp" },
    },
  },
  {
    lights: [
      { cct: 3000, ref: "DF8137/2/62-11" },
      { cct: 6500, ref: "DF8137/62-24" },
    ],
    // Applique LED Volets (boîtier noir à deux volets en trapèze, deux V haut et bas) : salon en lambris de chêne, entrée en pierre la nuit.
    scenes: {
      interieur: { 3000: "/catalogue/scenes/led-df8137-interieur-3000.webp", 6500: "/catalogue/scenes/led-df8137-interieur-6500.webp" },
      exterieur: { 3000: "/catalogue/scenes/led-df8137-exterieur-3000.webp", 6500: "/catalogue/scenes/led-df8137-exterieur-6500.webp" },
    },
  },
  {
    lights: [
      { cct: 3000, ref: "DF8326/62-20" },
      { cct: 6500, ref: "DF8326/62-19" },
    ],
    // Applique LED Bobine dorée (petite, noir et or, deux cônes de lumière haut et bas) : coin de café-restaurant, pilier de portail la nuit.
    scenes: {
      interieur: { 3000: "/catalogue/scenes/led-df8326-interieur-3000.webp", 6500: "/catalogue/scenes/led-df8326-interieur-6500.webp" },
      exterieur: { 3000: "/catalogue/scenes/led-df8326-exterieur-3000.webp", 6500: "/catalogue/scenes/led-df8326-exterieur-6500.webp" },
    },
  },
  {
    lights: [
      { cct: 3000, ref: "DF8627/62-18" },
      { cct: 6500, ref: "DF8627/62-17" },
    ],
    // Applique LED Bobine blanche (même modèle que la Bobine dorée, corps blanc, deux cônes haut et bas) : mur près d'une porte intérieure, façade ocre la nuit.
    scenes: {
      interieur: { 3000: "/catalogue/scenes/led-df8627-interieur-3000.webp", 6500: "/catalogue/scenes/led-df8627-interieur-6500.webp" },
      exterieur: { 3000: "/catalogue/scenes/led-df8627-exterieur-3000.webp", 6500: "/catalogue/scenes/led-df8627-exterieur-6500.webp" },
    },
  },
  {
    lights: [{ cct: 3000, ref: "FX8003/15WBK" }],
    // Applique LED Hublot ovale (cadre noir, diffuseur opale allumé en entier, blanc chaud) : buanderie, porche arrière la nuit.
    scenes: {
      interieur: { 3000: "/catalogue/scenes/led-fx8003-interieur-3000.webp" },
      exterieur: { 3000: "/catalogue/scenes/led-fx8003-exterieur-3000.webp" },
    },
  },
  {
    lights: [{ cct: 3000, ref: "MH62-1" }],
    // Applique LED Arc (petite coque noire, deux V haut et bas) : home cinéma, escalier extérieur la nuit.
    scenes: {
      interieur: { 3000: "/catalogue/scenes/led-mh62-1-interieur-3000.webp" },
      exterieur: { 3000: "/catalogue/scenes/led-mh62-1-exterieur-3000.webp" },
    },
  },
  {
    lights: [{ cct: 3000, ref: "MH62-10/219/MH62-5" }],
    // Applique LED Carré opale (panneau opale allumé sur socle noir, blanc chaud) : salle de sport, devanture le soir.
    scenes: {
      interieur: { 3000: "/catalogue/scenes/led-mh62-10-219-interieur-3000.webp" },
      exterieur: { 3000: "/catalogue/scenes/led-mh62-10-219-exterieur-3000.webp" },
    },
  },
  {
    lights: [{ cct: 3000, ref: "MH62-12/MH62-8" }],
    // Applique LED Trio (barre opale allumée, trois spots qui font chacun un V vers le bas) : cave à vin, passage entre deux maisons la nuit.
    scenes: {
      interieur: { 3000: "/catalogue/scenes/led-mh62-12-interieur-3000.webp" },
      exterieur: { 3000: "/catalogue/scenes/led-mh62-12-exterieur-3000.webp" },
    },
  },
  {
    lights: [{ cct: 3000, ref: "MH62-15" }],
    bulb: true,
    lighting: "3000K, ampoule changeable, applique orientable",
    // Applique LED Cube orientable (cube noir sur un bras, spot à ampoule changeable, tête orientable) : tableau d'un salon, mur de clôture la nuit.
    scenes: {
      interieur: { 3000: "/catalogue/scenes/led-mh62-15-interieur-3000.webp" },
      exterieur: { 3000: "/catalogue/scenes/led-mh62-15-exterieur-3000.webp" },
    },
  },
  {
    lights: [{ cct: 3000, ref: "MH62-15/15W" }],
    // Applique LED Anneau (anneau blanc, disque opale allumé, halo doux dans l'anneau) : chambre au mur vert sauge, porche d'entrée le soir.
    scenes: {
      interieur: { 3000: "/catalogue/scenes/led-mh62-15-15w-interieur-3000.webp" },
      exterieur: { 3000: "/catalogue/scenes/led-mh62-15-15w-exterieur-3000.webp" },
    },
  },
  {
    lights: [{ cct: 3000, ref: "MH62-16/MH62-6" }],
    // Applique LED Galet (ovale opale allumé sur une plaque noire, lueur douce sans faisceau) : salle de bain, mur de patio la nuit.
    scenes: {
      interieur: { 3000: "/catalogue/scenes/led-mh62-16-interieur-3000.webp" },
      exterieur: { 3000: "/catalogue/scenes/led-mh62-16-exterieur-3000.webp" },
    },
  },
  {
    lights: [
      { cct: 3000, ref: "MH62-16WW" },
      { cct: 6500, ref: "MH62-16WH" },
    ],
    // Applique LED Visière (chapeau noir arrondi, face opale bombée allumée, sans faisceau) : cage d'escalier, abri de voiture le soir.
    // Les scènes 6500K arrivent après le choix de mehdi : en attendant, la fiche montre la photo ERP pour 6500K.
    scenes: {
      interieur: { 3000: "/catalogue/scenes/led-mh62-16w-interieur-3000.webp" },
      exterieur: { 3000: "/catalogue/scenes/led-mh62-16w-exterieur-3000.webp" },
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
