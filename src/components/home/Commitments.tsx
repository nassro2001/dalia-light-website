"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { generalMessage, projectMessage, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { ExternalButton } from "@/components/ui/Button";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Engagements (DIRECTION_VISUELLE.md §3, §8) : des phrases, pas des cartes numérotées.
// Section jour : au scroll, le texte se révèle mot à mot (du plâtre à l'encre), comme balayé par la lumière.
// Sans JS ou en mouvement réduit : texte entièrement éclairé.
// Suivi d'un encart nuit pour les professionnels de la construction (devis projet sur WhatsApp).

const commitments = [
  { moment: "Avant la vente", sentence: "Vous voyez chaque luminaire allumé dans nos deux showrooms, et nous vous conseillons sans engagement." },
  { moment: "Pendant la vente", sentence: "Des réponses claires sur WhatsApp, avec photos, disponibilités et devis détaillé." },
  { moment: "Après la vente", sentence: "Nous restons joignables : une question de pose, un remplacement, un conseil, vous savez qui appeler." },
];

const projectPoints = [
  "Devis établi sur plans ou sur liste de besoins, pièce par pièce",
  "Tarifs adaptés aux volumes",
  "Un interlocuteur unique, du choix des modèles à la livraison sur chantier",
];

export function Commitments() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".commit-word",
          // Teinte de départ à 3,1:1 sur plâtre : lisible même avant la révélation (texte large, WCAG AA).
          { color: "#8A8072" },
          {
            color: "#2A231B",
            ease: "none",
            stagger: 0.08,
            scrollTrigger: { trigger: ".commit-list", start: "top 78%", end: "bottom 50%", scrub: 0.4 },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="theme-jour pb-(--section-y)" aria-labelledby="commitments-title">
      <div className="container-site border-t border-line pt-(--section-y)">
        <h2 id="commitments-title" className="text-3xl font-extrabold">
          Notre promesse
        </h2>
        <p className="measure mt-4 text-lg text-fg-2">Présents pour la vente, toujours là après.</p>
        <ol className="commit-list mt-10 flex max-w-[34ch] flex-col gap-8 md:max-w-[40ch] md:gap-10">
          {commitments.map(({ moment, sentence }) => (
            <li key={moment}>
              <p className="text-sm font-semibold text-link">{moment}</p>
              <p className="mt-2 font-body text-2xl font-medium leading-snug tracking-tight">
                {sentence.split(" ").map((word, index) => (
                  <span key={`${word}-${index}`} className="commit-word">
                    {word}{" "}
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-12">
          <ExternalButton href={whatsappUrl(generalMessage())} variant="secondary">
            <WhatsAppIcon className="size-4" />
            Demander conseil sur WhatsApp
          </ExternalButton>
        </div>

        <div className="theme-nuit grain relative mt-(--section-y) overflow-hidden px-6 py-12 md:px-12 md:py-16 lg:px-16">
          {/* Halo chaud : l'encart est « éclairé » depuis le coin supérieur. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -top-32 size-[28rem] rounded-pill opacity-60"
            style={{ background: "radial-gradient(circle, rgba(255,184,0,.28) 0%, rgba(255,106,0,.08) 45%, transparent 70%)" }}
          />
          <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="text-sm font-semibold text-link">Promoteurs, architectes, entreprises du bâtiment</p>
              <h3 className="mt-3 text-2xl font-extrabold">Vous construisez&nbsp;? Confiez-nous l&apos;éclairage du projet.</h3>
              <p className="measure mt-5 text-fg-2">
                Immeubles, résidences, bureaux, hôtels, commerces : envoyez-nous vos plans ou votre liste de besoins.
                Nous vous répondons avec un devis complet, des parties communes aux logements.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <ExternalButton href={whatsappUrl(projectMessage())}>
                  <WhatsAppIcon className="size-4" />
                  Demander un devis projet
                </ExternalButton>
              </div>
              <p className="mt-3 text-sm text-fg-2">Ou passez en showroom avec vos plans, sans rendez-vous.</p>
            </div>
            <ul className="flex flex-col gap-5 self-center lg:col-span-5">
              {projectPoints.map((point) => (
                <li key={point} className="flex gap-4 border-t border-line pt-5">
                  <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-pill bg-flamme shadow-[0_0_10px_2px_rgba(255,184,0,.6)]" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
