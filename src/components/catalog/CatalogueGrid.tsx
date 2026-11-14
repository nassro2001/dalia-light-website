"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import type { Product } from "@/lib/catalog";
import { ProductCard } from "./ProductCard";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Grille de produits. Au scroll, chaque produit s'allume quand il traverse la bande centrale de l'écran
// et s'éteint en la quittant (DIRECTION_VISUELLE.md §8). Mouvement réduit : produits montrés allumés (CSS).
export function CatalogueGrid({ products, idPrefix = "grid" }: { products: Product[]; idPrefix?: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const key = products.map((product) => product.slug).join("|");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".product-card", ref.current).forEach((card) => {
          ScrollTrigger.create({
            trigger: card,
            start: "top 78%",
            end: "bottom 22%",
            onToggle: (self) => {
              card.dataset.lit = String(self.isActive);
            },
          });
        });
      });
    },
    { scope: ref, dependencies: [key], revertOnUpdate: true },
  );

  return (
    <ul ref={ref} className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
      {products.map((product) => (
        <li key={product.slug}>
          <ProductCard product={product} idPrefix={`${idPrefix}-${product.slug}`} />
        </li>
      ))}
    </ul>
  );
}
