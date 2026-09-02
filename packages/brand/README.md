# @tpvpn/brand

Brand asset pipeline for TP VPN. One script turns two inputs — the official mark
geometry and `fonts/Inter-Bold.ttf` — into every logo, app icon, social image,
flag set, font bundle and download pack the design system ships.

```
packages/brand/
├── fonts/                  Inter TTFs (Regular/Medium/SemiBold/Bold/ExtraBold) + OFL   ← input
├── vendor/circle-flags/    62 circular flag SVGs (HatScripts/circle-flags, MIT)        ← input
├── scripts/build-assets.mjs                                                            ← the generator
├── src/logo/               generated SVG sources + README.md (construction maths)      ← committed
└── dist/                   generated rasters, zips, manifest                           ← committed
```

## Regenerate

```sh
pnpm --filter @tpvpn/brand build
# or
cd packages/brand && node scripts/build-assets.mjs
```

The script wipes `dist/`, rebuilds everything and prints a manifest summary.
It is deterministic (fixed zip timestamps, sorted file order, no wall-clock
values), so re-running it on unchanged inputs produces byte-identical output.
Dependencies: `sharp` (rasterising via librsvg), `text-to-svg` (outlining the
wordmark with opentype.js), `archiver` (zips). No fonts need to be installed on
the machine.

### How the logo is built

- The mark is the Figma export in `tp-web/public/brand/logo-mark.svg`: a 66 × 66
  square, `rx 15.84` (24 %), fill `#1677FF`, white glyph 42.24 × 35.64 at
  (11.85, 17.08). The glyph path data is embedded verbatim in the script and
  asserted at build time.
- The wordmark "TP VPN" is Inter Bold at 66 × 0.56 = 36.96 px, letter-spacing
  −0.02 em, outlined to `<path>`. It is placed from the outlined glyph bounding
  box: visual left edge 66 × 0.18 = 11.88 to the right of the square, cap-height
  centre on the square's centre. Stacked gap = 66 × 0.25.
- Full numbers and per-file notes: [`src/logo/README.md`](src/logo/README.md).

### App-icon sizing rules

- iOS `AppIcon-1024.png` is a plain, opaque square (no rounded corners, no
  alpha) because iOS applies its own mask; every other size is the rounded mark.
- Android adaptive foreground: 108 dp canvas, glyph longest side = 44 % (47.52 dp),
  which keeps the whole glyph inside the 66 dp safe circle.
- PWA maskable: the W3C safe zone is a centred circle of 80 % diameter. The glyph's
  longest side is 66 % of that diameter (= 52.8 % of the canvas) so the full glyph
  bounding box — including the corners of the "T" — stays inside the circle
  (half-diagonal 34.5 % < 40 % radius). A glyph at 66 % of the *canvas* would be
  clipped by circular masks, which is why the rule is anchored to the safe zone.

## What is in `dist/`

| Path | Contents |
|---|---|
| `logo/svg/` | Copies of all `src/logo/*.svg` (9 logo variants + clear-space and grid diagrams). |
| `logo/png/` | `<variant>@1x.png` / `@2x.png` — horizontal, stacked and wordmark at 1024 / 2048 px wide; marks at 512 / 1024 px. Transparent background. |
| `app-icon/ios/` | `AppIcon-1024.png` (opaque, square — iOS applies the mask), `AppIcon-{180,167,152,120,87,80,76,60,58,40,29,20}.png` and a ready `Contents.json` (`AppIcon.appiconset`, iPhone / iPad / App Store). |
| `app-icon/android/` | Adaptive `ic_launcher_foreground.{svg,png}` (108 dp canvas @4×, glyph = 44 %), `ic_launcher_background.png` (solid `#1677FF`), legacy `ic_launcher-{512,192,144,96,72,48}.png`. |
| `app-icon/web/` | `favicon.ico` (16/32/48), `favicon-16.png`, `favicon-32.png`, `icon.svg`, `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `README.md` with the `site.webmanifest` snippet. |
| `app-icon/universal/` | `tp-vpn-icon-{1024,512,256,128,64,32}.png` — rounded mark for any other platform. |
| `social/` | `og-default.png` 1200×630, `github-social-preview-1280x640.png`, `avatar-1024.png`, `twitter-header-1500x500.png`. |
| `flags/` | 62 circle flags + `index.json` (`{ code: { en, zh } }`) + MIT license. |
| `fonts/` | The five Inter TTFs + `LICENSE-Inter.txt`. |
| `packs/` | Download zips: `tp-vpn-brand-assets-all.zip`, `tp-vpn-logo-pack.zip`, `tp-vpn-app-icons.zip`, `tp-vpn-social-kit.zip`, `tp-vpn-flags.zip`, `tp-vpn-fonts-inter.zip`. Each has a `README.txt` (contents, version, license note) and `LICENSE-BRAND.md`. |
| `manifest.json` | `{ generatedFrom, version, files: [{ path, bytes, width, height, kind, format }] }` — the docs site reads this to render download cards. `kind` ∈ `logo · app-icon · social · flag · font · pack · doc`. |

## Consumers

- `apps/site/scripts/sync-assets.mjs` copies `dist/` into the docs site's
  `public/` (`public/brand/**`, `public/downloads/*.zip`).
- `@tpvpn/ui`'s `Flag` component loads `flags/<code>.svg`.
- Product repos (tp-app, tp-web, tp-admin) should take icons from
  `dist/app-icon/**` rather than re-exporting from Figma.

## License

Brand assets: © TP VPN, all rights reserved — see [`LICENSE-BRAND.md`](../../LICENSE-BRAND.md).
Inter: SIL OFL 1.1. circle-flags: MIT.
