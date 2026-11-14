"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { categoryLabel, roomLabel, type Product } from "@/lib/catalog";
import { site } from "@/lib/site";
import { productMessage, whatsappUrl } from "@/lib/whatsapp";
import { useSelection } from "@/components/selection/SelectionProvider";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Button, ExternalButton } from "@/components/ui/Button";
import { RoomPreview } from "@/components/room/RoomPreview";
import { ProductVisual } from "./ProductVisual";

// Fiche produit (DIRECTION_VISUELLE.md §7) : visuel éteint / allumé, finitions, quantité,
// « Demander sur WhatsApp » et « Ajouter à ma sélection ». Sur mobile, ces deux actions restent
// accessibles dans une barre fixe en bas d'écran (le bouton WhatsApp flottant est alors masqué).

function formatDimensions({ diameter, height, width, depth }: Product["dimensions"]) {
  const parts = [
    diameter && `Ø ${diameter} cm`,
    width && `L ${width} cm`,
    depth && `P ${depth} cm`,
    height && `H ${height} cm`,
  ].filter(Boolean);
  return parts.join(" × ");
}

const ipHints: Record<string, string> = {
  IP20: "intérieur, pièces sèches",
  IP44: "résiste aux projections d'eau",
  IP54: "extérieur abrité, pluie",
  IP65: "extérieur, jets d'eau et poussière",
};

