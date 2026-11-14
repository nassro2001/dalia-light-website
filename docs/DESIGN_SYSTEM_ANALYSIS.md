# Dalia-Light — Analyse du design system

Source : projet Claude Design `019dda72-73f7-75d3-ae7b-e7f3995fcdbb` (« Dalia-Light Design System »), lu le 15/10/2026.
Fichiers analysés : `README.md`, `SKILL.md`, `colors_and_type.css`, `_adherence.oxlintrc.json`, `preview/*.html`, `ui_kits/website/index.html` + `README.md`, `wireframes/site-vitrine.html`.

---

## 1. La marque en une phrase

**DALIA-LIGHT** — distributeur de luminaires à Abidjan (Côte d'Ivoire), 2 showrooms. Signature : *« La référence du luminaire, c'est nous »*.
Direction artistique : **un showroom la nuit** — fond quasi noir, flaques de lumière or/ambre, accents orange. Premium, chaleureux, éditorial. Site vitrine animé (particules, lampe flottante, reveals au scroll), **pas d'e-commerce** : la conversion passe par le **devis gratuit** et la **visite en showroom**.

## 2. Tokens (source de vérité : `colors_and_type.css`)

### Couleurs
| Groupe | Tokens |
|---|---|
| Fonds | `--black #0C0C0C` · `--dark-surface #141410` · `--dark-elevated #1E1C14` |
| Or (accent principal) | `--gold-300 #FFE499` · `--gold-400 #FFD060` · **`--gold-500 #FFB800`** · `--gold-600 #D99500` · `--gold-700 #AA7200` · `--gold-logo #7A5200` |
| Orange (accent secondaire) | `--orange-300 #FFBE80` · `--orange-400 #FF8C40` · **`--orange-500 #FF6A00`** · `--orange-600 #CC5200` · `--orange-700 #992E00` |
| Neutres chauds | `--warm-white #F5EDD8` · `--warm-100 #EAD9B8` · `--warm-200 #C4A96A` |
| Voiles | `--fog rgba(255,184,0,.07)` · `--fog-strong .15` · `--dark-border .12` · `--dark-border-hover .40` |

**Sémantiques** (à utiliser en priorité dans le code) : `--bg-base/surface/elevated`, `--fg-primary` (warm-white), `--fg-secondary` (65 %), `--fg-muted` (38 %), `--fg-inverse`, `--accent-primary` (or), `--accent-secondary` (orange), `--accent-glow`, `--accent-glow-soft`, `--border-default`, `--border-focus`.

Le thème est **uniquement sombre**. Il n'y a pas de mode clair : `warm-white` ne sert que de fond ponctuel (exemple de logo).

### Typographie (Google Fonts)
| Rôle | Police | Usage |
|---|---|---|
| Display | **Syne** 600–800 | h1–h4, titres hero, chiffres clés, noms produits |
| Corps / UI | **DM Sans** 300–600 | paragraphes, boutons, labels, nav |
| Accent | **Cormorant Garamond** italique 300 | taglines, citations « … » |
| Mono | **JetBrains Mono** | fiches techniques (dimensions, IP, culot) |

Échelle : `--text-xs 11` · `sm 13` · `base 16` · `md 18` · `lg 20` · `xl 24` · `2xl 32` · `3xl 40` · `4xl 56` · `5xl 72` · `6xl 96` · `hero 120` px.
Interlignes `1.1 / 1.25 / 1.5 / 1.7` · Tracking `-0.03em` (titres) → `0.20em` (labels capitales).
Classes prêtes : `.display`, `.tagline`, `.body`, `.body-lg`, `.label`, `.label-gold`, `.mono`, `.gradient-text` (or-400 → orange-500 à 135°), `.glow-text`.

### Espacement, rayons, ombres, motion, layout
- **Espacements** (base 8) : `--space-1…30` = 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 120 px. Sections : 120 px en desktop, 60 px en mobile.
- **Rayons** : `xs 2` · `sm 4` (boutons, tags) · `md 12` (cartes) · `lg 20` (grandes surfaces) · `xl 32` · `pill 999`.
- **Ombres** : `--shadow-sm/md/lg` (noires, 40→80 %) ; **glows** `--glow-gold-sm/md/lg`, `--glow-orange`.
- **Motion** : `--ease-out-expo cubic-bezier(.16,1,.3,1)` (signature), `--ease-in-out` ; durées `150 / 250 / 450 / 600 ms`.
- **Layout** : `--container-max 1440px`, `--container-pad clamp(24px, 5vw, 96px)`, `--nav-height 80px`, grille 12 colonnes, gouttière 24 px.

## 3. Composants

| Composant | Spécification |
|---|---|
| **Bouton primary** | fond or-500, texte noir, rayon 4 px, DM Sans 600. Au survol : or-400 + `0 0 20px rgba(255,184,0,.4)`. Le UI kit ajoute un reflet qui balaie le bouton (`::after`). |
| **Secondary** | transparent, bordure or 1.5 px ; au survol, fond or à 10 % |
| **Ghost** | texte warm-white à 70 %, bordure warm-white à 20 % |
| **Orange** | fond orange-500 (CTA « Demander un devis ») ⚠️ voir contraste |
| Tailles / variantes | `sm` (8×16, 12 px) · `lg` (16×36, 16 px, 700) · **pill** (fond or à 12 %, rayon 999) · disabled |
| **Carte (base)** | fond `--dark-surface`, bordure `--dark-border`, rayon 12, `overflow:hidden`. Au survol : bordure à 40 %, translateY négatif, ombre noire + halo or léger |
| **ProductCard** | visuel (dégradé elevated→brun + radial or) · badge (Nouveau / Bestseller) · catégorie (label or) · nom (Syne) · prix en **FCFA** (or, 700) · bouton action |
| **FeatureBlock** | numéro 01/02/03 · icône dans un carré teinté or · titre · texte ; au survol, une bordure basse animée or→orange (scaleX) |
| **StatCard / barre de stats** | chiffre en Syne 800 avec `.gradient-text` + libellé ; barre de 4 colonnes sur fond surface |
| **Navbar** | fixe ; transparente puis, au scroll > 40 px, `rgba(8,8,6,.92)` + `blur(24px)`. Logo + nom + sous-titre à gauche · liens au centre (soulignement animé) · téléphone + CTA « Devis gratuit » à droite |
| **Pills de filtre** | Tout / Suspensions / Plafonniers / Appliques / Lampadaires / LED ; état actif or |
| **ShowroomCard** | emplacement de carte (grille + pin) · numéro · quartier · adresse / horaires / téléphone (icônes) · bouton outline « Itinéraire » |
| **Marquee** | bandeau de catégories qui défile en boucle (24 s, linéaire) |
| **Footer** | 4 colonnes (marque, Collection, Informations, Contact) → 2 colonnes en mobile ; copyright + tagline |
| **Icônes** | Lucide, trait de 1.5 px ; tailles 16 / 24 / 32 ; couleur or-500 ou warm-white ; usage fonctionnel uniquement, **pas d'emoji** |
| **Logo** | `assets/logo.png` (500×500, maison + suspension). Marge de protection ≥ 16 px, largeur minimale 80 px, ne jamais recolorer (variante assombrie uniquement sur fond or) |

## 4. Architecture du site (wireframes + UI kit)

Wireframes au format 1440 px (desktop) et 375 px (mobile) pour chaque écran :

1. **Hero** : grille en 2 colonnes, `min-height:100vh`.
   - Colonne gauche : localisation « Abidjan · Côte d'Ivoire » (point or lumineux), titre « L'art de la *lumière.* », séparateur dégradé, tagline Cormorant, CTA « Voir la collection → » + « Nos showrooms », chiffres ancrés en bas (2+ / 500+ / 10 ans).
   - Colonne droite : `#050503`, 4 anneaux concentriques en rotation, suspension en SVG (entrée puis `floatY 7s ∞`), cônes de lumière pulsés, particules sur canvas (80, or/orange).
   - Mobile : une seule colonne, la scène lampe est masquée (UI kit) ou réduite (wireframe).
2. **Collection** : en-tête de section + pills, grille de 4 colonnes (2 en mobile), bouton « Charger plus ». La variante B (barre latérale de filtres + vue liste, avec bascule grille ↔ liste) est proposée.
3. **Détail produit** *(absent du UI kit, uniquement dans les wireframes)* :
   - Fil d'Ariane et galerie (image principale de 420 px + 4 vignettes).
   - Prix, finitions (Or / Noir / Cuivre / Chrome), quantité, CTA « Demander un devis ».
   - Réassurance (showroom · garantie 2 ans · livraison Abidjan) et tableau de caractéristiques (diamètre, hauteur, ampoule, matière, IP).
   - Mobile : CTA collant (sticky).
4. **Stats + marquee + Promesse** : barre de 4 chiffres, bandeau défilant, 3 piliers (Qualité certifiée, Large sélection, Conseil expert).
5. **Showrooms + Contact** : 2 cartes (Cocody-Riviera, Plateau).
   - Formulaire de devis : nom, email, téléphone, message, avec « réponse sous 24 h » ; il n'existe que dans les wireframes.
   - Notes : carte → embed Google Maps ; formulaire → Formspree ou API.
6. **Footer**.

Comportements JS du UI kit : particules (canvas), flottement de la lampe après son entrée, état « scrolled » de la navbar, reveal au scroll via `IntersectionObserver` (seuil 0.12, `translateY(32px)` → 0, délais échelonnés `.reveal-delay-1…4`), pills actives. Points de rupture : **1024 / 820 / 600 px**.

## 5. Incohérences et points d'attention

### Écarts entre les sources
Le UI kit est la référence visuelle, mais `colors_and_type.css` fait foi pour les valeurs.

| Sujet | README | Tokens CSS | Previews / UI kit | Recommandation |
|---|---|---|---|---|
| Bordure carte | 0.15 | `--dark-border` 0.12 | 0.12 | **0.12 (token)** |
| `--fog` | 0.08 | 0.07 | — | **0.07** |
| Hauteur nav | — | 80 px | 84 px (wireframe + kit) | trancher : **80 px (token)** |
| Rayon bouton | 4 px | `--radius-sm` 4 | kit 3 px | **4 px** |
| Survol carte | −4 px | — | preview −3, kit −6 | **−4 px** |
| Style bouton primary | casse de phrase, 14 px | — | kit : CAPITALES 13 px, tracking 0.08em | choisir une seule règle (le kit est plus « premium ») |
| Titre hero | `--text-hero` 120, lh 1.1, ls −0.03 | — | kit `clamp(56px,6.5vw,104px)`, lh 0.96, ls −0.04 | **clamp du kit** (120 px fixe ne tient pas en mobile) |
| Fond hero | `--black` | — | `#080806` / `#050503` (hors tokens) | ajouter 2 tokens `--bg-deep`, `--bg-deepest` |
| Noms de variables | — | `--fg-primary`, `--dark-surface`… | kit : alias `--warm`, `--surface`, `--border`, `--ease` + hex en dur | réécrire avec les tokens canoniques |
| Rayon icône feature | — | aucun token 8 px | 8 px | utiliser `--radius-sm` ou ajouter `--radius-8` |
| Chiffres | — | — | « 2+ » / « 2 » showrooms, « 10 ans » / « 10+ » | harmoniser le contenu |

Le linter d'adhérence (`_adherence.oxlintrc.json`) avertit sur tout hex brut, tout `px` brut et toute police hors des 4 autorisées. Les previews et le UI kit le violent massivement. **Dans le site final : uniquement des `var(--…)`.**

### Accessibilité (contrastes WCAG calculés)
| Paire | Ratio | Verdict |
|---|---|---|
| `--fg-secondary` sur `--black` | 7.34 | ✅ AA/AAA |
| Texte warm-white à 50 % sur surface (feature body) | 4.71 | ✅ AA (de justesse) |
| **`--fg-muted` (38 %) sur noir / surface** | **3.19 / 3.24** | ❌ texte normal → OK seulement pour décor/≥ 18 px gras |
| Or-500 ↔ noir | 11.28 | ✅ |
| **warm-white sur orange-500 (bouton orange)** | **2.46** | ❌ → passer le texte en `--black` (6.81 ✅) ou foncer le fond en orange-600 |
| Bouton disabled | 2.38 | acceptable (élément inactif) |

Autres points :
- Ajouter `prefers-reduced-motion` : il faut couper particules, marquee, anneaux et flottement.
- Prévoir des états `:focus-visible`, absents partout : un anneau or 2 px avec `--border-focus`, par exemple.
- Les labels de 11 px en `--fg-muted` sont trop faibles : les passer en `--fg-secondary`.

### Ce qui manque au design system (à créer pour le build)
- **Champs de formulaire** (input, textarea, select, avec leurs états erreur et succès) : le README évoque des « inner shadows on inset inputs » sans les spécifier, et les wireframes ne montrent que des emplacements.
- **Fil d'Ariane, galerie produit, sélecteur de finition, stepper de quantité, onglets ou accordéon pour les caractéristiques**.
- **Menu mobile** (le hamburger est dessiné, l'état ouvert ne l'est pas), toast de confirmation, état vide, skeleton de chargement.
- **Photos** : aucune n'est fournie, seulement des icônes en placeholder. Le README demande des photos d'intérieurs éclairés en tons « golden hour ».
- **3D** : Three.js ou Spline est « encouragé » pour le hero, mais le kit utilise une lampe en SVG. Il faut décider si l'on passe à la 3D.

### Données à fournir par le client
Vrais numéros (actuellement `+225 07 00 00 00` en placeholder), adresses exactes et coordonnées GPS, comptes Instagram et Facebook, catalogue (noms, prix FCFA, finitions, caractéristiques, photos), email réel, années d'expérience.

### Règles de contenu
- Français, voix « nous », ton chaleureux et assuré, vocabulaire sensoriel (lumière, éclat, chaleur, raffinement).
- Ponctuation française : guillemets « … » et espaces avant `: ; ! ?` (espace insécable).
- Casse de phrase pour le corps du texte, CAPITALES pour les labels. **Pas d'emoji.**

## 6. Recommandations pour le build

1. **Socle** : importer `colors_and_type.css` tel quel comme fichier de tokens et y ajouter les tokens manquants (`--bg-deep`, `--bg-deepest`, focus ring, champs de formulaire).
2. **Stack** : le design est un site vitrine. Du HTML/CSS/JS statique (comme le UI kit) ou Astro suffit, le tout avec Lucide **à version épinglée** (le kit charge `lucide@latest`).
   - React ou Next ne se justifie que si le catalogue devient dynamique (CMS).
   - Le formulaire de devis passe par Formspree ou une petite API, et peut aussi proposer un lien WhatsApp, très utilisé en Côte d'Ivoire.
3. **Pages** : Accueil (Hero → Stats/Marquee → Collection → Promesse → Showrooms + Devis → Footer), Collection (filtres), Fiche produit, éventuellement une page Contact/Devis dédiée.
4. **Composants à coder en premier** : Button (5 variantes, 3 tailles), Card, ProductCard, FeatureBlock, StatItem, ShowroomCard, Navbar, Footer, Pill, champs de formulaire.
5. **Motion** : centraliser `--ease-out-expo` et les durées. Une seule utilité `.reveal` (IntersectionObserver), et le canvas de particules est mis en pause hors écran ou en `reduced-motion`.
6. **Qualité** : contrastes corrigés (voir §5), `:focus-visible`, images `loading="lazy"` en WebP/AVIF, meta OG, schema.org `LocalBusiness` pour les 2 showrooms (SEO local Abidjan).

## 7. Décisions à prendre avant de coder
1. Stack : statique (HTML/Astro) ou React/Next avec un CMS pour le catalogue ?
2. Conversion : uniquement devis et showroom (ce que montrent les wireframes), ou panier / WhatsApp ? Les wireframes mentionnent un « add to cart » sticky en mobile, mais le CTA reste « Demander un devis ».
3. Hero : lampe en SVG animée (le kit) ou vraie 3D (Three.js / Spline, comme le suggère le README) ?
4. Style des boutons : CAPITALES (kit) ou casse de phrase (README / previews) ?
5. ~~Emplacement~~ → résolu : dossier dédié `Saas/Dalia-Light/`, séparé du générateur de factures.
6. Logo : `assets/logo.png` est brun foncé (`#7A5200`) et peu lisible sur fond `#0C0C0C`. Il faut une version claire/dorée (idéalement en SVG).
