import type { Metadata, Viewport } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { CursorLight } from "@/components/layout/CursorLight";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SelectionDrawer } from "@/components/selection/SelectionDrawer";
import { SelectionProvider } from "@/components/selection/SelectionProvider";
import { WhatsAppFab } from "@/components/selection/WhatsAppFab";
import { site } from "@/lib/site";
import "./globals.css";

const syne = Syne({
  variable: "--ff-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const dmSans = DM_Sans({
  variable: "--ff-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Dalia-Light, luminaires à Abidjan",
    template: "%s · Dalia-Light",
  },
  description:
    "Suspensions, lustres, appliques, spots LED et lampadaires. Deux showrooms à Abidjan pour voir chaque luminaire allumé.",
};

export const viewport: Viewport = {
  themeColor: "#100D0A",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${syne.variable} ${dmSans.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#contenu"
          className="sr-only z-50 rounded-pill bg-cta px-5 py-3 text-sm font-semibold text-cta-fg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Aller au contenu
        </a>
        <SelectionProvider>
          <SiteHeader />
          <main id="contenu" className="flex flex-1 flex-col">
            {children}
          </main>
          <SiteFooter />
          <SelectionDrawer />
          <WhatsAppFab />
          <CursorLight />
        </SelectionProvider>
      </body>
    </html>
  );
}
