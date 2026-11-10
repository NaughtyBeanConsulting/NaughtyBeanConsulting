"""Build the favicon pack and logo files from the master logo.

    python3 tools/icons.py            # needs Pillow; run from the repo root

Source: static/img/Naughty_Bean_Consulting_Logo-removebg.png (1024x1024, transparent).
Writes the favicon / touch / Android / maskable icons to static/ (served from the site
root, which is where browsers look for /favicon.ico) and the logo to static/img/.
"""
from PIL import Image

SRC = "static/img/Naughty_Bean_Consulting_Logo-removebg.png"
PAPER = (241, 237, 227, 255)  # --paper, #f1ede3

im = Image.open(SRC).convert("RGBA")
r, g, b, a = im.split()
a = a.point(lambda v: 0 if v <= 1 else v)  # background-removal leaves alpha=1 haze everywhere
im = Image.merge("RGBA", (r, g, b, a))
art = im.crop(a.getbbox())
side = max(art.size)
square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
square.paste(art, ((side - art.width) // 2, (side - art.height) // 2))


def fit(size, scale=1.0, bg=None):
    """The logo at `scale` of a size x size canvas, centred, on `bg` (transparent if None)."""
    canvas = Image.new("RGBA", (size, size), bg or (0, 0, 0, 0))
    inner = round(size * scale)
    logo = square.resize((inner, inner), Image.LANCZOS)
    canvas.alpha_composite(logo, ((size - inner) // 2, (size - inner) // 2))
    return canvas


outputs = {
    "static/favicon-16x16.png": fit(16),
    "static/favicon-32x32.png": fit(32),
    "static/favicon-96x96.png": fit(96),
    # iOS paints transparency black, so the touch icon gets the paper background
    "static/apple-touch-icon.png": fit(180, 0.82, PAPER).convert("RGB"),
    "static/android-chrome-192x192.png": fit(192, 0.96),
    "static/android-chrome-512x512.png": fit(512, 0.96),
    # maskable: keep the art inside the 80% safe circle
    "static/maskable-icon-192x192.png": fit(192, 0.72, PAPER).convert("RGB"),
    "static/maskable-icon-512x512.png": fit(512, 0.72, PAPER).convert("RGB"),
    "static/img/logo.png": fit(512),
}
for path, img in outputs.items():
    img.save(path, optimize=True)
fit(48).save("static/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
fit(128).save("static/img/logo-128.webp", quality=90, method=6)
print("wrote", len(outputs) + 2, "files")
