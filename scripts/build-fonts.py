#!/usr/bin/env python3
"""Instance the variable fonts down to the axis ranges this site actually uses.

Run after changing a font dependency:

    python3 -m pip install fonttools brotli
    python3 scripts/build-fonts.py

Why this exists: Fontsource ships Archivo's full variable design space, which is
90kB for the latin subset alone — more than the entire 85kB font budget on its
own. We only ever set one width, so pinning `wdth` and narrowing `wght` cuts it
to 32kB without losing anything we use.

Output goes to src/assets/fonts/ so Vite hashes it and it gets immutable caching.
"""

from __future__ import annotations

import shutil
import sys
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parent.parent
MODULES = ROOT / "node_modules"
OUT = ROOT / "src" / "assets" / "fonts"

# Archivo is display-only: headings, nav and labels. It is pinned to
# wdth 112.5 (SemiExpanded) rather than kept as an axis because the range
# 100-125 costs 57kB against 32kB pinned, and we only ever use one width.
# The expanded cut is the whole reason for choosing Archivo -- it is what stops
# the site reading as another Inter page -- so the width is kept and the axis
# is not.
JOBS: list[dict] = [
    {
        "src": "@fontsource-variable/archivo/files/archivo-{subset}-wdth-normal.woff2",
        "out": "archivo-{subset}",
        "subsets": ["latin", "latin-ext"],
        "axes": {"wdth": 112.5, "wght": (400, 700)},
    },
    {
        "src": "@fontsource-variable/public-sans/files/public-sans-{subset}-wght-normal.woff2",
        "out": "public-sans-{subset}",
        "subsets": ["latin", "latin-ext"],
        "axes": {"wght": (400, 700)},
    },
    {
        # Plex Mono is static and already small. Latin only: it is rationed to
        # dates, metrics and tags, which are overwhelmingly digits.
        "src": "@fontsource/ibm-plex-mono/files/ibm-plex-mono-{subset}-400-normal.woff2",
        "out": "ibm-plex-mono-{subset}",
        "subsets": ["latin"],
        "axes": None,
    },
]


def build(job: dict, subset: str) -> tuple[str, int, int]:
    source = MODULES / job["src"].format(subset=subset)
    if not source.exists():
        raise SystemExit(f"missing source font: {source}\nRun `pnpm install` first.")

    target = OUT / f"{job['out'].format(subset=subset)}.woff2"
    before = source.stat().st_size

    if job["axes"] is None:
        shutil.copyfile(source, target)
    else:
        font = TTFont(source)
        instancer.instantiateVariableFont(font, job["axes"], inplace=True, updateFontNames=False)
        font.flavor = "woff2"
        font.save(target)

    return target.name, before, target.stat().st_size


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    critical = 0
    print(f"{'file':<32} {'source':>10} {'output':>10}")
    print("-" * 54)

    for job in JOBS:
        for subset in job["subsets"]:
            name, before, after = build(job, subset)
            if subset == "latin":
                critical += after
            print(f"{name:<32} {before / 1024:>9.1f}k {after / 1024:>9.1f}k")

    budget = 85 * 1024
    print("-" * 54)
    print(f"latin subsets (critical path): {critical / 1024:.1f}k of {budget / 1024:.0f}k budget")
    if critical > budget:
        print("OVER BUDGET", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
