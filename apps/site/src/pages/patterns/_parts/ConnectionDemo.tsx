import { useCallback, useEffect, useRef, useState } from 'react';
import { CircleX, RotateCcw } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Alert, AlertDescription, AlertTitle, Button, Label, StatusDot, Switch, type ConnectionState } from '@tpvpn/ui';
import { Pill, Preview } from '@/components/docs';
import { EASE_DECELERATE } from '@/lib/motion';
import { HomeScreen } from './HomeScreen';

/** Short zh label per state, shared with the copy table on the page. */
export const STATE_ZH: Record<ConnectionState, string> = { disconnected: '未连接', connecting: '连接中', connected: '已连接', error: '失败' };

const CODE_DEMO = `import { useEffect, useState } from 'react';
import { ConnectionButton, type ConnectionState } from '@tpvpn/ui';

const CONNECT_TIMEOUT_MS = 15_000; // 15 s 超时判定失败

function HomeConnect({ connect, onError }: { connect: () => Promise<void>; onError: (message: string) => void }) {
  const [state, setState] = useState<ConnectionState>('disconnected');
  const [elapsed, setElapsed] = useState('00:00:00');

  useEffect(() => {
    if (state !== 'connecting') return;
    let cancelled = false;
    const timeout = window.setTimeout(() => {
      cancelled = true;
      setState('disconnected'); // 回到未连接 + Toast，可重试
      onError('连接失败，请重试');
    }, CONNECT_TIMEOUT_MS);
    connect()
      .then(() => !cancelled && setState('connected'))
      .catch(() => {
        if (cancelled) return;
        setState('disconnected');
        onError('连接失败，请重试');
      })
      .finally(() => window.clearTimeout(timeout));
    return () => window.clearTimeout(timeout);
  }, [state, connect, onError]);

  return (
    <ConnectionButton
      state={state}
      elapsed={state === 'connected' ? elapsed : undefined}
      onClick={() => setState(state === 'connected' ? 'disconnected' : 'connecting')}
    />
  );
}`;

/** 3725 → "01:02:05"; ≥ 24 h → "1d 02:03:04". */
export function formatElapsed(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const days = Math.floor(s / 86400);
  const hh = String(Math.floor((s % 86400) / 3600)).padStart(2, '0');
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return days > 0 ? `${days}d ${hh}:${mm}:${ss}` : `${hh}:${mm}:${ss}`;
}

interface LogEntry {
  id: number;
  at: number;
  label: string;
}

function useConnectionDemo(simulateError: boolean) {
  const [state, setState] = useState<ConnectionState>('disconnected');
  const [seconds, setSeconds] = useState(0);
  const [log, setLog] = useState<LogEntry[]>([]);
  const origin = useRef<number | null>(null);
  const counter = useRef(0);

  const record = useCallback((label: string) => {
    const now = performance.now();
    origin.current ??= now;
    const at = now - origin.current;
    counter.current += 1;
    const id = counter.current;
    setLog((entries) => [...entries.slice(-5), { id, at, label }]);
  }, []);

  // connecting → (1.2 s) → connected | error
  useEffect(() => {
    if (state !== 'connecting') return;
    const id = window.setTimeout(() => {
      if (simulateError) {
        setState('error');
        record('失败 → 回到未连接，Toast「连接失败，请重试」');
      } else {
        setState('connected');
        record('已连接 · spring 300 ms · 计时开始');
      }
    }, 1200);
    return () => window.clearTimeout(id);
  }, [state, simulateError, record]);

  // session timer
  useEffect(() => {
    if (state !== 'connected') {
      setSeconds(0);
      return;
    }
    const id = window.setInterval(() => setSeconds((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, [state]);

  // toast auto-dismiss (5 s)
  useEffect(() => {
    if (state !== 'error') return;
    const id = window.setTimeout(() => setState('disconnected'), 5000);
    return () => window.clearTimeout(id);
  }, [state]);

  const toggle = useCallback(() => {
    if (state === 'connected') {
      record('再次点击 → 断开（无需二次确认）');
      setState('disconnected');
      return;
    }
    if (state === 'connecting') {
      record('连接中点击 → 取消，回到未连接');
      setState('disconnected');
      return;
    }
    record(state === 'error' ? '重试 → 连接中…' : '点击 → 连接中…（≤ 100 ms 出现外环）');
    setState('connecting');
  }, [state, record]);

  const retry = useCallback(() => {
    record('点击「重试」→ 连接中…');
    setState('connecting');
  }, [record]);

  const reset = useCallback(() => {
    setState('disconnected');
    setLog([]);
    origin.current = null;
  }, []);

  return { state, elapsed: formatElapsed(seconds), log, toggle, retry, reset };
}

function EventLog({ state, log }: { state: ConnectionState; log: LogEntry[] }) {
  return (
    <div className="flex min-w-0 flex-col rounded-lg border border-border-default bg-bg-surface p-4">
      <p className="eyebrow text-fg-muted">时序记录</p>
      <ol aria-live="polite" className="mt-3 flex flex-1 flex-col gap-2 text-sm">
        {log.length === 0 ? (
          <li className="text-fg-muted">点击手机里的连接按钮开始</li>
        ) : (
          log.map((entry) => (
            <li key={entry.id} className="flex gap-3">
              <span className="w-16 shrink-0 text-right font-mono text-xs text-fg-muted tabular">+{(entry.at / 1000).toFixed(2)} s</span>
              <span className="text-fg-secondary">{entry.label}</span>
            </li>
          ))
        )}
      </ol>
      <p className="mt-4 flex flex-wrap items-center gap-2 border-t border-border-subtle pt-3 text-[13px] text-fg-muted">
        <StatusDot state={state} size={8} />
        当前状态：{STATE_ZH[state]}
        <Pill size="sm" tone={state === 'connected' ? 'success' : state === 'error' ? 'error' : state === 'connecting' ? 'brand' : 'neutral'}>
          {state}
        </Pill>
      </p>
    </div>
  );
}

export function ConnectionDemo() {
  const [simulateError, setSimulateError] = useState(false);
  const reduced = useReducedMotion();
  const { state, elapsed, log, toggle, retry, reset } = useConnectionDemo(simulateError);

  const toast =
    state === 'error' ? (
      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: EASE_DECELERATE }}
        className="absolute inset-x-3 top-1 z-10"
      >
        <Alert variant="error" className="shadow-level-3">
          <CircleX aria-hidden />
          <AlertTitle>连接失败，请重试</AlertTitle>
          <AlertDescription>
            <Button size="sm" variant="outline" onClick={retry}>
              重试
            </Button>
          </AlertDescription>
        </Alert>
      </motion.div>
    ) : null;

  return (
    <Preview
      label="连接流程交互演示"
      centered={false}
      code={CODE_DEMO}
      toolbar={
        <>
          <span className="flex items-center gap-2">
            <Switch id="connection-simulate-error" size="sm" checked={simulateError} onCheckedChange={setSimulateError} />
            <Label htmlFor="connection-simulate-error" className="text-sm">
              模拟失败
            </Label>
          </span>
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcw aria-hidden />
            重置
          </Button>
        </>
      }
    >
      <div className="grid w-full grid-cols-1 items-start gap-6 @min-[720px]:grid-cols-[minmax(0,320px)_1fr]">
        <div className="mx-auto min-w-0 w-full max-w-[320px]">
          <HomeScreen state={state} elapsed={elapsed} onToggle={toggle} overlay={toast} />
        </div>
        <EventLog state={state} log={log} />
      </div>
    </Preview>
  );
}
