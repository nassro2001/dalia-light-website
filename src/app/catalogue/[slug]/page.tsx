import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categoryLabel, getAllProducts, getProduct, relatedProducts } from "@/lib/catalog";
import { site } from "@/lib/site";
import { CatalogueGrid } from "@/components/catalog/CatalogueGrid";
import { ProductDetail } from "@/components/catalog/ProductDetail";

// Une page par produit, pré-générée au build.
// Avec Cache Components, il faut au moins un paramètre : tant que le catalogue est vide,
// un paramètre fictif sert à la validation du build et répond 404 (getProduct ne le trouve pas).
export function generateStaticParams() {
  const params = getAllProducts().map((product) => ({ slug: product.slug }));
  return params.length > 0 ? params : [{ slug: "__aucun-produit__" }];
}

export async function generateMetadata({ params }: PageProps<"/catalogue/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: `${product.summary} ${categoryLabel(product.category)} à voir dans nos showrooms d'Abidjan.`,
    alternates: { canonical: `/catalogue/${product.slug}` },
  };
}

export default async function ProductPage({ params }: PageProps<"/catalogue/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = relatedProducts(product);

  // Données structurées pour les moteurs de recherche (fiche produit ; pas d'offre chiffrée : les prix se négocient en showroom).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.reference,
    description: product.description,
    category: categoryLabel(product.category),
    brand: { "@type": "Brand", name: site.name },
    url: `${site.url}/catalogue/${product.slug}`,
  };

  return (
    <>
      <section className="grain bg-nuit pb-28 pt-[calc(var(--nav-height)+2rem)] md:pb-(--section-y) md:pt-[calc(var(--nav-height)+3rem)]">
        <div className="container-site">
          <ProductDetail product={product} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="grain border-t border-line bg-nuit pb-32 pt-(--section-y) md:pb-(--section-y)" aria-labelledby="related-title">
          <div className="container-site">
            <h2 id="related-title" className="text-2xl font-extrabold">
              Dans le même esprit
            </h2>
            <div className="mt-10">
              <CatalogueGrid products={related} idPrefix="related" />
            </div>
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
