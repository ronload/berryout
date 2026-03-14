import sharp from "sharp";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const svgBuffer = readFileSync(resolve(root, "public/icon.svg"));

const sizes = [
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
];

for (const { name, size } of sizes) {
  // Re-render SVG at target size with a filled background for touch icons
  const resizedSvg = Buffer.from(
    svgBuffer
      .toString("utf-8")
      .replace(/width="24"/, `width="${size}"`)
      .replace(/height="24"/, `height="${size}"`)
      .replace('stroke="currentColor"', 'stroke="#ffffff"'),
  );

  await sharp(resizedSvg)
    .resize(size, size)
    .flatten({ background: "#0a0a0a" })
    .png()
    .toFile(resolve(root, "public", name));

  console.log(`Generated ${name} (${size}x${size})`);
}
