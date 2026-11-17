// Vidéos d'ambiance affichées en tête d'une sous-catégorie (clé : l'adresse de la catégorie, ?categorie=…).
// Fichiers compressés (sans son) dans public/catalogue/videos/, avec leur image fixe. Provisoire, comme
// web-images.ts : en ligne, elles iront dans le stockage Supabase (images/site/videos/).

export type CategoryVideo = {
  src: string;
  /** Image fixe : avant le chargement, et à la place de la vidéo si le visiteur a réduit les animations. */
  poster: string;
  /** L'article qu'on voit dans la vidéo : la légende mène à sa fiche. */
  productId?: string;
};

export const categoryVideos: Record<string, CategoryVideo> = {
  "lustre-1-amp": {
    src: "/catalogue/videos/lustre-1-amp.mp4",
    poster: "/catalogue/videos/lustre-1-amp.webp",
    productId: "3bb8ddb9-1f33-40cb-b023-2c7130836dad",
  },
};
