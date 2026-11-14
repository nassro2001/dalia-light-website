import type { Metadata } from "next";
import { showrooms } from "@/lib/site";
import { ShowroomBlock } from "@/components/showrooms/ShowroomBlock";

export const metadata: Metadata = {
  title: "Showrooms",
  description:
    "Deux showrooms à Abidjan, à la Riviera Palmeraie (Cocody) et à Treichville, ouverts du lundi au samedi de 8 h à 18 h. Venez voir chaque luminaire allumé avant de choisir.",
};

// Page jour (plâtre) : on vient nous voir.
export default function ShowroomsPage() {
  return (
    <div className="theme-jour pb-(--section-y) pt-[calc(var(--nav-height)+3rem)] md:pt-[calc(var(--nav-height)+5rem)]">
      <div className="container-site">
        <h1 className="text-4xl font-extrabold">Nos showrooms</h1>
        <p className="measure mt-4 text-lg text-fg-2">
          Un luminaire se choisit allumé. Venez voir nos modèles en situation et repartir avec les conseils de nos
          équipes, du lundi au samedi.
        </p>

        <div className="mt-16 flex flex-col">
          {showrooms.map((showroom, index) => (
            <article
              key={showroom.slug}
              id={showroom.slug}
              aria-labelledby={`${showroom.slug}-title`}
              className="scroll-mt-[calc(var(--nav-height)+2rem)] border-t border-line py-(--section-y) first:pt-12"
            >
              <ShowroomBlock showroom={showroom} variant={index} linkToPage />
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
