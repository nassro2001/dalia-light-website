import Link from "next/link";
import { directionsUrl, showrooms } from "@/lib/site";
import { OpenBadge } from "@/components/showrooms/Hours";
import { showroomMessage, whatsappUrl } from "@/lib/whatsapp";
import { Hero } from "@/components/hero/Hero";
import { Commitments } from "@/components/home/Commitments";
import { DawnTransition } from "@/components/home/DawnTransition";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { RoomsGallery } from "@/components/home/RoomsGallery";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { ExternalButton } from "@/components/ui/Button";

// Accueil (DIRECTION_VISUELLE.md §7) : nuit → hero 3D, par pièce ; aube ; jour → sélection, engagements, showrooms.
export default function Home() {
  return (
    <>
      <Hero />
      <RoomsGallery />
      <DawnTransition />
      <FeaturedProducts />
      <Commitments />

      <section className="theme-jour pb-(--section-y)" aria-labelledby="showrooms-title">
        <div className="container-site border-t border-line pt-(--section-y)">
          <h2 id="showrooms-title" className="text-3xl font-extrabold">
            Venez la voir allumée.
          </h2>
          <ul className="mt-12 grid gap-10 md:grid-cols-2">
            {showrooms.map((showroom) => (
              <li key={showroom.slug} className="border-t border-line pt-6">
                <h3 className="text-xl font-bold">
                  <Link href={`/showrooms/${showroom.slug}`} className="hover:text-link">
                    {showroom.name}
                  </Link>
                </h3>
                <div className="mt-2">
                  <OpenBadge schedule={showroom.schedule} />
                </div>
                <p className="mt-2 text-fg-2">
                  {showroom.address}
                  <br />
                  {showroom.hours}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <ExternalButton href={directionsUrl(showroom)} variant="secondary">
                    Itinéraire
                  </ExternalButton>
                  <ExternalButton href={whatsappUrl(showroomMessage(showroom.name), showroom.whatsapp)} variant="ghost">
                    <WhatsAppIcon className="size-4" />
                    Prévenir de ma visite
                  </ExternalButton>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
