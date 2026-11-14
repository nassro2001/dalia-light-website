# Dalia-Light — Direction visuelle

Document de référence pour construire le site. En cas de conflit, il prime sur `design-system/` (qui reste la source d'inspiration et de marque).
Établi avec les skills **frontend-design** et **ui-ux-pro-max** · 15/10/2026 · Statut : **proposition à valider**.

---

## 1. Le brief en une phrase

**Sujet** : un distributeur de luminaires à Abidjan avec 2 showrooms et un très grand catalogue.
**Public** : particuliers qui équipent ou rénovent, architectes et décorateurs, commerces et hôtels. Ils arrivent souvent sur mobile, en 4G.
**Rôle du site** : donner envie (une lumière belle et chaude), aider à trouver le bon luminaire dans un gros catalogue, puis **faire écrire sur WhatsApp** ou **venir en showroom**.

## 2. L'idée directrice : « On allume la pièce »

Un luminaire ne se juge pas éteint. Le site se comporte comme un showroom le soir : **la page s'ouvre dans une pièce sombre et la lumière s'allume**.

L'élément mémorable est unique, et c'est là que va toute l'audace :

> **Le hero est une suspension en 3D qui s'allume au chargement. Le visiteur peut ensuite la régler avec un variateur. Sa lumière éclaire réellement le titre.**

Tout le reste est calme, discipliné et photographique : il laisse les produits briller.

Deuxième principe, qui structure le parcours : **la nuit et le jour**.
- **Nuit** (fond sombre) : le hero et « Trouver par pièce » sur l'accueil, le catalogue. On regarde la lumière. (Révisé : la nuit est réservée aux moments où la lumière est le sujet, pour ne pas assombrir tout l'accueil.)
- **Jour** (fond clair, couleur plâtre) : sur l'accueil, la sélection de produits, les engagements et les showrooms ; les infos pratiques, le contact. Les visuels sombres des produits y ressortent comme des photos encadrées.

Le passage de l'un à l'autre est un vrai moment du scroll, pas une décoration.

## 3. Ce que j'ai écarté du design system, et pourquoi

Le design system d'origine accumule plusieurs réflexes « par défaut » qui rendraient le site générique. Il est réutilisé comme inspiration, pas tel quel.

