import Link from "next/link";
import { findCategory } from "@/lib/catalog";
import { getCategories, getProducts } from "@/lib/catalog/erp";
import { generalMessage, whatsappUrl } from "@/lib/whatsapp";
import { ExternalButton } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { CatalogueGrid } from "./CatalogueGrid";
import { CatalogueSearch } from "./CatalogueSearch";

// Le catalogue, lu dans l'ERP selon l'URL (?q=…&categorie=…&page=…). Rendu côté serveur : lisible sans
// JavaScript et par les moteurs de recherche. Les lectures de l'ERP sont mises en cache (lib/catalog/erp.ts).

const PAGE_SIZE = 24;

function href(params: { q?: string; categorie?: string | null; page?: number }) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.categorie) search.set("categorie", params.categorie);
  if (params.page && params.page > 1) search.set("page", String(params.page));
  const s = search.toString();
  return `/catalogue${s ? `?${s}` : ""}`;
}

export async function CatalogueResults({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  const q = one(raw.q).slice(0, 100);
  const page = Math.max(1, Math.min(500, Number.parseInt(one(raw.page), 10) || 1));

  const categories = await getCategories();
  const category = findCategory(categories, one(raw.categorie));
  const result = await getProducts({ q, categoryId: category?.id, page, limit: PAGE_SIZE });

  return (
    <div>
      <CatalogueSearch initial={q} categorie={category?.slug} />

      {categories.length > 0 && (
        <nav aria-label="Catégories" className="scroll-row -mx-(--container-pad) mt-6 overflow-x-auto px-(--container-pad) lg:mx-0 lg:px-0">
          <ul className="flex w-max gap-2 lg:w-auto lg:flex-wrap">
            {[{ slug: null as string | null, name: "Tout", id: "tout" }, ...categories].map((c) => {
              const selected = (category?.slug ?? null) === c.slug;
              return (
                <li key={c.id}>
                  <Link
                    href={href({ q, categorie: c.slug })}
                    scroll={false}
                    aria-current={selected ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center whitespace-nowrap rounded-pill border px-5 text-sm transition-colors duration-(--dur-fast) ${
                      selected ? "border-flamme bg-flamme text-nuit" : "border-line-strong text-fg-2 hover:border-fg hover:text-fg"
                    }`}
                  >
                    {c.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      <p className="mt-8 text-sm text-fg-2" aria-live="polite">
        {result.total} luminaire{result.total > 1 ? "s" : ""}
        {category ? ` dans ${category.name}` : ""}
        {q ? ` pour « ${q} »` : ""}
      </p>

      <div className="mt-6">
        {result.products.length > 0 ? (
          <CatalogueGrid products={result.products} priorityCount={4} />
        ) : (
          <div className="flex flex-col items-start gap-5 border-t border-line py-12">
            <p className="measure text-lg text-fg">
              {categories.length === 0
                ? "Le catalogue en ligne arrive. En attendant, écrivez-nous : nous vous envoyons les modèles disponibles."
                : "Aucun luminaire ne correspond à cette recherche. Essayez un autre mot ou écrivez-nous : nous l'avons peut-être en stock."}
            </p>
            <div className="flex flex-wrap gap-3">
              {(q || category) && (
                <Link href="/catalogue" className="inline-flex min-h-12 items-center rounded-pill border border-line-strong px-6 text-sm font-semibold hover:border-fg">
                  Tout le catalogue
                </Link>
              )}
              <ExternalButton href={whatsappUrl(generalMessage())}>
                <WhatsAppIcon className="size-4" />
                Écrire sur WhatsApp
              </ExternalButton>
            </div>
          </div>
        )}
      </div>

      {result.totalPages > 1 && (
        <nav aria-label="Pages du catalogue" className="mt-12 flex items-center justify-between gap-4 border-t border-line pt-8">
          {page > 1 ? (
            <Link href={href({ q, categorie: category?.slug, page: page - 1 })} className="inline-flex min-h-12 items-center rounded-pill border border-line-strong px-6 text-sm font-semibold hover:border-fg">
              Page précédente
            </Link>
          ) : (
            <span />
          )}
          <span className="text-sm tabular-nums text-fg-2">
            Page {page} sur {result.totalPages}
          </span>
          {page < result.totalPages ? (
            <Link href={href({ q, categorie: category?.slug, page: page + 1 })} className="inline-flex min-h-12 items-center rounded-pill border border-line-strong px-6 text-sm font-semibold hover:border-fg">
              Page suivante
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  );
}