export function ProductDetail({ product }: { product: Product }) {
  const { add, open, hideFab } = useSelection();
  const [lit, setLit] = useState(true);
  const [finishIndex, setFinishIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const finish = product.finishes[finishIndex];
  const path = `/catalogue/${product.slug}`;
  const message = productMessage({
    name: product.name,
    reference: product.reference,
    finish: finish?.name,
    quantity,
    url: `${site.url}${path}`,
  });

  // La barre fixe mobile porte déjà WhatsApp : on masque le bouton flottant sur cette page.
  useEffect(() => hideFab(), [hideFab]);

  useEffect(() => {
    if (!added) return;
    const id = setTimeout(() => setAdded(false), 4000);
    return () => clearTimeout(id);
  }, [added]);

  const addToSelection = () => {
    add(
      { id: product.slug, name: product.name, reference: product.reference, finish: finish?.name, url: path },
      quantity,
    );
    setAdded(true);
  };

  const specs: [string, string][] = [
    ["Référence", product.reference],
    ["Dimensions", formatDimensions(product.dimensions)],
    ["Matière", product.material],
    ["Culot", product.socket],
    ["Puissance", product.power],
    ["Température de couleur", product.colorTemps.map((k) => `${k} K`).join(", ")],
    ["Indice de protection", `${product.ip}${ipHints[product.ip] ? ` (${ipHints[product.ip]})` : ""}`],
    ["Pièces conseillées", product.rooms.map(roomLabel).join(", ")],
  ];

  return (
    <>
      <nav aria-label="Fil d'Ariane" className="text-sm text-fg-2">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link href="/" className="inline-flex min-h-11 items-center hover:text-fg">
              Accueil
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/catalogue" className="inline-flex min-h-11 items-center hover:text-fg">
              Catalogue
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/catalogue?categorie=${product.category}`} className="inline-flex min-h-11 items-center hover:text-fg">
              {categoryLabel(product.category)}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-fg">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-16">
        {/* Visuel */}
        <div className="min-w-0 lg:col-span-7">
          <div data-lit={lit} className="product-visual-host lg:sticky lg:top-[calc(var(--nav-height)+2rem)]">
            <ProductVisual product={product} swatch={finish?.swatch} idPrefix="detail" sizes="(min-width: 1024px) 55vw, 100vw" priority />
            <div className="mt-4 flex gap-2" role="group" aria-label="État du luminaire">
              {[
                { value: false, label: "Éteint" },
                { value: true, label: "Allumé" },
              ].map((option) => (
                <button
                  key={option.label}
                  type="button"
                  aria-pressed={lit === option.value}
                  onClick={() => setLit(option.value)}
                  className={`min-h-11 cursor-pointer rounded-pill border px-5 text-sm transition-colors duration-(--dur-fast) ${
                    lit === option.value ? "border-flamme bg-flamme text-nuit" : "border-line-strong text-fg-2 hover:border-fg hover:text-fg"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {!product.images && (
              <p className="mt-3 text-xs text-fg-2">Illustration provisoire, en attendant les photos du produit.</p>
            )}
            {product.scene && (
              <div className="mt-6">
                <RoomPreview scene={product.scene} productName={product.name} />
              </div>
            )}
          </div>
        </div>

        {/* Informations */}
        <div className="min-w-0 lg:col-span-5">
          <p className="text-sm text-link">{categoryLabel(product.category)}</p>
          <h1 className="mt-2 text-2xl font-extrabold break-words sm:text-3xl lg:text-2xl xl:text-3xl">{product.name}</h1>
          <p className="mt-4 text-sm text-fg-2">Prix sur demande : en showroom ou sur WhatsApp.</p>
          <p className={`mt-1 text-sm ${product.inStock ? "text-fg-2" : "text-laiton"}`}>
            {product.inStock ? "Disponible en showroom" : "Sur commande, délai à confirmer sur WhatsApp"}
          </p>

          <p className="measure mt-6 text-fg-2">{product.description}</p>

          {product.finishes.length > 0 && (
            <fieldset className="mt-8">
              <legend className="text-sm font-semibold">
                Finition : <span className="font-normal text-fg-2">{finish?.name}</span>
              </legend>
              <div className="mt-3 flex flex-wrap gap-3">
                {product.finishes.map((option, index) => (
                  <label key={option.name} className="cursor-pointer" title={option.name}>
                    <input
                      type="radio"
                      name="finition"
                      value={option.name}
                      checked={index === finishIndex}
                      onChange={() => setFinishIndex(index)}
                      className="peer sr-only"
                    />
                    <span
                      className="block size-11 rounded-pill border-2 border-transparent p-1 transition-colors duration-(--dur-fast) peer-checked:border-flamme peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-(--focus-ring)"
                    >
                      <span className="block size-full rounded-pill" style={{ background: option.swatch }} />
                    </span>
                    <span className="sr-only">{option.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <div className="mt-8">
            <span id="quantity-label" className="text-sm font-semibold">
              Quantité
            </span>
            <div className="mt-3 flex w-max items-center rounded-pill border border-line-strong" role="group" aria-labelledby="quantity-label">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="inline-flex size-11 cursor-pointer items-center justify-center text-fg-2 hover:text-fg disabled:cursor-not-allowed disabled:opacity-40"
                disabled={quantity <= 1}
                aria-label="Diminuer la quantité"
              >
                <Minus className="size-4" aria-hidden="true" />
              </button>
              <span className="w-8 text-center tabular-nums" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                className="inline-flex size-11 cursor-pointer items-center justify-center text-fg-2 hover:text-fg"
                aria-label="Augmenter la quantité"
              >
                <Plus className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <ExternalButton href={whatsappUrl(message)}>
              <WhatsAppIcon className="size-5" />
              Demander sur WhatsApp
            </ExternalButton>
            <Button variant="secondary" onClick={addToSelection}>
              {added ? <Check className="size-4" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
              Ajouter à ma sélection
            </Button>
          </div>
          <p className="mt-3 min-h-6 text-sm text-fg-2" aria-live="polite">
            {added && (
              <>
                Ajouté à votre sélection.{" "}
                <button type="button" onClick={open} className="cursor-pointer text-link underline underline-offset-4">
                  Voir ma sélection
                </button>
              </>
            )}
          </p>

          <ul className="mt-6 flex flex-col gap-2 border-t border-line pt-6 text-sm text-fg-2">
            <li>À voir allumé dans nos deux showrooms d&apos;Abidjan</li>
            <li>Livraison à Abidjan</li>
            <li>Suivi après la vente : nous restons joignables</li>
          </ul>

          <h2 className="mt-12 font-body text-lg font-semibold tracking-normal">Caractéristiques</h2>
          <dl className="mt-4 divide-y divide-line border-y border-line text-sm">
            {specs.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 py-3">
                <dt className="text-fg-2">{label}</dt>
                <dd className="tabular-nums text-fg">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Barre fixe mobile */}
      <div className="product-sticky-bar fixed inset-x-0 bottom-0 z-30 border-t border-line bg-penombre/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{product.name}</p>
            <p className="text-sm text-fg-2">Prix sur demande</p>
          </div>
          <button
            type="button"
            onClick={addToSelection}
            className={`inline-flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-pill border ${
              added ? "border-flamme bg-flamme text-nuit" : "border-line-strong text-fg"
            }`}
            aria-label="Ajouter à ma sélection"
          >
            {added ? <Check className="size-5" aria-hidden="true" /> : <Plus className="size-5" aria-hidden="true" />}
          </button>
          <ExternalButton href={whatsappUrl(message)} className="shrink-0 px-5">
            <WhatsAppIcon className="size-5" />
            WhatsApp
          </ExternalButton>
        </div>
      </div>
    </>
  );
}
