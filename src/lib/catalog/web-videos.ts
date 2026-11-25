// Vidéos d'ambiance affichées en tête d'une famille (« Tout voir », clé : ?famille=…) ou d'une sous-catégorie
// (clé : ?categorie=…).
// Fichiers compressés (avec leur son) dans public/catalogue/videos/, avec leur image fixe. Provisoire, comme
// web-images.ts : en ligne, elles iront dans le stockage Supabase (images/site/videos/).

export type CategoryVideo = {
  src: string;
  /** Image fixe : avant le chargement, et à la place de la vidéo si le visiteur a réduit les animations. */
  poster: string;
  /** L'article qu'on voit dans la vidéo : la légende mène à sa fiche. */
  productId?: string;
  /** Ou sa référence, pour un article dont on ne connaît pas l'identifiant : il est retrouvé dans l'ERP. */
  productRef?: string;
  /** Point de la vidéo à garder visible quand le bandeau la recadre (CSS object-position). */
  focus?: string;
};

export const familyVideos: Record<string, CategoryVideo> = {
  lustres: {
    src: "/catalogue/videos/famille-lustres.mp4",
    poster: "/catalogue/videos/famille-lustres.webp",
    productId: "2bb0d60e-d398-4a1e-8014-5da2127429d7",
    focus: "50% 20%",
  },
};

export const categoryVideos: Record<string, CategoryVideo> = {
  "lustre-1-amp": {
    src: "/catalogue/videos/lustre-1-amp.mp4",
    poster: "/catalogue/videos/lustre-1-amp.webp",
    productId: "3bb8ddb9-1f33-40cb-b023-2c7130836dad",
  },
  "lustre-5-amp": {
    src: "/catalogue/videos/lustre-5-amp.mp4",
    poster: "/catalogue/videos/lustre-5-amp.webp",
    productId: "c89f4608-7f58-4e04-b985-506f27b9d542", // Lustre Cylindres ambrés
    focus: "50% 25%",
  },
  "lustre-cristal": {
    src: "/catalogue/videos/lustre-cristal.mp4",
    poster: "/catalogue/videos/lustre-cristal.webp",
    productId: "07d4a6c6-e08a-482e-9578-0091eb8dfe79", // Lustre Cascade dorée
    focus: "50% 20%",
  },
  "lustre-10-amp": {
    src: "/catalogue/videos/lustre-10-amp.mp4",
    poster: "/catalogue/videos/lustre-10-amp.webp",
    productId: "7216cd89-f4e5-456a-aa4a-5e0ac8ad4331", // Lustre Bulles
    focus: "50% 20%",
  },
  "lustre-12-amp": {
    src: "/catalogue/videos/lustre-12-amp.mp4",
    poster: "/catalogue/videos/lustre-12-amp.webp",
    productId: "e46ff31b-3106-41f4-b1a9-20ca52ff4ab6", // Lustre Manoir
    focus: "50% 25%",
  },
  "lustre-led": {
    src: "/catalogue/videos/lustre-led.mp4",
    poster: "/catalogue/videos/lustre-led.webp",
    productRef: "MH74-1", // Lustre Cascade de givre
    focus: "50% 20%",
  },
  "applique-1-ampoule": {
    src: "/catalogue/videos/applique-1-ampoule.mp4",
    poster: "/catalogue/videos/applique-1-ampoule.webp",
    productRef: "1006/1B", // Applique Cloche et bois
  },
  "applique-2-ampoules": {
    src: "/catalogue/videos/applique-2-ampoules.mp4",
    poster: "/catalogue/videos/applique-2-ampoules.webp",
    productRef: "9933/2B", // Applique double Cylindres et bois
  },
};
