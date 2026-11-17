"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import type { CategoryVideo } from "@/lib/catalog/web-videos";

// Bandeau d'ambiance en tête d'une sous-catégorie : la vidéo tourne en boucle. Les navigateurs ne lancent une
// vidéo toute seule que muette : le son s'active avec le bouton. Si le visiteur a demandé moins d'animations,
// on reste sur l'image fixe (le bouton son lance alors la vidéo).
export function CategoryVideoBanner({ video, label, product }: { video: CategoryVideo; label: string; product?: { name: string; href: string } }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleSound = () => {
    const el = ref.current;
    if (!el) return;
    el.muted = !muted;
    if (muted) el.play().catch(() => {});
    setMuted(!muted);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (reduce.matches) el.pause();
      else el.play().catch(() => {});
    };
    apply();
    reduce.addEventListener("change", apply);
    return () => reduce.removeEventListener("change", apply);
  }, []);

  return (
    <figure className="relative mt-8 overflow-hidden bg-penombre">
      <video
        ref={ref}
        src={video.src}
        poster={video.poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={`Vidéo d'ambiance : ${label}`}
        style={{ objectPosition: video.focus ?? "50% 35%" }}
        className="aspect-video w-full object-cover md:aspect-[21/9]"
      />
      <button
        type="button"
        onClick={toggleSound}
        aria-pressed={!muted}
        aria-label={muted ? "Activer le son" : "Couper le son"}
        className="absolute right-4 top-4 inline-flex size-11 cursor-pointer items-center justify-center rounded-pill bg-nuit/60 text-ivoire backdrop-blur-sm transition-colors duration-(--dur-fast) hover:bg-nuit/80 hover:text-flamme md:right-6 md:top-6"
      >
        {muted ? <VolumeX className="size-5" aria-hidden="true" /> : <Volume2 className="size-5" aria-hidden="true" />}
      </button>
      {product && (
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-nuit/80 to-transparent px-5 pb-4 pt-12 text-sm text-ivoire md:px-8 md:pb-6">
          Dans la vidéo :{" "}
          <Link href={product.href} className="font-semibold underline decoration-laiton underline-offset-4 hover:text-flamme">
            {product.name}
          </Link>
        </figcaption>
      )}
    </figure>
  );
}
