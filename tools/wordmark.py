"""Outline the "Naughty Bean Consulting" wordmark from Codec Pro into SVG paths.

The site never ships the font file: the name is drawn as paths, shaped by HarfBuzz so
the font's kerning is kept. Output feeds layouts/_partials/wordmark-stack.html.

    pip install fonttools uharfbuzz
    python tools/wordmark.py ~/Library/Fonts/CodecPro-Regular.ttf "Naughty Bean" "Consulting" > stack.svg
    python tools/wordmark.py ~/Library/Fonts/CodecPro-Regular.ttf "Naughty Bean Consulting" > line.svg

Each argument after the font is one line, stacked left-aligned. Units: 1 em = 1000.
"""
import argparse
import re
import sys

import uharfbuzz as hb
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ap = argparse.ArgumentParser()
ap.add_argument("font")
ap.add_argument("lines", nargs="+")
ap.add_argument("--gap", type=float, default=0.12,
                help="space between a line's lowest ink and the next line's cap height, in em")
args = ap.parse_args()

hb_font = hb.Font(hb.Face(hb.Blob.from_file_path(args.font)))
tt = TTFont(args.font)
glyphs = tt.getGlyphSet()
order = tt.getGlyphOrder()
scale = 1000 / tt["head"].unitsPerEm
cap = (tt["OS/2"].sCapHeight or tt["hhea"].ascent) * scale


def draw(text, baseline, x=0.0):
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(hb_font, buf, {"kern": True, "liga": True})
    pen, bounds = SVGPathPen(glyphs), BoundsPen(glyphs)
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        glyph = glyphs[order[info.codepoint]]
        # font units are y-up; SVG is y-down
        t = (scale, 0, 0, -scale, x + pos.x_offset * scale, baseline - pos.y_offset * scale)
        glyph.draw(TransformPen(pen, t))
        glyph.draw(TransformPen(bounds, t))
        x += pos.x_advance * scale
    return pen.getCommands(), bounds.bounds


paths, box = [], None
baseline = cap  # first line's cap height sits at y = 0
for line in args.lines:
    d, b = draw(line, baseline)
    if box is not None and abs(b[0] - box[0]) > 0.01:
        # flush-left on the ink, not the sidebearing ("C" sits further left than "N")
        d, b = draw(line, baseline, x=box[0] - b[0])
    paths.append(d)
    box = b if box is None else (min(box[0], b[0]), min(box[1], b[1]), max(box[2], b[2]), max(box[3], b[3]))
    baseline = box[3] + args.gap * 1000 + cap

minx, miny, maxx, maxy = box
svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{minx:.0f} {miny:.0f} {maxx - minx:.0f} {maxy - miny:.0f}">\n'
svg += "\n".join(f'<path d="{d}"/>' for d in paths) + "\n</svg>\n"
svg = re.sub(r"-?\d+\.\d+", lambda m: f"{float(m.group()):.1f}".rstrip("0").rstrip("."), svg)
sys.stdout.write(svg)
print(f"aspect-ratio: {maxx - minx:.0f} / {maxy - miny:.0f}", file=sys.stderr)
