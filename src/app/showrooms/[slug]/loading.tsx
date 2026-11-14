// Frontière Suspense de la page showroom : navigation instantanée entre les deux showrooms.
export default function ShowroomLoading() {
  return (
    <section
      className="theme-jour pb-(--section-y) pt-[calc(var(--nav-height)+5rem)]"
      aria-busy="true"
      aria-label="Chargement du showroom"
    >
      <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="aspect-[3/2] bg-bg-raised lg:col-span-7" />
        <div className="flex flex-col gap-4 lg:col-span-5">
          <div className="h-4 w-24 rounded-pill bg-bg-raised" />
          <div className="h-12 w-3/4 rounded-pill bg-bg-raised" />
        </div>
      </div>
    </section>
  );
}
