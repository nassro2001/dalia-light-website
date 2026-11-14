// Usage : node scripts/retouche-nuit.js <photo-source> <prefixe-sortie> <dossier-contenant-node_modules>
// Réglages (recadrage, ellipse, étiquette) propres à chaque photo : à ajuster au cas par cas.
// Retouche « nuit » : garde les tons chauds et lumineux (cristaux, ampoules), fait plonger le reste dans le noir.
const sharp = require(process.argv[4] + "/node_modules/sharp");
const [src, out] = [process.argv[2], process.argv[3]];
const crop = { left: 10, top: 245, width: 790, height: 790 };
const cx = 370, cy = 395, rx = 400, ry = 410; // ellipse (coordonnées du recadrage)
const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
(async () => {
  const { data, info } = await sharp(src).extract(crop).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const o = Buffer.alloc(data.length);
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * 3;
    let r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const warm = sstep(0.06, 0.2, r - b);
    const d = Math.hypot((x - cx) / rx, (y - cy) / ry);
    const space = 1 - sstep(0.75, 1.05, d);
    const tag = x > 560 && x < 640 && y > 95 && y < 185 ? 0 : 1; // étiquette de prix
    const m = sstep(0.16, 0.42, lum) * warm * space * tag;
    // étalonnage chaud
    r = Math.min(1, r * 1.08); g = Math.min(1, g * 1.0); b = b * 0.82;
    const k = Math.pow(m, 1.2);
    // fond : nuit #100D0A
    o[i] = Math.round(255 * (r * k) + 16 * (1 - k));
    o[i + 1] = Math.round(255 * (g * k) + 13 * (1 - k));
    o[i + 2] = Math.round(255 * (b * k) + 10 * (1 - k));
  }
  const img = sharp(o, { raw: info });
  await img.clone().modulate({ brightness: 1.05, saturation: 1.1 }).webp({ quality: 86 }).toFile(out + "-allume.webp");
  await img.clone().modulate({ brightness: 0.45, saturation: 0.5 }).webp({ quality: 86 }).toFile(out + "-eteint.webp");
  await sharp(src).extract(crop).webp({ quality: 86 }).toFile(out + "-avant.webp");
  console.log("ok");
})();
