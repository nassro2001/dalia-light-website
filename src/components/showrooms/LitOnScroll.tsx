"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Enveloppe qui « allume » son contenu (data-lit) quand il traverse la bande centrale de l'écran.
// Mouvement réduit : contenu montré allumé (CSS .product-visual-host).
export function LitOnScroll({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.create({
          trigger: element,
          start: "top 75%",
          end: "bottom 20%",
          onToggle: (self) => {
            element.dataset.lit = String(self.isActive);
          },
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`product-visual-host ${className}`}>
      {children}
    </div>
  );
}
