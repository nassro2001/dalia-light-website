"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Minus, Plus, X } from "lucide-react";
import { selectionMessage, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { ButtonLink, ExternalButton } from "@/components/ui/Button";
import { useSelection } from "./SelectionProvider";

// Tiroir « Ma sélection » : <dialog> natif (piège le focus, ferme avec Échap).
export function SelectionDrawer() {
  const { items, count, isOpen, close, setQuantity, remove, clear } = useSelection();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="selection-title"
      onClose={close}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      className="panel-dialog m-0 ml-auto h-dvh max-h-none w-full max-w-md bg-penombre text-fg backdrop:bg-nuit/70 backdrop:backdrop-blur-sm"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 id="selection-title" className="text-xl font-bold">
            Ma sélection
          </h2>
          <button
            type="button"
            onClick={close}
            className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center text-fg-2 hover:text-fg"
            aria-label="Fermer ma sélection"
          >
            <X className="size-6" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-start justify-center gap-4 px-6">
            <p className="text-lg text-fg">Votre sélection est vide.</p>
            <p className="measure text-sm text-fg-2">
              Ajoutez des luminaires depuis le catalogue, puis envoyez la liste sur WhatsApp : nous vous répondons
              avec les disponibilités et un devis.
            </p>
            <ButtonLink href="/catalogue" variant="secondary" onClick={close}>
              Voir le catalogue
            </ButtonLink>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6">
              {items.map((item) => (
                <li key={`${item.id}-${item.finish ?? ""}`} className="flex gap-4 border-b border-line py-5">
                  <div className="flex-1">
                    <Link href={item.url} onClick={close} className="font-semibold text-fg hover:text-link">
                      {item.name}
                    </Link>
                    <p className="text-sm text-fg-2">
                      Réf. {item.reference}
                      {item.finish ? ` · ${item.finish}` : ""}
                    </p>
                    <button
                      type="button"
                      onClick={() => remove(item.id, item.finish)}
                      className="mt-1 inline-flex min-h-9 cursor-pointer items-center text-sm text-link hover:text-fg"
                    >
                      Retirer
                    </button>
                  </div>
                  <div className="flex items-center self-start rounded-pill border border-line" role="group" aria-label={`Quantité de ${item.name}`}>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.id, item.finish, item.quantity - 1)}
                      className="inline-flex size-11 cursor-pointer items-center justify-center text-fg-2 hover:text-fg"
                      aria-label="Diminuer la quantité"
                    >
                      <Minus className="size-4" aria-hidden="true" />
                    </button>
                    <span className="w-6 text-center tabular-nums" aria-live="polite">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.id, item.finish, item.quantity + 1)}
                      className="inline-flex size-11 cursor-pointer items-center justify-center text-fg-2 hover:text-fg"
                      aria-label="Augmenter la quantité"
                    >
                      <Plus className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 border-t border-line px-6 py-5">
              <p className="text-sm text-fg-2">
                {count} article{count > 1 ? "s" : ""}. Nous vous répondons sur WhatsApp avec les disponibilités et
                un devis.
              </p>
              <ExternalButton href={whatsappUrl(selectionMessage(items))} className="w-full">
                <WhatsAppIcon className="size-5" />
                Envoyer ma sélection sur WhatsApp
              </ExternalButton>
              <button
                type="button"
                onClick={clear}
                className="inline-flex min-h-11 cursor-pointer items-center justify-center text-sm text-fg-2 hover:text-fg"
              >
                Vider la sélection
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
