// Lustre cristal + parties opaques : disques = masque IA (detourage-ia.mjs, sortie l6-cut.png) ; rideau de cristal = zone
// tracée à la main ; franges = détection des scintillements. Polygones et exclusions propres à CETTE photo.
// Usage : node scripts/detourage-hybride.js <dossier contenant l6-crop.png, l6-cut.png et node_modules>
// Lustre disques + cristaux : disques = masque IA ; rideau dense = zone tracée ; franges = détection des scintillements.
const dir = process.argv[2];
const sharp = require(dir + "/node_modules/sharp");
const inPoly = (x, y, pts) => { let c = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; };
const dense = [[15, 285], [1405, 285], [1395, 420], [1250, 505], [1000, 520], [750, 515], [500, 505], [250, 480], [25, 420]];
const fringe = [[10, 380], [1410, 380], [1400, 560], [1180, 760], [700, 775], [330, 700], [10, 520]];
(async () => {
  const W = 1440, H = 780;
  const src = await sharp(dir + "/l6-crop.png").removeAlpha().raw().toBuffer();
  const blur = await sharp(dir + "/l6-crop.png").removeAlpha().blur(5).raw().toBuffer();
  const ai = await sharp(dir + "/l6-cut.png").ensureAlpha().extractChannel(3).toColourspace("b-w").raw().toBuffer();
  const alpha = Buffer.alloc(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const p = y * W + x, i = p * 3;
    const [r, g, b] = [src[i], src[i + 1], src[i + 2]];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), sat = mx ? (mx - mn) / mx : 0;
    const detail = Math.abs(r - blur[i]) + Math.abs(g - blur[i + 1]) + Math.abs(b - blur[i + 2]);
    let a = ai[p];
    if (x > 650 && x < 700 && y < 125) a = 0; // câble électrique du plafond
    if (inPoly(x, y, dense)) a = 255;
    else if (inPoly(x, y, fringe)) {
      const tag = (x > 640 && x < 760 && y > 700) || (x > 900 && x < 1090 && y > 625); // étiquette, lampe-cage voisine
      const sparkle = sat < 0.28 && mx > 120 && detail > 55;
      if (sparkle && !tag) a = Math.max(a, Math.min(255, (detail - 55) * 6));
    }
    alpha[p] = a;
  }
  // Dilatation légère des scintillements (les pampilles sont des perles, pas des points isolés).
  const soft = await sharp(alpha, { raw: { width: W, height: H, channels: 1 } }).blur(1.2).linear(1.6, 0).extractChannel(0).raw().toBuffer();
  const rgba = Buffer.alloc(W * H * 4);
  for (let p = 0; p < W * H; p++) { rgba[p * 4] = src[p * 3]; rgba[p * 4 + 1] = src[p * 3 + 1]; rgba[p * 4 + 2] = src[p * 3 + 2]; rgba[p * 4 + 3] = soft[p]; }
  const lamp = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
  const S2 = 1440, top = 360;
  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${S2}" height="${S2}">
    <defs><radialGradient id="g" cx="50%" cy="50%" r="65%"><stop offset="0" stop-color="#2E2419"/><stop offset=".55" stop-color="#1A1510"/><stop offset="1" stop-color="#100D0A"/></radialGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <rect x="512" y="0" width="5" height="${top + 30}" fill="#6B5427"/><rect x="928" y="0" width="5" height="${top + 30}" fill="#6B5427"/></svg>`);
  const off = await sharp(bg).composite([{ input: lamp, left: 0, top }]).png().toBuffer();
  await sharp(off).resize(1000, 1000).webp({ quality: 88 }).toFile(dir + "/l6-eteint.webp");
  const glow = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${S2}" height="${S2}">
    <defs><radialGradient id="b" cx="720" cy="${top + 380}" r="620" gradientTransform="translate(720 ${top + 380}) scale(1 .55) translate(-720 -${top + 380})" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#FFE7B0" stop-opacity=".95"/><stop offset=".3" stop-color="#FFB800" stop-opacity=".6"/><stop offset=".7" stop-color="#FF6A00" stop-opacity=".2"/><stop offset="1" stop-color="#FF6A00" stop-opacity="0"/></radialGradient></defs>
    <rect width="100%" height="100%" fill="url(#b)"/></svg>`);
  const on = await sharp(off).composite([{ input: glow, blend: "screen" }]).modulate({ brightness: 1.1, saturation: 1.15 }).png().toBuffer();
  await sharp(on).resize(1000, 1000).webp({ quality: 88 }).toFile(dir + "/l6-allume.webp");
  console.log("ok");
})();
