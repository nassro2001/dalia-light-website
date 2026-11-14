// Photo détourée par IA (@imgly/background-removal-node, modèle medium), puis composée sur fond nuit.
// Usage : node scripts/compose-detoure.js <dossier contenant susp-cut-medium.png, ../images/source et node_modules>
// La lumière de la version « allumé » est SIMULÉE (halo + cône) : réglages propres à chaque photo.
const dir = process.argv[2];
const sharp = require(dir + "/node_modules/sharp");
(async () => {
  // 1. Nettoyage du masque : ficelle bleue de l'étiquette, débris sous l'abat-jour.
  const { data, info } = await sharp(dir + "/susp-cut-medium.png").ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  // Photo d'origine au même cadrage : sert à reboucher les trous du masque dans l'abat-jour.
  const orig = await sharp(dir + "/../images/5.webp").extract({ left: 110, top: 300, width: 620, height: 620 }).resize(1024, 1024).removeAlpha().raw().toBuffer();
  const segDist = (x, y, ax, ay, bx, by) => {
    const dx = bx - ax, dy = by - ay; const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)));
    return Math.hypot(x - ax - t * dx, y - ay - t * dy);
  };
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * 4, j = (y * info.width + x) * 3;
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const blue = b > r + 25 && b > g + 5;
    const string = segDist(x, y, 470, 450, 372, 528) < 9 || segDist(x, y, 150, 690, 70, 1024) < 12;
    const inShade = ((x - 517) / 376) ** 2 + ((y - 752) / 166) ** 2 < 1;
    if (inShade && !string) {
      data[i] = orig[j]; data[i + 1] = orig[j + 1]; data[i + 2] = orig[j + 2]; data[i + 3] = 255;
    }
    // Reflets bleutés (ciel, vitrine) sur la tôle noire : ramenés à un noir neutre.
    if (inShade && data[i + 2] > data[i] + 4 && Math.hypot(x - 510, y - 690) > 95) {
      const l = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
      const v = Math.min(l, 38) * 0.8;
      data[i] = v + 3; data[i + 1] = v + 2; data[i + 2] = v;
    }
    if (blue || string || y > 935) data[i + 3] = 0;
  }
  const lamp = await sharp(data, { raw: info }).png().toBuffer();
  const W = 1024;
  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}">
    <defs><radialGradient id="g" cx="50%" cy="48%" r="62%"><stop offset="0" stop-color="#2E2419"/><stop offset=".55" stop-color="#1A1510"/><stop offset="1" stop-color="#100D0A"/></radialGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <rect x="499" y="0" width="5" height="170" fill="#2a2420"/></svg>`);
  // 2. Lumière simulée : halo de l'ampoule + cône sous l'abat-jour.
  const glow = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}">
    <defs>
      <radialGradient id="b" cx="510" cy="690" r="300" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFF4D6" stop-opacity="1"/><stop offset=".18" stop-color="#FFB800" stop-opacity=".85"/><stop offset=".5" stop-color="#FF6A00" stop-opacity=".4"/><stop offset="1" stop-color="#FF6A00" stop-opacity="0"/></radialGradient>
      <linearGradient id="c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFB800" stop-opacity=".7"/><stop offset="1" stop-color="#FFB800" stop-opacity="0"/></linearGradient>
      <filter id="f"><feGaussianBlur stdDeviation="18"/></filter>
    </defs>
    <ellipse cx="517" cy="752" rx="360" ry="150" fill="#FF9A1A" opacity=".22" filter="url(#f)"/>
    <circle cx="510" cy="690" r="300" fill="url(#b)"/></svg>`);
  // Cône de lumière : placé SOUS la lampe, il sort de l'ouverture de l'abat-jour.
  const cone = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}">
    <defs><linearGradient id="c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFB800" stop-opacity=".55"/><stop offset=".35" stop-color="#FF8A00" stop-opacity=".25"/><stop offset="1" stop-color="#FF6A00" stop-opacity="0"/></linearGradient>
    <filter id="f"><feGaussianBlur stdDeviation="22"/></filter></defs>
    <polygon points="170,760 864,760 1060,1024 -36,1024" fill="url(#c)" filter="url(#f)"/></svg>`);
  const base = sharp(bg).composite([{ input: lamp }]);
  const off = await base.clone().png().toBuffer();
  await sharp(off).resize(1000, 1000).modulate({ brightness: 1.15 }).webp({ quality: 88 }).toFile(dir + "/susp-eteint.webp");
  const lit = await sharp(bg).composite([{ input: cone, blend: "screen" }, { input: lamp }]).png().toBuffer();
  const on = await sharp(lit).composite([{ input: glow, blend: "screen" }]).png().toBuffer();
  await sharp(on).resize(1000, 1000).webp({ quality: 88 }).toFile(dir + "/susp-allume.webp");
  console.log("ok");
})();
