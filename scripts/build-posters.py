#!/usr/bin/env python3
"""Generate static SVG posters for the signal-surface hero.

These are the LCP image: a still of the same displaced grid the WebGL scene
draws, so a visitor who never gets the live canvas still sees the intended
picture rather than a blank. SVG rather than a captured AVIF because a
hairline grid compresses better as vectors and stays sharp at any DPR.

Run: python3 scripts/build-posters.py
"""

from __future__ import annotations

import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "assets" / "posters"

THEMES = {
    "light": {"paper": "#edf0f2", "ink": "#101418", "rust": "#e4572e"},
    "dark": {"paper": "#101519", "ink": "#e6eaed", "rust": "#e4572e"},
}

COLS, ROWS = 42, 28
WIDTH, HEIGHT = 1600, 900


def hash21(x: int, y: int) -> float:
    n = math.sin(x * 127.1 + y * 311.7) * 43758.5453
    return n - math.floor(n)


def noise(x: float, y: float) -> float:
    ix, iy = math.floor(x), math.floor(y)
    fx, fy = x - ix, y - iy
    fx = fx * fx * (3 - 2 * fx)
    fy = fy * fy * (3 - 2 * fy)
    a = hash21(ix, iy)
    b = hash21(ix + 1, iy)
    c = hash21(ix, iy + 1)
    d = hash21(ix + 1, iy + 1)
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy


def fbm(x: float, y: float) -> float:
    v, a = 0.0, 0.55
    for _ in range(4):
        v += a * noise(x, y)
        x, y = x * 2.03 + 13.17, y * 2.03
        a *= 0.5
    return v


def height_at(c: int, r: int) -> float:
    u, v = c / COLS, r / ROWS
    return fbm(u * 3.4, v * 4.6 + 0.4)


def project(c: int, r: int) -> tuple[float, float]:
    """Cheap perspective matching the three.js camera: looking down from -Y."""
    u = (c / COLS) * 2 - 1
    v = (r / ROWS) * 2 - 1
    h = (height_at(c, r) - 0.42) * 0.42
    # rotate around X ~ -50deg and push back
    y = v * 0.85 + h * 0.6
    z = 1.6 + v * 0.55
    x = u * 1.35
    persp = 1.7 / z
    return WIDTH * 0.52 + x * persp * 620, HEIGHT * 0.58 - y * persp * 520


def polyline(points: list[tuple[float, float]]) -> str:
    return " ".join(f"{x:.1f},{y:.1f}" for x, y in points)


def build(theme: str) -> str:
    colors = THEMES[theme]
    lines: list[str] = []
    threshold = 0.62

    for r in range(ROWS + 1):
        pts = [project(c, r) for c in range(COLS + 1)]
        # colour the whole row by its mid height — close enough for a poster
        above = height_at(COLS // 2, r) > threshold
        stroke = colors["rust"] if above else colors["ink"]
        opacity = 0.72 if above else 0.38
        lines.append(
            f'<polyline fill="none" stroke="{stroke}" stroke-opacity="{opacity}" '
            f'stroke-width="1" points="{polyline(pts)}"/>'
        )

    for c in range(COLS + 1):
        pts = [project(c, r) for r in range(ROWS + 1)]
        above = height_at(c, ROWS // 2) > threshold
        stroke = colors["rust"] if above else colors["ink"]
        opacity = 0.72 if above else 0.38
        lines.append(
            f'<polyline fill="none" stroke="{stroke}" stroke-opacity="{opacity}" '
            f'stroke-width="1" points="{polyline(pts)}"/>'
        )

    body = "\n    ".join(lines)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {WIDTH} {HEIGHT}" '
        f'width="{WIDTH}" height="{HEIGHT}" role="presentation">\n'
        f'  <rect width="100%" height="100%" fill="{colors["paper"]}"/>\n'
        f"  <g stroke-linecap=\"square\" stroke-linejoin=\"miter\">\n    {body}\n  </g>\n"
        f"</svg>\n"
    )


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for theme in THEMES:
        path = OUT / f"signal-surface-{theme}.svg"
        path.write_text(build(theme), encoding="utf-8")
        print(f"{path.relative_to(ROOT)}  {path.stat().st_size / 1024:.1f}k")


if __name__ == "__main__":
    main()
