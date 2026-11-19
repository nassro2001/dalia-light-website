import { cacheLife } from "next/cache";
import sharp from "sharp";
import { SCENE_MARK } from "./web-images";

// Le site affiche deux sortes de photos. Une photo détourée (fond transparent) se pose sur le fond plâtre, avec
// une marge et un halo. Une photo entière (une mise en scène faite à la main, ajoutée dans l'ERP) remplit son cadre.
// On les distingue en regardant la photo elle-même : une photo détourée a des zones transparentes.
// Une adresse de photo ne change jamais (le nom du fichier est unique), donc la réponse se garde indéfiniment.

/** Part de pixels transparents à partir de laquelle une photo est considérée comme détourée. */
const CUTOUT_SHARE = 0.005;

async function isCutout(url: string): Promise<boolean> {
  "use cache";
  cacheLife("max");
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`Photo ${url} : ${res.status}`);
  const { data, info } = await sharp(Buffer.from(await res.arrayBuffer()))
    .resize(128, 128, { fit: "fill" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let transparent = 0;
  for (let i = info.channels - 1; i < data.length; i += info.channels) if (data[i] < 16) transparent++;
  return transparent / (info.width * info.height) >= CUTOUT_SHARE;
}

/** Faute de pouvoir lire la photo : les photos détourées du site sont rangées dans images/site/lot-… */
function guessCutout(url: string) {
  return url.includes("/site/lot-");
}

/** Marque les photos entières de l'ERP (#scene) pour qu'elles remplissent leur cadre. */
export async function markScenes(images: string[]): Promise<string[]> {
  return Promise.all(
    images.map(async (src) => {
      if (!/^https?:\/\//.test(src) || src.endsWith(SCENE_MARK)) return src;
      const cutout = await isCutout(src).catch(() => guessCutout(src));
      return cutout ? src : src + SCENE_MARK;
    }),
  );
}
