"use client";

import { useEffect, useRef } from "react";

// Sur mobile, les rangées de catégories défilent à l'horizontale : on amène le choix en cours dans le champ,
// sinon la famille choisie peut rester cachée hors de l'écran.
export function RevealActive({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelectorAll<HTMLElement>("[data-on]").forEach((item) => {
      const row = item.closest<HTMLElement>(".scroll-row");
      if (!row || row.scrollWidth <= row.clientWidth) return;
      row.scrollLeft = item.offsetLeft - row.offsetLeft - (row.clientWidth - item.offsetWidth) / 2;
    });
  });
  return <div ref={ref}>{children}</div>;
}
