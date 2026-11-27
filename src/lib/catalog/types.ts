// Modèle du catalogue. Les articles viennent de l'ERP (dalia-light-inventory, routes /api/site) :
// seulement ceux cochés « visible sur le site », sans prix ni quantités.

import type { Cct, Decor } from "./web-lights";

export type RoomSlug =
  | "salon"
  | "salle-a-manger"
  | "chambre"
  | "cuisine"
  | "salle-de-bain"
  | "exterieur"
  | "commerce"
  | "boite-de-nuit";

export type Category = {
  id: string;
  name: string;
  /** Pour l'URL : ?categorie=lustres */
  slug: string;
  productCount: number;
};

export type Product = {
  /** Identifiant ERP : c'est lui que porte la demande de devis. */
  id: string;
  /** Nom lisible + identifiant : /catalogue/lustre-cristal-3-feux--<id> */
  slug: string;
  reference: string;
  name: string;
  description: string | null;
  category: { id: string; name: string; slug: string };
  /** Photos du site, détourées (fond transparent). La première sert de vignette. */
  images: string[];
  /** Il en reste en magasin ou en entrepôt ; sinon sur commande. */
  available: boolean;
  /** Appliques LED : teintes de lumière et décors au choix sur la fiche (web-lights.ts). */
  lights?: ProductLights;
};

export type LightOption = {
  cct: Cct;
  reference: string;
  /** Identifiant ERP de cette référence : c'est lui que porte la demande de devis quand cette teinte est choisie. */
  id: string;
  /** Photo de l'ERP de cette référence, montrée tant qu'il n'y a pas de mise en scène pour la teinte. */
  image?: string;
};

export type ProductLights = {
  options: LightOption[];
  /** Mises en scène : décor → teinte → image. */
  scenes: Partial<Record<Decor, Partial<Record<Cct, string>>>>;
  /** Ampoule changeable : pas de teinte fixe. */
  bulb?: boolean;
  /** Texte de la ligne Éclairage, s'il remplace la teinte (web-lights.ts). */
  lighting?: string;
};

export type Showroom = {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
};

export type ProductPage = {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
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
