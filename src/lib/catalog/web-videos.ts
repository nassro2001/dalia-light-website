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
  "lustre-12-amp": {
    src: "/catalogue/videos/lustre-12-amp.mp4",
    poster: "/catalogue/videos/lustre-12-amp.webp",
    productId: "e46ff31b-3106-41f4-b1a9-20ca52ff4ab6", // Lustre Manoir
    focus: "50% 25%",
  },
};
