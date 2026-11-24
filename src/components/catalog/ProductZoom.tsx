"use client";

import Image from "next/image";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { isScene } from "@/lib/catalog";

// Photo en grand (fiche produit) : plein écran, un clic ou un toucher agrandit l'image à l'endroit visé, puis la
// souris (ou le doigt qui glisse) déplace la loupe sur le luminaire. Flèches pour passer d'une photo à l'autre,
// Échap pour fermer (<dialog> natif).

const SCALE = 2.5;

export type ProductZoomHandle = { show: () => void };

type Props = {
  images: string[];
  name: string;
  index: number;
  onIndexChange: (index: number) => void;
};

export const ProductZoom = forwardRef<ProductZoomHandle, Props>(function ProductZoom({ images, name, index, onIndexChange }, ref) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  // Décalage de la photo agrandie (px). La position du pointeur sur l'écran (0 à 1) correspond à une position
  // sur la photo : bord gauche de l'écran = bord gauche de la photo, etc. La photo agrandie couvre donc toujours
  // l'écran quand elle est plus grande que lui, même si le pointeur sort de la photo d'origine.
  const [shift, setShift] = useState({ x: 0, y: 0 });
  const natural = useRef<{ w: number; h: number } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const press = useRef<{ x: number; y: number } | null>(null);
  const moved = useRef(false);

  useImperativeHandle(ref, () => ({
    show: () => {
      setZoomed(false);
      setOpen(true);
      dialogRef.current?.showModal();
    },
  }));

  const src = images[index] ?? images[0];
  const count = images.length;

  const go = (step: number) => {
    setZoomed(false);
    onIndexChange((index + step + count) % count);
  };

  const pointAt = (event: { clientX: number; clientY: number; currentTarget: HTMLElement }) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const fx = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const fy = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    // Cadre de la photo affichée (object-contain, marge de 4 % de la largeur), avant agrandissement.
    const pad = rect.width * 0.04;
    const n = natural.current ?? { w: 1, h: 1 };
    const k = Math.min((rect.width - 2 * pad) / n.w, (rect.height - 2 * pad) / n.h);
    const iw = n.w * k;
    const ih = n.h * k;
    const ix = (rect.width - iw) / 2;
    const iy = (rect.height - ih) / 2;
    const axis = (f: number, size: number, start: number, length: number) =>
      length * SCALE > size ? -f * (length * SCALE - size) - start * SCALE : (size - length * SCALE) / 2 - start * SCALE;
    setShift({ x: axis(fx, rect.width, ix, iw), y: axis(fy, rect.height, iy, ih) });
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    press.current = { x: event.clientX, y: event.clientY };
    moved.current = false;
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!zoomed) return;
    if (event.pointerType === "mouse") return pointAt(event);
    if (!press.current) return;
    if (Math.hypot(event.clientX - press.current.x, event.clientY - press.current.y) > 6) moved.current = true;
    pointAt(event);
  };

  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    press.current = null;
    if (moved.current) return; // fin d'un glissement, pas un toucher
    pointAt(event);
    setZoomed((z) => !z);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (count < 2) return;
    if (event.key === "ArrowRight") go(1);
    if (event.key === "ArrowLeft") go(-1);
  };

  const iconButton =
    "pointer-events-auto inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-pill bg-nuit/60 text-fg-2 backdrop-blur hover:text-fg";

  return (
    <dialog
      ref={dialogRef}
      aria-label={`Photos de ${name}`}
      onClose={() => {
        setOpen(false);
        setZoomed(false);
      }}
      onKeyDown={onKeyDown}
      className="room-dialog m-0 h-dvh max-h-none w-full max-w-none bg-nuit text-fg backdrop:bg-nuit"
    >
      <div className="relative h-full">
        <div
          ref={stageRef}
          className={`absolute inset-0 overflow-hidden touch-none select-none ${zoomed ? "cursor-zoom-out" : "cursor-zoom-in"} ${
            src && !isScene(src) ? "bg-platre" : ""
          }`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onClick={onClick}
        >
          {open && src && (
            <div
              className="absolute inset-0 transition-transform duration-200 ease-out motion-reduce:transition-none"
              style={{
                transform: zoomed ? `translate(${shift.x}px, ${shift.y}px) scale(${SCALE})` : "none",
                transformOrigin: "0 0",
              }}
            >
              <Image
                key={src}
                src={src}
                alt={index === 0 ? name : `${name}, vue ${index + 1}`}
                fill
                sizes="200vw"
                quality={90}
                draggable={false}
                onLoad={(event) => {
                  const img = event.currentTarget;
                  natural.current = { w: img.naturalWidth, h: img.naturalHeight };
                }}
                className="object-contain p-[4%]"
              />
            </div>
          )}
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 bg-gradient-to-b from-nuit/80 to-transparent px-(--container-pad) pb-10 pt-5">
          <div className="min-w-0">
            <p className="truncate text-lg font-extrabold">{name}</p>
            {count > 1 && (
              <p className="text-sm tabular-nums text-fg-2">
                {index + 1} / {count}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                if (!zoomed && stageRef.current) {
                  const rect = stageRef.current.getBoundingClientRect();
                  pointAt({ clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2, currentTarget: stageRef.current });
                }
                setZoomed((z) => !z);
              }}
              className={iconButton}
              aria-label={zoomed ? "Réduire la photo" : "Agrandir la photo"}
            >
              {zoomed ? <ZoomOut className="size-6" strokeWidth={1.5} aria-hidden="true" /> : <ZoomIn className="size-6" strokeWidth={1.5} aria-hidden="true" />}
            </button>
            <button type="button" onClick={() => dialogRef.current?.close()} className={iconButton} aria-label="Fermer les photos">
              <X className="size-6" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>

        {count > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} className={`${iconButton} absolute left-3 top-1/2 -translate-y-1/2`} aria-label="Photo précédente">
              <ChevronLeft className="size-6" strokeWidth={1.5} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => go(1)} className={`${iconButton} absolute right-3 top-1/2 -translate-y-1/2`} aria-label="Photo suivante">
              <ChevronRight className="size-6" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </>
        )}

        <p className="pointer-events-none absolute inset-x-0 bottom-0 px-(--container-pad) pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center text-xs text-fg-2">
          {zoomed ? "Déplacez la souris ou faites glisser pour explorer. Touchez pour réduire." : "Touchez ou cliquez sur la photo pour zoomer."}
        </p>
      </div>
    </dialog>
  );
});
