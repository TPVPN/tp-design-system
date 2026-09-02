import { useId, useState, type CSSProperties } from 'react';
import { Switch, ToggleGroup, ToggleGroupItem } from '@tpvpn/ui';
import { Preview } from '@/components/docs';
import { token, tokenCssVar } from '@/lib/tokens';
import { px } from './naming';

type Device = 'mobile' | 'tablet' | 'desktop';

const DEVICES: { id: Device; label: string; width: number; range: string }[] = [
  { id: 'mobile', label: '手机', width: 360, range: '< 768' },
  { id: 'tablet', label: '平板', width: 768, range: '768 – 1023' },
  { id: 'desktop', label: '桌面', width: 1024, range: '≥ 1024' },
];

function gridSpec(d: Device) {
  return {
    columns: Number(token(`grid.${d}.columns`)) || 4,
    gutter: px(token(`grid.${d}.gutter`)),
    margin: px(token(`grid.${d}.margin`)),
  };
}

const CSS_SNIPPET = `.grid {
  display: grid;
  grid-template-columns: repeat(${token('grid.mobile.columns')}, minmax(0, 1fr));
  gap: var(${tokenCssVar('grid.mobile.gutter')});            /* ${token('grid.mobile.gutter')} */
  padding-inline: var(${tokenCssVar('grid.mobile.margin')}); /* ${token('grid.mobile.margin')} */
}
@media (min-width: ${token('breakpoint.md')}) {
  .grid { grid-template-columns: repeat(${token('grid.tablet.columns')}, minmax(0, 1fr)); gap: var(${tokenCssVar('grid.tablet.gutter')}); padding-inline: var(${tokenCssVar('grid.tablet.margin')}); }
}
@media (min-width: ${token('breakpoint.lg')}) {
  .grid { grid-template-columns: repeat(${token('grid.desktop.columns')}, minmax(0, 1fr)); gap: var(${tokenCssVar('grid.desktop.gutter')}); padding-inline: var(${tokenCssVar('grid.desktop.margin')}); }
}`;

function MockCard() {
  return (
    <div className="rounded-lg border border-border-default bg-bg-surface p-3 shadow-level-1" style={{ gridColumn: 'span 4' }} aria-hidden>
      <div className="flex items-center gap-3">
        <span className="size-8 shrink-0 rounded-full bg-bg-surface-sunken ring-hairline" />
        <span className="flex-1 space-y-1.5">
          <span className="block h-2.5 w-3/5 rounded-full bg-slate-200" />
          <span className="block h-2 w-2/5 rounded-full bg-bg-surface-sunken" />
        </span>
        <span className="h-2 w-8 rounded-full bg-status-success-bg" />
      </div>
    </div>
  );
}

/** Live 4 / 8 / 12-column grid with gutter + margin overlay, driven by grid.* tokens. */
export function GridOverlayDemo() {
  const [device, setDevice] = useState<Device>('mobile');
  const [overlay, setOverlay] = useState(true);
  const switchId = useId();
  const spec = gridSpec(device);
  const dev = DEVICES.find((d) => d.id === device)!;
  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${spec.columns}, minmax(0, 1fr))`,
    gap: spec.gutter,
  };

  return (
    <Preview
      background="canvas"
      centered={false}
      padded={false}
      label="栅格演示"
      code={CSS_SNIPPET}
      lang="css"
      toolbar={
        <>
          <ToggleGroup type="single" size="sm" variant="outline" value={device} onValueChange={(v) => v && setDevice(v as Device)} aria-label="设备" className="flex-wrap">
            {DEVICES.map((d) => (
              <ToggleGroupItem key={d.id} value={d.id}>
                {d.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <label htmlFor={switchId} className="ml-1 flex items-center gap-2 text-sm text-fg-secondary">
            <Switch id={switchId} size="sm" checked={overlay} onCheckedChange={setOverlay} />
            显示栅格
          </label>
          <span className="font-mono text-[12px] text-fg-muted tnum">
            {spec.columns} 列 · gutter {spec.gutter} · 边距 {spec.margin} · {dev.range}
          </span>
        </>
      }
    >
      <div className="overflow-x-auto p-6">
        <div
          className="relative mx-auto w-full overflow-hidden rounded-lg border border-border-default bg-bg-surface shadow-level-1"
          style={{ maxWidth: dev.width }}
          role="img"
          aria-label={`${dev.label}栅格：${spec.columns} 列，gutter ${spec.gutter}px，边距 ${spec.margin}px`}
        >
          <div className="flex h-14 items-center border-b border-border-subtle text-headline text-fg-primary" style={{ paddingInline: spec.margin }}>
            TP VPN
          </div>
          <div className="bg-bg-canvas" style={{ ...gridStyle, padding: spec.margin }}>
            <MockCard />
            <MockCard />
            <MockCard />
          </div>
          {overlay && (
            <div className="pointer-events-none absolute inset-0" style={{ ...gridStyle, paddingInline: spec.margin }} aria-hidden>
              {Array.from({ length: spec.columns }, (_, i) => (
                <span key={i} className="h-full border-x border-blue-500/25 bg-blue-500/10" />
              ))}
            </div>
          )}
        </div>
        <p className="mt-3 mb-0 text-center text-xs text-fg-muted">
          画布宽 {dev.width}px（桌面按容器等比缩放）· 每张卡片跨 4 列，因此手机 1 张 / 行，平板 2 张，桌面 3 张。
        </p>
      </div>
    </Preview>
  );
}
