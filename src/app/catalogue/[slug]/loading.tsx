// Frontière Suspense de la fiche produit : navigation instantanée entre fiches,
// le contenu s'affiche dès que les paramètres de l'URL sont lus.
export default function ProductLoading() {
  return (
    <section
      className="grain bg-nuit pb-(--section-y) pt-[calc(var(--nav-height)+5rem)]"
      aria-busy="true"
      aria-label="Chargement du luminaire"
    >
      <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="aspect-square bg-penombre lg:col-span-7" />
        <div className="flex flex-col gap-4 lg:col-span-5">
          <div className="h-4 w-24 rounded-pill bg-penombre" />
          <div className="h-14 w-3/4 rounded-pill bg-penombre" />
          <div className="h-6 w-32 rounded-pill bg-penombre" />
        </div>
      </div>
    </section>
  );
}
