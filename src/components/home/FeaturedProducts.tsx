import { getAllProducts } from "@/lib/catalog";
import { CatalogueGrid } from "@/components/catalog/CatalogueGrid";
import { ButtonLink } from "@/components/ui/Button";

// Sélection de l'accueil : les meilleures ventes et les nouveautés (badge), quatre au maximum.
// Section jour (plâtre) : les visuels sombres des produits y ressortent comme des photos encadrées.
// Les produits s'allument au passage dans la bande centrale de l'écran (CatalogueGrid).
export function FeaturedProducts() {
  const featured = getAllProducts()
    .filter((product) => product.badge)
    .sort((a, b) => (a.badge === b.badge ? 0 : a.badge === "Bestseller" ? -1 : 1))
    .slice(0, 4);

  // Rien à mettre en avant (catalogue pas encore chargé) : on n'affiche pas la section.
  if (featured.length === 0) return null;

  return (
    <section className="theme-jour pb-(--section-y)" aria-labelledby="featured-title">
      <div className="container-site">
        <div className="flex flex-col gap-6 pt-(--section-y) md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="featured-title" className="text-3xl font-extrabold">
              Les plus demandés
            </h2>
            <p className="measure mt-4 text-lg text-fg-2">Nos meilleures ventes et les dernières arrivées en showroom.</p>
          </div>
          <ButtonLink href="/catalogue" variant="secondary" className="self-start md:self-auto">
            Voir tout le catalogue
          </ButtonLink>
        </div>
        <div className="mt-12">
          <CatalogueGrid products={featured} idPrefix="featured" />
        </div>
      </div>
    </section>
  );
}
