// État mutable partagé entre les timelines GSAP (DOM) et la scène 3D (lue à chaque image dans useFrame).
// Pas de state React : GSAP écrit ces valeurs 60 fois par seconde sans provoquer de re-rendu.
export type HeroState = {
  /** Filament qui rougeoit avant l'allumage, 0 → 1. */
  filament: number;
  /** Allumage de la pièce, 0 → 1 (multiplié par le variateur). */
  ignite: number;
  /** Zoom de la caméra : 1 = vue normale, > 1 = gros plan sur l'ampoule. */
  camZoom: number;
  /** 1 = caméra centrée sur l'ampoule, 0 = cadrage normal. */
  camFocus: number;
  /** Sortie du hero au scroll, 0 → 1 : la lampe défile plus lentement que la page, le faisceau s'élargit. */
  lift: number;
  /** Pendule : angle (rad) et vitesse angulaire. */
  angle: number;
  velocity: number;
  /** Glisser en cours : angle visé par le pointeur, ou null. */
  dragTarget: number | null;
};

export function createHeroState(lit: boolean): HeroState {
  return {
    filament: lit ? 1 : 0,
    ignite: lit ? 1 : 0,
    camZoom: lit ? 1 : 5,
    camFocus: lit ? 0 : 1,
    lift: 0,
    angle: 0,
    velocity: 0,
    dragTarget: null,
  };
}
