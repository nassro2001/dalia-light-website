import { createRequire } from "module";
const dir = process.argv[2];
const require = createRequire(dir + "/package.json");
const { removeBackground } = require("@imgly/background-removal-node");
const sharp = require("sharp");
const crop = { left: 110, top: 300, width: 620, height: 620 };
const png = await sharp(process.argv[3]).extract(crop).resize(1024, 1024).png().toBuffer();
for (const model of ["medium", "small"]) {
  const blob = await removeBackground(new Blob([png], { type: "image/png" }), { model });
  await sharp(Buffer.from(await blob.arrayBuffer())).png().toFile(`${dir}/susp-cut-${model}.png`);
}
console.log("ok");
