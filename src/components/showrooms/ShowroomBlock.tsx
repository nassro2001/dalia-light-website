import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { directionsUrl, mapEmbedUrl, type Showroom } from "@/lib/site";
import { showroomMessage, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { ExternalButton } from "@/components/ui/Button";
import { HoursTable, OpenBadge } from "./Hours";
import { LitOnScroll } from "./LitOnScroll";
import { MapEmbed } from "./MapEmbed";
import { ShowroomVisual } from "./ShowroomVisual";

// Un showroom : vitrine qui s'allume au scroll, statut ouvert/fermé, adresse, horaires, actions
// (itinéraire, WhatsApp, appel). Utilisé sur /showrooms (titre h2) et sur la page du showroom (titre h1, carte).

type Props = {
  showroom: Showroom;
  variant: number;
  as?: "h1" | "h2";
  withMap?: boolean;
  linkToPage?: boolean;
};

export function ShowroomBlock({ showroom, variant, as: Heading = "h2", withMap = false, linkToPage = false }: Props) {
  const tel = showroom.phone.replace(/\s/g, "");
  const SubHeading = Heading === "h1" ? "h2" : "h3";
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      <div className="min-w-0 lg:col-span-7">
        <LitOnScroll className="overflow-hidden bg-nuit">
          <ShowroomVisual name={showroom.name} variant={variant} />
        </LitOnScroll>
        {withMap && (
          <div className="mt-6">
            <MapEmbed src={mapEmbedUrl(showroom)} address={showroom.street} label={`Showroom ${showroom.name}`} />
          </div>
        )}
      </div>

      <div className="min-w-0 lg:col-span-5">
        <p className="text-sm text-link">Showroom</p>
        <Heading id={`${showroom.slug}-title`} className={`mt-1 font-extrabold ${Heading === "h1" ? "text-4xl" : "text-3xl"}`}>{showroom.name}</Heading>
        <div className="mt-3">
          <OpenBadge schedule={showroom.schedule} />
        </div>
        <p className="measure mt-5 text-fg-2">{showroom.summary}</p>

        <ul className="mt-6 flex flex-col gap-3 text-sm">
          <li className="flex gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-link" strokeWidth={1.5} aria-hidden="true" />
            <span>
              {showroom.street}
              <br />
              <span className="text-fg-2">{showroom.access}</span>
              {showroom.placeUrl && (
                <>
                  <br />
                  <a
                    href={showroom.placeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex min-h-9 items-center text-link underline-offset-4 hover:underline"
                  >
                    Voir la fiche Google Maps (avis, photos)
                  </a>
                </>
              )}
            </span>
          </li>
          <li className="flex gap-3">
            <Phone className="mt-0.5 size-4 shrink-0 text-link" strokeWidth={1.5} aria-hidden="true" />
            <a href={`tel:${tel}`} className="-my-3 inline-flex min-h-11 items-center tabular-nums hover:text-link">
              {showroom.phone}
            </a>
          </li>
        </ul>

        <div className="mt-8">
          <SubHeading className="font-body text-sm font-semibold tracking-normal">Horaires</SubHeading>
          <div className="mt-3">
            <HoursTable schedule={showroom.schedule} />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ExternalButton href={directionsUrl(showroom)}>Itinéraire</ExternalButton>
          <ExternalButton href={whatsappUrl(showroomMessage(showroom.name), showroom.whatsapp)} variant="secondary">
            <WhatsAppIcon className="size-4" />
            Prévenir de ma visite
          </ExternalButton>
        </div>

        {linkToPage && (
          <Link href={`/showrooms/${showroom.slug}`} className="mt-6 inline-flex min-h-11 items-center text-sm text-link underline-offset-4 hover:underline">
            Tout savoir sur le showroom {showroom.name}
          </Link>
        )}
      </div>
    </div>
  );
}
