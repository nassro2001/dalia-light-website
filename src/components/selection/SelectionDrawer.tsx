"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Minus, Plus, X } from "lucide-react";
import { quoteFollowUpMessage, selectionMessage, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Button, ButtonLink, ExternalButton } from "@/components/ui/Button";
import { QuoteRequestForm } from "./QuoteRequestForm";
import { useSelection } from "./SelectionProvider";

// Tiroir « Ma sélection » : <dialog> natif (piège le focus, ferme avec Échap).
// Trois temps : la liste, le formulaire de demande de devis (envoyée à l'ERP), puis la confirmation avec le
// numéro du devis. L'envoi de la liste sur WhatsApp reste possible à tout moment.
export function SelectionDrawer() {
  const { items, count, isOpen, close, setQuantity, remove, clear } = useSelection();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState<"list" | "form">("list");
  const [sent, setSent] = useState<{ number: string; showroom: string } | null>(null);

  // À la réouverture, on repart de la liste (et on oublie la confirmation déjà lue).
  useEffect(() => {
    if (isOpen) return;
    const id = setTimeout(() => {
      setStep("list");
      setSent(null);
    }, 300);
    return () => clearTimeout(id);
  }, [isOpen]);

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
          <div className="flex items-center gap-1">
            {step === "form" && !sent && (
              <button
                type="button"
                onClick={() => setStep("list")}
                className="-ml-3 inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center text-fg-2 hover:text-fg"
                aria-label="Revenir à ma sélection"
              >
                <ArrowLeft className="size-5" aria-hidden="true" />
              </button>
            )}
            <h2 id="selection-title" className="text-xl font-bold">
              {sent ? "Demande envoyée" : step === "form" ? "Demander un devis" : "Ma sélection"}
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center text-fg-2 hover:text-fg"
            aria-label="Fermer ma sélection"
          >
            <X className="size-6" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>

        {sent ? (
          <div className="flex flex-1 flex-col items-start justify-center gap-4 px-6">
            <span className="inline-flex size-12 items-center justify-center rounded-pill bg-flamme text-nuit">
              <Check className="size-6" aria-hidden="true" />
            </span>
            <p className="text-lg text-fg">
              Votre demande <span className="font-semibold tabular-nums">{sent.number}</span> est bien arrivée
              {sent.showroom ? ` (${sent.showroom})` : ""}.
            </p>
            <p className="measure text-sm text-fg-2">
              Nous préparons votre devis et vous l&apos;envoyons sur WhatsApp. Pour aller plus vite ou ajouter une
              précision, écrivez-nous en citant ce numéro.
            </p>
            <ExternalButton href={whatsappUrl(quoteFollowUpMessage(sent.number, sent.showroom))} className="w-full">
              <WhatsAppIcon className="size-5" />
              Nous écrire sur WhatsApp
            </ExternalButton>
            <Button variant="ghost" onClick={close} className="w-full">
              Fermer
            </Button>
          </div>
        ) : step === "form" && items.length > 0 ? (
          <QuoteRequestForm
            items={items}
            onSent={(result) => {
              setSent(result);
              clear();
            }}
          />
        ) : items.length === 0 ? (
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
                  <div className="relative size-16 shrink-0 overflow-hidden bg-platre">
                    {item.image && <Image src={item.image} alt="" fill sizes="64px" className="object-contain p-1" />}
                  </div>
                  <div className="min-w-0 flex-1">
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
                {count} article{count > 1 ? "s" : ""}. Demandez votre devis : nous vous répondons sur WhatsApp avec
                les prix et les disponibilités.
              </p>
              <Button onClick={() => setStep("form")} className="w-full">
                Demander un devis
              </Button>
              <ExternalButton href={whatsappUrl(selectionMessage(items))} variant="secondary" className="w-full">
                <WhatsAppIcon className="size-5" />
                Ou envoyer la liste sur WhatsApp
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
