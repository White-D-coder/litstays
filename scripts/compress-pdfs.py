"""Compress the four supplied PDFs without rasterising their text or vectors.

Requires the same PyMuPDF/Pillow tools as prepare-brochures.py. Writes candidates
to the specified directory; source PDFs and flipbook previews stay untouched.
Usage: python3 scripts/compress-pdfs.py /tmp/lit-compressed-pdfs
"""
import hashlib
import io
import json
import sys
from pathlib import Path

import fitz
from PIL import Image, ImageChops, ImageStat

ROOT = Path(__file__).resolve().parents[1]
FILES = ['Avante.pdf', 'Archway.pdf', 'Villa Aurania.pdf', 'TLS - Food Package.pdf']


def compress(filename, destination):
    source = ROOT / 'public' / filename
    target = destination / filename
    if target.resolve() == source.resolve():
        raise ValueError('Output must differ from the original PDF path.')
    document = fitz.open(source)
    seen = set()
    replaced = 0
    for page in document:
        for info in page.get_images(full=True):
            xref, mask = info[:2]
            if xref in seen:
                continue
            seen.add(xref)
            image = document.extract_image(xref)
            # Preserve transparency and small graphics; retain CMYK colour space.
            if mask or image['colorspace'] not in (1, 3, 4) or min(image['width'], image['height']) < 600:
                continue
            with Image.open(io.BytesIO(image['image'])) as photo:
                if photo.getcolors(maxcolors=257) is not None:
                    continue
                photo = photo.convert('CMYK' if photo.mode == 'CMYK' else 'RGB')
                photo.thumbnail((2000, 2000), Image.Resampling.LANCZOS)
                buffer = io.BytesIO()
                photo.save(buffer, format='JPEG', quality=88, optimize=True, subsampling=0)
            candidate = buffer.getvalue()
            if len(candidate) < len(image['image']) * .85:
                page.replace_image(xref, stream=candidate)
                replaced += 1
    document.save(target, garbage=4, deflate=True, deflate_images=True, deflate_fonts=True, use_objstms=1)
    document.close()
    with fitz.open(source) as before, fitz.open(target) as after:
        assert len(before) == len(after), filename
        # Object streams can raise the PDF container version; document metadata stays.
        assert {k: v for k, v in before.metadata.items() if k != 'format'} == {k: v for k, v in after.metadata.items() if k != 'format'}, filename
        assert before.get_toc() == after.get_toc(), filename
        worst_difference = 0
        for old, new in zip(before, after):
            assert old.rect == new.rect, (filename, old.number)
            # Font object numbers can change during deduplication. Compare actual
            # words and their positions rather than internal object identifiers.
            assert old.get_text() == new.get_text(), (filename, old.number)
            assert old.get_text('words') == new.get_text('words'), (filename, old.number)
            assert old.get_links() == new.get_links(), (filename, old.number)
            original = old.get_pixmap(colorspace=fitz.csRGB)
            optimized = new.get_pixmap(colorspace=fitz.csRGB)
            a = Image.frombytes('RGB', (original.width, original.height), original.samples)
            b = Image.frombytes('RGB', (optimized.width, optimized.height), optimized.samples)
            difference = sum(ImageStat.Stat(ImageChops.difference(a, b)).mean) / 3
            worst_difference = max(worst_difference, difference)
        # Catch missing images, broken transforms and major colour changes.
        assert worst_difference < 3, (filename, worst_difference)
    if target.stat().st_size >= source.stat().st_size:
        raise ValueError(f'Compression did not reduce {filename}')
    return {
        'file': filename, 'before_bytes': source.stat().st_size,
        'after_bytes': target.stat().st_size, 'pages': len(fitz.open(target)),
        'recompressed_photos': replaced,
        'max_page_mean_pixel_difference_out_of_255': round(worst_difference, 4),
        'original_sha256': hashlib.sha256(source.read_bytes()).hexdigest(),
        'compressed_sha256': hashlib.sha256(target.read_bytes()).hexdigest(),
    }


if __name__ == '__main__':
    destination = Path(sys.argv[1])
    destination.mkdir(parents=True, exist_ok=True)
    results = [compress(filename, destination) for filename in FILES]
    report = json.dumps(results, indent=2) + '\n'
    (destination / 'validation.json').write_text(report)
    print(report)
