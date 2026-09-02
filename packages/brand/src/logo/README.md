# TP VPN logo sources

Every file in this folder is **generated** by `packages/brand/scripts/build-assets.mjs`.
Edit the script (or the inputs it reads), never the SVGs.

## Inputs

1. **Mark geometry** — the official Figma export `tp-web/public/brand/logo-mark.svg`:
   a 66 × 66 square with `rx = 15.84` (24 % of the side), fill `#1677FF`, and the
   white "TP" glyph (bounding box 42.24 × 35.64, offset 11.85, 17.08). The glyph
   `<path d>` is copied **verbatim** into the script and asserted at build time —
   it is never redrawn or re-encoded.
2. **Wordmark** — "TP VPN" set in Inter Bold (`fonts/Inter-Bold.ttf`, Inter 4.001,
   SIL OFL) and outlined to `<path>` with `text-to-svg` / opentype.js, so no
   file contains a `<text>` element and nothing depends on installed fonts.

## Construction (all values in mark units, mark height = 66)

| Rule | Value |
|---|---|
| Font size = mark height × 0.56 | 36.96 px |
| Letter-spacing | -0.02 em (text-to-svg's `letterSpacing` is in em, multiplied by the font size) |
| Cap height at that size (= glyph bounding-box height; OS/2 capHeight 1490 / 2048) | 26.89 |
| Wordmark tight width (bounding box of the outlined glyphs) | 129.598 |
| Horizontal gap = mark height × 0.18 | 11.88 |
| Stacked gap = mark height × 0.25 | 16.5 |
| Horizontal lock-up | 207.48 × 66 |
| Stacked lock-up | 129.6 × 109.39 |
| Wordmark alone | 129.6 × 26.89 |

**Optical alignment.** The wordmark is positioned from the *outlined glyph bounding
box*, not from font metrics: the visual left edge of the "T" (its left side bearing,
0 px, is trimmed) sits exactly `gap` to the right of the square, and the
centre of the cap height is aligned to the centre of the square (baseline at
y = 46.445 in the horizontal lock-up). In the stacked lock-up the wordmark
is centred on the mark's vertical axis by the same bounding box. Kerning: Inter 4
stores kerning as class-based GPOS pairs that opentype.js 0.11 does not resolve,
so the wordmark uses letter-spacing only — this is deterministic and is the
reference rendering for every platform.

## Files

| File | What |
|---|---|
| `tp-vpn-logo-horizontal.svg` | Primary lock-up: blue mark + slate-900 wordmark. White / light backgrounds. |
| `tp-vpn-logo-horizontal-reversed.svg` | White square with blue glyph + white wordmark. For `#1677FF` or dark backgrounds. |
| `tp-vpn-logo-stacked.svg` | Mark above a centred wordmark. |
| `tp-vpn-logo-mark.svg` | Mark only (blue square, white glyph). Also the app-icon source. |
| `tp-vpn-logo-mark-mono-black.svg` | Single colour: slate-900 square, white glyph. |
| `tp-vpn-logo-mark-mono-white.svg` | Single colour: white square, slate-900 glyph. |
| `tp-vpn-logo-mark-reversed.svg` | White square, blue glyph (for blue backgrounds). |
| `tp-vpn-wordmark.svg` / `tp-vpn-wordmark-white.svg` | Wordmark only, tight bounding box. |
| `tp-vpn-logo-clearspace.svg` | Documentation diagram: clear space X = ½ mark height on every side. |
| `tp-vpn-logo-grid.svg` | Documentation diagram: construction grid (24 % corner radius, glyph box, dimensions). |

All SVGs have a tight `viewBox`, explicit `width`/`height`, `role="img"` and an
`aria-label`. Rules of use: minimum mark size 24 px on screen / 8 mm in print,
horizontal lock-up ≥ 96 px wide, clear space ≥ ½ mark height; never recolour,
stretch, rotate, outline or add effects. See `LICENSE-BRAND.md`.
