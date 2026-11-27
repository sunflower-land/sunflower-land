#!/usr/bin/env python3
"""Deterministic Vietnamese + UI punctuation localization builder for public/fonts/Hint.ttf.

Rebuilds TrueType Hint.ttf from the pristine 322 original m5x7 glyphs (byte/contour-identical)
plus 94 missing precomposed NFC Vietnamese glyphs and 6 aligned UI punctuation/currency glyphs.

Usage:
    python scripts/build_hint_vn.py
    python scripts/build_hint_vn.py --check
    python scripts/build_hint_vn.py --specimen path/to/specimen.png
"""

from __future__ import annotations

import argparse
import io
import sys
import urllib.request
from pathlib import Path

from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont

UNIT = 64
MIN_PY = -2
MAX_PY = 9  # Pixel [py, py + 1] spans up to (9 + 1) * 64 = 640 units.
BASE_GLYPH_COUNT = 322

REPO_ROOT = Path(__file__).resolve().parent.parent
BASE_FONT_PATH = REPO_ROOT / "scripts" / "Hint_base.ttf"
OUT_FONT_PATH = REPO_ROOT / "public" / "fonts" / "Hint.ttf"
BASE_FONT_URL = "https://sunflower-land.com/testnet-assets/fonts/Hint.ttf"

EXPECTED_HHEA = (682, -128, 92)
EXPECTED_TYPO = (768, -256, 92)
EXPECTED_WIN = (682, 128)

VN_LOWER = "àáảãạăằắẳẵặâầấẩẫậđèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ"
VN_ALL = VN_LOWER + VN_LOWER.upper()
UI_PUNCT = "\u2022\u2013\u2014\u2026\u2192\u20ab"  # • – — … → ₫


def pattern_to_pixels(rows_top_down: list[str], bottom_y: int = 0, left_x: int = 0) -> set[tuple[int, int]]:
    """Convert ASCII-art pixel rows (top row first) into integer (x, y) font-pixel coordinates."""
    pixels: set[tuple[int, int]] = set()
    height = len(rows_top_down)
    for row_idx, row in enumerate(rows_top_down):
        py = bottom_y + (height - 1 - row_idx)
        for col_idx, ch in enumerate(row):
            if ch == "#":
                pixels.add((left_x + col_idx, py))
    return pixels


