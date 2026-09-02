/** SVG sequence diagram for /patterns/connection: tap → connecting → connected, with the error branch. */
export function SequenceDiagram() {
  const Y = { user: 70, button: 150, feedback: 232 } as const;
  return (
    <figure className="my-6 overflow-x-auto rounded-xl border border-border-default bg-bg-surface p-4 shadow-level-1">
      <svg viewBox="0 0 800 330" className="h-auto w-full min-w-[720px]" role="img" aria-labelledby="conn-seq-title conn-seq-desc">
        <title id="conn-seq-title">连接流程时序图</title>
        <desc id="conn-seq-desc">
          点击后 100 毫秒内出现连接中反馈，外环以 1.2 秒一圈循环；成功后以 spring 300 毫秒进入已连接并开始计时；失败或 15 秒超时回到未连接并弹出可重试的错误提示。
        </desc>

        <text x="90" y="26" className="fill-fg-muted text-[11px]">
          事件顺序示意（非等比时间轴）
        </text>

        {/* lanes */}
        {(
          [
            ['用户', Y.user],
            ['按钮', Y.button],
            ['反馈', Y.feedback],
          ] as const
        ).map(([label, y]) => (
          <g key={label}>
            <text x="16" y={y + 4} className="fill-fg-primary text-[12px] font-medium">
              {label}
            </text>
            <line x1="90" x2="780" y1={y} y2={y} className="stroke-border-default" />
          </g>
        ))}

        {/* user taps */}
        <circle cx="110" cy={Y.user} r="7" className="fill-blue-500" />
        <text x="110" y={Y.user + 24} textAnchor="middle" className="fill-fg-secondary text-[11px]">
          点击
        </text>
        <circle cx="720" cy={Y.user} r="7" className="fill-slate-400" />
        <text x="720" y={Y.user + 24} textAnchor="middle" className="fill-fg-secondary text-[11px]">
          再次点击 → 断开
        </text>
        {[110, 470, 720].map((x) => (
          <line key={x} x1={x} x2={x} y1={Y.user + 8} y2={Y.button - 10} className="stroke-blue-500" strokeDasharray="3 3" />
        ))}

        {/* button state bars */}
        <rect x="90" y={Y.button - 9} width="20" height="18" rx="4" className="fill-state-disconnected" />
        <rect x="110" y={Y.button - 9} width="360" height="18" rx="4" className="fill-state-connecting" />
        <text x="290" y={Y.button + 4} textAnchor="middle" className="fill-white text-[11px] font-medium">
          连接中… · 外环 1.2 s / 圈 · aria-busy
        </text>
        <rect x="470" y={Y.button - 9} width="250" height="18" rx="4" className="fill-state-connected" />
        <text x="595" y={Y.button + 4} textAnchor="middle" className="fill-white text-[11px] font-medium">
          已连接 · gradient.connected + brand-glow-lg
        </text>
        <rect x="720" y={Y.button - 9} width="60" height="18" rx="4" className="fill-state-disconnected" />
        <text x="100" y={Y.button + 26} textAnchor="middle" className="fill-fg-muted text-[10px]">
          未连接
        </text>
        <text x="750" y={Y.button + 26} textAnchor="middle" className="fill-fg-muted text-[10px]">
          未连接
        </text>

        {/* feedback markers */}
        <path d="M110 208 v-6 h220 v6" fill="none" className="stroke-blue-500" strokeWidth="1.5" />
        <text x="220" y="196" textAnchor="middle" className="fill-fg-secondary text-[11px]">
          呼吸 + 旋转弧线循环 · duration.connect 1.2 s
        </text>
        {(
          [
            [170, '≤ 100 ms 首次反馈', 'duration.fast'],
            [470, 'spring 300 ms 进入已连接', 'easing.spring'],
            [590, '计时开始 00:00:00', 'numeric-md · tabular'],
          ] as const
        ).map(([x, label, sub]) => (
          <g key={x}>
            <line x1={x} x2={x} y1={Y.button + 9} y2={Y.feedback - 6} className="stroke-blue-500" strokeDasharray="3 3" />
            <circle cx={x} cy={Y.feedback} r="5" className="fill-bg-surface stroke-blue-500" strokeWidth="2" />
            <text x={x} y={Y.feedback + 22} textAnchor="middle" className="fill-fg-primary text-[11px] font-medium">
              {label}
            </text>
            <text x={x} y={Y.feedback + 36} textAnchor="middle" className="fill-fg-muted text-[10px]">
              {sub}
            </text>
          </g>
        ))}

        {/* error branch */}
        <path d="M330 159 V 300 H 462" fill="none" className="stroke-state-error" strokeWidth="1.5" strokeDasharray="4 3" />
        <path d="M462 295 L 470 300 L 462 305 Z" className="fill-state-error" />
        <text x="480" y="297" className="fill-state-error-fg text-[11px] font-medium">
          失败 / 15 s 超时 → 回到未连接
        </text>
        <text x="480" y="312" className="fill-state-error-fg text-[11px]">
          Toast「连接失败，请重试」→ 「重试」重新进入连接中
        </text>
      </svg>
      <figcaption className="mt-3 text-xs text-fg-muted">
        时间刻度仅表示先后顺序；真实时长见 <code className="font-mono">duration.fast / connect / moderate</code> 三个 token。
      </figcaption>
    </figure>
  );
}
