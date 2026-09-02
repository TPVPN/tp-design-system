import { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button, ConnectionButton, StatusDot, ToggleGroup, ToggleGroupItem, connectionStateLabel, type ConnectionState } from '@tpvpn/ui';
import { Preview } from '@/components/docs';
import { token } from '@/lib/tokens';

const CONNECT_MS = parseFloat(token('duration.connect')) || 1200;

const CODE = `import { useState } from 'react';
import { ConnectionButton, type ConnectionState } from '@tpvpn/ui';

function Home() {
  const [state, setState] = useState<ConnectionState>('disconnected');

  // connecting → connected 由隧道握手结果驱动；这里用 2 × duration.connect 模拟
  const toggle = () => {
    if (state === 'connected') return setState('disconnected');
    setState('connecting');
    setTimeout(() => setState('connected'), ${CONNECT_MS * 2});
  };

  return <ConnectionButton state={state} size="mobile" onClick={toggle} />;
}`;

const pad = (n: number) => String(n).padStart(2, '0');
const fmt = (s: number) => `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;

/** Interactive ConnectionButton: click cycles disconnected → connecting → connected → disconnected. */
export function ConnectionDemo() {
  const [state, setState] = useState<ConnectionState>('disconnected');
  const [size, setSize] = useState<'mobile' | 'desktop'>('mobile');
  const [seconds, setSeconds] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (state !== 'connected') {
      setSeconds(0);
      return;
    }
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [state]);

  const reset = () => {
    window.clearTimeout(timer.current);
    setState('disconnected');
  };

  const onClick = () => {
    window.clearTimeout(timer.current);
    if (state === 'disconnected' || state === 'error') {
      setState('connecting');
      timer.current = window.setTimeout(() => setState('connected'), CONNECT_MS * 2);
    } else {
      setState('disconnected');
    }
  };

  return (
    <Preview
      background="canvas"
      label="连接按钮动画演示"
      minHeight={320}
      code={CODE}
      toolbar={
        <>
          <ToggleGroup type="single" size="sm" variant="outline" value={size} onValueChange={(v) => v && setSize(v as 'mobile' | 'desktop')} aria-label="尺寸" className="flex-wrap">
            <ToggleGroupItem value="mobile">128 手机</ToggleGroupItem>
            <ToggleGroupItem value="desktop">160 桌面</ToggleGroupItem>
          </ToggleGroup>
          <span className="ml-1 inline-flex items-center gap-2 text-sm text-fg-secondary">
            <StatusDot state={state} size={8} />
            {connectionStateLabel[state]}
            <span className="font-mono text-[12px] text-fg-muted">{state}</span>
          </span>
          <Button size="sm" variant="ghost" onClick={reset} className="ml-auto">
            <RotateCcw aria-hidden />
            重置
          </Button>
        </>
      }
    >
      <ConnectionButton state={state} size={size} onClick={onClick} elapsed={state === 'connected' ? fmt(seconds) : undefined} />
    </Preview>
  );
}
