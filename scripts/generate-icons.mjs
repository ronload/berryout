import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const svgBuffer = readFileSync(resolve(root, "public/icon.svg"));

const padding = 0.2; // 20% padding on each side, icon occupies 60%
const widthAttribute = /width="24"/;
const heightAttribute = /height="24"/;

const sizes = [
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
];

async function generateIcon({ name, size }) {
  const iconSize = Math.round(size * (1 - padding * 2));

  const resizedSvg = Buffer.from(
    svgBuffer
      .toString("utf-8")
      .replace(widthAttribute, `width="${iconSize}"`)
      .replace(heightAttribute, `height="${iconSize}"`)
      .replace('stroke="currentColor"', 'stroke="#ffffff"'),
  );

  const iconBuffer = await sharp(resizedSvg).resize(iconSize, iconSize).png().toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: "#0a0a0a",
    },
  })
    .composite([{ input: iconBuffer, gravity: "centre" }])
    .png()
    .toFile(resolve(root, "public", name));

  // biome-ignore lint/suspicious/noConsole: this CLI script reports each generated file on the terminal
  console.log(`Generated ${name} (${size}x${size}, icon ${iconSize}x${iconSize})`);
}

await Promise.all(sizes.map(generateIcon));
