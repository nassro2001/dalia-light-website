"use client";

import { useEffect, useState, useTransition } from "react";
import { listShowrooms, sendQuoteRequest } from "@/app/actions/devis";
import type { Showroom } from "@/lib/catalog";
import type { SelectionItem } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";

// Formulaire de demande de devis : nom, numéro WhatsApp, showroom, message facultatif.
// Les champs restent remplis d'une visite à l'autre (localStorage) : un client qui revient n'a pas à les retaper.

const CONTACT_KEY = "dalia-light:contact";

const field =
  "mt-2 block min-h-12 w-full rounded-lg border border-line-strong bg-transparent px-4 text-base text-fg placeholder:text-fg-2 focus:border-fg focus:outline-none";

function readContact(): { name: string; phone: string; storeId: string } {
  try {
    return { name: "", phone: "", storeId: "", ...JSON.parse(window.localStorage.getItem(CONTACT_KEY) ?? "{}") };
  } catch {
    return { name: "", phone: "", storeId: "" };
  }
}

export function QuoteRequestForm({
  items,
  onSent,
}: {
  items: SelectionItem[];
  onSent: (result: { number: string; showroom: string }) => void;
}) {
  const [showrooms, setShowrooms] = useState<Showroom[] | null>(null);
  const [contact, setContact] = useState(readContact);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let alive = true;
    listShowrooms()
      .then((list) => alive && setShowrooms(list))
      .catch(() => alive && setShowrooms([]));
    return () => {
      alive = false;
    };
  }, []);

  // Un seul showroom : il est choisi d'office.
  const storeId = contact.storeId || (showrooms?.length === 1 ? showrooms[0].id : "");
  const update = (patch: Partial<typeof contact>) => setContact((c) => ({ ...c, ...patch }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      window.localStorage.setItem(CONTACT_KEY, JSON.stringify({ ...contact, storeId }));
    } catch {
      // stockage indisponible : rien à garder
    }
    startTransition(async () => {
      const result = await sendQuoteRequest({
        storeId,
        clientName: contact.name,
        clientPhone: contact.phone,
        message: message.trim() || undefined,
        lines: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
      });
      if (result.ok) onSent({ number: result.number, showroom: result.showroom });
      else setError(result.error);
    });
  };

  return (
    <form onSubmit={submit} className="flex flex-1 flex-col overflow-y-auto">
      <div className="flex flex-col gap-5 px-6 py-6">
        <p className="text-sm text-fg-2">
          {items.length} article{items.length > 1 ? "s" : ""} dans votre demande. Nous vous envoyons le devis sur
          WhatsApp.
        </p>

        <label className="text-sm font-semibold">
          Votre nom
          <input
            required
            minLength={2}
            maxLength={120}
            autoComplete="name"
            value={contact.name}
            onChange={(e) => update({ name: e.target.value })}
            className={field}
          />
        </label>

        <label className="text-sm font-semibold">
          Votre numéro WhatsApp
          <input
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={40}
            pattern="[0-9+ ().-]{8,}"
            placeholder="07 00 00 00 00"
            value={contact.phone}
            onChange={(e) => update({ phone: e.target.value })}
            className={field}
          />
        </label>

        <label className="text-sm font-semibold">
          Showroom
          <select
            required
            value={storeId}
            onChange={(e) => update({ storeId: e.target.value })}
            disabled={!showrooms}
            className={`${field} cursor-pointer bg-penombre`}
          >
            <option value="" disabled>
              {showrooms ? "Choisissez un showroom" : "Chargement…"}
            </option>
            {showrooms?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
                {s.location ? ` (${s.location})` : ""}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-semibold">
          Message <span className="font-normal text-fg-2">(facultatif)</span>
          <textarea
            rows={3}
            maxLength={1000}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Livraison, pose, délai, quantité pour un chantier…"
            className={`${field} py-3`}
          />
        </label>

        {error && (
          <p role="alert" className="rounded-lg border border-braise/40 px-4 py-3 text-sm text-fg">
            {error}
          </p>
        )}
        {showrooms?.length === 0 && (
          <p className="text-sm text-fg-2">
            La demande en ligne est momentanément indisponible. Revenez en arrière pour envoyer votre liste sur WhatsApp.
          </p>
        )}
      </div>

      <div className="mt-auto border-t border-line px-6 py-5">
        <Button type="submit" className="w-full" disabled={pending || !storeId}>
          {pending ? "Envoi…" : "Envoyer ma demande"}
        </Button>
        <p className="mt-3 text-xs text-fg-2">Pas de prix en ligne : chaque devis est préparé par le showroom.</p>
      </div>
    </form>
  );
}
