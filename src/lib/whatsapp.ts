import { site } from "./site";

export type SelectionItem = {
  id: string;
  name: string;
  reference: string;
  finish?: string;
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
  const finish = item.finish ? `, finition ${item.finish}` : "";
  const quantity = item.quantity && item.quantity > 1 ? `${item.quantity} × ` : "";
  return `Bonjour Dalia-Light, je suis intéressé(e) par ${quantity}${item.name} (réf. ${item.reference}${finish}). Est-il disponible ?\n${item.url}`;
}

export function selectionMessage(items: SelectionItem[]) {
  const lines = items.map((item) => {
    const finish = item.finish ? `, ${item.finish}` : "";
    return `• ${item.quantity} × ${item.name} (réf. ${item.reference}${finish})`;
  });
  return [
    "Bonjour Dalia-Light, voici ma sélection :",
    ...lines,
    "",
    "Pouvez-vous me faire un devis ?",
  ].join("\n");
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
