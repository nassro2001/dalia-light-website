"use client";

import { generalMessage, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { useSelection } from "./SelectionProvider";

// Bouton WhatsApp flottant, masqué quand une barre fixe (fiche produit) l'affiche déjà.
export function WhatsAppFab() {
  const { fabHidden } = useSelection();
  if (fabHidden) return null;

  return (
    <a
      href={whatsappUrl(generalMessage())}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Écrire sur WhatsApp"
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-30 grid size-14 place-items-center rounded-pill bg-cta text-cta-fg shadow-panel transition-[filter] duration-(--dur-fast) hover:brightness-110 md:hidden"
    >
      <WhatsAppIcon className="size-6" />
    </a>
  );
}
