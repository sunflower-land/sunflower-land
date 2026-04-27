#!/usr/bin/env python3
"""
Regenerate INTERIOR_LAYOUTS by scanning the four interior background webps.

Usage (from repo root):
    python3 src/features/game/expansion/placeable/lib/generateInteriorLayouts.py

Scans each of src/assets/buildings/{tent,home,manor,mansion}.webp in 16x16
increments and marks a tile "valid" (placeable) if ≥ 60% of its pixels match
the reddish-brown wood floor palette. Walls (lighter beige), decorations
(red windows / doors), and transparent pixels are excluded.

The emitted sets are copy-pasted into interiorLayouts.ts by hand after running
— keeping the TS file human-readable and avoiding codegen steps at build time.

Verifies the progression is additive (basic ⊂ spring ⊂ desert ⊂ volcano) and
prints warnings otherwise.
"""
from PIL import Image
import sys

CANVAS_W, CANVAS_H = 24, 24  # tiles — matches INTERIOR_CANVAS
TILE = 16                    # px per tile
IMG_W, IMG_H = 380, 320      # native px of the background images

ISLANDS = [
    ("basic",   "tent"),
    ("spring",  "home"),
    ("desert",  "manor"),
    ("volcano", "mansion"),
]


def is_floor(r: int, g: int, b: int, a: int) -> bool:
    """Return True for reddish-brown wood floor pixels."""
    if a < 255:
        return False
    # Red must dominate — wood is warm-hued.
    if not (r > g and r > b):
        return False
    # Exclude lighter beige walls (higher green).
    if g >= 155:
        return False
    # Exclude near-white highlights on walls.
    if r >= 225:
        return False
    # Exclude very dark shadows / outline pixels.
    if r < 110:
        return False
    # Exclude saturated pure-red decorations (windows / doors).
    if r - g > 120:
        return False
    return True


def classify(path: str) -> set:
    """Return the set of (cx, cy) canvas tiles classified as floor."""
    img = Image.open(path).convert("RGBA")
    px = img.load()
    valid = set()
    for cy in range(1, CANVAS_H + 1):          # canvas y = tile TOP, 1..24
        for cx in range(0, CANVAS_W):
            img_row = 20 - cy                   # image row from top (0..19)
            if img_row < 0 or img_row > 19:
                continue
            img_px_x0 = cx * TILE
            img_px_y0 = img_row * TILE
            if img_px_x0 >= IMG_W:
                continue
            floor = total = 0
            for dy in range(TILE):
                for dx in range(TILE):
                    ix, iy = img_px_x0 + dx, img_px_y0 + dy
                    if ix >= IMG_W or iy >= IMG_H:
                        continue
                    total += 1
                    if is_floor(*px[ix, iy]):
                        floor += 1
            if total and floor / total >= 0.6:
                valid.add((cx, cy))
    return valid


def main() -> int:
    layouts = {}
    for name, fname in ISLANDS:
        layouts[name] = classify(f"src/assets/buildings/{fname}.webp")
        print(f"{name:8} ({fname}): {len(layouts[name]):3} valid tiles")

    # Additive check
    ordered = [n for n, _ in ISLANDS]
    for i in range(1, len(ordered)):
        a, b = ordered[i - 1], ordered[i]
        if not layouts[a] <= layouts[b]:
            lost = sorted(layouts[a] - layouts[b])
            print(f"  ERROR: {a} NOT subset of {b}. Lost tiles: {lost}")
            return 1
    print("additive progression verified ✓")

    # Emit as TS set-of-strings literal ready to paste into interiorLayouts.ts
    print("\n// paste the per-island blocks below into INTERIOR_LAYOUTS:\n")
    for name in ordered:
        print(f"  {name}: new Set([")
        xs = sorted(layouts[name])
        for i in range(0, len(xs), 8):
            row = ", ".join(f'"{x},{y}"' for x, y in xs[i:i + 8])
            print(f"    {row},")
        print(f"  ]),  // {len(layouts[name])} tiles")
    return 0


if __name__ == "__main__":
    sys.exit(main())
