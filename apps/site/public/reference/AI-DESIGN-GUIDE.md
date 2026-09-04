# TP VPN · AI design handoff

Revision: 2026-09-04-mobile-social. All new references use Light Mode.

## Read first

1. Fetch https://brand.tpvpn.com/reference/ai-design-standard.json.
2. Fetch https://brand.tpvpn.com/reference/social/prompts.json for the four exact Image Gen prompts.
3. Use the official logo at https://brand.tpvpn.com/brand/logo/svg/tp-vpn-logo-horizontal.svg unchanged.

## Generate, then typeset

Choose ONE theme: connection, global, protection, or flow. Generate a text-free image with a near-white background and #1677FF accent. Keep the left 45% quiet and put the hero subject in the right 50%. Use matte ceramic, frosted glass and soft daylight. Preserve the full generation prompt. Never generate logos, text, invented UI, metrics, or security claims.

Place the official vector logo and editable headline in a separate layout layer. English uses Inter; Chinese uses PingFang SC or Noto Sans SC. Do not fake bold. Do not mix Chinese and English headlines at equal prominence. Reference headlines are brand concepts, not validated product claims.

## Deliverables

The four source PNGs are 1536 × 1024. Each matching SVG is a self-contained 1200 × 800 landscape composition with embedded source art, unchanged vector logo and editable English typography. Install Inter before editing. Chinese alternatives appear in the website preview; use a licensed installed Chinese font when typesetting.

For square 1080 × 1080, portrait 1080 × 1350 or Story 1080 × 1920, recompose instead of cropping the finished landscape. Place headline above art; preserve logo clearance. Reserve approximately 12% at Story top/bottom for platform chrome and check the actual publishing preview. These are internal templates, not claims about every platform's current requirements.

## Mobile UI

Review /platforms/ios, /platforms/android and /platforms/mobile-motion. Web sketches use Lucide icons with matching semantics, not pixel-identical native controls. Native implementation should use SwiftUI and SF Symbols, or Compose Material 3 and Material icons. Keep minimum 44 pt iOS / 48 dp Android touch targets, system font scaling, safe-area handling, semantic labels, keyboard/back behavior and reduced-motion alternatives. Connection success must come from the real VPN engine, never from an animation timer.

The .swift and .kt files are integration references, not compiled release artifacts. Compile in the actual app, connect real state and permissions, then test VoiceOver/TalkBack, large text, back dismissal and device sizes.

## Final check

- Official logo and #1677FF unchanged; all assets remain light.
- One clear focal object, no stray glyphs, no stretched geometry.
- Readable headline, correct language, safe margins and contrast.
- No invented node counts, speed, no-log certification or absolute anonymity.
- No free/guest flow. Any trial messaging requires confirmed pricing and auto-conversion terms.
- Keep source art, editable layout and the exact prompt together.
