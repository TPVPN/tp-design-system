import { useState } from 'react';
import { Play } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { Button } from '@tpvpn/ui';
import { DocTable } from '@/components/docs';
import { tokensByPrefix } from '@/lib/tokens';
import { CopyName } from './CopyName';

const USAGE: Record<string, string> = {
  instant: '状态即时切换',
  fast: '按压反馈、颜色变化',
  quick: '淡入淡出、Tooltip；reduced motion 统一时长',
  base: '默认：hover、切换、站点交互',
  moderate: 'Sheet / Dialog 进入、页面切换',
  slow: '大面积布局变化、Hero 揭示',
  slower: '骨架屏 → 内容、数据加载完成',
  connect: '连接按钮呼吸 / 旋转周期',
};

/** duration.* table — the Play button slides a 40px dot across a 14rem track using that exact duration. */
export function DurationTable() {
  const reduced = useReducedMotion() ?? false;
  const [on, setOn] = useState<Record<string, boolean>>({});
  const rows = tokensByPrefix('duration');

  return (
    <DocTable
      caption="duration token 与演示"
      head={
        <>
          <th>Token</th>
          <th className="w-16">ms</th>
          <th>用途</th>
          <th className="w-[19rem]">演示</th>
        </>
      }
    >
      {rows.map((t) => {
        const ms = parseFloat(String(t.value)) || 0;
        const active = Boolean(on[t.key]);
        return (
          <tr key={t.path} className="transition-colors hover:bg-bg-surface-hover">
            <td>
              <CopyName text={t.path} />
              <p className="mt-0.5 mb-0 font-mono text-[11px] text-fg-muted">--duration-{t.key} · duration-(--duration-{t.key})</p>
            </td>
            <td className="font-mono text-[13px] text-fg-secondary tnum">{ms}</td>
            <td className="text-fg-secondary">{t.description ?? USAGE[t.key]}</td>
            <td>
              <div className="flex h-10 items-center gap-3">
                <Button
                  size="icon-sm"
                  variant="outline"
                  aria-label={`播放 ${t.key}（${ms} 毫秒）`}
                  onClick={() => setOn((s) => ({ ...s, [t.key]: !s[t.key] }))}
                >
                  <Play aria-hidden />
                </Button>
                <div className="relative h-2 w-56 rounded-full bg-bg-surface-sunken">
                  <span
                    aria-hidden
                    className="absolute top-1/2 left-0 size-10 rounded-full bg-blue-500 shadow-level-2"
                    style={{
                      transform: `translate(${active ? 'calc(14rem - 2.5rem)' : '0px'}, -50%)`,
                      transition: reduced ? 'none' : `transform ${ms}ms var(--ease-standard)`,
                    }}
                  />
                </div>
              </div>
            </td>
          </tr>
        );
      })}
    </DocTable>
  );
}
