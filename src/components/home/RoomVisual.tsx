import type { RoomSlug } from "@/lib/catalog";

// Illustration provisoire d'une pièce (en attendant les photos d'intérieurs éclairés).
// Pièce dans la pénombre ; le calque .visual-lit allume les luminaires et leurs flaques de lumière
// quand un parent porte data-lit="true" (voir globals.css, « VISUEL PRODUIT »).

const FURNITURE = "#2A2219";
const EDGE = "#3A2F23";
const BRASS = "#B98C45";

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#15110D" />
        <stop offset="1" stopColor="#1E1913" />
      </linearGradient>
      <radialGradient id={`${id}-halo`}>
        <stop offset="0" stopColor="#FFF1CF" stopOpacity="0.9" />
        <stop offset="0.25" stopColor="#FFB800" stopOpacity="0.45" />
        <stop offset="0.6" stopColor="#FF6A00" stopOpacity="0.1" />
        <stop offset="1" stopColor="#FF6A00" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${id}-beam`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFC85A" stopOpacity="0.32" />
        <stop offset="1" stopColor="#FFC85A" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={`${id}-beam-braise`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FF6A00" stopOpacity="0.38" />
        <stop offset="1" stopColor="#FF6A00" stopOpacity="0" />
      </linearGradient>
      <radialGradient id={`${id}-pool`} cy="0.3">
        <stop offset="0" stopColor="#FFB800" stopOpacity="0.28" />
        <stop offset="1" stopColor="#FFB800" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

/** Suspension en cloche : câble, cloche, faisceau, halo et flaque au sol (allumés). */
function Pendant({ id, x, y, w = 70, floor = 400, beam = true }: { id: string; x: number; y: number; w?: number; floor?: number; beam?: boolean }) {
  return (
    <g>
      <g className="visual-lit">
        {beam && <path d={`M${x - w * 0.4} ${y} L${x + w * 0.4} ${y} L${x + w * 1.6} ${floor} L${x - w * 1.6} ${floor} Z`} fill={`url(#${id}-beam)`} />}
        <ellipse cx={x} cy={floor} rx={w * 1.7} ry={w * 0.35} fill={`url(#${id}-pool)`} />
        <circle cx={x} cy={y} r={w * 1.1} fill={`url(#${id}-halo)`} />
      </g>
      <path d={`M${x} 0 V${y - w * 0.5}`} stroke="#5A4630" strokeWidth="2" />
      <path d={`M${x - w / 2} ${y} C${x - w / 2} ${y - w * 0.55} ${x + w / 2} ${y - w * 0.55} ${x + w / 2} ${y} Z`} fill={BRASS} />
      <ellipse cx={x} cy={y} rx={w / 2} ry={w * 0.08} fill="#2A2219" />
      <ellipse cx={x} cy={y} rx={w / 2} ry={w * 0.08} fill="#FFE2A0" className="visual-lit" />
    </g>
  );
}

/** Petite source ponctuelle (applique, lanterne, spot) avec halo. */
function Glow({ id, x, y, r = 60 }: { id: string; x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={`url(#${id}-halo)`} className="visual-lit" />
      <circle cx={x} cy={y} r="5" fill="#3A2F22" />
      <circle cx={x} cy={y} r="5" fill="#FFF4D6" className="visual-lit" />
    </g>
  );
}

