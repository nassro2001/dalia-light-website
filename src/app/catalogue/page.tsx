import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllProducts } from "@/lib/catalog";
import { CatalogueBrowser } from "@/components/catalog/CatalogueBrowser";
import { CatalogueGrid } from "@/components/catalog/CatalogueGrid";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { ExternalButton } from "@/components/ui/Button";
import { generalMessage, whatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Catalogue",
  description:
    "Suspensions, lustres, plafonniers, appliques, lampadaires, spots LED et éclairage extérieur. Une sélection de nos plus beaux modèles, à voir allumés en showroom.",
};

export default function CataloguePage() {
  return (
    <section className="grain bg-nuit pb-(--section-y) pt-[calc(var(--nav-height)+3rem)] md:pt-[calc(var(--nav-height)+5rem)]">
      <div className="container-site">
        <h1 className="text-4xl font-extrabold">Catalogue</h1>
        <p className="measure mt-4 text-lg text-fg-2">
          Une sélection de nos plus beaux luminaires. Ajoutez-les à votre sélection et envoyez-la sur WhatsApp : nous
          vous répondons avec les disponibilités et les prix, qui se discutent aussi directement en showroom.
        </p>

        <div className="mt-12">
          <h2 className="sr-only">Luminaires</h2>
          {/* Les filtres lisent l'URL (useSearchParams) : rendus côté client. En attendant, tout le catalogue est servi
              dans le HTML (lisible sans JS et par les moteurs de recherche). */}
          <Suspense fallback={<CatalogueGrid products={getAllProducts()} idPrefix="ssr" />}>
            <CatalogueBrowser />
          </Suspense>
        </div>

        <div className="mt-16 flex flex-col items-start gap-6 border-t border-line pt-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-body text-xl font-semibold tracking-normal">Vous ne trouvez pas votre modèle ?</h2>
            <p className="measure mt-2 text-fg-2">
              Ce catalogue ne montre qu&apos;une partie de nos références : nos showrooms en présentent bien d&apos;autres.
              Envoyez-nous une photo ou une idée, nous vous proposons ce qui s&apos;en rapproche.
            </p>
          </div>
          <ExternalButton href={whatsappUrl(generalMessage())} className="shrink-0">
            <WhatsAppIcon className="size-4" />
            Nous demander sur WhatsApp
          </ExternalButton>
        </div>
      </div>
    </section>
  );
}
