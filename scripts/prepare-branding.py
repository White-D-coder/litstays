"""Prepare web logos and icons from the owner's transparent PNG exports.

Requires Pillow. Original exports are preserved; only transparent padding is
removed. The favicon symbol comes from Artboard 2 copy.png, without its text.
"""

import base64
import io
import json
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
EXPORTS = PUBLIC / "Logo Exports" / "PNGS"
BRAND = PUBLIC / "brand"
BRAND.mkdir(exist_ok=True)

variants = {
    "ink": "Artboard 1 copy.png",
    "light": "Artboard 2 copy 3.png",
    "sand": "Artboard 2 copy 2.png",
    "forest": "Artboard 3 copy 2.png",
}
for name, filename in variants.items():
    image = Image.open(EXPORTS / filename).convert("RGBA")
    image.crop(image.getchannel("A").getbbox()).save(BRAND / f"logo-{name}.png", optimize=True)

source = Image.open(EXPORTS / "Artboard 2 copy.png").convert("RGBA")
alpha = source.getchannel("A")
top = alpha.getbbox()[1]
bottom = next(y for y in range(top, source.height) if not alpha.crop((0, y, source.width, y + 1)).getbbox())
symbol = source.crop((0, top, source.width, bottom))
symbol = symbol.crop(symbol.getchannel("A").getbbox())
symbol.save(BRAND / "mark.png", optimize=True)


def icon(size):
    canvas = Image.new("RGBA", (size, size), "#2C3B28")
    mark = symbol.copy()
    mark.thumbnail((round(size * .76), round(size * .82)), Image.Resampling.LANCZOS)
    canvas.alpha_composite(mark, ((size - mark.width) // 2, (size - mark.height) // 2))
    return canvas


for size in (16, 32):
    icon(size).save(PUBLIC / f"favicon-{size}x{size}.png", optimize=True)
for size in (192, 512):
    icon(size).save(PUBLIC / f"icon-{size}.png", optimize=True)
icon(180).save(PUBLIC / "apple-touch-icon.png", optimize=True)
icon(256).save(PUBLIC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

# Keep the previous icon URL accurate for bookmarks that still request it.
encoded = io.BytesIO()
symbol.save(encoded, format="PNG", optimize=True)
data = base64.b64encode(encoded.getvalue()).decode("ascii")
width, height = symbol.size
display_height = 52
display_width = display_height * width / height
(PUBLIC / "icon.svg").write_text(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
    '<rect width="64" height="64" rx="12" fill="#2C3B28"/>'
    f'<image x="{(64 - display_width) / 2:.3f}" y="6" width="{display_width:.3f}" height="52" '
    f'href="data:image/png;base64,{data}"/></svg>\n'
)
(PUBLIC / "site.webmanifest").write_text(json.dumps({
    "name": "The Lit Stays",
    "short_name": "Lit Stays",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#F7F1E2",
    "theme_color": "#2C3B28",
    "icons": [
        {"src": f"/icon-{size}.png", "sizes": f"{size}x{size}", "type": "image/png", "purpose": "any"}
        for size in (192, 512)
    ],
}, indent=2) + "\n")
print(f"Prepared 4 logo variants, {width}×{height} brand mark, favicons and mobile icons.")