function Scene({ room, id }: { room: RoomSlug; id: string }) {
  switch (room) {
    case "salon":
      return (
        <>
          <Pendant id={id} x={200} y={170} w={84} />
          <path d="M70 300 h260 v24 h-260 Z" fill={EDGE} />
          <path d="M60 322 h280 v46 h-280 Z" fill={FURNITURE} />
          <path d="M60 300 h22 v68 h-22 Z M318 300 h22 v68 h-22 Z" fill={EDGE} />
          <path d="M80 368 v18 M320 368 v18" stroke={EDGE} strokeWidth="5" />
        </>
      );
    case "salle-a-manger":
      return (
        <>
          <g className="visual-lit">
            <ellipse cx="200" cy="330" rx="170" ry="40" fill={`url(#${id}-pool)`} />
            <circle cx="200" cy="180" r="120" fill={`url(#${id}-halo)`} />
          </g>
          <path d="M200 0 V160" stroke="#5A4630" strokeWidth="2" />
          <path d="M150 182 C160 196 240 196 250 182 M168 170 C176 182 224 182 232 170" stroke={BRASS} strokeWidth="4" fill="none" />
          {[150, 250, 168, 232].map((x, i) => (
            <Glow key={x} id={id} x={x} y={i < 2 ? 176 : 164} r={30} />
          ))}
          <path d="M100 322 h200 v10 h-200 Z" fill={EDGE} />
          <path d="M118 332 v58 M282 332 v58" stroke={EDGE} strokeWidth="6" />
          <path d="M70 300 v90 M70 340 h30 M330 300 v90 M330 340 h-30" stroke={FURNITURE} strokeWidth="6" />
        </>
      );
    case "chambre":
      return (
        <>
          <g className="visual-lit">
            <ellipse cx="200" cy="250" rx="200" ry="120" fill={`url(#${id}-pool)`} />
          </g>
          <Glow id={id} x={78} y={228} r={70} />
          <Glow id={id} x={322} y={228} r={70} />
          <path d="M70 228 h16 v20 h-16 Z M314 228 h16 v20 h-16 Z" fill={BRASS} />
          <path d="M110 250 h180 v80 h-180 Z" fill={EDGE} />
          <path d="M90 330 h220 v44 h-220 Z" fill={FURNITURE} />
          <path d="M120 316 h70 v18 h-70 Z M210 316 h70 v18 h-70 Z" fill="#4A3D2E" />
        </>
      );
    case "cuisine":
      return (
        <>
          {[120, 200, 280].map((x) => (
            <Pendant key={x} id={id} x={x} y={200} w={42} floor={330} />
          ))}
          <path d="M50 330 h300 v8 h-300 Z" fill="#4A3D2E" />
          <path d="M60 338 h280 v62 h-280 Z" fill={FURNITURE} />
          <path d="M150 338 v62 M250 338 v62" stroke={EDGE} strokeWidth="3" />
        </>
      );
    case "salle-de-bain":
      return (
        <>
          <g className="visual-lit">
            <path d="M120 140 h160 v160 h-160 Z" fill="#FFE2A0" opacity="0.12" />
            <ellipse cx="200" cy="140" rx="160" ry="70" fill={`url(#${id}-halo)`} />
          </g>
          <path d="M140 132 h120 v8 h-120 Z" fill={BRASS} />
          <path d="M145 140 h110 v4 h-110 Z" fill="#FFF4D6" className="visual-lit" />
          <rect x="130" y="152" width="140" height="140" rx="70" fill="#1E1913" stroke={EDGE} strokeWidth="4" />
          <path d="M110 320 h180 v80 h-180 Z" fill={FURNITURE} />
          <path d="M100 312 h200 v10 h-200 Z" fill="#4A3D2E" />
        </>
      );
    case "exterieur":
      return (
        <>
          <path d="M60 170 L200 90 L340 170 Z" fill={EDGE} />
          <path d="M80 170 h240 v230 h-240 Z" fill={FURNITURE} />
          <path d="M170 290 h60 v110 h-60 Z" fill="#15110D" />
          <path d="M110 210 h44 v44 h-44 Z M246 210 h44 v44 h-44 Z" fill="#15110D" />
          <path d="M110 210 h44 v44 h-44 Z M246 210 h44 v44 h-44 Z" fill="#FFD27A" opacity="0.35" className="visual-lit" />
          <g className="visual-lit">
            <ellipse cx="200" cy="400" rx="150" ry="30" fill={`url(#${id}-pool)`} />
          </g>
          <Glow id={id} x={248} y={300} r={70} />
          <path d="M240 288 h16 v24 h-16 Z" fill={BRASS} opacity="0.6" />
        </>
      );
    case "boite-de-nuit":
      return (
        <>
          {/* Bar rétroéclairé au fond */}
          <path d="M40 150 h320 v150 h-320 Z" fill="#17120D" />
          <path d="M40 150 h320 v150 h-320 Z" fill="#FF9A1F" opacity="0.14" className="visual-lit" />
          {[195, 250].map((y) => (
            <path key={y} d={`M50 ${y} h300`} stroke={EDGE} strokeWidth="4" />
          ))}
          {[60, 78, 96, 130, 148, 200, 218, 236, 280, 298, 330].map((x, i) => (
            <rect key={x} x={x} y={i % 2 ? 165 : 170} width="10" height={i % 2 ? 30 : 25} rx="3" fill={FURNITURE} />
          ))}
          {[64, 100, 140, 176, 226, 262, 300, 334].map((x, i) => (
            <rect key={x} x={x} y={i % 2 ? 222 : 226} width="10" height={i % 2 ? 28 : 24} rx="3" fill={FURNITURE} />
          ))}
          <path d="M40 300 h320 v10 h-320 Z" fill="#4A3D2E" />
          <path d="M50 310 h300 v40 h-300 Z" fill={FURNITURE} />
          {/* Faisceaux croisés depuis la boule à facettes, sur la piste */}
          <g className="visual-lit">
            <path d="M196 92 L204 92 L120 420 L40 420 Z" fill={`url(#${id}-beam)`} />
            <path d="M196 92 L204 92 L360 420 L280 420 Z" fill={`url(#${id}-beam-braise)`} />
            <path d="M197 92 L203 92 L230 420 L170 420 Z" fill={`url(#${id}-beam)`} />
            <ellipse cx="200" cy="420" rx="190" ry="40" fill={`url(#${id}-pool)`} />
            <circle cx="200" cy="80" r="70" fill={`url(#${id}-halo)`} />
          </g>
          <path d="M200 0 V62" stroke="#5A4630" strokeWidth="2" />
          <circle cx="200" cy="80" r="18" fill="#5A4630" />
          <circle cx="200" cy="80" r="18" fill="#FFE2A0" opacity="0.85" className="visual-lit" />
          <path d="M182 80 h36 M200 62 v36 M187 67 l26 26 M213 67 l-26 26" stroke="#2A2219" strokeWidth="1.5" />
          {/* Tabourets */}
          {[110, 200, 290].map((x) => (
            <path key={x} d={`M${x - 16} 362 h32 v6 h-32 Z M${x - 2} 368 h4 v32 h-4 Z`} fill={EDGE} />
          ))}
        </>
      );
    case "commerce":
      return (
        <>
          <path d="M60 80 h280" stroke={EDGE} strokeWidth="6" />
          {[120, 200, 280].map((x) => (
            <g key={x}>
              <path d={`M${x - 14} 88 L${x + 14} 88 L${x + 60} 400 L${x - 60} 400 Z`} fill={`url(#${id}-beam)`} className="visual-lit" />
              <path d={`M${x - 9} 80 h18 v14 h-18 Z`} fill={BRASS} />
              <circle cx={x} cy={96} r="22" fill={`url(#${id}-halo)`} className="visual-lit" />
            </g>
          ))}
          {[230, 300, 370].map((y) => (
            <path key={y} d={`M60 ${y} h280`} stroke={EDGE} strokeWidth="5" />
          ))}
          {[
            [80, 200, 40, 30],
            [140, 206, 30, 24],
            [230, 196, 50, 34],
            [300, 204, 26, 26],
            [90, 272, 50, 28],
            [180, 268, 36, 32],
            [260, 274, 60, 26],
            [70, 344, 40, 26],
            [150, 340, 60, 30],
            [250, 346, 44, 24],
          ].map(([x, y, w, h]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} fill={FURNITURE} />
          ))}
        </>
      );
  }
}

export function RoomVisual({ room, label }: { room: RoomSlug; label: string }) {
  const id = `room-${room}`;
  return (
    <svg viewBox="0 0 400 480" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${label}, illustration`}>
      <Defs id={id} />
      <rect width="400" height="480" fill={`url(#${id}-wall)`} />
      <path d="M0 400 h400 v80 h-400 Z" fill="#100D0A" />
      <Scene room={room} id={id} />
    </svg>
  );
}
