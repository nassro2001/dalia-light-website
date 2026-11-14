"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

// Halo de lumière chaude qui suit la souris (le curseur devient une petite source de lumière).
// - suit avec un léger retard (gsap.quickTo), s'intensifie et se resserre sur les liens et boutons ;
// - s'atténue sur les sections jour (plâtre), disparaît quand la souris quitte la fenêtre ;
// - souris uniquement (hover + pointeur fin), coupé en mouvement réduit. Le curseur natif reste visible.
export function CursorLight() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const light = ref.current;
    if (!light) return;

    const mm = gsap.matchMedia();
    mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const moveX = gsap.quickTo(light, "x", { duration: 0.55, ease: "power3.out" });
      const moveY = gsap.quickTo(light, "y", { duration: 0.55, ease: "power3.out" });
      let state = "";

      const setState = (next: "off" | "nuit" | "jour" | "actif") => {
        if (next === state) return;
        state = next;
        const target = {
          off: { opacity: 0, scale: 0.6 },
          nuit: { opacity: 1, scale: 1 },
          jour: { opacity: 0.35, scale: 0.85 },
          actif: { opacity: 1, scale: 0.55 },
        }[next];
        gsap.to(light, { ...target, duration: 0.35, ease: "power2.out", overwrite: "auto" });
      };

      const onMove = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        moveX(event.clientX);
        moveY(event.clientY);
        const target = event.target instanceof Element ? event.target : null;
        if (target?.closest("a, button, input, label, [role='button']")) setState("actif");
        else if (target?.closest(".theme-jour")) setState("jour");
        else setState("nuit");
      };
      const onLeave = () => setState("off");

      gsap.set(light, { xPercent: -50, yPercent: -50, opacity: 0, scale: 0.6 });
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      return () => {
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
      };
    });
  });

  return <div ref={ref} aria-hidden="true" className="cursor-light" />;
}
