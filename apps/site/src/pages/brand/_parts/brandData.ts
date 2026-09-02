/**
 * Static brand data for the /brand/* pages — imported at build time so the
 * pages render without a fetch (the same files are mirrored to public/brand/).
 */
import manifest from '../../../../../../packages/brand/dist/manifest.json';
import iosContents from '../../../../../../packages/brand/dist/app-icon/ios/Contents.json';

export interface BrandFile {
  path: string;
  bytes: number;
  width: number | null;
  height: number | null;
  kind: string;
  format: string;
}

export const BRAND_VERSION: string = manifest.version;
export const BRAND_FILES: readonly BrandFile[] = manifest.files as BrandFile[];

/** Manifest entry for a path relative to `packages/brand/dist` (e.g. `logo/svg/tp-vpn-logo-mark.svg`). */
export function brandFile(path: string): BrandFile | undefined {
  return BRAND_FILES.find((f) => f.path === path);
}

/** Byte size of a zip pack (`tp-vpn-logo-pack.zip`) from the manifest, or `undefined`. */
export function packBytes(zip: string): number | undefined {
  return brandFile(`packs/${zip}`)?.bytes;
}

export interface IosIconEntry {
  filename: string;
  idiom: 'iphone' | 'ipad' | 'ios-marketing' | (string & {});
  scale: string;
  size: string;
}

/** `AppIcon.appiconset/Contents.json` as shipped in `app-icon/ios/`. */
export const IOS_ICON_ENTRIES: readonly IosIconEntry[] = iosContents.images as IosIconEntry[];

/** `"20x20"` + `"3x"` → 60 */
export function iosPixelSize(entry: IosIconEntry): number {
  const pt = parseFloat(entry.size);
  const scale = parseFloat(entry.scale);
  return Math.round(pt * scale);
}