| Dans le design system | Décision | Raison |
|---|---|---|
| 4 familles (Syne, DM Sans, Cormorant, JetBrains Mono) | **2 familles** : Syne + DM Sans | La personnalité vient de la typographie traitée comme un élément actif, pas de l'accumulation. Le mono pour les specs est un tic. |
| Un mot du titre en italique ou en or (« L'art de la *lumière.* ») | **Abandonné** | Tic de mise en avant. Ici c'est la lumière 3D qui éclaire le titre, pas une couleur appliquée. |
| Labels en CAPITALES espacées au-dessus de chaque titre | **Supprimés** | Bruit. Un label n'apparaît que s'il informe (catégorie d'un produit, statut « Ouvert »). |
| Features numérotées 01 / 02 / 03 | **Supprimées** | Ce n'est pas une séquence. Les engagements deviennent des phrases courtes, à côté des faits. |
| Bande de stats « 500+ / 10 ans » en dégradé or→orange | **Supprimée** | Traitement par défaut. Les chiffres apparaissent dans le texte quand ils servent. |
| Noir neutre `#0C0C0C` + accent or vif partout | **Noir chaud** + or réservé à la lumière | « Noir + un accent vif » est un cliché. Ici l'or n'apparaît que là où il y a de la lumière, ce qui lui donne du sens. |
| Particules, anneaux qui tournent, marquee, fade-up sur chaque section | **Un seul moment orchestré** : l'allumage | L'animation partout dilue l'effet et coûte cher sur mobile. |
| Cartes produit encadrées, bordure or, élévation au survol | **Pas de cartes** : photo + texte | On évite le « kit SaaS ». C'est la photo qui fait le travail. |
| « → » ajouté aux boutons, séparateurs « A · B · C » | **Abandonnés** | Tics de template. |

**Suggestion ui-ux-pro-max non retenue.** Le mode `--design-system` a proposé « Liquid Glass » sur fond clair avec Cormorant et Montserrat, conçu pour des interfaces Apple et la mode. Ça ne correspond ni au sujet ni à la marque. Conformément à la règle du skill, **cette sortie n'a pas été persistée**. Le skill a été utilisé pour ses règles UX, Next.js et Three.js (voir §10), qui sont pertinentes.

## 4. Couleurs

Six teintes, nommées d'après le monde de l'éclairage.

| Nom | Hex | Rôle |
|---|---|---|
| **Nuit** | `#100D0A` | Fond des sections « nuit ». Noir brun : une pièce éteinte, pas un écran. |
| **Pénombre** | `#1A1510` | Surfaces sur fond nuit (tiroir « Ma sélection », menus, champs) |
| **Ivoire** | `#F3EADB` | Texte principal sur nuit (16.2:1). Texte secondaire : ivoire à 70 %, soit `#B9AE9C` (8.9:1) |
| **Laiton** | `#C9A15B` | Matière des structures : filets, icônes, catégories, liens sur nuit (8.1:1). **Ce n'est pas de la lumière.** |
| **Flamme** | `#FFB800` | **Uniquement la lumière** : halo 3D, état « allumé », bouton principal (texte nuit dessus, 11.2:1) |
| **Plâtre** | `#EEE7DB` | Fond des sections « jour ». Texte en encre `#2A231B` (12.6:1), liens en laiton foncé `#7A5A22` (5.2:1) |

Règles d'usage :
- **Braise `#FF6A00`** (l'orange de la marque) : uniquement **au cœur des halos**, dans le dégradé de lumière, comme le filament d'une ampoule. Jamais en aplat d'interface.
- Le laiton clair n'est **jamais** utilisé sur plâtre (1.96:1) : le laiton foncé le remplace.
- WhatsApp n'apporte **pas son vert**. Le logo WhatsApp suffit pour être reconnu, et le bouton reste dans la palette.
- Grain très léger (3 %) sur les fonds nuit uniquement, pour éviter le noir « plat écran ».

## 5. Typographie

| Rôle | Police | Traitement |
|---|---|---|
| Titres, affichage | **Syne** 700–800 | Grande taille et chasse serrée (`-0.035em`). Le titre du hero est **éclairé** par la lampe : un dégradé radial en `background-clip:text` suit la position du cône de lumière. Les lettres hors du halo restent dans la pénombre. |
| Texte, interface, specs | **DM Sans** 400–600 | Casse de phrase partout. Chiffres tabulaires (`font-variant-numeric: tabular-nums`) pour les prix FCFA et les caractéristiques (diamètre, IP, culot). |

Échelle modulaire en quarte (×1.333, base 16 px), comme le recommande *The Elements of Typographic Style* :

| Usage | Taille |
|---|---|
| Hero | `clamp(48px, 8vw, 120px)` |
| Titre de section (h2) | 50 px |
| Titre de bloc (h3) | 38 px |
| Grand texte | 28 px |
| Petit titre (h4) | 21 px |
| Texte courant | 16 px (17 px sur desktop) |
| Petit texte | 14 px |
| Mentions | 12 px, jamais moins |

Interlignage : 1.6 pour le texte et 1.05 pour l'affichage. Longueur de ligne : **65 caractères au maximum**.

## 6. Mise en page

Grille de 12 colonnes, 1440 px au maximum. **Le texte est aligné à gauche, partout** : on ne centre rien sauf exception justifiée. La composition est asymétrique, avec la lampe et la lumière décalées à droite et le texte ancré en bas à gauche.

```
HERO (nuit, 100svh)                        CATALOGUE (nuit)
┌──────────────────────────────────┐       ┌──────────────────────────────────┐
│ logo        Catalogue Showrooms ◉│       │ Trouver par pièce                │
│                      │            │       │ ┌────────────┐┌─────┐┌─────┐     │
│                      │  câble     │       │ │ Salon      ││Chbre││Cuis.│     │
│                    ╭─┴─╮          │       │ │ (grande)   │├─────┤├─────┤     │
│                    │3D │ lampe    │       │ └────────────┘│Ext. ││Comm.│     │
│                   ╱╲   ╱╲ cône    │       │               └─────┘└─────┘     │
│ Chaque pièce     ╱  ╲ ╱  ╲        │       │ Suspensions  Lustres  Appliques… │
│ a sa lumière.   (titre éclairé)   │       │ ▢ ▢ ▢ ▢   photo éteinte → allumée│
│ [Voir le catalogue] [WhatsApp]   │       │                                  │
│ variateur ○────●──── 70 %         │       └──────────────────────────────────┘
└──────────────────────────────────┘
SHOWROOMS (jour, plâtre)                    FICHE PRODUIT
┌──────────────────────────────────┐       ┌──────────────────────────────────┐
│ Venez la voir allumée.           │       │ ┌───────────────┐ Lustre Milano   │
│ ┌──────────────┐ Cocody-Riviera  │       │ │ photo allumée │ 85 000 FCFA     │
│ │  carte /     │ Ouvert · 19h00  │       │ │ (bascule      │ Finition ●○○○   │
│ │  photo       │ [Itinéraire]    │       │ │  éteint/allumé)│ [WhatsApp]      │
│ └──────────────┘ [WhatsApp]      │       │ └───────────────┘ [+ Sélection]  │
│ Plateau …                        │       │ Caractéristiques (tableau)       │
└──────────────────────────────────┘       └──────────────────────────────────┘
```

**Hiérarchie des arrondis**, au lieu d'un seul rayon partout :
- **0** pour les photos : elles vont à fond perdu ou s'alignent sur la grille.
- **pilule** pour les commandes qu'on manipule (boutons, variateur, filtres), comme un interrupteur.
- **16 px** pour les panneaux qui glissent (tiroir « Ma sélection », menu mobile).

## 7. Pages et sections

1. **Accueil**
   - Hero 3D.
   - « Trouver par pièce » : salon, chambre, cuisine, extérieur, commerce et hôtel. Les tuiles photo ont des tailles variées.
   - Une sélection de produits par catégorie.
   - Les engagements, en phrases : garantie 2 ans, conseil en showroom, livraison à Abidjan, stock.
   - Passage à la section **jour** : les showrooms.
   - Footer.
2. **Catalogue** : filtres par catégorie, pièce, finition, culot, température de couleur (2700 K / 3000 K / 4000 K) et prix. Recherche. Grille dense et rapide. Les filtres s'ouvrent en tiroir sur mobile et sont reflétés dans l'URL, pour qu'on puisse partager une recherche.
3. **Fiche produit**
   - Galerie avec bascule **éteint / allumé**.
   - Finitions, caractéristiques et produits proches.
   - CTA « Demander sur WhatsApp » et « Ajouter à ma sélection ». Sur mobile, ils sont dans une **barre fixe en bas**.
4. **Showrooms** : une page par showroom (SEO local) avec adresse, horaires, statut ouvert ou fermé, itinéraire et WhatsApp.
5. **Ma sélection** : un tiroir accessible partout, qui envoie la liste complète sur WhatsApp.

## 8. Interactions et mouvement

> Révisé le 15/10/2026 à la demande du client : un hero plus spectaculaire et des animations au scroll.
> Bibliothèque : **GSAP 3.15 + ScrollTrigger** (`@gsap/react`, versions figées).

**Le hero, une séquence orchestrée** (au chargement) :
1. La pièce est noire et la caméra est en gros plan sur l'ampoule. Le filament rougeoit (braise).
2. La lumière vacille puis s'allume, et la caméra recule pour révéler la lampe.
3. La lumière balaie le titre depuis la lampe.
4. Le texte, les boutons et le variateur apparaissent.

**Animations déclenchées par le visiteur** :
- **Pousser la lampe** à la souris ou au doigt : un vrai pendule amorti. Le cône, la flaque au sol et la lumière sur le titre suivent son balancement.
- **Variateur** : il règle l'intensité de la lampe, du cône, de la poussière et du titre.
- **Halo du curseur** (souris uniquement) : une lumière chaude suit la souris avec un léger retard. Elle se resserre sur les liens et les boutons, et s'atténue sur les sections jour. Le curseur natif reste visible.
- **Frôler la lampe** : passer vite la souris près de l'abat-jour lui donne un petit élan.
- **Survol ou tap d'un produit** : la photo passe en fondu de « éteint » à « allumé ».
- **Ajout à la sélection** : la pastille du compteur s'allume brièvement.
- **Ouverture du tiroir ou des filtres** : glissement de 300 ms. La fermeture est plus rapide (200 ms).

**Ambiance** : quelques grains de poussière flottent dans le faisceau, 110 sur ordinateur et 45 sur mobile.

**Animations au scroll** (ScrollTrigger, liées à la position du scroll) :
- **Sortie du hero** : la lampe défile plus lentement que la page (parallaxe), son faisceau s'élargit et le texte glisse plus vite.
- **Aube** (révisé le 15/10/2026, l'ancien dégradé brun jugé « boueux ») : entre la nuit et le jour, un dôme plâtre net se lève depuis le bas au fil du scroll, bordé d'un liseré de lumière dorée, jusqu'à rejoindre la section jour. Aucun dégradé.
- **Trouver par pièce** : galerie horizontale. Sur ordinateur, la section reste fixe et le scroll fait défiler les pièces ; sur mobile, défilement horizontal natif aimanté. Chaque pièce s'allume en arrivant au centre.
- **Produits** (accueil, catalogue, produits proches) : chaque visuel s'allume en traversant la bande centrale de l'écran et s'éteint en la quittant.
- **Engagements** : le texte s'éclaire mot à mot au fil du scroll.

**Interdits** : fade-up générique sur chaque section, rebonds, Lenis ou tout autre « smooth scroll » qui détourne le défilement natif.

**`prefers-reduced-motion`** :
- Le hero s'affiche directement allumé, sans timeline ni scroll lié.
- L'aube devient un dégradé fixe.
- La lampe peut toujours être poussée et le variateur fonctionne.

**Sans JS** : le hero est allumé grâce au CSS, avec la lampe SVG. S'il y a du JS mais que l'allumage n'a pas démarré, un filet de sécurité allume la pièce après 4 s.

## 9. Le hero 3D : spécifications techniques

| Point | Choix |
|---|---|
| Moteur | **React Three Fiber + drei**, avec **un seul `<Canvas>`** sur toute la page (une seule instance WebGL, règle critique ui-ux-pro-max) |
| Modèle | GLB compressé (Draco ou Meshopt), **≤ 1,5 Mo** ; ampoule en matériau émissif. ⚠️ **Le modèle reste à trouver.** |
| Lumière | Bloom en post-process sur desktop. Sur mobile : halo en sprite additif, sans post-process. |
| Chargement | Une **image fixe de la lampe allumée** sert de LCP (`next/image` avec `priority`). Le Canvas est chargé ensuite par import dynamique côté client, quand le navigateur est libre. |
| Économie | `frameloop="demand"`. Pause hors écran (IntersectionObserver) et quand l'onglet est caché. Libération de la géométrie, des matériaux et des textures au démontage. |
| Repli | Pas de WebGL, appareil faible ou mouvement réduit : l'image fixe reste affichée. Le site est **entièrement utilisable sans la 3D**. |
| Entrées | Souris **et** tactile pour le variateur. Le variateur est un vrai `<input type="range">` accessible au clavier, avec un libellé « Intensité de la lumière ». |

## 10. Règles UX (ui-ux-pro-max)

**Accessibilité**
- Contraste de 4.5:1 au minimum : toutes les paires du §4 sont vérifiées.
- Focus visible : anneau flamme de 2 px.
- `alt` descriptifs (« Suspension Milano dorée, allumée »).
- Les boutons qui ne contiennent qu'une icône ont un `aria-label`.

**Tactile**
- Cibles de 44×44 px au minimum, espacées de 8 px.
- Aucune information réservée au survol : la bascule éteint/allumé existe aussi au tap et dans la galerie.

**Performance**
- `next/image` partout, en AVIF/WebP. `priority` uniquement sur l'image du hero.
- Espace réservé pour toutes les images (CLS < 0.1).
- Code de la 3D chargé séparément.

**Navigation**
- Barre fixe de 72 px, transparente sur le hero puis opaque au scroll. Elle ne masque jamais le contenu (`scroll-padding-top`).
- Liens profonds pour les filtres et les produits.
- Le bouton retour du navigateur fonctionne normalement.

**Nombres**
- Prix au format `85 000 FCFA`, avec espace insécable et chiffres tabulaires.

**Responsive**
- Pensé d'abord pour le mobile, avec 4 points de contrôle : 375, 768, 1024 et 1440 px.
- Aucun scroll horizontal, sauf la rangée de filtres (défilement horizontal assumé sur mobile).

## 11. WhatsApp, la conversion

**Messages pré-remplis** (`https://wa.me/<numéro>?text=…`) :
- Depuis une fiche produit : « Bonjour Dalia-Light, je suis intéressé(e) par **Lustre Doré Milano** (réf. DL-0123, finition Or). Est-il disponible ? <lien> »
- Depuis « Ma sélection » : la liste des produits avec référence, finition et quantité, plus « Pouvez-vous me faire un devis ? ».

**Points d'entrée** :
- le bouton du hero ;
- la fiche produit (barre fixe en bas sur mobile) ;
- le tiroir « Ma sélection » ;
- chaque carte showroom, qui peut avoir son propre numéro ;
- le bouton flottant, **masqué quand une barre fixe produit est déjà affichée**, pour ne pas doubler.

**Ma sélection** :
- Stockée dans `localStorage` et protégée par `try/catch` : si le navigateur bloque le stockage, la sélection reste en mémoire le temps de la visite.
- Aucun compte nécessaire.

## 12. Ton et textes

- **Voix** : « nous ». Ton chaleureux, assuré et concret. On décrit la lumière (« chaude », « tamisée », « qui ne fatigue pas les yeux ») plutôt que de vendre.
- **Casse** : casse de phrase partout. **Pas d'emoji. Pas de « → » dans les boutons.**
- **Boutons** : ils disent exactement ce qui se passe, avec le même verbe du début à la fin. « Ajouter à ma sélection » produit « Ajouté à votre sélection ». « Écrire sur WhatsApp » ouvre WhatsApp.
- **Ponctuation française** : « guillemets », espace insécable avant `: ; ! ?`.
- **Exemples** :
  - Hero : « Chaque pièce a sa lumière. »
  - Sous-titre : « Plus de 500 luminaires à voir allumés dans nos deux showrooms d'Abidjan. »
  - Section jour : « Venez la voir allumée. »
  - Catalogue vide (aucun résultat) : « Aucun luminaire ne correspond à ces filtres. Retirez un filtre ou écrivez-nous : nous l'avons peut-être en stock. »

## 13. Impact sur le code existant

La palette et l'échelle typographique ci-dessus **remplacent** une partie de `src/styles/tokens.css`. Mise à jour à faire au début du build :
- ajouter les tokens nuit, pénombre, ivoire, laiton, flamme, plâtre, encre et laiton foncé ;
- passer l'échelle typographique en quarte ;
- retirer Cormorant et JetBrains de `layout.tsx` ;
- hauteur de la barre de navigation : 72 px.

Les tokens d'origine restent dans `design-system/` comme référence.

## 14. Ce qu'il faut pour avancer

| Besoin | Bloque | Piste |
|---|---|---|
| **Modèle 3D de la suspension** | Le hero | Acheter un GLB (Sketchfab, CGTrader), le commander à un graphiste 3D, ou le modéliser dans Blender d'après un produit phare du catalogue |
| **Photos produit éteint + allumé** | Catalogue et fiches | Un shooting simple sur fond sombre, avec le même cadrage pour les deux états. En attendant, une seule photo par produit (la bascule se désactive). |
| Photos des pièces (salon, chambre…) | « Trouver par pièce » | Ambiances en tons chauds, ou banque d'images en attendant |
| Numéro(s) WhatsApp | Tous les CTA | Un numéro général, et éventuellement un par showroom |
| Logo clair pour fond sombre | La barre de navigation | Le logo actuel est brun foncé. Il faut une version ivoire ou laiton, idéalement en SVG. |

## 15. Ordre de construction proposé

1. Mettre à jour les tokens et les polices (§13).
2. Poser la structure commune : barre de navigation, footer, tiroir « Ma sélection », bouton WhatsApp.
3. Construire le catalogue et la fiche produit avec des données d'exemple, en image simple.
4. Construire l'accueil avec l'image fixe du hero, ce qui donne un site complet et rapide.
5. Brancher la 3D dans le hero, quand le modèle est disponible.
6. Passe finale : accessibilité, Lighthouse, tests sur un vrai mobile en 4G.
