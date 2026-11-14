// Illustration provisoire d'un showroom (en attendant les photos) : une devanture le soir,
// la vitrine remplie de luminaires qui s'allument (calque .visual-lit, voir globals.css).
// variant change la disposition des luminaires pour distinguer les deux showrooms.

const BRASS = "#B98C45";
const FRAME = "#3A2F23";

type Lamp = { x: number; y: number; kind: "dome" | "globe" | "cone" | "lustre" };

const layouts: Lamp[][] = [
  [
    { x: 150, y: 230, kind: "dome" },
    { x: 250, y: 260, kind: "lustre" },
    { x: 360, y: 225, kind: "globe" },
    { x: 450, y: 250, kind: "cone" },
    { x: 540, y: 232, kind: "dome" },
  ],
  [
    { x: 140, y: 240, kind: "cone" },
    { x: 210, y: 240, kind: "cone" },
    { x: 300, y: 228, kind: "globe" },
    { x: 410, y: 262, kind: "lustre" },
    { x: 530, y: 236, kind: "dome" },
  ],
];

function LampShape({ lamp, id }: { lamp: Lamp; id: string }) {
  const { x, y, kind } = lamp;
  return (
    <g>
      <circle cx={x} cy={y + 8} r="70" fill={`url(#${id}-halo)`} className="visual-lit" />
      <path d={`M${x} 150 V${y - 18}`} stroke="#5A4630" strokeWidth="1.5" />
      {kind === "dome" && (
        <>
          <path d={`M${x - 26} ${y} C${x - 26} ${y - 26} ${x + 26} ${y - 26} ${x + 26} ${y} Z`} fill={BRASS} />
          <ellipse cx={x} cy={y} rx="26" ry="4" fill="#FFE2A0" className="visual-lit" />
        </>
      )}
      {kind === "globe" && (
        <>
          <circle cx={x} cy={y} r="18" fill="#2A2219" />
          <circle cx={x} cy={y} r="18" fill="#FFE8B0" className="visual-lit" />
        </>
      )}
      {kind === "cone" && (
        <>
          <path d={`M${x - 8} ${y - 18} L${x + 8} ${y - 18} L${x + 16} ${y + 4} L${x - 16} ${y + 4} Z`} fill="#2B2722" />
          <ellipse cx={x} cy={y + 4} rx="16" ry="3" fill="#FFE2A0" className="visual-lit" />
        </>
      )}
      {kind === "lustre" && (
        <>
          <path d={`M${x - 34} ${y - 6} C${x - 20} ${y + 8} ${x + 20} ${y + 8} ${x + 34} ${y - 6}`} stroke={BRASS} strokeWidth="3" fill="none" />
          {[-34, -12, 12, 34].map((dx) => (
            <g key={dx}>
              <circle cx={x + dx} cy={y - 10} r="4" fill="#3A2F22" />
              <circle cx={x + dx} cy={y - 10} r="4" fill="#FFF4D6" className="visual-lit" />
            </g>
          ))}
        </>
      )}
    </g>
  );
}

export function ShowroomVisual({ name, variant = 0 }: { name: string; variant?: number }) {
  const id = `showroom-${variant}`;
  const lamps = layouts[variant % layouts.length];
  return (
    <svg viewBox="0 0 680 460" className="block size-full" role="img" aria-label={`Showroom ${name}, illustration de la vitrine`}>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1A1510" />
          <stop offset="1" stopColor="#2A2016" />
        </linearGradient>
        <radialGradient id={`${id}-halo`}>
          <stop offset="0" stopColor="#FFF1CF" stopOpacity="0.8" />
          <stop offset="0.3" stopColor="#FFB800" stopOpacity="0.35" />
          <stop offset="1" stopColor="#FF6A00" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-spill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFC85A" stopOpacity="0.32" />
          <stop offset="1" stopColor="#FFC85A" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="680" height="460" fill={`url(#${id}-sky)`} />
      {/* Façade */}
      <path d="M40 60 h600 v340 h-600 Z" fill="#16120D" />
      <path d="M40 60 h600 v52 h-600 Z" fill={FRAME} />
      <text x="340" y="94" textAnchor="middle" fontFamily="var(--ff-syne), sans-serif" fontWeight="800" fontSize="22" letterSpacing="2" fill="#2A2219">
        DALIA-LIGHT
      </text>
      <text x="340" y="94" textAnchor="middle" fontFamily="var(--ff-syne), sans-serif" fontWeight="800" fontSize="22" letterSpacing="2" fill="#FFD27A" className="visual-lit">
        DALIA-LIGHT
      </text>

      {/* Vitrine */}
      <rect x="80" y="140" width="520" height="230" fill="#0E0B08" />
      <rect x="80" y="140" width="520" height="230" fill="#FF9A1F" opacity="0.1" className="visual-lit" />
      {lamps.map((lamp) => (
        <LampShape key={`${lamp.x}-${lamp.y}`} lamp={lamp} id={id} />
      ))}
      <rect x="80" y="140" width="520" height="230" fill="none" stroke={FRAME} strokeWidth="8" />
      <path d="M340 140 V370" stroke={FRAME} strokeWidth="6" />

      {/* Trottoir et lumière qui en sort */}
      <path d="M0 400 h680 v60 h-680 Z" fill="#100D0A" />
      <path d="M80 400 L600 400 L660 460 L20 460 Z" fill={`url(#${id}-spill)`} className="visual-lit" />
    </svg>
  );
}
