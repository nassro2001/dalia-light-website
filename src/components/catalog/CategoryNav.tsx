import Link from "next/link";
import { shortLabel, type Category, type FamilyGroup } from "@/lib/catalog";
import { RevealActive } from "./RevealActive";

// Deux niveaux : les familles, comme une rangée d'interrupteurs (celle qu'on choisit « s'allume »), puis
// les catégories de la famille choisie, en simple texte. On ne voit jamais plus d'une dizaine de choix à la fois.

type Href = (params: { famille?: string | null; categorie?: string | null }) => string;

export function CategoryNav({
  groups,
  total,
  family,
  category,
  href,
}: {
  groups: FamilyGroup[];
  total: number;
  family: FamilyGroup | null;
  category: Category | null;
  href: Href;
}) {
  const switches = [{ slug: null as string | null, label: "Tout", productCount: total }, ...groups];

  return (
    <nav aria-label="Catégories" className="mt-6">
      <RevealActive>
      <ul className="scroll-row -mx-(--container-pad) flex gap-2 overflow-x-auto px-(--container-pad) pb-1 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
        {switches.map((f) => {
          const on = (family?.slug ?? null) === f.slug;
          return (
            <li key={f.slug ?? "tout"} className="shrink-0" data-on={on || undefined}>
              <Link
                href={href({ famille: f.slug })}
                scroll={false}
                aria-current={on && !category ? "page" : undefined}
                className={`group inline-flex min-h-11 items-center gap-2.5 whitespace-nowrap rounded-pill border px-5 text-sm transition-[color,background-color,border-color,box-shadow] duration-(--dur-enter) ease-out-expo ${
                  on
                    ? "border-flamme bg-flamme font-semibold text-nuit shadow-[0_0_32px_-6px_rgba(255,184,0,0.6)]"
                    : "border-line-strong text-fg hover:border-laiton"
                }`}
              >
                {f.label}
                <span className={`text-xs tabular-nums ${on ? "text-nuit/70" : "text-fg-2 group-hover:text-laiton"}`}>
                  {f.productCount}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {family && family.categories.length > 1 && (
        <ul
          aria-label={family.label}
          className="scroll-row -mx-(--container-pad) mt-4 flex gap-x-6 overflow-x-auto px-(--container-pad) lg:mx-0 lg:flex-wrap lg:gap-y-1 lg:overflow-visible lg:px-0"
        >
          <SubLink href={href({ famille: family.slug })} on={!category}>
            Tout voir
          </SubLink>
          {family.categories.map((c) => (
            <SubLink key={c.id} href={href({ categorie: c.slug })} on={category?.id === c.id}>
              {shortLabel(c, family)}
            </SubLink>
          ))}
        </ul>
      )}
      </RevealActive>
    </nav>
  );
}

function SubLink({ href, on, children }: { href: string; on: boolean; children: React.ReactNode }) {
  return (
    <li className="shrink-0" data-on={on || undefined}>
      <Link
        href={href}
        scroll={false}
        aria-current={on ? "page" : undefined}
        className={`inline-flex min-h-11 items-center whitespace-nowrap border-b text-sm transition-colors duration-(--dur-fast) ${
          on ? "border-flamme text-fg" : "border-transparent text-fg-2 hover:text-fg"
        }`}
      >
        {children}
      </Link>
    </li>
  );
}
