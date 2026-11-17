"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRef } from "react";
import { rooms } from "@/lib/catalog";
import { RoomVisual } from "./RoomVisual";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// « Trouver par pièce » (DIRECTION_VISUELLE.md §7-8) : galerie horizontale, chaque pièce s'allume en arrivant au centre.
// - Ordinateur : la section reste fixe et le scroll vertical fait défiler la galerie (ScrollTrigger pin + containerAnimation).
// - Mobile : défilement horizontal natif avec aimantation, la pièce la plus visible s'allume.
// - Mouvement réduit : défilement natif, pièces montrées allumées (CSS).

const intros: Record<string, string> = {
  salon: "Une lumière principale, une lampe de lecture, une ambiance.",
  "salle-a-manger": "Une suspension bien centrée au-dessus de la table.",
  chambre: "Des appliques douces de part et d'autre du lit.",
  cuisine: "Des suspensions alignées au-dessus du plan de travail.",
  "salle-de-bain": "Une lumière franche au miroir, protégée de l'eau.",
  exterieur: "Une entrée accueillante, des allées balisées.",
  commerce: "Des spots qui mettent la vitrine en valeur.",
  "boite-de-nuit": "Des faisceaux et des ambiances qui se règlent pour la nuit.",
};

const wide = new Set(["salon", "commerce", "boite-de-nuit"]);

export function RoomsGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!section || !viewport || !track) return;
      const tiles = gsap.utils.toArray<HTMLElement>(".room-tile", track);
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        viewport.style.overflowX = "hidden";
        const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
        const slide = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        tiles.forEach((tile) => {
          ScrollTrigger.create({
            trigger: tile,
            containerAnimation: slide,
            start: "left 70%",
            end: "right 30%",
            onToggle: (self) => {
              tile.dataset.lit = String(self.isActive);
            },
          });
        });
        return () => {
          viewport.style.overflowX = "";
        };
      });

      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              (entry.target as HTMLElement).dataset.lit = String(entry.intersectionRatio > 0.6);
            });
          },
          { root: viewport, threshold: [0, 0.6, 1] },
        );
        tiles.forEach((tile) => observer.observe(tile));
        return () => observer.disconnect();
      });
    },
    { scope: sectionRef },
  );

  return (
    // Enveloppe en bloc : sous un parent flex (<main>), ScrollTrigger ne réserverait pas l'espace de défilement du pin.
    <div>
      <section ref={sectionRef} className="grain overflow-hidden bg-nuit py-(--section-y) lg:flex lg:min-h-svh lg:flex-col lg:justify-center lg:py-16" aria-labelledby="rooms-title">
        <div className="container-site">
          <h2 id="rooms-title" className="text-3xl font-extrabold">
            Trouver par pièce
          </h2>
          <p className="measure mt-4 text-lg text-fg-2">
            Chaque pièce a ses usages. Choisissez la vôtre, nous vous montrons les luminaires qui lui conviennent.
          </p>
        </div>

        <div ref={viewportRef} className="scroll-row mt-10 snap-x snap-mandatory overflow-x-auto lg:mt-12">
          <ul ref={trackRef} className="flex w-max gap-4 px-(--container-pad) md:gap-6">
            {rooms.map((room) => {
              return (
                <li
                  key={room.slug}
                  className={`room-tile product-visual-host shrink-0 snap-center lg:w-auto ${
                    wide.has(room.slug) ? "w-[min(82vw,36rem)]" : "w-[min(72vw,24rem)]"
                  }`}
                >
                  <Link href="/catalogue" className="group block">
                    {/* Ordinateur : hauteur fixée par l'écran (la section épinglée doit tenir dans la fenêtre). */}
                    <div
                      className={`relative overflow-hidden bg-penombre lg:h-[min(60svh,34rem)] ${
                        wide.has(room.slug) ? "aspect-[4/5] lg:aspect-[6/5]" : "aspect-[4/5]"
                      }`}
                    >
                      <RoomVisual room={room.slug} label={room.label} />
                      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-nuit via-nuit/70 to-transparent p-5 pt-16 md:p-6 md:pt-20">
                        <h3 className="text-xl font-bold">{room.label}</h3>
                        <p className="mt-1 text-sm text-fg-2">{intros[room.slug]}</p>
                        <p className="mt-3 text-sm text-link group-hover:text-fg">
                          Voir les luminaires
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
