"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import {
  activeFilterCount,
  colorTemperatures,
  filterProducts,
  filtersToSearch,
  getAllProducts,
  parseFilters,
  rooms,
  sockets,
  type CatalogFilters,
} from "@/lib/catalog";
import { categories } from "@/lib/site";
import { generalMessage, whatsappUrl } from "@/lib/whatsapp";
import { Button, ExternalButton } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { CatalogueGrid } from "./CatalogueGrid";

// Catalogue filtrable. Tous les filtres sont reflétés dans l'URL (partage d'une recherche, retour arrière).
// Ordinateur : filtres en colonne à gauche. Mobile : tiroir « Filtres ».

type Option = { value: string; label: string; hint?: string };

const groups: { key: keyof Pick<CatalogFilters, "piece" | "temperature" | "culot">; legend: string; options: Option[] }[] = [
  { key: "piece", legend: "Pièce", options: rooms.map((r) => ({ value: r.slug, label: r.label })) },
  {
    key: "temperature",
    legend: "Température de couleur",
    options: colorTemperatures.map((t) => ({ value: String(t.value), label: t.label, hint: t.hint })),
  },
  { key: "culot", legend: "Culot", options: sockets.map((s) => ({ value: s, label: s })) },
];

function FilterGroups({
  filters,
  onChange,
  idPrefix,
}: {
  filters: CatalogFilters;
  onChange: (patch: Partial<CatalogFilters>) => void;
  idPrefix: string;
}) {
  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => {
        const current = filters[group.key] === null ? "" : String(filters[group.key]);
        return (
          <fieldset key={group.key}>
            <legend className="text-sm font-semibold text-fg">{group.legend}</legend>
            <div className="mt-3 flex flex-col">
              {[{ value: "", label: "Toutes" } as Option, ...group.options].map((option) => {
                const id = `${idPrefix}-${group.key}-${option.value || "all"}`;
                return (
                  <label
                    key={id}
                    htmlFor={id}
                    className="flex min-h-10 cursor-pointer items-center gap-3 text-sm text-fg-2 hover:text-fg has-checked:text-fg"
                  >
                    <input
                      id={id}
                      type="radio"
                      name={`${idPrefix}-${group.key}`}
                      value={option.value}
                      checked={current === option.value}
                      onChange={() =>
                        onChange({
                          [group.key]:
                            option.value === "" ? null : group.key === "temperature" ? Number(option.value) : option.value,
                        })
                      }
                      className="size-4 accent-flamme"
                    />
                    <span>
                      {option.label}
                      {option.hint && <span className="block text-xs text-fg-2">{option.hint}</span>}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}

export function CatalogueBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = useMemo(() => parseFilters(new URLSearchParams(searchParams.toString())), [searchParams]);
  const results = useMemo(() => filterProducts([...getAllProducts()], filters), [filters]);
  const [query, setQuery] = useState(filters.q);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const active = activeFilterCount(filters);

  const update = (patch: Partial<CatalogFilters>) => {
    router.replace(`${pathname}${filtersToSearch({ ...filters, ...patch })}`, { scroll: false });
  };

  // Recherche : met l'URL à jour après une courte pause de frappe.
  useEffect(() => {
    if (query === filters.q) return;
    const id = setTimeout(() => {
      router.replace(`${pathname}${filtersToSearch({ ...filters, q: query })}`, { scroll: false });
    }, 250);
    return () => clearTimeout(id);
  }, [query, filters, pathname, router]);

  const reset = () => {
    setQuery("");
    router.replace(pathname, { scroll: false });
  };

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      {/* Filtres, ordinateur */}
      <aside className="hidden lg:col-span-3 lg:block" aria-label="Filtres">
        <div className="sticky top-[calc(var(--nav-height)+2rem)]">
          <FilterGroups filters={filters} onChange={update} idPrefix="side" />
          {active > 0 && (
            <button type="button" onClick={reset} className="mt-8 cursor-pointer text-sm text-link underline-offset-4 hover:underline">
              Effacer les filtres
            </button>
          )}
        </div>
      </aside>

      <div className="min-w-0 lg:col-span-9">
        {/* Recherche, tri, filtres mobile */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="catalogue-search" className="text-sm text-fg-2">
              Rechercher un luminaire
            </label>
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-fg-2" aria-hidden="true" />
              <input
                id="catalogue-search"
                type="search"
                inputMode="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Nom, référence, matière…"
                className="min-h-12 w-full rounded-pill border border-line-strong bg-transparent pl-11 pr-5 text-base text-fg placeholder:text-fg-2 focus:border-fg focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div>
              <label htmlFor="catalogue-sort" className="text-sm text-fg-2">
                Trier
              </label>
              <select
                id="catalogue-sort"
                value={filters.tri}
                onChange={(event) => update({ tri: event.target.value as CatalogFilters["tri"] })}
                className="mt-2 block min-h-12 cursor-pointer rounded-pill border border-line-strong bg-nuit px-5 text-sm text-fg focus:border-fg focus:outline-none"
              >
                <option value="pertinence">Notre sélection</option>
                <option value="nouveautes">Nouveautés d&apos;abord</option>
                <option value="nom">Nom (A → Z)</option>
              </select>
            </div>
            <Button variant="secondary" className="self-end lg:hidden" onClick={() => dialogRef.current?.showModal()}>
              <SlidersHorizontal className="size-4" aria-hidden="true" />
              Filtres{active > 0 ? ` (${active})` : ""}
            </Button>
          </div>
        </div>

        {/* Catégories */}
        <nav aria-label="Catégories" className="scroll-row -mx-(--container-pad) mt-6 overflow-x-auto px-(--container-pad) lg:mx-0 lg:px-0">
          <ul className="flex w-max gap-2 lg:w-auto lg:flex-wrap">
            {[{ slug: null, label: "Tout" }, ...categories].map((category) => {
              const selected = filters.categorie === category.slug;
              return (
                <li key={category.label}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => update({ categorie: category.slug as CatalogFilters["categorie"] })}
                    className={`min-h-11 cursor-pointer whitespace-nowrap rounded-pill border px-5 text-sm transition-colors duration-(--dur-fast) ${
                      selected ? "border-flamme bg-flamme text-nuit" : "border-line-strong text-fg-2 hover:border-fg hover:text-fg"
                    }`}
                  >
                    {category.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <p className="mt-8 text-sm text-fg-2" aria-live="polite">
          {results.length} luminaire{results.length > 1 ? "s" : ""}
        </p>

        <div className="mt-6">
          {results.length > 0 ? (
            <CatalogueGrid products={results} />
          ) : (
            <div className="flex flex-col items-start gap-5 border-t border-line py-12">
              <p className="measure text-lg text-fg">
                Aucun luminaire ne correspond à ces filtres. Retirez un filtre ou écrivez-nous : nous l&apos;avons peut-être en
                stock.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" onClick={reset}>
                  Effacer les filtres
                </Button>
                <ExternalButton href={whatsappUrl(generalMessage())}>
                  <WhatsAppIcon className="size-4" />
                  Écrire sur WhatsApp
                </ExternalButton>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filtres, mobile */}
      <dialog
        ref={dialogRef}
        aria-labelledby="filters-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
        className="panel-dialog m-0 ml-auto h-dvh max-h-none w-full max-w-md bg-penombre text-fg backdrop:bg-nuit/70 backdrop:backdrop-blur-sm"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <h2 id="filters-title" className="text-xl font-bold">
              Filtres
            </h2>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center text-fg-2 hover:text-fg"
              aria-label="Fermer les filtres"
            >
              <X className="size-6" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <FilterGroups filters={filters} onChange={update} idPrefix="sheet" />
          </div>
          <div className="flex gap-3 border-t border-line px-6 py-5">
            <Button variant="ghost" onClick={reset} disabled={active === 0 && !filters.categorie && !filters.q}>
              Tout effacer
            </Button>
            <Button className="flex-1" onClick={() => dialogRef.current?.close()}>
              Voir {results.length} luminaire{results.length > 1 ? "s" : ""}
            </Button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

