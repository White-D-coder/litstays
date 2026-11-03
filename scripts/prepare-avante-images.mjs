import sharp from 'sharp';
import { mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const source = path.resolve('public/avante');
const destination = path.join(source, 'optimized');
const sizes = [480, 960, 1440, 1920];
const files = (await readdir(source)).filter(file => /^Avante_CAM_May26-\d+\.JPEG$/i.test(file));
await mkdir(destination, { recursive: true });
sharp.concurrency(2);

let totalBytes = 0;
for (const file of files) {
  const number = file.match(/-(\d+)\.JPEG$/i)[1];
  const original = path.join(source, file);
  const modified = (await stat(original)).mtimeMs;
  for (const width of sizes) {
    const output = path.join(destination, `avante-${number}-${width}.webp`);
    const existing = await stat(output).catch(() => null);
    if (existing && existing.mtimeMs >= modified) { totalBytes += existing.size; continue; }
    const result = await sharp(original).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 80, effort: 4 }).toFile(output);
    totalBytes += result.size;
  }
}
console.log(`Prepared ${files.length} Avante photos in ${sizes.length} sizes (${(totalBytes / 1048576).toFixed(1)} MB). Originals preserved.`);
