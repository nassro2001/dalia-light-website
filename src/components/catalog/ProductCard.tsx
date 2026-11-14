"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Plus } from "lucide-react";
import { categoryLabel, type Product } from "@/lib/catalog";
import { useSelection } from "@/components/selection/SelectionProvider";
import { ProductVisual } from "./ProductVisual";

// Carte produit sans « carte » (DIRECTION_VISUELLE.md §3) : la photo fait le travail.
// Le visuel s'allume au survol (souris) ou quand la carte passe au centre de l'écran (catalogue, voir CatalogueGrid).
export function ProductCard({ product, idPrefix }: { product: Product; idPrefix?: string }) {
  const { add } = useSelection();
  const [added, setAdded] = useState(false);
  const href = `/catalogue/${product.slug}`;

  useEffect(() => {
    if (!added) return;
    const id = setTimeout(() => setAdded(false), 2200);
    return () => clearTimeout(id);
  }, [added]);

  return (
    <article className="product-card product-visual-host group relative flex flex-col">
      <Link href={href} className="block" aria-label={product.name}>
        <ProductVisual product={product} idPrefix={idPrefix} />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-pill bg-nuit/80 px-3 py-1 text-xs font-semibold text-flamme backdrop-blur">
            {product.badge}
          </span>
        )}
      </Link>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-link">{categoryLabel(product.category)}</p>
          <h3 className="mt-1 font-body text-base font-semibold leading-snug tracking-normal">
            <Link href={href} className="hover:text-link">
              {product.name}
            </Link>
          </h3>
        </div>

        <button
          type="button"
          onClick={() => {
            add({
              id: product.slug,
              name: product.name,
              reference: product.reference,
              finish: product.finishes[0]?.name,
              url: href,
            });
            setAdded(true);
          }}
          className={`inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-pill border transition-colors duration-(--dur-fast) ${
            added ? "border-flamme bg-flamme text-nuit" : "border-line-strong text-fg hover:border-fg"
          }`}
          aria-label={added ? `${product.name} ajouté à votre sélection` : `Ajouter ${product.name} à ma sélection`}
        >
          {added ? <Check className="size-4" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
        </button>
      </div>
      <span className="sr-only" aria-live="polite">
        {added ? `${product.name} ajouté à votre sélection` : ""}
      </span>
    </article>
  );
}
