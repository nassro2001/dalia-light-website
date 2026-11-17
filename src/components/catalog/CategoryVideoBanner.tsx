"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { CategoryVideo } from "@/lib/catalog/web-videos";

// Bandeau d'ambiance en tête d'une sous-catégorie : la vidéo tourne en boucle, sans le son. Si le visiteur a
// demandé moins d'animations, on reste sur l'image fixe.
export function CategoryVideoBanner({ video, label, product }: { video: CategoryVideo; label: string; product?: { name: string; href: string } }) {
  const ref = useRef<HTMLVideoElement>(null);

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
