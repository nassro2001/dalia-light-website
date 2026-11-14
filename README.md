# Dalia-Light — Site vitrine

Site vitrine de **Dalia-Light**, distributeur de luminaires à Abidjan (2 showrooms).
Signature : *« La référence du luminaire, c'est nous »*.

> Statut : **structure commune en place** — Next.js 16.4 (App Router, TypeScript, Tailwind v4), tokens de la direction visuelle, logo, header, menu mobile, footer, « Ma sélection » + WhatsApp, **hero 3D animé** (allumage cinématique GSAP, pendule, poussière, variateur), animations au scroll (parallaxe, aube nuit → jour), effets souris, **catalogue filtrable**, **fiches produits** (16 produits d'exemple) et **showrooms** (page générale + une page par showroom).

## Démarrer
```bash
npm install
npm run dev
```
Si des styles modifiés n'apparaissent pas (cache Turbopack figé, notamment après un `npm run build`) : arrêter le serveur puis `npm run dev:clean`.

## Sources
- Design system (Claude Design) : https://claude.ai/design/p/019dda72-73f7-75d3-ae7b-e7f3995fcdbb
  - le UI kit (`ui_kits/website/index.html`) et les wireframes (`wireframes/site-vitrine.html`) y restent consultables
- **Direction visuelle (référence du build)** : [docs/DIRECTION_VISUELLE.md](docs/DIRECTION_VISUELLE.md)
- Analyse du design system d'origine : [docs/DESIGN_SYSTEM_ANALYSIS.md](docs/DESIGN_SYSTEM_ANALYSIS.md)
- **Passe de qualité** (Lighthouse, accessibilité, checklist) : [docs/QUALITE.md](docs/QUALITE.md)

## Arborescence
```
src/
├── app/
│   ├── layout.tsx            polices (Syne, DM Sans), header, footer, tiroir, bouton WhatsApp
│   ├── globals.css           thème Tailwind, utilitaires (container-site, measure, grain), panneaux
│   ├── page.tsx              accueil : nuit (hero 3D, par pièce) → aube (dôme) → jour (sélection, engagements, showrooms)
│   ├── catalogue/page.tsx    catalogue (filtres dans l'URL, Suspense)
│   ├── catalogue/[slug]/     fiche produit (pré-générée, JSON-LD) + loading.tsx
│   └── showrooms/            page générale + [slug]/ (page par showroom, JSON-LD Store, carte)
├── components/
│   ├── catalog/              CatalogueBrowser (filtres), CatalogueGrid (allumage au scroll), ProductCard, ProductDetail, ProductVisual
│   ├── hero/                 Hero (allumage CSS, variateur), HeroScene (3D R3F), LampFallback (SVG), lamp.ts
│   ├── home/                 RoomsGallery + RoomVisual (par pièce), FeaturedProducts, Commitments, DawnTransition
│   ├── layout/               SiteHeader, SiteFooter, Logo, CursorLight, PagePlaceholder
│   ├── selection/            SelectionProvider, SelectionDrawer, WhatsAppFab
│   ├── showrooms/            ShowroomBlock, Hours (ouvert/fermé, horaires), ShowroomVisual, MapEmbed, LitOnScroll
│   ├── ui/Button.tsx         Button, ButtonLink, ExternalButton (primary / secondary / ghost)
│   └── icons/WhatsAppIcon.tsx
├── lib/
│   ├── catalog/              types, products.ts (DONNÉES D'EXEMPLE), filtres et tri
│   ├── site.ts               coordonnées, showrooms (horaires structurés), catégories (valeurs PROVISOIRES)
│   ├── hours.ts              statut ouvert/fermé (heure d'Abidjan, UTC+0), tableau d'horaires, schema.org
│   ├── whatsapp.ts           liens wa.me + messages pré-remplis
│   └── selection-store.ts    « Ma sélection » (localStorage, repli mémoire)
└── styles/tokens.css         palette nuit/jour, échelle en quarte, rayons, mouvement
```
Logo : `public/brand/logo-nuit.png` (recoloré laiton/flamme pour fond sombre, généré depuis `assets/brand/logo.png`) et `logo-jour.png` (original recadré). Favicon : `src/app/icon.svg`.

Autres dossiers : `docs/` (direction visuelle, analyse), `design-system/` (tokens d'origine, référence), `assets/` (sources brutes), `.claude/skills/ui-ux-pro-max/`.

## Configuration
Variables d'environnement (`.env.local`) :
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — facultatif : remplace le numéro WhatsApp principal (par défaut Treichville, `2250777272777`)
- `NEXT_PUBLIC_SITE_URL` — URL publique du site

## Tokens → Tailwind
- Couleurs sémantiques (basculent avec `.theme-jour`) : `bg-bg`, `bg-bg-raised`, `text-fg`, `text-fg-2`, `text-link`, `border-line`, `border-line-strong`, `bg-cta` / `text-cta-fg`
- Palette brute : `nuit`, `penombre`, `ivoire`, `ivoire-70`, `laiton`, `flamme`, `braise`, `platre`, `encre`, `encre-70`, `laiton-fonce` (palettes Tailwind par défaut désactivées)
- Polices : `font-display` (Syne), `font-body` (DM Sans) · Tailles : `text-xs` → `text-4xl`, `text-hero` · Rayons : `rounded-pill`, `rounded-panel` · `shadow-panel` · `ease-out-expo`
- Section jour : ajouter la classe `theme-jour` ; section nuit avec grain : `grain bg-nuit`

## Pages prévues
Voir [docs/DIRECTION_VISUELLE.md](docs/DIRECTION_VISUELLE.md) §7 : accueil (hero 3D, par pièce, sélection produits, engagements, showrooms en section jour), catalogue filtrable, fiche produit (bascule éteint/allumé, WhatsApp + « Ma sélection »), une page par showroom.

## Catalogue
- Données : `src/lib/catalog/products.ts` (16 produits **d'exemple**). Le modèle (`types.ts`) est prêt pour un CMS : remplacer `getAllProducts` / `getProduct`.
- **Pas de prix** (négociés en showroom) et **sélection** des modèles les plus attirants, pas tout le stock ; encart « Vous ne trouvez pas votre modèle ? » vers WhatsApp.
- Filtres : catégorie, pièce, température de couleur, culot, recherche, tri (notre sélection, nouveautés, nom) — tous dans l'URL (`/catalogue?categorie=suspensions&piece=salon`).
- Visuels : tant qu'un produit n'a pas `images: { off, on, alt }`, une illustration SVG par type de luminaire s'affiche (teinte = finition choisie). Avec photos, même comportement éteint / allumé.
- Allumage : au survol (souris), au passage dans la bande centrale de l'écran (scroll), ou par le bouton Éteint / Allumé de la fiche.
- Fiche : finitions, quantité, « Demander sur WhatsApp » (message avec référence, finition, quantité et lien), « Ajouter à ma sélection », barre fixe sur mobile, données structurées `Product` (sans offre chiffrée).

## Photos produits et mise en situation 3D
- Photos brutes dans `assets/photos-brutes/`, images du site dans `public/products/`. Scripts dans `scripts/` :
  - `compose-png-detoure.js` (recommandé) : PNG déjà détouré → versions éteint / allumé sur fond nuit, sans retouche du produit ;
  - `retouche-nuit.js` : photo de lustre allumé → fond plongé dans le noir ;
  - `detourage-ia.mjs` + `compose-detoure.js` / `detourage-hybride.js` : détourage automatique (moins fiable).
- « Voir dans une pièce » (fiche produit, si `product.scene` est renseigné) : la photo détourée est suspendue dans une pièce 3D, salle à manger, salon ou hall d'hôtel (plafond 3,40 m) selon `scene.room` (`components/room/RoomScene.tsx`), éclairage réel (spot, ombres), variateur, angle de vue à la souris ou au doigt. Chargé seulement à l'ouverture.

## Showrooms
- Données dans `src/lib/site.ts`. Adresses et horaires réels : **Riviera Palmeraie** (Triangle, rue François Mitterrand, en face de l'hôtel Mirabel) et **Treichville** (rue 12, avenue 19, en face du restaurant Talaat), lundi–samedi 8 h – 18 h. WhatsApp et téléphone : Riviera Palmeraie +225 07 08 08 47 47, Treichville +225 07 77 27 27 77 (numéro principal du site).
- Localisation : coordonnées GPS (`geo`) extraites des fiches Google Maps « Dalia Light » du client (`placeUrl`). L'itinéraire et la carte visent ces coordonnées ; la page propose aussi « Voir la fiche Google Maps (avis, photos) ». Sans `geo`, repli sur le repère `mapQuery`.
- Statut « Ouvert, ferme à 18 h » / « Fermé, ouvre lundi à 8 h » calculé dans le navigateur à l'heure d'Abidjan (UTC+0, sans heure d'été), mis à jour chaque minute ; jour courant surligné dans le tableau.
- Carte Google Maps chargée seulement au clic (« Afficher la carte »).
- Page par showroom pré-générée, avec données structurées `Store` (adresse, horaires) pour le référencement local.

## Hero 3D et animations
- `three` 0.186.1 + `@react-three/fiber` 9.8.1, `gsap` 3.15.0 + `@gsap/react` 2.1.2 (versions figées). Détails : [DIRECTION_VISUELLE.md §8](docs/DIRECTION_VISUELLE.md).
- **Allumage** (timeline GSAP) : gros plan sur le filament → vacillement → recul caméra → la lumière balaie le titre → apparition du texte.
- **Pendule** : la lampe se pousse à la souris / au doigt (`lamp-handle`), physique amortie dans `HeroScene.tsx`.
- **Poussière** dans le faisceau (shader, 110 grains desktop / 45 mobile).
- **Scroll** (ScrollTrigger) : parallaxe de la lampe et élargissement du faisceau à la sortie du hero ; « Trouver par pièce » en galerie horizontale épinglée (ordinateur) ou défilement natif aimanté (mobile), chaque pièce s'allume au centre ; produits allumés au passage ; engagements révélés mot à mot ; « aube » : dôme plâtre qui se lève, bordé d'un liseré doré.
- État partagé GSAP ↔ 3D : `components/hero/heroState.ts` (objet mutable lu à chaque image, aucun re-rendu React).
- La suspension est **modélisée en code**. Pour un vrai produit : charger un GLB (≤ 1,5 Mo) à la place de `Lamp` dans `HeroScene.tsx`.
- Sans WebGL : lampe SVG + allumage. Sans JS : hero allumé. Mouvement réduit : état final, pas de timeline ni de scroll lié.
- Mobile / économie de données : allumage immédiat avec la lampe SVG, 3D chargée 4 s après le chargement (navigateur libre). Ordinateur : 3D immédiate (séquence cinématique).

## Décisions ouvertes
| # | Sujet | Options |
|---|---|---|
| 1 | Stack | ✅ Next.js — CMS catalogue à choisir |
| 2 | Conversion | ✅ WhatsApp (message pré-rempli par produit + « Ma sélection ») |
| 3 | Hero | ✅ vraie 3D (React Three Fiber) — lampe modélisée en code ; à remplacer par un vrai produit (GLB) |
| 4 | Boutons | ✅ casse de phrase ; CAPITALES réservées aux petits labels |
| 5 | Logo sur fond noir | ✅ provisoire : version recolorée laiton/flamme. Idéalement, obtenir un SVG officiel en version claire |
| 6 | Hébergement / domaine | à définir (ex. dalia-light.ci) |
| 7 | Contact secondaire | formulaire simple en plus de WhatsApp ? (Formspree · email) |

## Contenu à obtenir du client
- [ ] Logo vectoriel (SVG) + version claire pour fond sombre
- [x] Numéros WhatsApp / téléphone des 2 showrooms
- [ ] Email, Instagram, Facebook
- [x] Adresses et horaires des 2 showrooms
- [x] Coordonnées GPS et fiches Google Maps des 2 showrooms
- [ ] Catalogue (sélection des plus beaux modèles) : noms, catégories, finitions, caractéristiques — sans prix
- [ ] Photos produits et showrooms (tons chauds, « golden hour »)
- [ ] Chiffres clés réels (années d'expérience, nombre de références)
- [ ] Texte « À propos », conditions de livraison et de service après-vente (pas de garantie affichée pour l'instant)
- [ ] Offre professionnels (accueil, « Vous construisez ? ») : confirmer « tarifs adaptés aux volumes » et la livraison sur chantier
