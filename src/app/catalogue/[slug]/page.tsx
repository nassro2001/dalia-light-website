import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { idFromSlug, productPath } from "@/lib/catalog";
import { getProduct, getProducts } from "@/lib/catalog/erp";
import { site } from "@/lib/site";
import { CatalogueGrid } from "@/components/catalog/CatalogueGrid";
import { ProductDetail } from "@/components/catalog/ProductDetail";

// Une page par article publié dans l'ERP. Les premiers articles sont pré-générés au build ; les autres le sont à
// la première visite puis gardés en cache (Cache Components). Avec Cache Components, il faut au moins un
// paramètre : si l'ERP n'est pas joignable au build, un paramètre fictif sert à la validation et répond 404.
export async function generateStaticParams() {
  const { products } = await getProducts({ limit: 100 });
  const params = products.map((product) => ({ slug: product.slug }));
  return params.length > 0 ? params : [{ slug: "__aucun-produit__" }];
}

async function load(slug: string) {
  const id = idFromSlug(slug);
  return id ? getProduct(id) : null;
}

export async function generateMetadata({ params }: PageProps<"/catalogue/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await load(slug);
  if (!product) return {};
  const description =
    product.description?.slice(0, 160) ||
    `${product.name} (réf. ${product.reference}), ${product.category.name.toLowerCase()} à voir dans nos showrooms d'Abidjan.`;
  return {
    title: product.name,
    description,
    alternates: { canonical: productPath(product) },
    openGraph: product.images[0] ? { images: [{ url: product.images[0] }] } : undefined,
  };
}

export default async function ProductPage({ params }: PageProps<"/catalogue/[slug]">) {
  const { slug } = await params;
  const product = await load(slug);
  if (!product) notFound();
  // Le nom a changé dans l'ERP : l'ancienne adresse mène à la nouvelle.
  if (product.slug !== slug) permanentRedirect(productPath(product));

  const { products: sameCategory } = await getProducts({ categoryId: product.category.id, limit: 5 });
  const related = sameCategory.filter((p) => p.id !== product.id).slice(0, 4);

  // Données structurées pour les moteurs de recherche (fiche produit ; pas d'offre chiffrée : les prix se négocient en showroom).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.reference,
    description: product.description ?? undefined,
    category: product.category.name,
    image: product.images,
    brand: { "@type": "Brand", name: site.name },
    url: `${site.url}${productPath(product)}`,
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
              <CatalogueGrid products={related} />
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
