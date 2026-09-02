# circle-flags (vendored)

62 circular country/region flags used by TP VPN for node lists, selected from
**[HatScripts/circle-flags](https://github.com/HatScripts/circle-flags)** —
"A collection of 400+ minimal circular SVG country flags" by HatScripts.

- License: **MIT** — © HatScripts. Full text in [`LICENSE.txt`](LICENSE.txt).
- Files are unmodified upstream SVGs (512 × 512 viewBox, circular mask).
- File names are lower-case ISO 3166-1 alpha-2 codes (`us.svg`, `hk.svg`, …).
- `scripts/build-assets.mjs` copies them to `dist/flags/` and writes
  `dist/flags/index.json` with English / 简体中文 display names for each code.

To add a flag: drop the upstream `<code>.svg` here **and** add the code to
`FLAG_NAMES` in `scripts/build-assets.mjs` — the build fails if the two get out
of sync.
