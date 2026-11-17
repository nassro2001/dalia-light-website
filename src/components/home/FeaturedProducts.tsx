import { getProducts } from "@/lib/catalog/erp";
import { CatalogueGrid } from "@/components/catalog/CatalogueGrid";
import { ButtonLink } from "@/components/ui/Button";

// Aperçu du catalogue sur l'accueil : quatre articles publiés dans l'ERP.
// Les produits s'allument au passage dans la bande centrale de l'écran (CatalogueGrid).
export async function FeaturedProducts() {
  const { products: featured } = await getProducts({ limit: 4 });

  // Rien à mettre en avant (catalogue pas encore chargé) : on n'affiche pas la section.
  if (featured.length === 0) return null;

  return (
    <section className="theme-jour pb-(--section-y)" aria-labelledby="featured-title">
      <div className="container-site">
        <div className="flex flex-col gap-6 pt-(--section-y) md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="featured-title" className="text-3xl font-extrabold">
              Dans nos showrooms
            </h2>
            <p className="measure mt-4 text-lg text-fg-2">Un aperçu du catalogue. Ajoutez vos luminaires à votre sélection et demandez un devis.</p>
          </div>
          <ButtonLink href="/catalogue" variant="secondary" className="self-start md:self-auto">
            Voir tout le catalogue
          </ButtonLink>
        </div>
        <div className="mt-12">
          <CatalogueGrid products={featured} />
        </div>
      </div>
    </section>
  );
}
