import Image from "next/image";
import type { Product, Silhouette } from "@/lib/catalog/types";

// Visuel produit avec deux états, éteint et allumé (DIRECTION_VISUELLE.md §8).
// - Avec photos (product.images) : deux images au même cadrage, fondu de l'une à l'autre.
// - Sans photos (provisoire) : silhouette dessinée par type de luminaire, dans la teinte de la finition.
// L'état allumé s'affiche quand un parent porte data-lit="true" ou au survol d'un parent .product-visual-host
// (voir globals.css, « VISUEL PRODUIT »).

type Props = {
  product: Product;
  /** Couleur de la finition affichée (par défaut la première). */
  swatch?: string;
  /** Préfixe unique pour les dégradés SVG quand le même produit apparaît deux fois sur la page. */
  idPrefix?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

type Light = {
  /** Source lumineuse (coordonnées du viewBox 300 × 300). */
  x: number;
  y: number;
  /** Faisceau : vers le bas, vers le haut, ou diffus tout autour. */
  beam: "down" | "up" | "diffuse";
  /** Largeur du faisceau au sol (down) ou au plafond (up). */
  spread: number;
};

type Drawing = {
  /** Éléments fixes : câble, plafond, mur, sol. */
  fixtures?: string[];
  /** Corps métallique (teinte de la finition). */
  body: string[];
  /** Parties qui s'illuminent : verre, intérieur d'abat-jour, diffuseur. */
  glow: string[];
  light: Light;
  /** Petites ampoules visibles (lustres). */
  bulbs?: [number, number][];
};

const drawings: Record<Silhouette, Drawing> = {
  dome: {
    fixtures: ["M150 0 V112"],
    body: ["M92 176 C96 132 122 110 150 110 C178 110 204 132 208 176 Z", "M143 104 h14 v10 h-14 Z"],
    glow: ["M100 176 C120 186 180 186 200 176 C180 170 120 170 100 176 Z"],
    light: { x: 150, y: 172, beam: "down", spread: 230 },
  },
  globe: {
    fixtures: ["M150 0 V96"],
    body: ["M141 92 h18 v10 h-18 Z"],
    glow: ["M150 102 a52 52 0 1 0 0.1 0 Z"],
    light: { x: 150, y: 154, beam: "diffuse", spread: 200 },
  },
  cone: {
    fixtures: ["M150 0 V92"],
    body: ["M134 92 L166 92 L194 178 L106 178 Z"],
    glow: ["M110 178 C130 186 170 186 190 178 C170 173 130 173 110 178 Z"],
    light: { x: 150, y: 174, beam: "down", spread: 170 },
  },
  lustre: {
    fixtures: ["M150 0 V86"],
    body: [
      "M146 86 h8 v66 h-8 Z",
      "M150 150 C120 150 92 146 78 128 M150 150 C180 150 208 146 222 128",
      "M150 140 C126 138 108 128 102 112 M150 140 C174 138 192 128 198 112",
      "M74 128 h8 v-10 h-8 Z M218 128 h8 v-10 h-8 Z M98 112 h8 v-10 h-8 Z M194 112 h8 v-10 h-8 Z",
      "M140 158 h20 l-4 10 h-12 Z",
    ],
    glow: [],
    bulbs: [
      [78, 110],
      [222, 110],
      [102, 94],
      [198, 94],
    ],
    light: { x: 150, y: 120, beam: "diffuse", spread: 260 },
  },
  plafonnier: {
    fixtures: ["M40 70 H260"],
    body: ["M84 70 h132 v6 h-132 Z"],
    glow: ["M90 76 Q150 132 210 76 Z"],
    light: { x: 150, y: 100, beam: "down", spread: 260 },
  },
  applique: {
    fixtures: ["M60 40 V260"],
    body: ["M60 132 h22 v40 h-22 Z", "M82 150 h28 v6 h-28 Z"],
    glow: ["M104 128 L176 104 L170 150 L110 162 Z"],
    light: { x: 140, y: 120, beam: "up", spread: 160 },
  },
  lampadaire: {
    fixtures: ["M40 272 H260"],
    body: ["M148 150 h4 v120 h-4 Z", "M150 196 L104 272 M150 196 L196 272 M150 196 L150 272"],
    glow: ["M112 92 L188 92 L204 150 L96 150 Z"],
    light: { x: 150, y: 140, beam: "down", spread: 200 },
  },
  spot: {
    fixtures: ["M40 60 H260"],
    body: ["M132 60 h36 v34 h-36 Z", "M128 94 h44 v8 h-44 Z"],
    glow: ["M136 102 h28 v4 h-28 Z"],
    light: { x: 150, y: 104, beam: "down", spread: 120 },
  },
  lanterne: {
    fixtures: ["M60 40 V260", "M60 110 H110"],
    body: ["M112 112 L150 84 L188 112 Z", "M118 112 h64 v6 h-64 Z", "M118 186 h64 v8 h-64 Z", "M146 194 h8 v14 h-8 Z"],
    glow: ["M124 118 h52 v68 h-52 Z"],
    light: { x: 150, y: 152, beam: "diffuse", spread: 180 },
  },
};

function beamPath({ x, y, beam, spread }: Light) {
  if (beam === "down") return `M${x - 34} ${y} L${x + 34} ${y} L${x + spread / 2} 300 L${x - spread / 2} 300 Z`;
  if (beam === "up") return `M${x - 30} ${y} L${x + 30} ${y} L${x + spread / 2} 0 L${x - spread / 2} 0 Z`;
  return "";
}

export function ProductVisual({ product, swatch, idPrefix, sizes = "(min-width: 1024px) 25vw, 50vw", priority, className = "" }: Props) {
  const color = swatch ?? product.finishes[0]?.swatch ?? "#B98C45";

  if (product.images) {
    return (
      <div className={`product-visual relative aspect-square overflow-hidden bg-penombre ${className}`}>
        <Image src={product.images.off} alt={product.images.alt} fill sizes={sizes} className="object-cover" preload={priority} />
        <Image src={product.images.on} alt="" fill sizes={sizes} className="visual-lit object-cover" aria-hidden="true" />
      </div>
    );
  }

  const drawing = drawings[product.silhouette];
  const id = `${idPrefix ?? product.slug}-v`;
  const beam = beamPath(drawing.light);

  return (
    <div className={`product-visual relative aspect-square overflow-hidden bg-penombre ${className}`}>
      <svg viewBox="0 0 300 300" className="absolute inset-0 size-full" role="img" aria-label={`${product.name}, illustration`}>
        <defs>
          <radialGradient id={`${id}-room`} cx="50%" cy="40%" r="75%">
            <stop offset="0" stopColor="#1E1913" />
            <stop offset="1" stopColor="#100D0A" />
          </radialGradient>
          <linearGradient id={`${id}-metal`} x1="0" x2="1">
            <stop offset="0" stopColor="#000" stopOpacity="0.35" />
            <stop offset="0.45" stopColor="#fff" stopOpacity="0.22" />
            <stop offset="1" stopColor="#000" stopOpacity="0.4" />
          </linearGradient>
          <radialGradient id={`${id}-halo`}>
            <stop offset="0" stopColor="#FFF1CF" stopOpacity="0.95" />
            <stop offset="0.2" stopColor="#FFB800" stopOpacity="0.55" />
            <stop offset="0.55" stopColor="#FF6A00" stopOpacity="0.12" />
            <stop offset="1" stopColor="#FF6A00" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}-beam`} x1="0" y1={drawing.light.beam === "up" ? "1" : "0"} x2="0" y2={drawing.light.beam === "up" ? "0" : "1"}>
            <stop offset="0" stopColor="#FFC85A" stopOpacity="0.35" />
            <stop offset="1" stopColor="#FFC85A" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="300" height="300" fill={`url(#${id}-room)`} />

        {/* Calque allumé : faisceau et halo, sous le luminaire */}
        <g className="visual-lit">
          {beam && <path d={beam} fill={`url(#${id}-beam)`} />}
          <circle cx={drawing.light.x} cy={drawing.light.y} r={drawing.light.spread * 0.55} fill={`url(#${id}-halo)`} />
        </g>

        {drawing.fixtures?.map((d) => (
          <path key={d} d={d} stroke="#5A4630" strokeWidth="2" fill="none" />
        ))}

        {/* Parties lumineuses : sombres éteintes, claires allumées */}
        {drawing.glow.map((d) => (
          <g key={d}>
            <path d={d} fill="#2A2219" />
            <path d={d} fill="#FFE2A0" className="visual-lit" />
          </g>
        ))}

        {drawing.body.map((d) => {
          const isLine = !d.trim().endsWith("Z");
          return isLine ? (
            <path key={d} d={d} stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
          ) : (
            <g key={d}>
              <path d={d} fill={color} />
              <path d={d} fill={`url(#${id}-metal)`} />
            </g>
          );
        })}

        {drawing.bulbs?.map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x + 4} cy={y} r="5" fill="#3A2F22" />
            <circle cx={x + 4} cy={y} r="5" fill="#FFF4D6" className="visual-lit" />
            <circle cx={x + 4} cy={y} r="22" fill={`url(#${id}-halo)`} className="visual-lit" />
          </g>
        ))}
      </svg>
    </div>
  );
}
