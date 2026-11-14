"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@/lib/use-media-query";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { generalMessage, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { ButtonLink, ExternalButton } from "@/components/ui/Button";
import { createHeroState, type HeroState } from "./heroState";
import { LAMP, MOBILE_QUERY } from "./lamp";
import { LampFallback } from "./LampFallback";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Hero « On allume la pièce » (DIRECTION_VISUELLE.md §2, §8, §9).
// 1. Allumage cinématique : gros plan sur le filament qui rougeoit et vacille, recul de la caméra,
//    la lumière balaie le titre depuis la lampe, puis le variateur apparaît (le texte est visible dès l'arrivée).
// 2. La lampe se pousse à la souris ou au doigt : vrai pendule amorti, la lumière du titre suit.
//    Elle réagit aussi quand la souris la frôle (petit élan).
// 3. Poussière dans le faisceau (scène 3D).
// 4. Au scroll, la lampe défile plus lentement que la page et son faisceau s'élargit vers la section suivante.
// Sans JS : rendu allumé (CSS). Mouvement réduit : état final directement, aucun mouvement automatique.

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

let webglSupport: boolean | undefined;
function hasWebGL() {
  if (webglSupport === undefined) {
    try {
      webglSupport = !!document.createElement("canvas").getContext("webgl2");
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}
const noopSubscribe = () => () => {};
const prefersSaveData = () =>
  Boolean(
    (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection?.saveData,
  );

const DEFAULT_INTENSITY = 80;
/** Au-delà, l'allumage démarre même si la 3D n'est pas prête (la lampe SVG prend le relais). */
const MAX_WAIT_FOR_SCENE = 2500;
const MAX_DRAG_ANGLE = 0.65;
/** Mobile : délai après le chargement avant de charger la 3D, pour laisser la page devenir interactive. */
const MOBILE_SCENE_DELAY = 4000;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stateRef = useRef<HeroState>(createHeroState(false));
  const draggingRef = useRef(false);
  const introRef = useRef<gsap.core.Timeline | null>(null);
  const [intensity, setIntensity] = useState(DEFAULT_INTENSITY);
  const [sceneReady, setSceneReady] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [inView, setInView] = useState(true);
  const [deferredReady, setDeferredReady] = useState(false);

  const isMobile = useMediaQuery(MOBILE_QUERY);
  const isClient = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const webgl = useSyncExternalStore(noopSubscribe, hasWebGL, () => false);
  const saveData = useSyncExternalStore(
    noopSubscribe,
    prefersSaveData,
    () => false,
  );
  // Mobile ou économie de données : l'allumage se joue tout de suite avec la lampe SVG, et la 3D (three.js,
  // ~1,5 s de calcul sur un téléphone moyen) n'est chargée qu'une fois la page affichée et le navigateur libre.
  const deferScene = isMobile || saveData;
  const loadScene = webgl && (!deferScene || deferredReady);
  const canStart =
    sceneReady || timedOut || (isClient && (!webgl || deferScene));

  useEffect(() => {
    if (!webgl || !deferScene) return;
    let idleId = 0;
    let timerId = 0;
    const schedule = () => {
      timerId = window.setTimeout(() => {
        if ("requestIdleCallback" in window) {
          idleId = window.requestIdleCallback(() => setDeferredReady(true), {
            timeout: 4000,
          });
        } else {
          setDeferredReady(true);
        }
      }, MOBILE_SCENE_DELAY);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      clearTimeout(timerId);
      if (idleId) window.cancelIdleCallback(idleId);
    };
  }, [webgl, deferScene]);

  useEffect(() => {
    const id = setTimeout(() => setTimedOut(true), MAX_WAIT_FOR_SCENE);
    return () => clearTimeout(id);
  }, []);

  // Met la scène en pause quand le hero sort de l'écran.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting),
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  /** Termine l'allumage immédiatement (scroll, variateur ou lampe touchés pendant la séquence). */
  const finishIntro = () => {
    const intro = introRef.current;
    if (intro && intro.progress() < 1) intro.progress(1);
  };

  useGSAP(
    () => {
      const hero = sectionRef.current;
      if (!canStart || !hero || hero.classList.contains("is-lit")) return;
      const state = stateRef.current;
      const syncIgnite = () =>
        hero.style.setProperty("--ignite", String(state.ignite));
      const syncLift = () =>
        hero.style.setProperty("--lift", String(state.lift));

      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          if (context.conditions?.reduce) {
            Object.assign(state, createHeroState(true));
            gsap.set(hero, { "--ignite": 1, "--sweep": 1 });
            hero.classList.add("is-lit");
            return;
          }

          Object.assign(state, createHeroState(false));
          gsap.set(hero, { "--ignite": 0, "--sweep": 0 });
          hero.classList.add("is-lit");

          // 1. Allumage
          introRef.current = gsap
            .timeline({ defaults: { ease: "power2.out" } })
            .to(state, { filament: 0.5, duration: 0.7, ease: "power1.in" })
            .to(state, { filament: 1, duration: 0.3 })
            .to(state, {
              keyframes: {
                ignite: [0, 0.38, 0.05, 0.55, 0.18, 1],
                easeEach: "none",
              },
              duration: 1.1,
              onUpdate: syncIgnite,
            })
            .to(
              state,
              { camZoom: 1, camFocus: 0, duration: 2.1, ease: "expo.inOut" },
              "<0.2",
            )
            .to(
              hero,
              { "--sweep": 1, duration: 1.6, ease: "power2.inOut" },
              "<0.6",
            )
            .from(
              ".hero-reveal",
              {
                opacity: 0,
                y: 18,
                duration: 0.9,
                stagger: 0.12,
                ease: "expo.out",
                clearProps: "opacity,transform",
              },
              "-=0.9",
            );

          // 4. Sortie au scroll : la lampe traîne (parallaxe), le faisceau s'élargit, le texte glisse plus vite.
          const scrollTrigger = {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          };
          gsap.to(state, {
            lift: 1,
            ease: "none",
            onUpdate: syncLift,
            // Le visiteur défile avant la fin de l'allumage : on termine la séquence tout de suite,
            // sinon il verrait le gros plan de la caméra pendant le scroll.
            scrollTrigger: {
              ...scrollTrigger,
              onUpdate: (self) => self.progress > 0.01 && finishIntro(),
            },
          });
          gsap.to(".hero-content", {
            y: -110,
            opacity: 0,
            ease: "power1.in",
            scrollTrigger,
          });
        },
      );
    },
    { dependencies: [canStart], scope: sectionRef },
  );

  // 2. Pendule : l'angle visé suit le pointeur autour du point d'attache au plafond.
  const aim = useCallback(
    (event: React.PointerEvent) => {
      const hero = sectionRef.current;
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const anchor = isMobile ? LAMP.mobile : LAMP.desktop;
      const pivotX = rect.left + anchor.x * rect.width;
      const pivotY = rect.top + stateRef.current.lift * rect.height * 0.45;
      const angle = Math.atan2(
        event.clientX - pivotX,
        Math.max(event.clientY - pivotY, 1),
      );
      stateRef.current.dragTarget = Math.max(
        -MAX_DRAG_ANGLE,
        Math.min(MAX_DRAG_ANGLE, angle),
      );
    },
    [isMobile],
  );

  // La lampe réagit quand on la frôle : un passage rapide de la souris près de l'abat-jour
  // lui donne un petit élan, proportionnel à la vitesse du geste et à la proximité.
  const brush = useCallback(
    (event: React.PointerEvent) => {
      const hero = sectionRef.current;
      const state = stateRef.current;
      if (!hero || event.pointerType !== "mouse" || draggingRef.current) return;
      const rect = hero.getBoundingClientRect();
      const anchor = isMobile ? LAMP.mobile : LAMP.desktop;
      const bulbX =
        rect.left +
        anchor.x * rect.width +
        Math.sin(state.angle) * rect.height * anchor.y;
      const bulbY = rect.top + (anchor.y + state.lift * 0.45) * rect.height;
      const zone = anchor.radius * 1.8;
      const distance = Math.hypot(
        event.clientX - bulbX,
        event.clientY - (bulbY - anchor.radius * 0.5),
      );
      if (distance > zone) return;
      const impulse = event.movementX * 0.004 * (1 - distance / zone);
      state.velocity = Math.max(-2.5, Math.min(2.5, state.velocity + impulse));
    },
    [isMobile],
  );

  const release = () => {
    draggingRef.current = false;
    stateRef.current.dragTarget = null;
  };

  const onSwing = useCallback((offsetPx: number) => {
    sectionRef.current?.style.setProperty(
      "--swing-px",
      `${offsetPx.toFixed(1)}px`,
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero grain relative flex min-h-svh flex-col overflow-hidden bg-nuit"
      style={{ "--i": intensity / 100 } as React.CSSProperties}
      aria-labelledby="hero-title"
      onPointerMove={brush}
    >
      <div
        aria-hidden="true"
        className="hero-pool pointer-events-none absolute inset-0"
      />

      <LampFallback hidden={sceneReady} />

      {loadScene && (
        <div
          className={`hero-canvas pointer-events-none absolute inset-0 transition-opacity duration-300 ${
            sceneReady ? "opacity-100" : "opacity-0"
          }`}
        >
          <HeroScene
            stateRef={stateRef}
            intensity={intensity / 100}
            isMobile={isMobile}
            running={inView}
            onSwing={onSwing}
            onReady={() => setSceneReady(true)}
          />
        </div>
      )}

      {/* Zone de prise de la lampe (souris et tactile). Le variateur reste l'alternative au clavier. */}
      <div
        aria-hidden="true"
        className="lamp-handle absolute z-10 cursor-grab touch-none active:cursor-grabbing"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          draggingRef.current = true;
          finishIntro();
          aim(event);
        }}
        onPointerMove={(event) => {
          if (draggingRef.current) aim(event);
        }}
        onPointerUp={release}
        onPointerCancel={release}
      />

      <div className="hero-content container-site pointer-events-none relative z-20 mt-auto flex flex-col gap-10 pb-12 pt-[calc(var(--nav-height)+42svh)] md:pb-20 md:pt-[calc(var(--nav-height)+3rem)]">
        <div className="pointer-events-auto">
          <h1 id="hero-title" className="lit-title text-hero font-extrabold">
            <span className="block md:whitespace-nowrap">Chaque pièce</span>
            <span className="block md:whitespace-nowrap">a sa lumière.</span>
          </h1>
          <p className="measure mt-6 text-lg text-fg-2">
            Plus de 2000 luminaires à voir allumés dans nos deux showrooms
            d&apos;Abidjan.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/catalogue">Voir le catalogue</ButtonLink>
            <ExternalButton
              href={whatsappUrl(generalMessage())}
              variant="secondary"
            >
              <WhatsAppIcon className="size-4" />
              Écrire sur WhatsApp
            </ExternalButton>
          </div>
        </div>

        <div className="hero-reveal pointer-events-auto w-full md:absolute md:bottom-20 md:right-(--container-pad) md:w-72">
          <label
            htmlFor="dimmer"
            className="flex items-baseline justify-between text-sm text-fg-2"
          >
            Intensité de la lumière
            <output htmlFor="dimmer" className="tabular-nums text-fg">
              {intensity} %
            </output>
          </label>
          <input
            id="dimmer"
            type="range"
            min={0}
            max={100}
            step={1}
            value={intensity}
            onChange={(event) => {
              finishIntro();
              setIntensity(Number(event.target.value));
            }}
            className="dimmer mt-2 w-full"
          />
          <p className="mt-1 text-xs text-fg-2">
            Vous pouvez aussi pousser la lampe.
          </p>
        </div>
      </div>
    </section>
  );
}
