"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Passage de la nuit au jour (DIRECTION_VISUELLE.md §2) : au scroll, un dôme plâtre se lève depuis le bas
// de la bande, bordé d'un liseré de lumière dorée, jusqu'à recouvrir toute la largeur et rejoindre
// la section jour suivante. Sans JS ou en mouvement réduit : bande entièrement plâtre (raccord direct).
export function DawnTransition() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ref.current,
          { "--dawn": 0 },
          {
            "--dawn": 1,
            ease: "power1.in",
            scrollTrigger: { trigger: ref.current, start: "top 85%", end: "bottom 40%", scrub: 0.6 },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} aria-hidden="true" className="dawn h-[42svh] md:h-[50svh]">
      <div className="dawn-glow">
        <div className="dawn-sun" />
      </div>
    </div>
  );
}
