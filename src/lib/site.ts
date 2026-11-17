import { families } from "./catalog/families";
// Configuration du site.
// Adresses et horaires des showrooms : données du client (15/10/2026).
// Coordonnées GPS et fiches Google Maps : données du client.
// Numéros WhatsApp (aussi affichés comme téléphones) : données du client. Email et réseaux sociaux : encore PROVISOIRES.

/** Plage d'ouverture : jours (0 = dimanche … 6 = samedi) et heures « HH:MM », heure d'Abidjan (UTC+0). */
export type OpeningSlot = { days: number[]; opens: string; closes: string };

export type Showroom = {
  slug: string;
  name: string;
  district: string;
  /** Adresse courte, une ligne. */
  address: string;
  street: string;
  phone: string;
  /** Numéro WhatsApp au format international sans « + » ni espaces. */
  whatsapp: string;
  /** Horaires en une phrase (pied de page, menu mobile). */
  hours: string;
  schedule: OpeningSlot[];
  /** Adresse lue par Google Maps quand les coordonnées GPS ne sont pas encore connues. */
  mapQuery: string;
  /** Coordonnées GPS exactes (fiche Google Maps) : prioritaires sur mapQuery pour la carte et l'itinéraire. */
  geo?: { lat: number; lng: number };
  /** Lien de la fiche Google Maps du magasin (avis, photos). */
  placeUrl?: string;
  /** Repère d'accès, en une phrase. */
  access: string;
  summary: string;
};

// Numéros WhatsApp (format international sans « + » ni espaces, pour wa.me).
const WHATSAPP_RIVIERA = "2250708084747";
const WHATSAPP_TREICHVILLE = "2250777272777";
/** Numéro principal (boutons généraux, sélection, fiches produits) : Treichville. Surchargeable par variable d'environnement. */
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? WHATSAPP_TREICHVILLE;

export const site = {
  name: "Dalia-Light",
  tagline: "La référence du luminaire, c'est nous",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  city: "Abidjan",
  whatsapp: WHATSAPP_NUMBER,
  phone: "+225 07 77 27 27 77",
  email: "contact@dalia-light.ci",
  social: {
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
  },
} as const;

export const nav = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/showrooms", label: "Showrooms" },
] as const;

const WEEKDAYS_8_18: OpeningSlot[] = [{ days: [1, 2, 3, 4, 5, 6], opens: "08:00", closes: "18:00" }];

export const showrooms: Showroom[] = [
  {
    slug: "riviera-palmeraie",
    name: "Riviera Palmeraie",
    district: "Cocody",
    address: "Riviera Palmeraie Triangle, Abidjan",
    street: "Riviera Palmeraie Triangle, rue François Mitterrand, Cocody, Abidjan",
    phone: "+225 07 08 08 47 47",
    whatsapp: WHATSAPP_RIVIERA,
    hours: "Lundi au samedi, 8 h – 18 h",
    schedule: WEEKDAYS_8_18,
    mapQuery: "Hôtel Mirabel, Riviera Palmeraie, Abidjan",
    geo: { lat: 5.3635432, lng: -3.9540105 },
    placeUrl: "https://maps.app.goo.gl/Sv5vazkw5mdPLwTX9",
    access: "En face de l'hôtel Mirabel.",
    summary: "Suspensions, lustres, appliques et éclairage extérieur, présentés allumés.",
  },
  {
    slug: "treichville",
    name: "Treichville",
    district: "Treichville",
    address: "Rue 12, avenue 19, Treichville, Abidjan",
    street: "Rue 12, avenue 19, Treichville, Abidjan",
    phone: "+225 07 77 27 27 77",
    whatsapp: WHATSAPP_TREICHVILLE,
    hours: "Lundi au samedi, 8 h – 18 h",
    schedule: WEEKDAYS_8_18,
    mapQuery: "Restaurant Talaat, Treichville, Abidjan",
    geo: { lat: 5.3025294, lng: -4.0107267 },
    placeUrl: "https://maps.app.goo.gl/agk7zfbDHuXmNBr79",
    access: "En face du restaurant Talaat.",
    summary: "Spots, rails, appliques et solutions pour la maison, les bureaux et les commerces.",
  },
];

/** Destination Google Maps : coordonnées GPS si connues, sinon l'adresse. */
function mapsDestination(showroom: Showroom) {
  return showroom.geo ? `${showroom.geo.lat},${showroom.geo.lng}` : showroom.mapQuery;
}

/** Lien « Itinéraire » : ouvre Google Maps (application sur mobile) avec le trajet jusqu'au showroom. */
export function directionsUrl(showroom: Showroom) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsDestination(showroom))}`;
}

/** Carte intégrée (chargée au clic). */
export function mapEmbedUrl(showroom: Showroom) {
  return `https://www.google.com/maps?q=${encodeURIComponent(mapsDestination(showroom))}&z=17&output=embed`;
}

/** Les familles du catalogue (lib/catalog/families.ts), pour le pied de page et les pages showroom. */
export const categories = families.map(({ slug, label }) => ({ slug, label }));
