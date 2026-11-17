"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

// Recherche du catalogue : met l'URL à jour après une courte pause de frappe (la page relit le catalogue côté
// serveur). Sans JavaScript, c'est un formulaire GET ordinaire.
export function CatalogueSearch({ initial, famille, categorie }: { initial: string; famille?: string; categorie?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initial);
  const current = searchParams.get("q") ?? "";

  useEffect(() => {
    if (query.trim() === current.trim()) return;
    const id = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query.trim()) params.set("q", query.trim());
      else params.delete("q");
      params.delete("page");
      const search = params.toString();
      router.replace(`${pathname}${search ? `?${search}` : ""}`, { scroll: false });
    }, 300);
    return () => clearTimeout(id);
  }, [query, current, pathname, router, searchParams]);

  return (
    <form action={pathname} role="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="catalogue-search" className="text-sm text-fg-2">
        Rechercher un luminaire
      </label>
      <div className="relative mt-2">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-fg-2" aria-hidden="true" />
        <input
          id="catalogue-search"
          name="q"
          type="search"
          inputMode="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Lustre, applique, spot…"
          className="min-h-12 w-full rounded-pill border border-line-strong bg-transparent pl-11 pr-5 text-base text-fg placeholder:text-fg-2 focus:border-fg focus:outline-none"
        />
      </div>
      {famille && <input type="hidden" name="famille" value={famille} />}
      {categorie && <input type="hidden" name="categorie" value={categorie} />}
    </form>
  );
}
