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
  "MH70-5": "/catalogue/scenes/led-mh70-5.webp", // Lustre Ovale de cristal
  "MH74-4": "/catalogue/scenes/led-mh74-4.webp", // Lustre Banquise
  "MH70-9": "/catalogue/scenes/led-mh70-9.webp", // Lustre Spirale argent
  "MH70-9/1": "/catalogue/scenes/led-mh70-9-1.webp", // Lustre Carrés dorés
  "MH70-8": "/catalogue/scenes/led-mh70-8.webp", // Lustre Arabesque dorée
  "MH74-2": "/catalogue/scenes/led-mh74-2.webp", // Lustre Remous de givre
  "MH69-1": "/catalogue/scenes/led-mh69-1.webp", // Lustre Auréole
  "79308/62/47": "/catalogue/scenes/led-79308-62-47.webp", // Suspension Coupole dorée
  "MH74-5/2N": "/catalogue/scenes/led-mh74-5-2n.webp", // Lustre Croisée de cristal
  "MH74-3": "/catalogue/scenes/led-mh74-3.webp", // Lustre Glacier
  "MH78-1": "/catalogue/scenes/led-mh78-1.webp", // Lustre Cannelé blanc
  "MH70-13": "/catalogue/scenes/led-mh70-13.webp", // Suspension Boucle blanche
  "MH70-3": "/catalogue/scenes/led-mh70-3.webp", // Suspension linéaire Ondine
  "MH70-6": "/catalogue/scenes/led-mh70-6.webp", // Lustre Constellation
  "MH70-11": "/catalogue/scenes/led-mh70-11.webp", // Lustre Entrelacs blanc
  "MH74-6": "/catalogue/scenes/led-mh74-6.webp", // Lustre Nuage doré
  "MH70-12": "/catalogue/scenes/led-mh70-12.webp", // Suspension Boucle dorée
  "MH74-7": "/catalogue/scenes/led-mh74-7.webp", // Lustre Vague dorée
  "MH69-2": "/catalogue/scenes/led-mh69-2.webp", // Lustre Gyroscope
  "MH74-1/1D": "/catalogue/scenes/led-mh74-1-1d.webp", // Lustre Diadème de glace
  "MH74-4/1N": "/catalogue/scenes/led-mh74-4-1n.webp", // Lustre Couronne noire
  "MH70-14": "/catalogue/scenes/led-mh70-14.webp", // Suspension Clef de sol
  "MH70-10": "/catalogue/scenes/led-mh70-10.webp", // Lustre Calligraphie noire
  "MH74-6/3N": "/catalogue/scenes/led-mh74-6-3n.webp", // Lustre Éclat noir
  "MH67-12": "/catalogue/scenes/led-mh67-12.webp", // Lustre Touches de piano
  // APPLIQUE 1 AMPOULE : mises en scène IA (lots de novembre), par référence.
  "0100/1": "/catalogue/scenes/a1-0100-1.webp", // Applique Écran givré
  "1006/1A": "/catalogue/scenes/a1-1006-1a.webp", // Applique Col de cygne et bois
  "1006/1B": "/catalogue/scenes/a1-1006-1b.webp", // Applique Cloche et bois
  "1095/A": "/catalogue/scenes/a1-1095-a.webp", // Applique Tulipe sculptée
  "1096/1A": "/catalogue/scenes/a1-1096-1a.webp", // Applique Tulipe et cristal
  "1096/1B1": "/catalogue/scenes/a1-1096-1b1.webp", // Applique Cylindre cannelé
  "1096/1B2": "/catalogue/scenes/a1-1096-1b2.webp", // Applique Corolle cannelée
  "1097/1A": "/catalogue/scenes/a1-1097-1a.webp", // Applique Lanterne opaline
  "1112B": "/catalogue/scenes/a1-1112b.webp", // Applique Ambre octogonale
  "1522-1W": "/catalogue/scenes/a1-1522-1w.webp", // Applique Demi-lune mosaïque
  "19830/1": "/catalogue/scenes/a1-19830-1.webp", // Applique Opaline chromée
  "21004B": "/catalogue/scenes/a1-21004b.webp", // Applique Voile givré
  "21004C": "/catalogue/scenes/a1-21004c.webp", // Applique Voile ambré
  "21006B": "/catalogue/scenes/a1-21006b.webp", // Applique Glacier cerclé
  "21075B": "/catalogue/scenes/a1-21075b.webp", // Applique Glacier évasé
  "21076E-CH": "/catalogue/scenes/a1-21076e-ch.webp", // Applique Éventail cerclé
  "21076F-CH": "/catalogue/scenes/a1-21076f-ch.webp", // Applique Éventail chromé
  "21850/1CH": "/catalogue/scenes/a1-21850-1ch.webp", // Applique Bougie argentée
  "21850/1GD": "/catalogue/scenes/a1-21850-1gd.webp", // Applique Bougie dorée
  "24300": "/catalogue/scenes/a1-24300.webp", // Applique Tulipe jaune
  "24740/1GD": "/catalogue/scenes/a1-24740-1gd.webp", // Applique Cylindre à facettes
  "3001/HALF": "/catalogue/scenes/a1-3001-half.webp", // Vasque murale givrée
  "3002/HALF": "/catalogue/scenes/a1-3002-half.webp", // Vasque murale blanche
  "3004/HALF": "/catalogue/scenes/a1-3004-half.webp", // Vasque murale Arabesques
  "3005": "/catalogue/scenes/a1-3005.webp", // Vasque murale opaline
  "3005/HALF": "/catalogue/scenes/a1-3005-half.webp", // Vasque murale Rinceaux
  "3006/HALF": "/catalogue/scenes/a1-3006-half.webp", // Vasque murale Feuillage
  "3016/HALF": "/catalogue/scenes/a1-3016-half.webp", // Vasque murale Dentelle
  "3025/1": "/catalogue/scenes/a1-3025-1.webp", // Applique Tulipe et volute
  "3133/1W": "/catalogue/scenes/a1-3133-1w.webp", // Applique Photophore fer forgé
  "31955": "/catalogue/scenes/a1-31955.webp", // Applique Triangle opaline
  "32318/1A": "/catalogue/scenes/a1-32318-1a.webp", // Applique Cylindre strié
  "32318/1C": "/catalogue/scenes/a1-32318-1c.webp", // Applique Colonne blanche
  "32525/1": "/catalogue/scenes/a1-32525-1.webp", // Applique Corolle sur volute
  "32626/1": "/catalogue/scenes/a1-32626-1.webp", // Applique Corolle et cristal
  "32662/1T": "/catalogue/scenes/a1-32662-1t.webp", // Applique Nœud chromé
  "32857/1B": "/catalogue/scenes/a1-32857-1b.webp", // Applique Trapèze givré
  "32857/1C": "/catalogue/scenes/a1-32857-1c.webp", // Applique Trapèze chromé
  "32923/1C": "/catalogue/scenes/a1-32923-1c.webp", // Applique Trapèze miroir
  "33067/1": "/catalogue/scenes/a1-33067-1.webp", // Applique Couronne dorée
  "33477/1N": "/catalogue/scenes/a1-33477-1n.webp", // Applique Losange ambré
  "33479/1B": "/catalogue/scenes/a1-33479-1b.webp", // Applique Losange miroir
  "33598/1": "/catalogue/scenes/a1-33598-1.webp", // Applique Corolle opaline
  "33740/1": "/catalogue/scenes/a1-33740-1.webp", // Applique Tulipe laiton
  "33786/1": "/catalogue/scenes/a1-33786-1.webp", // Applique Bourgeon opalin
  "33848": "/catalogue/scenes/a1-33848.webp", // Applique Cylindre jaune
  "33857/1A": "/catalogue/scenes/a1-33857-1a.webp", // Applique Lames givrées
  "33885/1A": "/catalogue/scenes/a1-33885-1a.webp", // Applique Bol ondulé
  "33886/1C": "/catalogue/scenes/a1-33886-1c.webp", // Applique Tulipe sur volute noire
  "33935/1A": "/catalogue/scenes/a1-33935-1a.webp", // Applique Photophore ambré
  "33935/1C": "/catalogue/scenes/a1-33935-1c.webp", // Applique Cadre doré ambré
  "33936/1C": "/catalogue/scenes/a1-33936-1c.webp", // Applique Ovale orange
  "33937/1C": "/catalogue/scenes/a1-33937-1c.webp", // Applique Médaillon ambré
  "33986/1B": "/catalogue/scenes/a1-33986-1b.webp", // Applique Miroir rose
  "33997/1": "/catalogue/scenes/a1-33997-1.webp", // Applique Frise grecque
  "34008/1": "/catalogue/scenes/a1-34008-1.webp", // Applique Marbre veiné
  "34016/1": "/catalogue/scenes/a1-34016-1.webp", // Applique Vagues carrées
  "34017/1": "/catalogue/scenes/a1-34017-1.webp", // Applique Losange ondulé
  "34040/1": "/catalogue/scenes/a1-34040-1.webp", // Applique Collerette dorée
  "34043/1": "/catalogue/scenes/a1-34043-1.webp", // Applique Flamme dégradée
  "34045": "/catalogue/scenes/a1-34045.webp", // Applique Dégradé brun
  "34080": "/catalogue/scenes/a1-34080.webp", // Applique Frise argentée
  "34090": "/catalogue/scenes/a1-34090.webp", // Applique Méandre
  "3787/1W": "/catalogue/scenes/a1-3787-1w.webp", // Applique Goutte bleutée
  "4001/HALF": "/catalogue/scenes/a1-4001-half.webp", // Vasque murale géométrique
  "445A/1W": "/catalogue/scenes/a1-445a-1w.webp", // Applique Demi-lune bronze
  "61-22": "/catalogue/scenes/a1-61-22.webp", // Applique Lanterne fer forgé
  "6620/1W": "/catalogue/scenes/a1-6620-1w.webp", // Applique Lanterne cerclée
  "6622/1W": "/catalogue/scenes/a1-6622-1w.webp", // Applique Lanterne laiton
  "6623/1W": "/catalogue/scenes/a1-6623-1w.webp", // Applique Bandeau doré
  "6624/1W": "/catalogue/scenes/a1-6624-1w.webp", // Applique Tulipe ambrée
  "6626/1W": "/catalogue/scenes/a1-6626-1w.webp", // Applique Cylindre cannelé noir
  "6628/1W": "/catalogue/scenes/a1-6628-1w.webp", // Applique Cylindre fumé
  "6802A/1W": "/catalogue/scenes/a1-6802a-1w.webp", // Applique Cloche striée ambrée
  "6818/1": "/catalogue/scenes/a1-6818-1.webp", // Applique Clochette
  "6979/1W": "/catalogue/scenes/a1-6979-1w.webp", // Applique Tulipe chromée
  "7118/1": "/catalogue/scenes/a1-7118-1.webp", // Applique Lune dorée
  "712-2003": "/catalogue/scenes/a1-712-2003.webp", // Vasque murale nacrée
  "712-3001": "/catalogue/scenes/a1-712-3001.webp", // Vasque murale plissée
  "712-3006": "/catalogue/scenes/a1-712-3006.webp", // Vasque murale Volutes
  "712-3007": "/catalogue/scenes/a1-712-3007.webp", // Vasque murale Arabesque blanche
  "8146/1": "/catalogue/scenes/a1-8146-1.webp", // Applique Fleurs
  "8150/A": "/catalogue/scenes/a1-8150-a.webp", // Applique Cylindre craquelé
  "8150/B": "/catalogue/scenes/a1-8150-b.webp", // Applique Cylindre ciselé
  "8170/1": "/catalogue/scenes/a1-8170-1.webp", // Applique Hublot
  "8350/1": "/catalogue/scenes/a1-8350-1.webp", // Applique Globe côtelé
  "8451": "/catalogue/scenes/a1-8451.webp", // Applique Damier double
  "8452/1": "/catalogue/scenes/a1-8452-1.webp", // Applique Damier miroir
  "8466/1": "/catalogue/scenes/a1-8466-1.webp", // Applique Coupe ambrée
  "8592": "/catalogue/scenes/a1-8592.webp", // Applique Cylindre doré
  "8608/1": "/catalogue/scenes/a1-8608-1.webp", // Applique Globe strié laiton
  "8627": "/catalogue/scenes/a1-8627.webp", // Applique Tulipe ciselée
  "8888/1": "/catalogue/scenes/a1-8888-1.webp", // Applique Photophore laiton
  "9026/1": "/catalogue/scenes/a1-9026-1.webp", // Applique Couronne laiton
  "91031A/1W": "/catalogue/scenes/a1-91031a-1w.webp", // Applique Goutte ambrée
  "9623B/1": "/catalogue/scenes/a1-9623b-1.webp", // Applique Papillon
  "98003/1W": "/catalogue/scenes/a1-98003-1w.webp", // Vasque murale Mini
  "98006/1W": "/catalogue/scenes/a1-98006-1w.webp", // Vasque murale Coquille
  "9915B/1W": "/catalogue/scenes/a1-9915b-1w.webp", // Applique Corolle chromée
  "9916B/1W": "/catalogue/scenes/a1-9916b-1w.webp", // Applique Tulipe transparente
  "9933/1A": "/catalogue/scenes/a1-9933-1a.webp", // Applique Lotus et bois
  "9933/1A1": "/catalogue/scenes/a1-9933-1a1.webp", // Applique Fleur et bois
  "9933/1B": "/catalogue/scenes/a1-9933-1b.webp", // Applique Cylindre et bois
  "9933/1C": "/catalogue/scenes/a1-9933-1c.webp", // Applique Bambou et bois
  "9935/1B/1083/1": "/catalogue/scenes/a1-9935-1b-1083-1.webp", // Applique Demi-cylindre et bois
  "9981A/1W": "/catalogue/scenes/a1-9981a-1w.webp", // Applique Goutte striée
  "9982B/1W": "/catalogue/scenes/a1-9982b-1w.webp", // Applique Écailles
  "A1JAUNE-BLANC": "/catalogue/scenes/a1-a1jaune-blanc.webp", // Vasque murale marbrée
  "A7428-1C": "/catalogue/scenes/a1-a7428-1c.webp", // Applique Veines dorées
  "A7450-1RAB": "/catalogue/scenes/a1-a7450-1rab.webp", // Applique Cadre rainuré
  "B1114/1": "/catalogue/scenes/a1-b1114-1.webp", // Applique Cube et bois
  "B2152": "/catalogue/scenes/a1-b2152.webp", // Applique Liseuse blanche
  "B-6633B/1": "/catalogue/scenes/a1-b-6633b-1.webp", // Applique Cristal chromé
  "B-9736/1": "/catalogue/scenes/a1-b-9736-1.webp", // Applique Lanterne de cristal
  "B-9736B/1": "/catalogue/scenes/a1-b-9736b-1.webp", // Applique Prisme de cristal
  "B-9736E/1": "/catalogue/scenes/a1-b-9736e-1.webp", // Applique Carré chromé
  "D6014/1": "/catalogue/scenes/a1-d6014-1.webp", // Applique Liseuse bronze
  "DL00B": "/catalogue/scenes/a1-dl00b.webp", // Applique Écran motifs bleus
  "DL00M": "/catalogue/scenes/a1-dl00m.webp", // Applique Écran motifs orange
  "DL00O": "/catalogue/scenes/a1-dl00o.webp", // Applique Écran spirales dorées
  "FX3003/HALF": "/catalogue/scenes/a1-fx3003-half.webp", // Vasque murale Rayures
  "FX6026/HALF": "/catalogue/scenes/a1-fx6026-half.webp", // Vasque murale Lune
  "L8011/1": "/catalogue/scenes/a1-l8011-1.webp", // Applique Lanterne géométrique
  "L8075/1": "/catalogue/scenes/a1-l8075-1.webp", // Applique Cristal fumé
  "L8078/1": "/catalogue/scenes/a1-l8078-1.webp", // Applique Verre fumé ovale
  "L8169": "/catalogue/scenes/a1-l8169.webp", // Applique Cylindre bagué
  "L8172/1": "/catalogue/scenes/a1-l8172-1.webp", // Applique Torsade dorée
  "L8174/1": "/catalogue/scenes/a1-l8174-1.webp", // Applique Tulipe givrée
  "L8424/1": "/catalogue/scenes/a1-l8424-1.webp", // Applique Mosaïque
  "L8427/1": "/catalogue/scenes/a1-l8427-1.webp", // Applique Lanterne ambrée
  "L8435/1": "/catalogue/scenes/a1-l8435-1.webp", // Applique Bulle de verre
  "L8436": "/catalogue/scenes/a1-l8436.webp", // Applique Coupe baguée
  "L8437/1": "/catalogue/scenes/a1-l8437-1.webp", // Applique Cloche noire
  "L8441/1": "/catalogue/scenes/a1-l8441-1.webp", // Applique Verre damier
  "L8445/1": "/catalogue/scenes/a1-l8445-1.webp", // Applique Ananas doré
  "L8600": "/catalogue/scenes/a1-l8600.webp", // Applique Soleil gravé
  "L8609": "/catalogue/scenes/a1-l8609.webp", // Applique Écrin perlé
  "L8637": "/catalogue/scenes/a1-l8637.webp", // Applique Cristal perlé
  "LQ8444/1": "/catalogue/scenes/a1-lq8444-1.webp", // Applique Damier opaline
  "MH50-11": "/catalogue/scenes/a1-mh50-11.webp", // Applique Globe laiton
  "MH50-15": "/catalogue/scenes/a1-mh50-15.webp", // Applique Cage dorée
  "MH50-19": "/catalogue/scenes/a1-mh50-19.webp", // Applique Cylindre ambré
  "MH50-27": "/catalogue/scenes/a1-mh50-27.webp", // Applique Champignon opalin
  "MH50-3": "/catalogue/scenes/a1-mh50-3.webp", // Applique Pampilles ambrées
  "MH50-32": "/catalogue/scenes/a1-mh50-32.webp", // Applique Col de cygne blanc
  "MH50-35": "/catalogue/scenes/a1-mh50-35.webp", // Applique Tulipe striée
  "MH50-8": "/catalogue/scenes/a1-mh50-8.webp", // Applique Lanterne cage
  "MH5664-1B": "/catalogue/scenes/a1-mh5664-1b.webp", // Applique Cadre bois clair
  "MH61-16": "/catalogue/scenes/a1-mh61-16.webp", // Applique Cylindre décoré
  "MH62-13/2240/1": "/catalogue/scenes/a1-mh62-13-2240-1.webp", // Applique Cylindre noir
  "TX1146-1L": "/catalogue/scenes/a1-tx1146-1l.webp", // Applique Écran floral
  "TX1148-1L": "/catalogue/scenes/a1-tx1148-1l.webp", // Applique Écran pastilles
  "W1129": "/catalogue/scenes/a1-w1129.webp", // Applique Écran roses
  "XY3120-1B": "/catalogue/scenes/a1-xy3120-1b.webp", // Applique Spirales bleues
  "XY3123-1ACR": "/catalogue/scenes/a1-xy3123-1acr.webp", // Applique Fleurs orange
  "XY3123-1C": "/catalogue/scenes/a1-xy3123-1c.webp", // Applique Fleurs noires
  "XY3137-1": "/catalogue/scenes/a1-xy3137-1.webp", // Applique Écran graphique
  "YB-23103/1": "/catalogue/scenes/a1-yb-23103-1.webp", // Applique Coupe classique
  "ZA1014/1WFGD": "/catalogue/scenes/a1-za1014-1wfgd.webp", // Applique Dentelle dorée
  "ZA1016/1BK": "/catalogue/scenes/a1-za1016-1bk.webp", // Applique Tulipe opaline noire

  // APPLIQUE 2 AMPOULES : mises en scène IA (25 novembre), par référence.
  "1006/2A": "/catalogue/scenes/a2-1006-2a.webp", // Applique double Tubes et bois
  "1006/2B": "/catalogue/scenes/a2-1006-2b.webp", // Applique double Cônes et bois
  "1083/2": "/catalogue/scenes/a2-1083-2.webp", // Applique double Cylindres décalés
  "1095/2A": "/catalogue/scenes/a2-1095-2a.webp", // Applique double Opaline ondulée
  "1096/2A": "/catalogue/scenes/a2-1096-2a.webp", // Applique double Tulipes ciselées
  "1096/2B1": "/catalogue/scenes/a2-1096-2b1.webp", // Applique double Cylindres cannelés
  "1096/2B2": "/catalogue/scenes/a2-1096-2b2.webp", // Applique double Vases cannelés
  "1097/2A": "/catalogue/scenes/a2-1097-2a.webp", // Applique double Cloches facettées
  "1098/2A": "/catalogue/scenes/a2-1098-2a.webp", // Applique double Tulipes opalines
  "21019A-2": "/catalogue/scenes/a2-21019a-2.webp", // Applique Tube strié chromé
  "21113": "/catalogue/scenes/a2-21113.webp", // Applique Vagues noires
  "8018/2": "/catalogue/scenes/a2-8018-2.webp", // Applique double Photophores dorés
  "8019/2": "/catalogue/scenes/a2-8019-2.webp", // Applique double Tulipes ambrées
  "8372/2": "/catalogue/scenes/a2-8372-2.webp", // Applique double Cylindres ambrés
  "9933/2A": "/catalogue/scenes/a2-9933-2a.webp", // Applique double Lotus et bois
  "9933/2B": "/catalogue/scenes/a2-9933-2b.webp", // Applique double Cylindres et bois
  "9933/2C": "/catalogue/scenes/a2-9933-2c.webp", // Applique double Bambou et bois
  "9935/2B": "/catalogue/scenes/a2-9935-2b.webp", // Applique double Duo décalé bois
  "B-9623B/2CR": "/catalogue/scenes/a2-b-9623b-2cr.webp", // Applique double Papillon chromé
  "B-9736B/2": "/catalogue/scenes/a2-b-9736b-2.webp", // Applique double Cristal chromé
  "B-9736E/2": "/catalogue/scenes/a2-b-9736e-2.webp", // Applique double Carrés givrés
  "MH50-20": "/catalogue/scenes/a2-mh50-20.webp", // Applique double Tubes et pampille
  "MH50-24": "/catalogue/scenes/a2-mh50-24.webp", // Applique double Cylindres givrés
  "MH62-21/7W/MH62-11": "/catalogue/scenes/a2-mh62-21-7w-mh62-11.webp", // Applique Rectangle blanc
  "MH65-2": "/catalogue/scenes/a2-mh65-2.webp", // Applique Double spot anthracite

  // APPLIQUES CRISTAL : mises en scène IA (26 novembre), par référence.
  "28046": "/catalogue/scenes/cr-28046.webp", // Applique cristal Pampilles fumées
  "3021/1W/MH34-31": "/catalogue/scenes/cr-3021-1w-mh34-31.webp", // Applique cristal Plumes givrées
  "3070/1W/MH34-16": "/catalogue/scenes/cr-3070-1w-mh34-16.webp", // Applique cristal Lamelles noires
  "32970/3B": "/catalogue/scenes/cr-32970-3b.webp", // Applique cristal Cascade de perles
  "33214/2B": "/catalogue/scenes/cr-33214-2b.webp", // Applique cristal Ciselée chromée
  "332152A": "/catalogue/scenes/cr-332152a.webp", // Applique cristal Couronne dorée
  "33247/3B": "/catalogue/scenes/cr-33247-3b.webp", // Applique cristal Dentelle argentée
  "33595": "/catalogue/scenes/cr-33595.webp", // Applique cristal Fontaine opaline
  "33710/2A": "/catalogue/scenes/cr-33710-2a.webp", // Applique cristal Corolle dorée
  "33943/2": "/catalogue/scenes/cr-33943-2.webp", // Applique cristal Prismes et noir
  "B2116": "/catalogue/scenes/cr-b2116.webp", // Applique cristal Lames dorées
  "B2117": "/catalogue/scenes/cr-b2117.webp", // Applique cristal Éclats dorés
  "B3000/MH60-3": "/catalogue/scenes/cr-b3000-mh60-3.webp", // Applique cristal Tube de verre laiton
  "B9119/MH60-04": "/catalogue/scenes/cr-b9119-mh60-04.webp", // Applique cristal Tiges horizontales
  "M6837": "/catalogue/scenes/cr-m6837.webp", // Applique cristal Spirale dorée
  "M6838": "/catalogue/scenes/cr-m6838.webp", // Applique cristal Arceau doré
  "MH73-4": "/catalogue/scenes/cr-mh73-4.webp", // Applique cristal Grappes de perles
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
