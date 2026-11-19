// Photos de mise en scène (le luminaire allumé dans une pièce), fournies par Dalia-Light, rangées dans
// public/catalogue/scenes/. Elles passent avant la photo détourée de l'ERP, qui reste en vue suivante.
// Provisoire, comme web-names.ts : elles rejoindront l'ERP (photos du site) avant la mise en ligne.

// Clé : l'identifiant de l'article dans l'ERP, ou à défaut sa référence. Plusieurs mises en scène possibles.
export const sceneImages: Record<string, string | string[]> = {
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
  "80afa263-8bbd-44aa-9d90-32e4a3a3272e": "/catalogue/scenes/80afa263-8bbd-44aa-9d90-32e4a3a3272e.webp", // Lustre Givre
  "23bf22d4-6594-44b1-9df4-3385ca19935d": "/catalogue/scenes/23bf22d4-6594-44b1-9df4-3385ca19935d.webp", // Lustre Ébène
  "09eb3f67-2748-4fbe-8eaa-aace0e35f0f0": "/catalogue/scenes/09eb3f67-2748-4fbe-8eaa-aace0e35f0f0.webp", // Lustre Ambre
  "7ee95e56-b061-4644-8bfb-d774c5f68b02": "/catalogue/scenes/7ee95e56-b061-4644-8bfb-d774c5f68b02.webp", // Lustre Cerceaux
  "c89f4608-7f58-4e04-b985-506f27b9d542": "/catalogue/scenes/c89f4608-7f58-4e04-b985-506f27b9d542.webp", // Lustre Cylindres ambrés
  "d85d8499-8b9a-4dbb-a8dc-0143fbf23805": "/catalogue/scenes/d85d8499-8b9a-4dbb-a8dc-0143fbf23805.webp", // Lustre Colonnes
  "aeba259c-1508-49ec-9207-c903ce88b359": "/catalogue/scenes/aeba259c-1508-49ec-9207-c903ce88b359.webp", // Lustre Duo laiton
  "c120f159-d20a-4917-b180-d536d0a8df33": "/catalogue/scenes/c120f159-d20a-4917-b180-d536d0a8df33.webp", // Lustre Rivière rosée
  "07d4a6c6-e08a-482e-9578-0091eb8dfe79": "/catalogue/scenes/07d4a6c6-e08a-482e-9578-0091eb8dfe79.webp", // Lustre Cascade dorée
  "c6fcf624-dee7-4d0a-8665-ac5f2d82e732": "/catalogue/scenes/c6fcf624-dee7-4d0a-8665-ac5f2d82e732.webp", // Lustre Couronne
  "e1eeff48-fdb8-4d13-a5d8-59c5ce41ec63": "/catalogue/scenes/e1eeff48-fdb8-4d13-a5d8-59c5ce41ec63.webp", // Lustre Coquillages
  "904dcad4-63bf-409b-83a2-448ecc0e0690": "/catalogue/scenes/904dcad4-63bf-409b-83a2-448ecc0e0690.webp", // Lustre Alvéoles
  "dfe597a5-cee8-4c5c-89a9-83a2bc40c406": "/catalogue/scenes/dfe597a5-cee8-4c5c-89a9-83a2bc40c406.webp", // Lustre Vagues
  "9dffaff1-d0ed-4b64-a5d0-d438c96f227b": "/catalogue/scenes/9dffaff1-d0ed-4b64-a5d0-d438c96f227b.webp", // Suspension Grelot
  "a1ded677-db1e-4a76-9bcd-da187cbc8f8f": "/catalogue/scenes/a1ded677-db1e-4a76-9bcd-da187cbc8f8f.webp", // Suspension Bulbe
  "a58a2b0b-9fa0-4d80-b3c3-13ce4bb7fa21": "/catalogue/scenes/a58a2b0b-9fa0-4d80-b3c3-13ce4bb7fa21.webp", // Lustre Pagode
  "2b5bf834-cba6-4b26-b274-ff74fa212221": "/catalogue/scenes/2b5bf834-cba6-4b26-b274-ff74fa212221.webp", // Lustre Minaret
  "787ff88f-5d28-4377-9544-fafa3f84110a": "/catalogue/scenes/787ff88f-5d28-4377-9544-fafa3f84110a.webp", // Lustre Cloche dorée
  "655f1489-e085-4a2d-bfbf-6276145777f2": "/catalogue/scenes/655f1489-e085-4a2d-bfbf-6276145777f2.webp", // Lustre Éclipse
  "a9b46d09-3bc1-4832-bfd8-899501c644f3": "/catalogue/scenes/a9b46d09-3bc1-4832-bfd8-899501c644f3.webp", // Lustre Tourelle
  "1bb7eff7-de8a-4ff5-9813-912088fae43d": "/catalogue/scenes/1bb7eff7-de8a-4ff5-9813-912088fae43d.webp", // Lustre Dôme doré
  "e11a891e-28f9-41b0-911c-2165975928ba": "/catalogue/scenes/e11a891e-28f9-41b0-911c-2165975928ba.webp", // Lustre Clavier
  "e9d32637-4707-42eb-a103-5d8c56a5be2c": "/catalogue/scenes/e9d32637-4707-42eb-a103-5d8c56a5be2c.webp", // Lustre Rosé
  "63cb318c-527a-454d-95f0-bfff6bdfb462": "/catalogue/scenes/63cb318c-527a-454d-95f0-bfff6bdfb462.webp", // Lustre Clavier grand modèle
  "901c8775-9a0a-460f-bb55-19e2b1f3a07d": "/catalogue/scenes/901c8775-9a0a-460f-bb55-19e2b1f3a07d.webp", // Lustre Orgue
  "b2a545f3-34de-4284-aac4-49d72c26c118": "/catalogue/scenes/b2a545f3-34de-4284-aac4-49d72c26c118.webp", // Lustre Soleil
  "0f796938-59cd-48f6-9ef8-742c8a97c2e6": "/catalogue/scenes/0f796938-59cd-48f6-9ef8-742c8a97c2e6.webp", // Lustre Nacre
  "1ce3a885-3092-4a33-b3bf-25e343a090ac": "/catalogue/scenes/1ce3a885-3092-4a33-b3bf-25e343a090ac.webp", // Lustre Fumé
  "a490d430-c531-434b-882c-d13148662d24": "/catalogue/scenes/a490d430-c531-434b-882c-d13148662d24.webp", // Lustre Cascade ambrée
  "96aca078-c2e3-4964-9d32-78e0433b997a": "/catalogue/scenes/96aca078-c2e3-4964-9d32-78e0433b997a.webp", // Lustre Stalactites
  "5526bb53-f0de-49eb-b900-3b69d7ba8df4": "/catalogue/scenes/5526bb53-f0de-49eb-b900-3b69d7ba8df4.webp", // Lustre Orgue doré
  "9c29a92b-9bc4-41f8-b28b-51e30224e093": "/catalogue/scenes/9c29a92b-9bc4-41f8-b28b-51e30224e093.webp", // Lustre Étoile noire
  "6d7168a8-079c-4741-80b0-6d26e9a2d4de": "/catalogue/scenes/6d7168a8-079c-4741-80b0-6d26e9a2d4de.webp", // Lustre Étoile dorée
  "3f2fc411-3d28-489f-9798-67dd35f1f9b5": "/catalogue/scenes/3f2fc411-3d28-489f-9798-67dd35f1f9b5.webp", // Lustre Étoile cuivrée
  "ad592157-f591-4287-9d58-a2030b047c0a": "/catalogue/scenes/ad592157-f591-4287-9d58-a2030b047c0a.webp", // Lustre Pétales argent
  "4731f753-34c8-4548-ac1f-77f7e75ee7dc": "/catalogue/scenes/4731f753-34c8-4548-ac1f-77f7e75ee7dc.webp", // Lustre Coquillages dorés
  "a4705d57-301d-47ff-b376-ed42bcb936dd": "/catalogue/scenes/a4705d57-301d-47ff-b376-ed42bcb936dd.webp", // Lustre Ombrelle
  "34ba878b-dc04-4937-87c3-2cb508823c0c": "/catalogue/scenes/34ba878b-dc04-4937-87c3-2cb508823c0c.webp", // Lustre Galerie
  // LUSTRE LED : ces articles ne sont pas encore publiés dans l'ERP, on les reconnaît à leur référence.
  "MH74-1": "/catalogue/scenes/led-mh74-1.webp", // Lustre Cascade de givre
  "MH76-16": ["/catalogue/scenes/led-mh76-16.webp", "/catalogue/scenes/led-mh76-16-2.webp"], // Suspension Anneau laiton
  "MH74-5": "/catalogue/scenes/led-mh74-5.webp", // Lustre Ruban de givre
  "MH70-7": "/catalogue/scenes/led-mh70-7.webp", // Lustre Croissant blanc
  "MH76-18": "/catalogue/scenes/led-mh76-18.webp", // Suspension Goutte laiton
  "MH70-1": "/catalogue/scenes/led-mh70-1.webp", // Lustre Spirale blanche
  "MH70-5": "/catalogue/scenes/led-mh70-5.webp", // Lustre Ovale de cristal
  "MH74-4": "/catalogue/scenes/led-mh74-4.webp", // Lustre Banquise
  "MH70-9": "/catalogue/scenes/led-mh70-9.webp", // Lustre Ellipses argent
  "MH70-9/1": "/catalogue/scenes/led-mh70-9-1.webp", // Lustre Carrés dorés
  "MH70-8": "/catalogue/scenes/led-mh70-8.webp", // Lustre Arabesque dorée
  "MH74-2": "/catalogue/scenes/led-mh74-2.webp", // Lustre Remous de givre
  "79308/62/47": "/catalogue/scenes/led-79308-62-47.webp", // Suspension Coupole dorée
  "MH74-5/2N": "/catalogue/scenes/led-mh74-5-2n.webp", // Lustre Croisée de cristal
  "MH69-1": "/catalogue/scenes/led-mh69-1.webp", // Lustre Saturne
  "MH74-3": "/catalogue/scenes/led-mh74-3.webp", // Lustre Glacier
  "MH78-1": "/catalogue/scenes/led-mh78-1.webp", // Lustre Cannelé blanc
  "MH70-13": "/catalogue/scenes/led-mh70-13.webp", // Suspension Boucle blanche
  "MH70-3": "/catalogue/scenes/led-mh70-3.webp", // Suspension linéaire Ondine
  "MH70-6": "/catalogue/scenes/led-mh70-6.webp", // Lustre Constellation
  "MH70-11": "/catalogue/scenes/led-mh70-11.webp", // Lustre Entrelacs blanc
  "MH74-6": "/catalogue/scenes/led-mh74-6.webp", // Lustre Nuage doré
  "MH70-12": "/catalogue/scenes/led-mh70-12.webp", // Suspension Boucle dorée
  "MH69-2": "/catalogue/scenes/led-mh69-2.webp", // Lustre Gravitation
  "MH74-7": "/catalogue/scenes/led-mh74-7.webp", // Lustre Vague dorée
  "MH70-4": "/catalogue/scenes/led-mh70-4.webp", // Lustre Gyroscope
  "MH74-1/1D": "/catalogue/scenes/led-mh74-1-1d.webp", // Lustre Diadème de glace
  "MH74-4/1N": "/catalogue/scenes/led-mh74-4-1n.webp", // Lustre Couronne noire
  "MH70-14": "/catalogue/scenes/led-mh70-14.webp", // Suspension Clef de sol
  "MH70-10": "/catalogue/scenes/led-mh70-10.webp", // Lustre Calligraphie noire
  "MH74-6/3N": "/catalogue/scenes/led-mh74-6-3n.webp", // Lustre Éclat noir
  "MH67-12": "/catalogue/scenes/led-mh67-12.webp", // Lustre Touches de piano
};

/** Marque d'une photo entière de l'ERP (voir photo-kind.ts) : elle remplit son cadre. */
export const SCENE_MARK = "#scene";

/** Les photos d'un article pour le site : la mise en scène du site d'abord, puis celles de l'ERP. */
export function webImages(id: string, reference: string, erpImages: string[]): string[] {
  const scenes = sceneImages[id] ?? sceneImages[reference] ?? [];
  return [...(Array.isArray(scenes) ? scenes : [scenes]), ...erpImages];
}

/** Une photo de mise en scène remplit son cadre ; une photo détourée se pose sur le fond plâtre. */
export function isScene(src: string | undefined) {
  return Boolean(src && (src.includes("/scenes/") || src.endsWith(SCENE_MARK)));
}
