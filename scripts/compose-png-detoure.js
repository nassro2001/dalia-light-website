// Compose une photo produit DÉJÀ détourée (PNG transparent) sur le fond nuit du site, sans agrandir ni retoucher
// les pixels du produit. Version « allumé » : halo de l'ampoule et cône de lumière ajoutés (lumière simulée).
// Usage : node scripts/compose-png-detoure.js <png> <prefixe-sortie> <ampoules> [--deja-allume]
//   <ampoules> : « x,y » (une ampoule) ou « x,y;x,y;… » (lustre), en pixels dans le PNG d'origine.
//   --deja-allume : la photo montre le luminaire allumé ; « allumé » = la photo (halo léger en plus),
//                   « éteint » = la photo assombrie.
//   --remplissage=0.85 : part du cadre occupée par le produit (0.65 par défaut).
//   --sans-halo : pas de halo par ampoule (rubans LED, anneaux lumineux) ; seule la lueur d'ensemble est ajoutée.
//   --led : photo d'un luminaire LED éteint ; la version « allumé » teinte le produit en blanc chaud et le fait briller.
// Le cadrage carré est centré sur le produit.
const sharp = require("sharp");
const [src, out, bulbArg] = process.argv.slice(2);
const alreadyLit = process.argv.includes("--deja-allume");
const bulbs = bulbArg.split(";").map((pair) => pair.split(",").map(Number));
const noHalo = process.argv.includes("--sans-halo");
const led = process.argv.includes("--led");
const multi = bulbs.length > 1 || noHalo;
const fill = Number((process.argv.find((a) => a.startsWith("--remplissage=")) ?? "=0.65").split("=")[1]);

(async () => {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let minx = info.width, maxx = 0, miny = info.height, maxy = 0;
  for (let p = 0; p < info.width * info.height; p++) {
    if (data[p * 4 + 3] < 10) continue;
    const x = p % info.width, y = (p / info.width) | 0;
    minx = Math.min(minx, x); maxx = Math.max(maxx, x); miny = Math.min(miny, y); maxy = Math.max(maxy, y);
  }
  // Carré centré : le produit occupe « fill » de la plus grande dimension.
  const size = Math.round(Math.max(maxx - minx, maxy - miny) / fill);
  const cx = (minx + maxx) / 2, cy = (miny + maxy) / 2;
  const left = Math.round(cx - size / 2), top = Math.round(cy - size / 2);
  const padded = await sharp(src).extend({ top: size, bottom: size, left: size, right: size, background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const product = await sharp(padded)
    .extract({ left: left + size, top: top + size, width: size, height: size }).png().toBuffer();
  const s = size;
  const pts = bulbs.map(([x, y]) => [x - left, y - top]);
  const ux = pts.reduce((a, p) => a + p[0], 0) / pts.length, uy = pts.reduce((a, p) => a + p[1], 0) / pts.length;

  const svg = (body) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}">${body}</svg>`);
  const bg = svg(`<defs><radialGradient id="g" cx="50%" cy="46%" r="65%"><stop offset="0" stop-color="#3A2D1F"/><stop offset=".5" stop-color="#1F1913"/><stop offset="1" stop-color="#100D0A"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/>`);
  const cone = svg(`<defs><linearGradient id="c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFB800" stop-opacity=".65"/><stop offset=".4" stop-color="#FF8A00" stop-opacity=".18"/><stop offset="1" stop-color="#FF6A00" stop-opacity="0"/></linearGradient><filter id="f"><feGaussianBlur stdDeviation="${s / 40}"/></filter></defs>
    <polygon points="${ux - s * 0.27},${uy + s * 0.06} ${ux + s * 0.27},${uy + s * 0.06} ${ux + s * 0.6},${s} ${ux - s * 0.6},${s}" fill="url(#c)" filter="url(#f)"/>`);
  // Halo par ampoule : grand pour une suspension, petit et nombreux pour un lustre.
  const r = s * (multi ? (alreadyLit ? 0.05 : 0.08) : 0.26), peak = alreadyLit ? 0.45 : 1;
  const glow = svg(`<defs><radialGradient id="b"><stop offset="0" stop-color="#FFF1CC" stop-opacity="${peak}"/><stop offset=".2" stop-color="#FFB800" stop-opacity="${0.7 * peak}"/><stop offset=".6" stop-color="#FF6A00" stop-opacity="${0.15 * peak}"/><stop offset="1" stop-color="#FF6A00" stop-opacity="0"/></radialGradient></defs>
    ${noHalo ? "" : pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#b)"/>`).join("")}`);
  // Lustre : une grande lueur chaude derrière, qui baigne tout le luminaire.
  const aura = svg(`<defs><radialGradient id="a" cx="${ux}" cy="${uy}" r="${s * 0.42}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFB800" stop-opacity=".55"/><stop offset=".5" stop-color="#FF8A00" stop-opacity=".18"/><stop offset="1" stop-color="#FF6A00" stop-opacity="0"/></radialGradient></defs><circle cx="${ux}" cy="${uy}" r="${s * 0.42}" fill="url(#a)"/>`);

  const productOff = alreadyLit ? await sharp(product).modulate({ brightness: 0.62, saturation: 0.7 }).png().toBuffer() : product;
  await sharp(bg).composite([{ input: productOff }]).webp({ quality: 92 }).toFile(out + "-eteint.webp");
  // Lustre photographié éteint : les cristaux et le métal s'éclairent un peu (lumière simulée).
  const productOn = led
    ? await sharp(product).tint("#FFE2B4").modulate({ brightness: 1.3 }).png().toBuffer()
    : multi && !alreadyLit
      ? await sharp(product).modulate({ brightness: 1.15, saturation: 1.08 }).png().toBuffer()
      : product;
  const lit = await sharp(bg).composite([{ input: multi ? aura : cone, blend: "screen" }, { input: productOn }]).png().toBuffer();
  await sharp(lit).composite([{ input: glow, blend: "screen" }]).webp({ quality: 92 }).toFile(out + "-allume.webp");
  console.log(`ok ${s}×${s}, ${pts.length} ampoule(s)`);
})();