def rasterize_glyph(glyf_table: object, glyph: object) -> set[tuple[int, int]]:
    """Scanline-rasterize an orthogonal 64-unit TrueType glyph into integer (x, y) pixel coordinates."""
    if glyph.numberOfContours <= 0:
        return set()
    coords, end_pts, _ = glyph.getCoordinates(glyf_table)
    edges: list[tuple[int, int, int, int]] = []
    start = 0
    for end in end_pts:
        pts = [(coords[i][0] // UNIT, coords[i][1] // UNIT) for i in range(start, end + 1)]
        count = len(pts)
        for i in range(count):
            x1, y1 = pts[i]
            x2, y2 = pts[(i + 1) % count]
            if y1 != y2:
                edges.append((x1, y1, x2, y2))
        start = end + 1
    ys = [p[1] // UNIT for p in coords]
    pixels: set[tuple[int, int]] = set()
    for py in range(min(ys), max(ys)):
        yc = py + 0.5
        crossings = sorted(
            x1 + (yc - y1) * (x2 - x1) / (y2 - y1)
            for x1, y1, x2, y2 in edges
            if (y1 <= yc < y2) or (y2 <= yc < y1)
        )
        for idx in range(0, len(crossings), 2):
            if idx + 1 < len(crossings):
                xa = int(round(crossings[idx]))
                xb = int(round(crossings[idx + 1]))
                for px in range(xa, xb):
                    pixels.add((px, py))
    return pixels


def pixels_to_contours(pixels: set[tuple[int, int]]) -> list[list[tuple[int, int]]]:
    """Convert a pixel set into merged, non-overlapping orthogonal contours in TrueType CW winding."""
    if not pixels:
        return []
    for _, py in pixels:
        if not (MIN_PY <= py <= MAX_PY):
            raise ValueError(f"Pixel y={py} outside allowed grid bounds [{MIN_PY}, {MAX_PY}]")

    edge_counts: dict[tuple[tuple[int, int], tuple[int, int]], int] = {}
    for px, py in pixels:
        quad = [
            ((px, py), (px, py + 1)),
            ((px, py + 1), (px + 1, py + 1)),
            ((px + 1, py + 1), (px + 1, py)),
            ((px + 1, py), (px, py)),
        ]
        for u, v in quad:
            rev = (v, u)
            if edge_counts.get(rev, 0) > 0:
                edge_counts[rev] -= 1
                if edge_counts[rev] == 0:
                    del edge_counts[rev]
            else:
                edge_counts[(u, v)] = edge_counts.get((u, v), 0) + 1

    outgoing: dict[tuple[int, int], list[tuple[int, int]]] = {}
    for (u, v), count in sorted(edge_counts.items()):
        for _ in range(count):
            outgoing.setdefault(u, []).append(v)

    def pick_next(prev: tuple[int, int], curr: tuple[int, int]) -> tuple[int, int]:
        candidates = outgoing[curr]
        if len(candidates) == 1:
            return candidates.pop(0)
        dx, dy = curr[0] - prev[0], curr[1] - prev[1]
        preferred = [(dy, -dx), (dx, dy), (-dy, dx), (-dx, -dy)]
        for ndx, ndy in preferred:
            nxt = (curr[0] + ndx, curr[1] + ndy)
            if nxt in candidates:
                candidates.remove(nxt)
                return nxt
        return candidates.pop(0)

    raw_loops: list[list[tuple[int, int]]] = []
    for start in sorted(outgoing.keys()):
        while outgoing.get(start):
            nxt = outgoing[start].pop(0)
            loop = [start]
            prev, curr = start, nxt
            while curr != start:
                loop.append(curr)
                nxt = pick_next(prev, curr)
                prev, curr = curr, nxt
            raw_loops.append(loop)

    simplified: list[list[tuple[int, int]]] = []
    for loop in raw_loops:
        n = len(loop)
        pts: list[tuple[int, int]] = []
        for i in range(n):
            p0 = loop[(i - 1) % n]
            p1 = loop[i]
            p2 = loop[(i + 1) % n]
            cross = (p1[0] - p0[0]) * (p2[1] - p1[1]) - (p1[1] - p0[1]) * (p2[0] - p1[0])
            if cross != 0:
                pts.append(p1)
        if len(pts) >= 4:
            simplified.append(pts)
    return simplified


def contour_signed_area(pts: list[tuple[int, int]]) -> int:
    """Twice the signed area of a closed polygon (>0 CCW, <0 CW)."""
    n = len(pts)
    return sum(pts[i][0] * pts[(i + 1) % n][1] - pts[(i + 1) % n][0] * pts[i][1] for i in range(n))


def build_tt_glyph(pixels: set[tuple[int, int]], glyf_table: object) -> object:
    """Build a TrueType glyf entry from an integer pixel set and verify lossless round-trip."""
    contours = pixels_to_contours(pixels)
    pen = TTGlyphPen(None)
    for loop in contours:
        pen.moveTo((loop[0][0] * UNIT, loop[0][1] * UNIT))
        for x, y in loop[1:]:
            pen.lineTo((x * UNIT, y * UNIT))
        pen.closePath()
    glyph = pen.glyph()
    glyph.recalcBounds(glyf_table)

    if glyph.numberOfContours > 0:
        coords, _, _ = glyph.getCoordinates(glyf_table)
        for x, y in coords:
            if x % UNIT != 0 or y % UNIT != 0:
                raise AssertionError(f"Non-grid coordinate ({x}, {y})")
    round_trip = rasterize_glyph(glyf_table, glyph)
    if round_trip != pixels:
        raise AssertionError(f"Contour round-trip mismatch: expected {sorted(pixels)}, got {sorted(round_trip)}")
    return glyph


# Compressed 6-px uppercase bases (y = 0..5, leaving y = 6 empty spacer below y = 7..9 marks).
A_SHORT = pattern_to_pixels([".###.", "#...#", "#...#", "#####", "#...#", "#...#"])
E_SHORT = pattern_to_pixels([".####", "#....", "####.", "#....", "#....", ".####"])
I_SHORT = pattern_to_pixels(["#####", "..#..", "..#..", "..#..", "..#..", "#####"])
O_SHORT = pattern_to_pixels([".###.", "#...#", "#...#", "#...#", "#...#", ".###."])
U_SHORT = pattern_to_pixels(["#...#", "#...#", "#...#", "#...#", "#...#", ".###."])
Y_SHORT = pattern_to_pixels(["#...#", "#...#", ".#.#.", "..#..", "..#..", "..#.."])

# Compact y body for ỵ so the dot at y = -2 has a clean 1-px gap at y = -1.
Y_COMPACT = pattern_to_pixels(["#...#", "#...#", ".#.#.", "..#..", ".#..."])


def shift_x(pixels: PixelSet, dx: int) -> PixelSet:
    return {(x + dx, y) for x, y in pixels}

# Lowercase single-row / 2-row marks (y = 6..8, matching existing m5x7 accents).
MARK_LOWER_GRAVE = pattern_to_pixels([".#...", "..#.."], bottom_y=6)
MARK_LOWER_ACUTE = pattern_to_pixels(["...#.", "..#.."], bottom_y=6)
MARK_LOWER_TILDE = pattern_to_pixels(["..#.#", ".#.#."], bottom_y=6)
MARK_LOWER_HOOK = pattern_to_pixels([".##..", "...#.", "..#.."], bottom_y=6)

# Left-shifted lowercase tones for horned vowels ơ / ư (clear of horn at x = 5).
MARK_HORN_LOWER_GRAVE = pattern_to_pixels([".#...", "..#.."], bottom_y=6)
MARK_HORN_LOWER_ACUTE = pattern_to_pixels(["...#.", "..#.."], bottom_y=6)
MARK_HORN_LOWER_TILDE = pattern_to_pixels([".#.#.", "#.#.."], bottom_y=6)
MARK_HORN_LOWER_HOOK = pattern_to_pixels([".##..", "...#.", "..#.."], bottom_y=6)

# Uppercase marks (y = 8..9 on normal 7-px caps; y = 7..9 on 6-px compressed caps).
MARK_UPPER_GRAVE = pattern_to_pixels([".#...", "..#.."], bottom_y=8)
MARK_UPPER_ACUTE = pattern_to_pixels(["...#.", "..#.."], bottom_y=8)
MARK_UPPER_TILDE = pattern_to_pixels(["..#.#", ".#.#."], bottom_y=8)
MARK_HORN_UPPER_TILDE = pattern_to_pixels([".#.#.", "#.#.."], bottom_y=8)
MARK_UPPER_HOOK_SHORT = pattern_to_pixels([".##..", "...#.", "..#.."], bottom_y=7)

# Centered lowercase circumflex + breve matching native m5x7 positions (x = 1..3).
LC_CIRC_CENTER: PixelSet = {(1, 6), (2, 7), (3, 6)}
LC_BREVE_CENTER: PixelSet = {(1, 7), (2, 6), (3, 7)}

# Stacked lowercase circumflex + tone (y = 6..9, leaving y = 5 empty).
STACK_LC_CIRC_GRAVE = LC_CIRC_CENTER | {(0, 9), (1, 8)}
STACK_LC_CIRC_ACUTE = LC_CIRC_CENTER | {(4, 9), (3, 8)}
STACK_LC_CIRC_HOOK = LC_CIRC_CENTER | {(2, 9), (3, 9), (3, 8)}
STACK_LC_CIRC_TILDE = LC_CIRC_CENTER | {(1, 8), (2, 9), (3, 8), (4, 9)}

# Stacked lowercase breve + tone (y = 6..9, leaving y = 5 empty).
STACK_LC_BREVE_GRAVE = LC_BREVE_CENTER | {(0, 9), (1, 8)}
STACK_LC_BREVE_ACUTE = LC_BREVE_CENTER | {(4, 9), (3, 8)}
STACK_LC_BREVE_HOOK = LC_BREVE_CENTER | {(1, 9), (2, 9), (2, 8)}
STACK_LC_BREVE_TILDE = LC_BREVE_CENTER | {(1, 9), (2, 8), (3, 9), (4, 8)}

# Centered uppercase circumflex + breve over 6-px bases (y = 7..8, leaving y = 6 empty).
UC_CIRC_CENTER: PixelSet = {(1, 7), (2, 8), (3, 7)}
UC_BREVE_CENTER: PixelSet = {(1, 8), (2, 7), (3, 8)}

# Grave variants shift the 5-px body right +1 px so the mark sits cleanly at x = 0..1 while ^ / ˘ stays centered at x = 2..4.
STACK_UC_CIRC_GRAVE = shift_x(UC_CIRC_CENTER, 1) | {(0, 9), (1, 8)}
STACK_UC_CIRC_ACUTE = UC_CIRC_CENTER | {(5, 9), (4, 8)}
STACK_UC_CIRC_HOOK = UC_CIRC_CENTER | {(4, 9), (5, 9), (5, 8)}
STACK_UC_CIRC_TILDE = UC_CIRC_CENTER | {(4, 9), (5, 8), (6, 9)}

STACK_UC_BREVE_GRAVE = shift_x(UC_BREVE_CENTER, 1) | {(0, 9), (1, 8)}
STACK_UC_BREVE_ACUTE = UC_BREVE_CENTER | {(5, 9), (4, 8)}
STACK_UC_BREVE_HOOK = UC_BREVE_CENTER | {(4, 9), (5, 9), (5, 8)}
STACK_UC_BREVE_TILDE = UC_BREVE_CENTER | {(4, 9), (5, 8), (6, 9)}

DOT_BELOW_5 = {(2, -2)}


def generate_glyph_specs(font: TTFont) -> dict[int, tuple[int, set[tuple[int, int]]]]:
    """Build (advance_px, pixel_set) for all 100 new glyphs from the base m5x7 font."""
    cmap = font.getBestCmap()
    glyf = font["glyf"]

    def base(ch: str) -> set[tuple[int, int]]:
        return rasterize_glyph(glyf, glyf[cmap[ord(ch)]])

    a, e, i_ch, o, u, y = base("a"), base("e"), base("i"), base("o"), base("u"), base("y")
    dotless_i = base("\u0131")
    d_croat = base("\u0111")
    abreve, acirc, ecirc, ocirc = base("\u0103"), base("\u00e2"), base("\u00ea"), base("\u00f4")
    A, E, I, O, U, Y = base("A"), base("E"), base("I"), base("O"), base("U"), base("Y")
    Abreve, Acirc, Ecirc, Ocirc = base("\u0102"), base("\u00c2"), base("\u00ca"), base("\u00d4")

    specs: dict[int, tuple[int, set[tuple[int, int]]]] = {}

    def add(ch: str, adv: int, pix: set[tuple[int, int]]) -> None:
        specs[ord(ch)] = (adv, set(pix))

    # --- Lowercase missing simple vowels & dots ---
    add("ả", 6, a | MARK_LOWER_HOOK)
    add("ạ", 6, a | DOT_BELOW_5)
    add("ẻ", 6, e | MARK_LOWER_HOOK)
    add("ẽ", 6, e | MARK_LOWER_TILDE)
    add("ẹ", 6, e | DOT_BELOW_5)
    add("ỉ", 4, dotless_i | pattern_to_pixels(["##..", "..#.", ".#.."], bottom_y=6))
    add("ị", 3, i_ch | {(1, -2)})
    add("ỏ", 6, o | MARK_LOWER_HOOK)
    add("ọ", 6, o | DOT_BELOW_5)
    add("ủ", 6, u | MARK_LOWER_HOOK)
    add("ụ", 6, u | DOT_BELOW_5)
    add("ỳ", 6, y | MARK_LOWER_GRAVE)
    add("ỷ", 6, y | MARK_LOWER_HOOK)
    add("ỹ", 6, y | MARK_LOWER_TILDE)
    add("ỵ", 6, Y_COMPACT | DOT_BELOW_5)

    # --- Uppercase missing simple vowels & dots ---
    add("Ả", 6, A_SHORT | MARK_UPPER_HOOK_SHORT)
    add("Ạ", 6, A | DOT_BELOW_5)
    add("Ẻ", 6, E_SHORT | MARK_UPPER_HOOK_SHORT)
    add("Ẽ", 6, E | MARK_UPPER_TILDE)
    add("Ẹ", 6, E | DOT_BELOW_5)
    add("Ỉ", 6, I_SHORT | MARK_UPPER_HOOK_SHORT)
    add("Ị", 6, I | DOT_BELOW_5)
    add("Ỏ", 6, O_SHORT | MARK_UPPER_HOOK_SHORT)
    add("Ọ", 6, O | DOT_BELOW_5)
    add("Ủ", 6, U_SHORT | MARK_UPPER_HOOK_SHORT)
    add("Ụ", 6, U | DOT_BELOW_5)
    add("Ỳ", 6, Y | MARK_UPPER_GRAVE)
    add("Ỷ", 6, Y_SHORT | MARK_UPPER_HOOK_SHORT)
    add("Ỹ", 6, Y | MARK_UPPER_TILDE)
    add("Ỵ", 6, Y | DOT_BELOW_5)

    # --- Lowercase stacked ă / â / ê / ô ---
    add("ằ", 6, a | STACK_LC_BREVE_GRAVE)
    add("ắ", 6, a | STACK_LC_BREVE_ACUTE)
    add("ẳ", 6, a | STACK_LC_BREVE_HOOK)
    add("ẵ", 6, a | STACK_LC_BREVE_TILDE)
    add("ặ", 6, abreve | DOT_BELOW_5)

    add("ầ", 6, a | STACK_LC_CIRC_GRAVE)
    add("ấ", 6, a | STACK_LC_CIRC_ACUTE)
    add("ẩ", 6, a | STACK_LC_CIRC_HOOK)
    add("ẫ", 6, a | STACK_LC_CIRC_TILDE)
    add("ậ", 6, acirc | DOT_BELOW_5)

    add("ề", 6, e | STACK_LC_CIRC_GRAVE)
    add("ế", 6, e | STACK_LC_CIRC_ACUTE)
    add("ể", 6, e | STACK_LC_CIRC_HOOK)
    add("ễ", 6, e | STACK_LC_CIRC_TILDE)
    add("ệ", 6, ecirc | DOT_BELOW_5)

    add("ồ", 6, o | STACK_LC_CIRC_GRAVE)
    add("ố", 6, o | STACK_LC_CIRC_ACUTE)
    add("ổ", 6, o | STACK_LC_CIRC_HOOK)
    add("ỗ", 6, o | STACK_LC_CIRC_TILDE)
    add("ộ", 6, ocirc | DOT_BELOW_5)

    # --- Uppercase stacked Ă / Â / Ê / Ô (centered ^/˘ with 1 px clearance) ---
    stacked_uc_groups = [
        (("Ằ", "Ắ", "Ẳ", "Ẵ", "Ặ"), A_SHORT, Abreve, True),
        (("Ầ", "Ấ", "Ẩ", "Ẫ", "Ậ"), A_SHORT, Acirc, False),
        (("Ề", "Ế", "Ể", "Ễ", "Ệ"), E_SHORT, Ecirc, False),
        (("Ồ", "Ố", "Ổ", "Ỗ", "Ộ"), O_SHORT, Ocirc, False),
    ]
    for (g_ch, a_ch, h_ch, t_ch, d_ch), short_base, full_circ, is_breve in stacked_uc_groups:
        g_mark = STACK_UC_BREVE_GRAVE if is_breve else STACK_UC_CIRC_GRAVE
        a_mark = STACK_UC_BREVE_ACUTE if is_breve else STACK_UC_CIRC_ACUTE
        h_mark = STACK_UC_BREVE_HOOK if is_breve else STACK_UC_CIRC_HOOK
        t_mark = STACK_UC_BREVE_TILDE if is_breve else STACK_UC_CIRC_TILDE
        add(g_ch, 7, shift_x(short_base, 1) | g_mark)
        add(a_ch, 7, short_base | a_mark)
        add(h_ch, 7, short_base | h_mark)
        add(t_ch, 8, short_base | t_mark)
        add(d_ch, 6, full_circ | DOT_BELOW_5)

    # --- Horned vowels ơ / Ơ / ư / Ư (adv = 7) ---
    o_horn = o | {(5, 3), (5, 4)}
    add("ơ", 7, o_horn)
    add("ờ", 7, o_horn | MARK_HORN_LOWER_GRAVE)
    add("ớ", 7, o_horn | MARK_HORN_LOWER_ACUTE)
    add("ở", 7, o_horn | MARK_HORN_LOWER_HOOK)
    add("ỡ", 7, o_horn | MARK_HORN_LOWER_TILDE)
    add("ợ", 7, o_horn | DOT_BELOW_5)

    u_horn = u | {(5, 4), (5, 5)}
    add("ư", 7, u_horn)
    add("ừ", 7, u_horn | MARK_HORN_LOWER_GRAVE)
    add("ứ", 7, u_horn | MARK_HORN_LOWER_ACUTE)
    add("ử", 7, u_horn | MARK_HORN_LOWER_HOOK)
    add("ữ", 7, u_horn | MARK_HORN_LOWER_TILDE)
    add("ự", 7, u_horn | DOT_BELOW_5)

    O_horn = O | {(5, 5), (5, 6)}
    O_short_horn = O_SHORT | {(5, 4), (5, 5)}
    add("Ơ", 7, O_horn)
    add("Ờ", 7, O_horn | MARK_UPPER_GRAVE)
    add("Ớ", 7, O_horn | MARK_UPPER_ACUTE)
    add("Ở", 7, O_short_horn | MARK_UPPER_HOOK_SHORT)
    add("Ỡ", 7, O_horn | MARK_HORN_UPPER_TILDE)
    add("Ợ", 7, O_horn | DOT_BELOW_5)

    U_horn = U | {(5, 6), (5, 7)}
    U_short_horn = U_SHORT | {(5, 5), (5, 6)}
    add("Ư", 7, U_horn)
    add("Ừ", 7, U_horn | MARK_UPPER_GRAVE)
    add("Ứ", 7, U_horn | MARK_UPPER_ACUTE)
    add("Ử", 7, U_short_horn | MARK_UPPER_HOOK_SHORT)
    add("Ữ", 7, U_horn | MARK_HORN_UPPER_TILDE)
    add("Ự", 7, U_horn | DOT_BELOW_5)

    # --- UI Punctuation & Currency ---
    add("\u2022", 4, pattern_to_pixels(["##", "##"], bottom_y=2, left_x=1))  # •
    add("\u2013", 6, {(x, 3) for x in range(5)})  # –
    add("\u2014", 6, {(x, 3) for x in range(6)})  # —
    add("\u2026", 6, {(0, 0), (2, 0), (4, 0)})  # …
    add("\u2192", 6, pattern_to_pixels(["..#..", "...#.", "#####", "...#.", "..#.."], bottom_y=1))  # →
    add("\u20ab", 7, d_croat | {(x, -2) for x in range(5)})  # ₫

    return specs


def glyph_name_for(cp: int) -> str:
    return f"uni{cp:04X}"


def ensure_base_font() -> bytes:
    """Load the pristine 322-glyph Hint_base.ttf, fetching from upstream CDN if absent."""
    if not BASE_FONT_PATH.is_file():
        BASE_FONT_PATH.parent.mkdir(parents=True, exist_ok=True)
        with urllib.request.urlopen(BASE_FONT_URL, timeout=30) as resp:
            BASE_FONT_PATH.write_bytes(resp.read())
    return BASE_FONT_PATH.read_bytes()


def build_font_bytes() -> tuple[bytes, set[int]]:
    """Compile Vietnamese Hint.ttf deterministically from Hint_base.ttf."""
    base_bytes = ensure_base_font()
    font = TTFont(io.BytesIO(base_bytes), recalcBBoxes=True, recalcTimestamp=False)
    base_order = font.getGlyphOrder()
    if len(base_order) != BASE_GLYPH_COUNT:
        raise AssertionError(f"Expected {BASE_GLYPH_COUNT} base glyphs in Hint_base.ttf, got {len(base_order)}")

    glyf = font["glyf"]
    hmtx = font["hmtx"]

    orig_snapshot: dict[str, tuple[tuple[int, int], int, object]] = {}
    for gname in base_order:
        gl = glyf[gname]
        coords = gl.getCoordinates(glyf) if gl.numberOfContours > 0 else None
        orig_snapshot[gname] = (hmtx[gname], gl.numberOfContours, coords)

    specs = generate_glyph_specs(font)
    existing_cps = set(font.getBestCmap().keys())
    specs = {cp: val for cp, val in specs.items() if cp not in existing_cps}
    if len(specs) != 100:
        raise AssertionError(f"Expected 100 new glyphs, got {len(specs)}")

    new_order = list(base_order)
    for cp in sorted(specs.keys()):
        adv_px, pix = specs[cp]
        gname = glyph_name_for(cp)
        glyph = build_tt_glyph(pix, glyf)
        glyf[gname] = glyph
        lsb = glyph.xMin if glyph.numberOfContours > 0 else 0
        hmtx[gname] = (adv_px * UNIT, lsb)
        new_order.append(gname)

        for table in font["cmap"].tables:
            if (table.platformID, table.platEncID) in ((0, 3), (3, 1)):
                table.cmap[cp] = gname

    font.setGlyphOrder(new_order)

    for gname, (orig_hmtx, orig_nc, orig_coords) in orig_snapshot.items():
        if hmtx[gname] != orig_hmtx:
            raise AssertionError(f"Original hmtx modified for {gname}")
        gl = glyf[gname]
        if gl.numberOfContours != orig_nc:
            raise AssertionError(f"Original contour count modified for {gname}")
        if orig_nc > 0 and gl.getCoordinates(glyf) != orig_coords:
            raise AssertionError(f"Original coordinates modified for {gname}")

    font["OS/2"].recalcUnicodeRanges(font)

    name_table = font["name"]
    license_entries = {
        9: "Daniel Linssen (managore); Vietnamese glyph extensions",
        13: "Creative Commons Zero v1.0 Universal (CC0 1.0 Public Domain) - base font m5x7 by Daniel Linssen, extended with Vietnamese glyphs",
        14: "https://creativecommons.org/publicdomain/zero/1.0/",
    }
    for name_id, text in license_entries.items():
        name_table.setName(text, name_id, 3, 1, 0x0409)
        name_table.setName(text, name_id, 1, 0, 0)

    hhea = font["hhea"]
    os2 = font["OS/2"]
    if (hhea.ascent, hhea.descent, hhea.lineGap) != EXPECTED_HHEA:
        raise AssertionError(f"hhea mismatch: {(hhea.ascent, hhea.descent, hhea.lineGap)}")
    if (os2.sTypoAscender, os2.sTypoDescender, os2.sTypoLineGap) != EXPECTED_TYPO:
        raise AssertionError(f"OS/2 typo mismatch: {(os2.sTypoAscender, os2.sTypoDescender, os2.sTypoLineGap)}")
    if (os2.usWinAscent, os2.usWinDescent) != EXPECTED_WIN:
        raise AssertionError(f"OS/2 win mismatch: {(os2.usWinAscent, os2.usWinDescent)}")

    buf = io.BytesIO()
    font.save(buf)
    return buf.getvalue(), set(specs.keys())


def verify_built_font(data: bytes, expected_new: set[int]) -> None:
    """Verify all invariants on serialized TTF bytes."""
    font = TTFont(io.BytesIO(data))
    order = font.getGlyphOrder()
    if len(order) != BASE_GLYPH_COUNT + 100:
        raise AssertionError(f"public/fonts/Hint.ttf glyph count {len(order)} != {BASE_GLYPH_COUNT + 100}")

    cmap_3_1 = next(t.cmap for t in font["cmap"].tables if (t.platformID, t.platEncID) == (3, 1))
    cmap_0_3 = next(t.cmap for t in font["cmap"].tables if (t.platformID, t.platEncID) == (0, 3))
    for ch in VN_ALL + UI_PUNCT:
        cp = ord(ch)
        if cp not in cmap_3_1 or cp not in cmap_0_3:
            raise AssertionError(f"Missing U+{cp:04X} ({ch}) in Unicode cmap")
        if cmap_3_1[cp] != cmap_0_3[cp]:
            raise AssertionError(f"cmap mismatch for U+{cp:04X}")

    glyf = font["glyf"]
    hmtx = font["hmtx"]
    generated_names = {glyph_name_for(cp) for cp in expected_new}
    for gname in order[1:]:
        adv, lsb = hmtx[gname]
        if gname in generated_names and (adv % UNIT != 0 or lsb % UNIT != 0):
            raise AssertionError(f"Non-64 hmtx on {gname}: {(adv, lsb)}")
        gl = glyf[gname]
        if gl.numberOfContours > 0:
            if gl.yMin < MIN_PY * UNIT or gl.yMax > (MAX_PY + 1) * UNIT:
                raise AssertionError(f"{gname} bounds y=[{gl.yMin}, {gl.yMax}] exceed [-128, 640]")
            if gname in generated_names:
                coords, end_pts, _ = gl.getCoordinates(glyf)
                for x, y in coords:
                    if x % UNIT != 0 or y % UNIT != 0:
                        raise AssertionError(f"{gname} off-grid coord ({x}, {y})")
                start = 0
                areas = []
                for end in end_pts:
                    pts = [coords[i] for i in range(start, end + 1)]
                    areas.append(contour_signed_area(pts))
                    start = end + 1
                if not any(a < 0 for a in areas):
                    raise AssertionError(f"{gname} missing CW outer contour")


def render_specimen(out_path: Path) -> None:
    """Render a pixel-crisp QA specimen PNG using Pillow/FreeType on public/fonts/Hint.ttf."""
    from PIL import Image, ImageDraw, ImageFont

    font = ImageFont.truetype(str(OUT_FONT_PATH), size=16 * 3)
    lines = [
        "134 VIETNAMESE GLYPHS + 6 UI PUNCTUATION (m5x7 / Hint.ttf 3x):",
        "a à á ả ã ạ | ă ằ ắ ẳ ẵ ặ | â ầ ấ ẩ ẫ ậ | d đ",
        "e è é ẻ ẽ ẹ | ê ề ế ể ễ ệ | i ì í ỉ ĩ ị",
        "o ò ó ỏ õ ọ | ô ồ ố ổ ỗ ộ | ơ ờ ớ ở ỡ ợ",
        "u ù ú ủ ũ ụ | ư ừ ứ ử ữ ự | y ỳ ý ỷ ỹ ỵ",
        "A À Á Ả Ã Ạ | Ă Ằ Ắ Ẳ Ẵ Ặ | Â Ầ Ấ Ẩ Ẫ Ậ | D Đ",
        "E È É Ẻ Ẽ Ẹ | Ê Ề Ế Ể Ễ Ệ | I Ì Í Ỉ Ĩ Ị",
        "O Ò Ó Ỏ Õ Ọ | Ô Ồ Ố Ổ Ỗ Ộ | Ơ Ờ Ớ Ở Ỡ Ợ",
        "U Ù Ú Ủ Ũ Ụ | Ư Ừ Ứ Ử Ữ Ự | Y Ỳ Ý Ỷ Ỹ Ỵ",
        "UI: •  –  —  …  →  ₫",
        "Ấn tượng · Ước lượng · Hệ thống · 100₫",
        "Phiên chợ • Đấu giá → Cửa hàng… Mùa màng ổn định!",
        "ĐẶC SẢN: SỮA TƯƠI, TRỨNG GÀ, MẬT ONG RỪNG – 1.250₫",
    ]
    w, h = 1550, 70 + len(lines) * 60
    img = Image.new("RGB", (w, h), (28, 22, 18))
    draw = ImageDraw.Draw(img)
    y = 24
    for idx, line in enumerate(lines):
        color = (255, 224, 130) if idx == 0 else (245, 240, 230)
        draw.text((24, y), line, font=font, fill=color)
        y += 60
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Build or check public/fonts/Hint.ttf with Vietnamese glyphs")
    parser.add_argument("--check", action="store_true", help="Verify public/fonts/Hint.ttf matches deterministic build")
    parser.add_argument("--specimen", type=Path, default=None, help="Write QA specimen PNG to this path")
    args = parser.parse_args(argv)

    built_bytes, new_cps = build_font_bytes()
    verify_built_font(built_bytes, new_cps)

    if args.check:
        if not OUT_FONT_PATH.is_file():
            print(f"ERROR: missing {OUT_FONT_PATH.relative_to(REPO_ROOT)}", file=sys.stderr)
            return 1
        on_disk = OUT_FONT_PATH.read_bytes()
        if on_disk != built_bytes:
            print("ERROR: public/fonts/Hint.ttf is out of date; run `python scripts/build_hint_vn.py`", file=sys.stderr)
            return 1
        print(f"OK public/fonts/Hint.ttf: {BASE_GLYPH_COUNT + len(new_cps)} glyphs verified deterministically")
    else:
        OUT_FONT_PATH.parent.mkdir(parents=True, exist_ok=True)
        OUT_FONT_PATH.write_bytes(built_bytes)
        print(f"Wrote public/fonts/Hint.ttf ({len(built_bytes)} bytes, +100 glyphs)")

    if args.specimen is not None:
        render_specimen(args.specimen)
        print(f"Wrote specimen to {args.specimen}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
