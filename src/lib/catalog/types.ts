// Modèle du catalogue. Indépendant de la source (fichier local aujourd'hui, CMS plus tard).

export type CategorySlug =
  | "suspensions"
  | "lustres"
  | "plafonniers"
  | "appliques"
  | "lampadaires"
  | "spots-led"
  | "exterieur";

export type RoomSlug =
  | "salon"
  | "salle-a-manger"
  | "chambre"
  | "cuisine"
  | "salle-de-bain"
  | "exterieur"
  | "commerce"
  | "boite-de-nuit";

/** Forme du visuel provisoire (en attendant les photos). */
export type Silhouette =
  | "dome"
  | "globe"
  | "cone"
  | "lustre"
  | "plafonnier"
  | "applique"
  | "lampadaire"
  | "spot"
  | "lanterne";

export type Finish = {
  name: string;
  /** Couleur de la pastille et du laiton du visuel provisoire. */
  swatch: string;
};

export type Product = {
  slug: string;
  reference: string;
  name: string;
  category: CategorySlug;
  rooms: RoomSlug[];
  finishes: Finish[];
  /** Températures de couleur possibles, en kelvins. */
  colorTemps: number[];
  socket: "E27" | "E14" | "GU10" | "LED intégrée";
  ip: string;
  /** Dimensions en centimètres. */
  dimensions: { diameter?: number; height?: number; width?: number; depth?: number };
  material: string;
  /** Puissance maximale conseillée (W) ou puissance LED. */
  power: string;
  summary: string;
  description: string;
  silhouette: Silhouette;
  badge?: "Nouveau" | "Bestseller";
  inStock: boolean;
  /** Photos éteint / allumé (même cadrage). Absentes : visuel provisoire dessiné. */
  images?: { off: string; on: string; alt: string };
  /** Mise en situation 3D (« Voir dans une pièce ») : photo détourée (PNG/WebP transparent) suspendue dans une pièce. */
  scene?: ProductScene;
};

export type ProductScene = {
  /** Image transparente, recadrée au ras du produit (sans la rosace : elle est modélisée en 3D). */
  cutout: string;
  /** Rapport largeur / hauteur de l'image. */
  aspect: number;
  /** Largeur réelle du produit dans l'image, en mètres (ex. diamètre de l'abat-jour). */
  widthM: number;
  /** Position de l'ampoule dans l'image, en fractions (0 à 1, depuis le coin haut gauche). */
  bulb: [number, number];
  /** Ouverture du faisceau (demi-angle, en radians) : large pour un abat-jour évasé. */
  beamAngle: number;
  /** « lustre » : lumière dans toutes les directions, pas de faisceau visible, cadrage plus haut. */
  kind?: "suspension" | "lustre";
  /** Hauteur de l'ampoule (ou du cœur lumineux) au-dessus du sol, en mètres. Par défaut 1,55 m (80 cm au-dessus de la table). */
  bulbHeightM?: number;
  /** Lustre : position de chaque ampoule dans l'image (fractions), pour les halos. */
  bulbs?: [number, number][];
  /** Pièce de la mise en situation : salle à manger (défaut, table sous la lampe), salon (table basse, canapé) ou hall d'hôtel (plafond haut, réception). */
  room?: "salle-a-manger" | "salon" | "hotel";
  /** Points d'accroche en haut de l'image (fractions de la largeur). Par défaut : un seul, au-dessus de l'ampoule. */
  hooks?: number[];
  /** « plafond » : fixé directement au plafond (plafonnier, lustre plafonnier) : ni rosace ni suspente, le haut de
      l'image touche le plafond et bulbHeightM est ignoré. */
  mount?: "suspendu" | "plafond";
  /** Lève le regard de la caméra (mètres) : utile pour un luminaire court collé à un plafond haut. */
  viewLift?: number;
  /** Photo d'un luminaire LED éteint : la 3D le teinte en blanc chaud selon le variateur. */
  led?: boolean;
  /** Suspente jusqu'au plafond : câble noir (défaut) ou chaîne laiton. */
  cord?: "cable" | "chaine";
};
