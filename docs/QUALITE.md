# Passe de qualité — 16/10/2026

Mesures : **Lighthouse 13.5.0**, build de production local (`next start`), profil **mobile** par défaut :
écran de téléphone, processeur bridé ×4, réseau « 4G lente » simulé.

## Résultats

| Page | Performance | Accessibilité | Bonnes pratiques | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| Accueil | 46 → **83** | 96 → **100** | 100 | 100 | 6,0 → 3,4 s | 1 590 → 370 ms | 0 |
| Catalogue | 83 → **91** | 98 → **100** | 100 | 100 | 3,4 s | 330 → 130 ms | 0 |
| Fiche produit | **94** | **100** | 100 | 100 | 3,1 s | 40 ms | 0 |
| Showrooms | **95** | **100** | 100 | 100 | 3,0 s | 50 ms | 0 |
| Page showroom | **92** | 98 → **100** | 100 | 100 | 3,3 s | 80 ms | 0 |

Profil ordinateur : accueil **88** (3D cinématique chargée immédiatement), catalogue **100**.

## Corrections apportées

**Performance (accueil)**
- Le texte et les boutons du hero sont visibles dès l'arrivée. Avant, ils étaient masqués jusqu'à la fin de l'allumage, ce qui retardait le LCP de 2,3 s. L'allumage éclaire toujours le titre, et seul le variateur apparaît en fondu.
- Sur mobile, ou si l'économie de données est activée, la 3D (three.js, environ 900 Ko non compressés) n'est chargée que 4 s après le chargement de la page, quand le navigateur est libre. L'allumage se joue tout de suite avec la lampe SVG, et la 3D prend le relais en fondu. Sur ordinateur, la séquence cinématique en 3D est inchangée.

**Accessibilité**
- Les engagements partent maintenant d'une teinte lisible (`#8A8072`, 3,1:1 sur plâtre, texte large) au lieu de 1,5:1 avant leur révélation au scroll.
- L'ordre des titres est corrigé :
  - catalogue : `h2` invisible « Luminaires » avant les cartes en `h3` ;
  - page showroom : « Horaires » en `h2` sous le `h1`.
- Les zones tactiles agrandies sont les liens de showroom du pied de page (18 → 36 px), les fils d'Ariane (18 → 44 px) et le lien téléphone (20 → 44 px).
- Sur mobile, la barre fixe de la fiche produit ne masque plus l'élément qui a le focus clavier (`scroll-padding-bottom`).

## Checklist ui-ux-pro-max (pre-delivery)

| Point | État |
|---|---|
| Contrastes ≥ 4,5:1 (texte courant), ≥ 3:1 (texte large) | ✅ vérifié par Lighthouse et calcul (palette nuit et jour) |
| Focus visible, ordre de tabulation = ordre visuel | ✅ anneau flamme sur nuit, encre sur jour ; ordre vérifié sur l'accueil |
| Lien d'évitement « Aller au contenu » | ✅ |
| Libellés des boutons icônes, `aria-hidden` sur icônes décoratives | ✅ aucun contrôle sans nom accessible |
| Échappatoire des panneaux (Échap, bouton fermer, clic à côté) | ✅ `<dialog>` natifs |
| Alternative au glisser (pousser la lampe) | ✅ variateur au clavier ; la lampe est décorative |
| Mouvement réduit | ✅ prévu partout (hero allumé d'emblée, pas de scroll animé, produits allumés) — **non testé manuellement** |
| Zones tactiles ≥ 44 px | ✅ sauf noms de produits sous les cartes (43 px, doublés par le visuel cliquable) |
| Pas de défilement horizontal (375 px) | ✅ 5 pages vérifiées |
| Pas d'emoji comme icônes, une seule famille (Lucide) | ✅ |
| Jetons sémantiques, pas de couleurs ad hoc | ✅ hors illustrations SVG provisoires |
| Images : dimensions réservées (CLS) | ✅ CLS 0 sur les 5 pages |
| Contenu animé automatiquement avec arrêt | ✅ seule la poussière et le léger balancement bougent seuls ; coupés en mouvement réduit et hors écran |

## Limites et suites

- **LCP mobile autour de 3 s** sur réseau 4G lente simulé : c'est le titre en Syne qui attend la police et le CSS. Il reste au-dessus de la cible « bon » (2,5 s). Piste : précharger une seule graisse de Syne, ou passer le titre en `font-display: optional` (au prix d'une police de secours à la première visite).
- **À tester sur de vrais téléphones** : Android d'entrée de gamme en 4G, Safari iOS (WebGL, `@starting-style`, `clip-path` animé).
- **À tester manuellement** : mouvement réduit activé dans le système, zoom du texte à 200 %, lecteur d'écran (TalkBack ou VoiceOver).
- La 3D sera plus légère avec un modèle GLB compressé à la place de la lampe dessinée en code.
- Les rapports JSON complets ne sont pas versionnés. Pour relancer une mesure (avec `npm run start` dans un autre terminal) :

```bash
npx lighthouse@13.5.0 http://localhost:3000/ --view
```
