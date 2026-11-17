import Link from "next/link";
import { categories, showrooms, site } from "@/lib/site";
import { generalMessage, whatsappUrl } from "@/lib/whatsapp";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="grain border-t border-line bg-nuit text-fg">
      <div className="container-site grid gap-12 py-16 md:grid-cols-12 md:gap-8 md:py-20">
        <div className="md:col-span-4">
          <Logo className="h-16 w-auto" />
          <p className="measure mt-4 text-sm text-fg-2">
            Luminaires pour la maison, les bureaux et les commerces. Deux showrooms à {site.city} pour les voir
            allumés avant de choisir.
          </p>
        </div>

        <nav aria-label="Catalogue" className="md:col-span-2">
          <h2 className="font-body text-sm font-semibold tracking-normal text-fg">Catalogue</h2>
          <ul className="mt-4 flex flex-col gap-1 text-sm">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/catalogue?famille=${category.slug}`}
                  className="inline-flex min-h-9 items-center text-fg-2 transition-colors duration-(--dur-fast) hover:text-fg"
                >
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <h2 className="font-body text-sm font-semibold tracking-normal text-fg">Showrooms</h2>
          <ul className="mt-4 flex flex-col gap-5 text-sm text-fg-2">
            {showrooms.map((showroom) => (
              <li key={showroom.slug}>
                <Link href={`/showrooms/${showroom.slug}`} className="inline-flex min-h-9 items-center text-fg hover:text-link">
                  {showroom.name}
                </Link>
                <br />
                {showroom.address}
                <br />
                {showroom.hours}
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="font-body text-sm font-semibold tracking-normal text-fg">Nous contacter</h2>
          <ul className="mt-4 flex flex-col gap-1 text-sm">
            <li>
              <a
                href={whatsappUrl(generalMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-9 items-center text-link hover:text-fg"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="inline-flex min-h-9 items-center text-fg-2 hover:text-fg">
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="inline-flex min-h-9 items-center text-fg-2 hover:text-fg">
                {site.email}
              </a>
            </li>
            <li>
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center text-fg-2 hover:text-fg">
                Instagram
              </a>
            </li>
            <li>
              <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center text-fg-2 hover:text-fg">
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-site flex flex-col gap-2 border-t border-line py-6 text-xs text-fg-2 md:flex-row md:justify-between">
        <p>© {site.name}, {site.city}</p>
        <p>« {site.tagline} »</p>
      </div>
    </footer>
  );
}
