import { readFile, writeFile } from 'node:fs/promises';
const root = new URL('../public/reference/', import.meta.url);
const logoText = await readFile(new URL('../../../packages/brand/dist/logo/svg/tp-vpn-logo-horizontal.svg', import.meta.url), 'utf8');
const innerLogo = logoText.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const titles = { connection: ['A clearer', 'connection.'], global: ['A world', 'within reach.'], protection: ['Move with', 'confidence.'], flow: ['Find', 'your flow.'] };
for (const [key, lines] of Object.entries(titles)) {
 const art = (await readFile(new URL(`social/${key}.png`, root))).toString('base64');
 const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="800" viewBox="0 0 1200 800"><title>TP VPN — ${lines.join(' ')}</title><rect width="1200" height="800" fill="#FAFBFF"/><image width="1200" height="800" xlink:href="data:image/png;base64,${art}"/><svg x="84" y="64" width="192" height="61.1" viewBox="0 0 207.48 66">${innerLogo}</svg><g font-family="Inter, Arial, sans-serif"><text x="84" y="315" fill="#0759C8" font-size="16" font-weight="600" letter-spacing="1.6">CONNECT WITH CLARITY</text><text x="84" y="390" fill="#0F172A" font-size="56" font-weight="600"><tspan x="84">${lines[0]}</tspan><tspan x="84" dy="68">${lines[1]}</tspan></text><text x="84" y="512" fill="#475569" font-size="21">Less friction. More possibility.</text><text x="84" y="735" fill="#475569" font-size="16">TP VPN · Brand concept</text></g></svg>`;
 await writeFile(new URL(`social/${key}.svg`, root), svg);
}
console.log('Built 4 self-contained, editable social SVG templates.');
