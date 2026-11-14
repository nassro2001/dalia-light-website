import Image from "next/image";
import Link from "next/link";
import logoNuit from "../../../public/brand/logo-nuit.png";
import logoJour from "../../../public/brand/logo-jour.png";

// Logo Dalia-Light.
// - nuit : version recolorée laiton + flamme (le logo d'origine, brun foncé, est illisible sur fond nuit)
// - jour : logo d'origine, pour les fonds plâtre
// Les deux sont recadrés depuis assets/brand/logo.png (500×500 → 461×199).
type LogoProps = {
  variant?: "nuit" | "jour";
  className?: string;
  /** Logo visible au chargement (header) : chargé sans attendre. */
  eager?: boolean;
};

export function Logo({ variant = "nuit", className = "h-11 w-auto", eager = false }: LogoProps) {
  return (
    <Link href="/" aria-label="Dalia-Light, accueil" className="inline-flex shrink-0">
      <Image
        src={variant === "nuit" ? logoNuit : logoJour}
        alt=""
        className={className}
        loading={eager ? "eager" : "lazy"}
        sizes="(min-width: 768px) 160px, 120px"
      />
    </Link>
  );
}
