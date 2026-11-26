"use client";

import Image from "next/image";
import { useState } from "react";
import { ZoomIn } from "lucide-react";
import type { ProductLights } from "@/lib/catalog/types";
import { cctHint, cctLabel, decorLabels, type Cct, type Decor } from "@/lib/catalog/web-lights";

// Applique LED : la mise en scène suit la teinte choisie (3000K, 6000K…) et le décor (intérieur, extérieur).
// Toutes les images sont empilées et passent de l'une à l'autre en fondu ; au changement de teinte, un voile de
// la nouvelle couleur s'allume puis s'efface, comme une lampe qui change de lumière.

const glow: Record<Cct, string> = {
  3000: "rgba(255, 176, 84, 0.85)",
  4000: "rgba(255, 232, 196, 0.85)",
  6000: "rgba(206, 226, 255, 0.85)",
  6500: "rgba(200, 222, 255, 0.85)",
};

export function sceneFor(lights: ProductLights, index: number, decor: Decor | undefined): string | undefined {
  const option = lights.options[index];
  if (!option) return undefined;
  return (decor && lights.scenes[decor]?.[option.cct]) ?? option.image;
}

export function decorsOf(lights: ProductLights): Decor[] {
  return (Object.keys(decorLabels) as Decor[]).filter((d) => Object.values(lights.scenes[d] ?? {}).some(Boolean));
}

type Props = {
  name: string;
  lights: ProductLights;
  index: number;
  decor: Decor | undefined;
  onIndexChange: (index: number) => void;
  onDecorChange: (decor: Decor) => void;
  onZoom: () => void;
};

export function LightSceneViewer({ name, lights, index, decor, onIndexChange, onDecorChange, onZoom }: Props) {
  const [swap, setSwap] = useState(0);
  const current = sceneFor(lights, index, decor);
  const decors = decorsOf(lights);
  const option = lights.options[index];

  // Toutes les vues possibles, chargées d'avance pour que le fondu soit immédiat.
  const layers = [
    ...new Set(
      lights.options.flatMap((_, i) => (decors.length ? decors.map((d) => sceneFor(lights, i, d)) : [sceneFor(lights, i, undefined)])),
    ),
  ].filter((src): src is string => Boolean(src));

  const chooseLight = (i: number) => {
    if (i === index) return;
    onIndexChange(i);
    setSwap((n) => n + 1);
  };

  return (
    <div>
      <button
        type="button"
        onClick={onZoom}
        className="group relative block aspect-square w-full cursor-zoom-in overflow-hidden bg-platre"
        aria-label={`Agrandir la photo de ${name}`}
      >
        {layers.map((src) => (
          <Image
            key={src}
            src={src}
            alt={src === current ? `${name}, ${option ? cctLabel(option.cct) : ""}${decor ? `, ${decorLabels[decor].toLowerCase()}` : ""}` : ""}
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            preload={src === current}
            className={`object-cover transition-opacity duration-700 ease-out motion-reduce:transition-none ${
              src === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {swap > 0 && option && (
          <span key={swap} aria-hidden="true" className="light-swap pointer-events-none absolute inset-0" style={{ "--swap": glow[option.cct] } as React.CSSProperties} />
        )}
        <span
          aria-hidden="true"
          className="absolute bottom-3 right-3 inline-flex size-11 items-center justify-center rounded-pill bg-nuit/60 text-fg backdrop-blur transition-opacity group-hover:opacity-100 md:opacity-70"
        >
          <ZoomIn className="size-5" strokeWidth={1.5} />
        </span>
      </button>

      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:gap-10">
        {lights.options.length > 1 && (
          <fieldset>
            <legend className="text-sm font-semibold">Éclairage</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {lights.options.map((o, i) => (
                <button
                  key={`${o.reference}-${o.cct}`}
                  type="button"
                  aria-pressed={i === index}
                  onClick={() => chooseLight(i)}
                  className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-pill border px-4 text-sm transition-colors ${
                    i === index ? "border-flamme text-fg" : "border-line-strong text-fg-2 hover:text-fg"
                  }`}
                >
                  <span aria-hidden="true" className="size-3 rounded-full" style={{ background: glow[o.cct], boxShadow: `0 0 10px ${glow[o.cct]}` }} />
                  {cctLabel(o.cct)}
                  <span className="text-fg-2">{cctHint(o.cct)}</span>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {decors.length > 1 && (
          <fieldset>
            <legend className="text-sm font-semibold">Décor</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {decors.map((d) => (
                <button
                  key={d}
                  type="button"
                  aria-pressed={d === decor}
                  onClick={() => onDecorChange(d)}
                  className={`inline-flex min-h-11 cursor-pointer items-center rounded-pill border px-4 text-sm transition-colors ${
                    d === decor ? "border-flamme text-fg" : "border-line-strong text-fg-2 hover:text-fg"
                  }`}
                >
                  {decorLabels[d]}
                </button>
              ))}
            </div>
          </fieldset>
        )}
      </div>
    </div>
  );
}
