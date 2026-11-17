import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProducts } from "@/lib/catalog";
import { openingHoursSpecification } from "@/lib/hours";
import { categories, showrooms, site } from "@/lib/site";
import { CatalogueGrid } from "@/components/catalog/CatalogueGrid";
import { ShowroomBlock } from "@/components/showrooms/ShowroomBlock";
import { ButtonLink } from "@/components/ui/Button";

// Une page par showroom (référencement local « luminaire Riviera Palmeraie », « luminaire Treichville »…), pré-générée au build.
export function generateStaticParams() {
  return showrooms.map((showroom) => ({ slug: showroom.slug }));
}

export async function generateMetadata({ params }: PageProps<"/showrooms/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const showroom = showrooms.find((s) => s.slug === slug);
  if (!showroom) return {};
  return {
    title: `Showroom ${showroom.name}`,
    description: `Luminaires à ${showroom.district}, Abidjan : ${showroom.summary} ${showroom.hours}.`,
    alternates: { canonical: `/showrooms/${showroom.slug}` },
  };
}

export default async function ShowroomPage({ params }: PageProps<"/showrooms/[slug]">) {
  const { slug } = await params;
  const index = showrooms.findIndex((s) => s.slug === slug);
  if (index === -1) notFound();
  const showroom = showrooms[index];
  const other = showrooms.find((s) => s.slug !== slug);
  const featured = getAllProducts()
    .filter((product) => product.badge)
    .slice(0, 4);

  // Données structurées : magasin local, adresse et horaires (Google, cartes).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: `${site.name} — Showroom ${showroom.name}`,
    url: `${site.url}/showrooms/${showroom.slug}`,
    telephone: showroom.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: showroom.street,
      addressLocality: "Abidjan",
      addressCountry: "CI",
    },
    openingHoursSpecification: openingHoursSpecification(showroom.schedule),
    ...(showroom.geo && {
      geo: { "@type": "GeoCoordinates", latitude: showroom.geo.lat, longitude: showroom.geo.lng },
    }),
    ...(showroom.placeUrl && { hasMap: showroom.placeUrl }),
  };

  return (
    <>
      <section className="theme-jour pb-(--section-y) pt-[calc(var(--nav-height)+2rem)] md:pt-[calc(var(--nav-height)+3rem)]">
        <div className="container-site">
          <nav aria-label="Fil d'Ariane" className="mb-8 text-sm text-fg-2">
            <ol className="flex flex-wrap items-center gap-x-2">
              <li>
                <Link href="/" className="inline-flex min-h-11 items-center hover:text-fg">
                  Accueil
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/showrooms" className="inline-flex min-h-11 items-center hover:text-fg">
                  Showrooms
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-fg">
                {showroom.name}
              </li>
            </ol>
          </nav>
          <ShowroomBlock showroom={showroom} variant={index} as="h1" withMap />
        </div>
      </section>

      <section className="theme-jour pb-(--section-y)" aria-labelledby="see-title">
        <div className="container-site border-t border-line pt-(--section-y)">
          <h2 id="see-title" className="text-3xl font-extrabold">
            Ce que vous y verrez allumé
          </h2>
          <ul className="mt-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/catalogue?categorie=${category.slug}`}
                  className="inline-flex min-h-11 items-center rounded-pill border border-line-strong px-5 text-sm hover:border-fg"
                >
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
          {featured.length > 0 && (
            <div className="mt-12">
              <CatalogueGrid products={featured} idPrefix={`showroom-${showroom.slug}`} />
            </div>
          )}
          {other && (
            <div className="mt-16 flex flex-col items-start gap-4 border-t border-line pt-10 md:flex-row md:items-center md:justify-between">
              <p className="text-lg">
                Plus près de chez vous ? Notre showroom <span className="font-semibold">{other.name}</span> vous accueille
                aussi.
              </p>
              <ButtonLink href={`/showrooms/${other.slug}`} variant="secondary">
                Voir le showroom {other.name}
              </ButtonLink>
            </div>
          )}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
