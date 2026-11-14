// En-tête provisoire des pages pas encore construites (remplacé au fil du build).
export function PagePlaceholder({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grain flex flex-1 items-end bg-nuit pb-(--section-y) pt-[calc(var(--nav-height)+var(--section-y))]">
      <div className="container-site">
        <h1 className="text-4xl font-extrabold">{title}</h1>
        <div className="measure mt-6 text-lg text-fg-2">{children}</div>
      </div>
    </section>
  );
}
