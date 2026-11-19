import Link from "next/link";
import { findCategory, groupByFamily, productPath, productSlug } from "@/lib/catalog";
import { webNames } from "@/lib/catalog/web-names";
import { categoryVideos, familyVideos } from "@/lib/catalog/web-videos";
import { getCategories, getFamilyProducts, getProducts } from "@/lib/catalog/erp";
import { generalMessage, whatsappUrl } from "@/lib/whatsapp";
import { ExternalButton } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { CatalogueGrid } from "./CatalogueGrid";
import { CatalogueSearch } from "./CatalogueSearch";
import { CategoryNav } from "./CategoryNav";
import { CategoryVideoBanner } from "./CategoryVideoBanner";

// Le catalogue, lu dans l'ERP selon l'URL (?q=…&famille=…&categorie=…&page=…). Rendu côté serveur : lisible
// sans JavaScript et par les moteurs de recherche. Les lectures de l'ERP sont mises en cache (lib/catalog/erp.ts).

const PAGE_SIZE = 24;

type Params = { q?: string; famille?: string | null; categorie?: string | null; page?: number };

function href(params: Params) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.categorie) search.set("categorie", params.categorie);
  else if (params.famille) search.set("famille", params.famille);
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
  const groups = groupByFamily(categories);
  // ?categorie= peut aussi nommer une famille (anciens liens : ?categorie=lustres).
  const wanted = one(raw.famille) || one(raw.categorie);
  const familyBySlug = groups.find((g) => g.slug === wanted) ?? null;
  const category = familyBySlug ? null : findCategory(categories, one(raw.categorie));
  const family = familyBySlug ?? (category ? (groups.find((g) => g.categories.some((c) => c.id === category.id)) ?? null) : null);

  const result =
    family && !category && family.categories.length > 1
      ? await getFamilyProducts({ categoryIds: family.categories.map((c) => c.id), q, page, limit: PAGE_SIZE })
      : await getProducts({ q, categoryId: category?.id ?? family?.categories[0]?.id, page, limit: PAGE_SIZE });
  const scope = category?.name ?? family?.label;
  const total = groups.reduce((sum, g) => sum + g.productCount, 0);
  // Vidéo d'ambiance : celle de la sous-catégorie, ou celle de la famille sur « Tout voir ». Première page, hors recherche.
  const video =
    page > 1 || q ? undefined : category ? categoryVideos[category.slug] : family ? familyVideos[family.slug] : undefined;
  const videoProductName = video?.productId ? webNames[video.productId] : undefined;
  const videoProduct = video?.productRef
    ? (await getProducts({ q: video.productRef, limit: 10 })).products.find((p) => p.reference === video.productRef)
    : undefined;

  return (
    <div>
      <CatalogueSearch initial={q} famille={category ? undefined : family?.slug} categorie={category?.slug} />

      {groups.length > 0 && (
        <CategoryNav
          groups={groups}
          total={total}
          family={family}
          category={category}
          href={(p) => href({ q, ...p })}
        />
      )}

      {video && scope && (
        <CategoryVideoBanner
          video={video}
          label={scope}
          product={
            videoProduct
              ? { name: videoProduct.name, href: productPath(videoProduct) }
              : video.productId && videoProductName
                ? { name: videoProductName, href: productPath({ slug: productSlug(videoProductName, video.productId) }) }
                : undefined
          }
        />
      )}

      <p className="mt-8 text-sm text-fg-2" aria-live="polite">
        {result.total} article{result.total > 1 ? "s" : ""}
        {scope ? ` dans ${scope}` : ""}
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
              {(q || family) && (
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
            <Link href={href({ q, famille: family?.slug, categorie: category?.slug, page: page - 1 })} className="inline-flex min-h-12 items-center rounded-pill border border-line-strong px-6 text-sm font-semibold hover:border-fg">
              Page précédente
            </Link>
          ) : (
            <span />
          )}
          <span className="text-sm tabular-nums text-fg-2">
            Page {page} sur {result.totalPages}
          </span>
          {page < result.totalPages ? (
            <Link href={href({ q, famille: family?.slug, categorie: category?.slug, page: page + 1 })} className="inline-flex min-h-12 items-center rounded-pill border border-line-strong px-6 text-sm font-semibold hover:border-fg">
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
