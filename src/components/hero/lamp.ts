// Position de l'ampoule dans le hero, partagée par la scène 3D, le repli SVG et le halo CSS.
// Valeurs en fraction de la largeur / hauteur du hero.
export const LAMP = {
  desktop: { x: 0.7, y: 0.4, radius: 120 },
  mobile: { x: 0.64, y: 0.3, radius: 78 },
} as const;

export const MOBILE_QUERY = "(max-width: 767px)";
