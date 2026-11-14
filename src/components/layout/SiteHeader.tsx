"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useSyncExternalStore } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { nav, showrooms, site } from "@/lib/site";
import { generalMessage, whatsappUrl } from "@/lib/whatsapp";
import { useSelection } from "@/components/selection/SelectionProvider";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { ExternalButton } from "@/components/ui/Button";
import { Logo } from "./Logo";

// La barre est transparente au-dessus du hero de l'accueil, puis devient opaque dès qu'on défile.
function subscribeScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}
const isScrolled = () => window.scrollY > 8;

export function SiteHeader() {
  const pathname = usePathname();
  const scrolled = useSyncExternalStore(subscribeScroll, isScrolled, () => false);
  // Transparente seulement au-dessus du hero de l'accueil ; opaque partout ailleurs (pages jour comprises).
  const solid = scrolled || pathname !== "/";
  const { count, open, addedPulse } = useSelection();
  const menuRef = useRef<HTMLDialogElement>(null);

  const closeMenu = () => menuRef.current?.close();

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 h-(--nav-height) transition-[background-color,border-color] duration-(--dur-enter) ease-out-expo ${
        solid ? "border-b border-line bg-nuit/90 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="container-site flex h-full items-center gap-8">
        <Logo eager className="h-10 w-auto md:h-11" />

        <nav aria-label="Navigation principale" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center px-3 text-sm transition-colors duration-(--dur-fast) ${
                      active ? "text-fg" : "text-fg-2 hover:text-fg"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={open}
            className="relative inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-pill px-3 text-sm text-fg-2 transition-colors duration-(--dur-fast) hover:text-fg"
            aria-label={count > 0 ? `Ma sélection, ${count} article${count > 1 ? "s" : ""}` : "Ma sélection, vide"}
          >
            <ShoppingBag className="size-5" strokeWidth={1.5} aria-hidden="true" />
            <span className="hidden lg:inline">Ma sélection</span>
            {count > 0 && (
              <span
                key={addedPulse}
                className="selection-pulse absolute right-0.5 top-1 grid min-w-5 place-items-center rounded-pill bg-flamme px-1 text-xs font-semibold text-nuit lg:static"
              >
                {count}
              </span>
            )}
          </button>

          <ExternalButton
            variant="secondary"
            href={whatsappUrl(generalMessage())}
            className="max-md:hidden"
          >
            <WhatsAppIcon className="size-4" />
            Écrire sur WhatsApp
          </ExternalButton>

          <button
            type="button"
            onClick={() => menuRef.current?.showModal()}
            className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center text-fg md:hidden"
            aria-label="Ouvrir le menu"
          >
            <Menu className="size-6" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>

      <dialog
        ref={menuRef}
        aria-label="Menu"
        className="panel-dialog m-0 ml-auto h-dvh max-h-none w-full max-w-sm bg-penombre text-fg backdrop:bg-nuit/70 backdrop:backdrop-blur-sm"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
      >
        <div className="flex h-full flex-col px-6 pb-8">
          <div className="flex h-(--nav-height) items-center justify-between">
            <Logo className="h-10 w-auto" />
            <button
              type="button"
              onClick={closeMenu}
              className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center"
              aria-label="Fermer le menu"
            >
              <X className="size-6" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Navigation mobile" className="mt-6">
            <ul className="flex flex-col">
              {[{ href: "/", label: "Accueil" }, ...nav].map((item) => (
                <li key={item.href} className="border-b border-line">
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="block py-4 font-display text-xl font-bold tracking-[-0.03em]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto flex flex-col gap-6">
            <ExternalButton href={whatsappUrl(generalMessage())} className="w-full">
              <WhatsAppIcon className="size-5" />
              Écrire sur WhatsApp
            </ExternalButton>
            <ul className="flex flex-col gap-3 text-sm text-fg-2">
              {showrooms.map((showroom) => (
                <li key={showroom.slug}>
                  <span className="text-fg">Showroom {showroom.name}</span>
                  <br />
                  {showroom.hours}
                </li>
              ))}
            </ul>
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-sm text-link">
              {site.phone}
            </a>
          </div>
        </div>
      </dialog>
    </header>
  );
}
