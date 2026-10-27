import sharp from 'sharp';
import { readFile, mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';

const sources = JSON.parse(await readFile(new URL('./image-sources.json', import.meta.url), 'utf8'));
const directory = path.resolve('public/images');
const originals = process.env.LITSTAYS_ORIGINALS || '/tmp/litstays-originals';
await mkdir(directory, { recursive: true });

for (const [name, url] of Object.entries(sources)) {
  const original = path.join(originals, `${name}.jpg`);
  let input;
  try { await access(original); input = await readFile(original); }
  catch {
    const response = await fetch(`${url}?im_w=1920`, { signal: AbortSignal.timeout(45000) });
    if (!response.ok) throw new Error(`Image download failed: ${name} (${response.status})`);
    input = Buffer.from(await response.arrayBuffer());
  }
  await Promise.all([480, 960, 1440, 1920].map(width => sharp(input).rotate().resize({ width }).webp({ quality: name === 'aerial' ? 76 : 68, effort: 6 }).toFile(path.join(directory, `${name}-${width}.webp`))));
  if (name === 'aerial') await Promise.all([480, 960, 1440, 1920].map(width => sharp(input).rotate().resize({ width, height: Math.round(width * 16 / 9), fit: 'cover', position: 'centre' }).webp({ quality: 72, effort: 6 }).toFile(path.join(directory, `aerial-mobile-${width}.webp`))));
  console.log(`Prepared ${name}: 4 responsive WebP sizes`);
}
const icon = await readFile('public/icon.svg');
await sharp(icon).resize(180, 180).png().toFile('public/apple-touch-icon.png');
await writeFile('public/images/README.txt', 'Photography: Villa Archway by The Lit Stays. Source URLs and provenance are documented in scripts/image-sources.json and README.md.\n');
