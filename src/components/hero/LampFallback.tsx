// Suspension en SVG : affichée au premier rendu (HTML serveur), puis remplacée en fondu par la 3D.
// Reste seule si WebGL est indisponible. Positionnée sur --lamp-x / --lamp-y comme la scène 3D.
export function LampFallback({ hidden }: { hidden: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`lamp-fallback pointer-events-none absolute top-0 flex -translate-x-1/2 flex-col items-center transition-opacity duration-(--dur-ignite) ${
        hidden ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-0.5 flex-1 bg-[#7A6038]" />
      <svg viewBox="0 0 240 150" className="w-full overflow-visible">
        <defs>
          <linearGradient id="fallback-brass" x1="0" x2="1">
            <stop offset="0" stopColor="#7A5A22" />
            <stop offset="0.45" stopColor="#D6A95C" />
            <stop offset="1" stopColor="#6B4E1D" />
          </linearGradient>
          <radialGradient id="fallback-bulb">
            <stop offset="0" stopColor="#FFF4D6" />
            <stop offset="0.5" stopColor="#FFB800" />
            <stop offset="1" stopColor="#FF6A00" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="108" y="0" width="24" height="16" rx="3" fill="#B98C45" />
        <path d="M110 14 C80 20 40 50 22 96 C14 116 6 128 0 134 L240 134 C234 128 226 116 218 96 C200 50 160 20 130 14 Z" fill="url(#fallback-brass)" />
        <ellipse cx="120" cy="134" rx="120" ry="12" fill="#FFD27A" style={{ opacity: "var(--lit)" }} />
        <circle cx="120" cy="134" r="40" fill="url(#fallback-bulb)" style={{ opacity: "var(--lit)" }} />
      </svg>
    </div>
  );
}
