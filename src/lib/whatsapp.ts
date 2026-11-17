import { site } from "./site";

export type SelectionItem = {
  /** Identifiant de l'article dans l'ERP. */
  id: string;
  name: string;
  reference: string;
  finish?: string;
  /** Vignette (photo du site). */
  image?: string;
  quantity: number;
  url: string;
};

export function whatsappUrl(text: string, number: string = site.whatsapp) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function generalMessage() {
  return "Bonjour Dalia-Light, je cherche un luminaire et j'aimerais un conseil.";
}

export function productMessage(item: Omit<SelectionItem, "quantity" | "id"> & { quantity?: number }) {
  // Pas de référence dans le message : le lien suffit à l'équipe pour retrouver l'article.
  const finish = item.finish ? `, finition ${item.finish}` : "";
  const quantity = item.quantity && item.quantity > 1 ? `${item.quantity} × ` : "";
  return `Bonjour Dalia-Light, je suis intéressé(e) par ${quantity}${item.name}${finish}. Est-il disponible ?\n${item.url}`;
}

export function selectionMessage(items: SelectionItem[]) {
  const lines = items.map((item) => {
    const finish = item.finish ? ` (${item.finish})` : "";
    return `• ${item.quantity} × ${item.name}${finish}\n  ${item.url.startsWith("http") ? item.url : `${site.url}${item.url}`}`;
  });
  return [
    "Bonjour Dalia-Light, voici ma sélection :",
    ...lines,
    "",
    "Pouvez-vous me faire un devis ?",
  ].join("\n");
}

/** Après l'envoi de la demande : le client peut relancer sur WhatsApp en citant son numéro de devis. */
export function quoteFollowUpMessage(number: string, showroomName: string) {
  return `Bonjour Dalia-Light, je viens d'envoyer ma demande de devis ${number} depuis le site (${showroomName}).`;
}

export function projectMessage() {
  return [
    "Bonjour Dalia-Light, je prépare un projet de construction et je souhaite un devis pour l'éclairage.",
    "Type de projet (immeuble, résidence, bureaux, hôtel…) :",
    "Nombre de logements ou de niveaux :",
    "Délai du chantier :",
    "Je peux vous envoyer les plans ou la liste des besoins.",
  ].join("\n");
}

export function showroomMessage(showroomName: string) {
  return `Bonjour Dalia-Light, je souhaite passer au showroom ${showroomName}. Quand puis-je venir ?`;
}
