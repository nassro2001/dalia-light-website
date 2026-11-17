import Image from "next/image";
import type { Product } from "@/lib/catalog";

// Visuel produit : la photo du site (détourée, fond transparent) posée sur un fond plâtre, pour qu'un luminaire
// noir reste lisible comme un lustre en cristal. Le halo chaud derrière s'allume au survol ou au passage dans la
// bande centrale de l'écran (classe .visual-lit, voir globals.css et CatalogueGrid).

type Props = {
  product: Pick<Product, "name" | "images">;
  /** Quelle photo de la liste (fiche produit : galerie). */
  index?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

export function ProductVisual({ product, index = 0, sizes = "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 50vw", priority, className = "" }: Props) {
  const src = product.images[index] ?? product.images[0];

  return (
    <div className={`product-visual relative aspect-square overflow-hidden bg-platre ${className}`}>
      <div
        aria-hidden="true"
        className="visual-lit absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 42%, rgba(255,200,90,0.55), rgba(255,160,40,0.18) 45%, transparent 72%)" }}
      />
      {src ? (
        <Image
          src={src}
          alt={index === 0 ? product.name : `${product.name}, vue ${index + 1}`}
          fill
          sizes={sizes}
          className="object-contain p-[8%]"
          preload={priority}
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-encre-70">
          Photo à venir
        </span>
      )}
    </div>
  );
}
