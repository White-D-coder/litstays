"""Render the supplied villa PDFs for the on-page scrapbook.

Requires PyMuPDF and Pillow. Originals remain untouched; full PDFs are still
available to view and download. Only the displayed pages load in the browser.
"""
from pathlib import Path

import fitz
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
WIDTH = 1200
SOURCES = {
    'avante': 'Avante.pdf',
    'aurania': 'Villa Aurania.pdf',
    'archway': 'Archway.pdf',
}

for slug, filename in SOURCES.items():
    source = ROOT / 'public' / filename
    destination = ROOT / 'public' / 'brochures' / slug
    destination.mkdir(parents=True, exist_ok=True)
    with fitz.open(source) as document:
        for number, page in enumerate(document, start=1):
            output = destination / f'page-{number:02d}.webp'
            if output.exists() and output.stat().st_mtime >= source.stat().st_mtime:
                continue
            scale = WIDTH / page.rect.width
            pixels = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False)
            Image.frombytes('RGB', (pixels.width, pixels.height), pixels.samples).save(
                output, 'WEBP', quality=84, method=4
            )
        size = sum(file.stat().st_size for file in destination.glob('page-*.webp'))
        print(f'{slug}: {len(document)} pages, {size / 1048576:.1f} MB. Original PDF preserved.', flush=True)
