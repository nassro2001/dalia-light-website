"use server";

import { headers } from "next/headers";
import { erpConfigured, erpFetch, getShowrooms } from "@/lib/catalog/erp";
import type { Showroom } from "@/lib/catalog";

// « Ma sélection » → demande de devis : elle arrive dans l'ERP (Devis, « Site, à chiffrer ») dans le showroom
// choisi, sans prix. Le magasin chiffre puis répond au client sur WhatsApp.

export type QuoteRequestInput = {
  storeId: string;
  clientName: string;
  clientPhone: string;
  message?: string;
  lines: { productId: string; quantity: number }[];
};

export type QuoteRequestResult =
  | { ok: true; number: string; showroom: string }
  | { ok: false; error: string };

export async function listShowrooms(): Promise<Showroom[]> {
  return getShowrooms();
}

export async function sendQuoteRequest(input: QuoteRequestInput): Promise<QuoteRequestResult> {
  if (!erpConfigured()) {
    return { ok: false, error: "La demande en ligne n'est pas encore disponible. Envoyez votre sélection sur WhatsApp." };
  }

  // L'adresse du visiteur : l'ERP freine les demandes en rafale par visiteur, pas par site.
  const h = await headers();
  const visitorIp = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || undefined;

  try {
    const res = await erpFetch("/quote-requests", {
      method: "POST",
      body: JSON.stringify({
        storeId: input.storeId,
        clientName: input.clientName,
        clientPhone: input.clientPhone,
        message: input.message,
        lines: input.lines.slice(0, 100),
      }),
      visitorIp,
    });
    const body = (await res.json().catch(() => ({}))) as { number?: string; store?: { name: string }; error?: string };
    if (!res.ok || !body.number) {
      // Les messages de l'ERP sont écrits pour le client (champ manquant, trop de demandes…).
      return { ok: false, error: body.error ?? "La demande n'a pas pu être envoyée. Réessayez ou écrivez-nous sur WhatsApp." };
    }
    return { ok: true, number: body.number, showroom: body.store?.name ?? "" };
  } catch (error) {
    console.error("Demande de devis : ERP injoignable", error);
    return { ok: false, error: "La demande n'a pas pu être envoyée. Réessayez ou écrivez-nous sur WhatsApp." };
  }
}
