"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

// Carte chargée à la demande : Google Maps n'est contacté qu'après un clic du visiteur
// (performance et vie privée). Avant le clic, un simple encart avec l'adresse.
export function MapEmbed({ src, address, label }: { src: string; address: string; label: string }) {
  const [shown, setShown] = useState(false);

  if (shown) {
    return (
      <iframe
        title={`Carte : ${label}`}
        src={src}
        className="aspect-[4/3] w-full border-0 md:aspect-video"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }

  return (
    <div className="flex aspect-[4/3] w-full flex-col items-start justify-end gap-3 border border-line bg-bg-raised p-6 md:aspect-video">
      <MapPin className="size-6 text-link" strokeWidth={1.5} aria-hidden="true" />
      <p className="text-sm text-fg-2">{address}</p>
      <button
        type="button"
        onClick={() => setShown(true)}
        className="min-h-11 cursor-pointer rounded-pill border border-line-strong px-5 text-sm text-fg hover:border-fg"
      >
        Afficher la carte
      </button>
      <p className="text-xs text-fg-2">La carte est chargée depuis Google Maps.</p>
    </div>
  );
}
