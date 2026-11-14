import Link from "next/link";
import { generalMessage, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { ButtonLink, ExternalButton } from "@/components/ui/Button";

// Page introuvable (404).
export default function NotFound() {
  return (
    <section className="grain flex flex-1 items-end bg-nuit pb-(--section-y) pt-[calc(var(--nav-height)+var(--section-y))]">
      <div className="container-site">
        <p className="text-sm text-link">Erreur 404</p>
        <h1 className="mt-2 text-4xl font-extrabold">Cette page est restée dans le noir.</h1>
        <p className="measure mt-6 text-lg text-fg-2">
          L&apos;adresse n&apos;existe pas ou a changé. Retrouvez nos luminaires dans le catalogue, ou{" "}
          <Link href="/showrooms" className="text-link underline-offset-4 hover:underline">
            nos showrooms
          </Link>
          .
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/catalogue">Voir le catalogue</ButtonLink>
          <ExternalButton href={whatsappUrl(generalMessage())} variant="secondary">
            <WhatsAppIcon className="size-4" />
            Écrire sur WhatsApp
          </ExternalButton>
        </div>
      </div>
    </section>
  );
}
