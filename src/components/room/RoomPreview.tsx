"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { Armchair, X } from "lucide-react";
import type { ProductScene } from "@/lib/catalog/types";
import { useMediaQuery } from "@/lib/use-media-query";
import { Button } from "@/components/ui/Button";
import type { Pointer } from "./RoomScene";

// « Voir dans une pièce » : la scène 3D (three.js) n'est téléchargée qu'à l'ouverture, pour garder la fiche légère.
const RoomScene = dynamic(() => import("./RoomScene"), {
  ssr: false,
  loading: () => <p className="grid h-full place-items-center text-sm text-fg-2">Préparation de la pièce…</p>,
});

const roomTitles = {
  "salle-a-manger": "dans une salle à manger",
  salon: "dans un salon",
  hotel: "dans un hall d'hôtel",
};

export function RoomPreview({ scene, productName }: { scene: ProductScene; productName: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pointer = useRef<Pointer>({ x: 0, y: 0 });
  const [open, setOpen] = useState(false);
  const [intensity, setIntensity] = useState(85);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const show = () => {
    setOpen(true);
    dialogRef.current?.showModal();
  };
  const hide = () => dialogRef.current?.close();

  // Souris : la position règle l'angle de vue. Doigt : on fait glisser.
  const track = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" && event.buttons === 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointer.current.x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
    pointer.current.y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
  };

  return (
    <>
      <Button variant="secondary" onClick={show}>
        <Armchair className="size-4" aria-hidden="true" />
        Voir dans une pièce
      </Button>

      <dialog
        ref={dialogRef}
        aria-labelledby="room-title"
        onClose={() => {
          setOpen(false);
          pointer.current.x = 0;
          pointer.current.y = 0;
        }}
        className="room-dialog m-0 h-dvh max-h-none w-full max-w-none bg-nuit text-fg backdrop:bg-nuit"
      >
        <div className="relative h-full">
          <div className="absolute inset-0 touch-none" onPointerMove={track} onPointerDown={track}>
            {open && <RoomScene scene={scene} intensity={intensity} pointer={pointer} isMobile={isMobile} />}
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 bg-gradient-to-b from-nuit/80 to-transparent px-(--container-pad) pb-10 pt-5">
            <div>
              <p className="text-sm text-link">Mise en situation</p>
              <h2 id="room-title" className="mt-1 text-xl font-extrabold sm:text-2xl">
                {productName} {roomTitles[scene.room ?? "salle-a-manger"]}
              </h2>
            </div>
            <button
              type="button"
              onClick={hide}
              className="pointer-events-auto inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-pill bg-nuit/60 text-fg-2 backdrop-blur hover:text-fg"
              aria-label="Fermer la mise en situation"
            >
              <X className="size-6" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-4 bg-gradient-to-t from-nuit/85 to-transparent px-(--container-pad) pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-12 md:flex-row md:items-end md:justify-between">
            <div className="pointer-events-auto w-full md:w-72">
              <label htmlFor="room-dimmer" className="flex items-baseline justify-between text-sm text-fg-2">
                Intensité de la lumière
                <output htmlFor="room-dimmer" className="tabular-nums text-fg">
                  {intensity} %
                </output>
              </label>
              <input
                id="room-dimmer"
                type="range"
                min={0}
                max={100}
                step={1}
                value={intensity}
                onChange={(event) => setIntensity(Number(event.target.value))}
                className="dimmer mt-2 w-full"
                style={{ "--i": intensity / 100 } as React.CSSProperties}
              />
            </div>
            <p className="max-w-sm text-xs text-fg-2">
              {isMobile ? "Faites glisser pour changer d'angle." : "Déplacez la souris pour changer d'angle."} Pièce de
              synthèse : le luminaire est une vraie photo, sa lumière est simulée.
            </p>
          </div>
        </div>
      </dialog>
    </>
  );
}
