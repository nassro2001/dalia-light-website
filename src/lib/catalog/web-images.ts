// Photos de mise en scène (le luminaire allumé dans une pièce), fournies par Dalia-Light, rangées dans
// public/catalogue/scenes/. Elles passent avant la photo détourée de l'ERP, qui reste en vue suivante.
// Provisoire, comme web-names.ts : elles rejoindront l'ERP (photos du site) avant la mise en ligne.

export const sceneImages: Record<string, string> = {
  "7a7e46be-a35e-4f59-87a3-446375c98ffb": "/catalogue/scenes/7a7e46be-a35e-4f59-87a3-446375c98ffb.webp", // Suspension Calebasse
  "2bb0d60e-d398-4a1e-8014-5da2127429d7": "/catalogue/scenes/2bb0d60e-d398-4a1e-8014-5da2127429d7.webp", // Suspension Galette
  "8dc49f0c-5323-4088-a247-29e3a71c68f4": "/catalogue/scenes/8dc49f0c-5323-4088-a247-29e3a71c68f4.webp", // Suspension Liane
  "8a6383dd-a0b6-4c2a-8b66-42ce0a93dfe7": "/catalogue/scenes/8a6383dd-a0b6-4c2a-8b66-42ce0a93dfe7.webp", // Suspension Fougère
  "65c93ed9-c766-411c-9f20-f91ec3ef7005": "/catalogue/scenes/65c93ed9-c766-411c-9f20-f91ec3ef7005.webp", // Suspension Volute
  "f14ad901-7cb5-45a3-b627-1a3929e6ccb2": "/catalogue/scenes/f14ad901-7cb5-45a3-b627-1a3929e6ccb2.webp", // Suspension Lanterne
  "5652174a-733e-49a9-91b4-90faa05367fc": "/catalogue/scenes/5652174a-733e-49a9-91b4-90faa05367fc.webp", // Suspension Miroir cuivré
  "d00490e1-2255-46c4-a95b-c12074719329": "/catalogue/scenes/d00490e1-2255-46c4-a95b-c12074719329.webp", // Suspension Feuillage
  "64e4069c-9b22-46ec-9db0-8f6c743ff356": "/catalogue/scenes/64e4069c-9b22-46ec-9db0-8f6c743ff356.webp", // Suspension Rubans
  "ef97f014-ddf7-4038-8b43-1cbce1b0cbbb": "/catalogue/scenes/ef97f014-ddf7-4038-8b43-1cbce1b0cbbb.webp", // Suspension Nasse
  "3bb8ddb9-1f33-40cb-b023-2c7130836dad": "/catalogue/scenes/3bb8ddb9-1f33-40cb-b023-2c7130836dad.webp", // Suspension Atelier noire
  "1d792ef4-a27e-4c1a-ab9a-014b37afe4e9": "/catalogue/scenes/1d792ef4-a27e-4c1a-ab9a-014b37afe4e9.webp", // Suspension Atelier orange
  "647cc04b-a836-4b5a-860e-204470e4f080": "/catalogue/scenes/647cc04b-a836-4b5a-860e-204470e4f080.webp", // Suspension Spirale
  "dc95c499-b49a-4202-b63e-aede6bf26734": "/catalogue/scenes/dc95c499-b49a-4202-b63e-aede6bf26734.webp", // Suspension Ambre
  "9281f17d-7648-406c-9489-72205d754831": "/catalogue/scenes/9281f17d-7648-406c-9489-72205d754831.webp", // Suspension Diadème
  "39ea67b8-9ff9-4c53-97af-137787b254b3": "/catalogue/scenes/39ea67b8-9ff9-4c53-97af-137787b254b3.webp", // Lanterne Veilleur
  "02e46bda-040f-4eac-910d-594effb8f90d": "/catalogue/scenes/02e46bda-040f-4eac-910d-594effb8f90d.webp", // Suspension Ogive
};

/** Une photo de mise en scène remplit son cadre ; une photo détourée se pose sur le fond plâtre. */
export function isScene(src: string | undefined) {
  return Boolean(src?.includes("/scenes/"));
}
