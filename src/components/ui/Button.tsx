import Link from "next/link";
import type { ComponentProps } from "react";

// Boutons : forme pilule (« une commande qu'on manipule », §6), cible ≥ 44 px.
// primary = flamme (lumière), secondary = filet, ghost = texte seul.
type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-pill px-6 text-sm font-semibold " +
  "transition-[background-color,border-color,color,filter] duration-(--dur-fast) ease-out-expo " +
  "disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer select-none";

const variants: Record<Variant, string> = {
  primary: "bg-cta text-cta-fg hover:brightness-110 active:brightness-95",
  secondary: "border border-line-strong text-fg hover:border-fg",
  ghost: "text-fg-2 hover:text-fg px-3",
};

export function buttonClasses(variant: Variant = "primary", className = "") {
  return `${base} ${variants[variant]} ${className}`;
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant };

export function Button({ variant = "primary", className = "", type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, className)} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant };

export function ButtonLink({ variant = "primary", className = "", ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, className)} {...props} />;
}

type ExternalButtonProps = ComponentProps<"a"> & { variant?: Variant };

/** Lien externe (WhatsApp, itinéraire) : s'ouvre dans un nouvel onglet. */
export function ExternalButton({ variant = "primary", className = "", ...props }: ExternalButtonProps) {
  return (
    <a target="_blank" rel="noopener noreferrer" className={buttonClasses(variant, className)} {...props} />
  );
}
