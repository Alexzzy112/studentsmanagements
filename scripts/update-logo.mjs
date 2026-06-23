import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";

const logoPath = path.resolve("public/logo.png");
const size = 256;
const radius = 48;
const borderSize = 12;

async function updateLogo() {
  const image = sharp(logoPath);
  const resized = await image.resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();

  const svgMask = Buffer.from(`
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" />
    </svg>
  `);

  const rounded = await sharp(resized)
    .composite([{ input: svgMask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const totalSize = size + borderSize * 2;

  const finalSvg = Buffer.from(`
    <svg width="${totalSize}" height="${totalSize}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${totalSize}" height="${totalSize}" rx="${radius + borderSize}" ry="${radius + borderSize}" fill="white" />
    </svg>
  `);

  const final = await sharp(finalSvg)
    .composite([{ input: rounded, top: borderSize, left: borderSize }])
    .png()
    .toBuffer();

  await fs.writeFile(logoPath, final);
  console.log(`Logo updated: ${totalSize}x${totalSize}, radius=${radius + borderSize}, white border`);
}

updateLogo().catch(console.error);
