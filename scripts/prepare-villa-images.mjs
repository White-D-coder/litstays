import sharp from 'sharp';
import { mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const collection = process.argv[2];
if (!['aurania', 'archway'].includes(collection)) throw new Error('Use: node scripts/prepare-villa-images.mjs aurania|archway');
const source = path.resolve('public', collection);
const destination = path.join(source, 'optimized');
const sizes = [480, 960, 1440, 1920];
// Aurania's three HEIC files show property maintenance rather than guest
// spaces; preserve them outside the guest gallery. Archway's (1) files are
// byte-for-byte duplicates of the corresponding drone photographs.
const files = (await readdir(source)).filter(file => /\.(jpe?g)$/i.test(file) && !/\(1\)/.test(file));
await mkdir(destination, { recursive: true });
sharp.concurrency(2);

let totalBytes = 0;
for (const file of files) {
  const number = file.match(/(?:IMG_|May26-)(\d+)/i)?.[1];
  const id = file.startsWith('Lit Stays') ? `aerial-${number}` : number;
  const original = path.join(source, file);
  const modified = (await stat(original)).mtimeMs;
  for (const width of sizes) {
    const output = path.join(destination, `${collection}-${id}-${width}.webp`);
    const existing = await stat(output).catch(() => null);
    if (existing && existing.mtimeMs >= modified) { totalBytes += existing.size; continue; }
    const result = await sharp(original).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 80, effort: 4 }).toFile(output);
    totalBytes += result.size;
  }
}
console.log(`Prepared ${files.length} ${collection} photos in ${sizes.length} sizes (${(totalBytes / 1048576).toFixed(1)} MB). Originals preserved.`);
