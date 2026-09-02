import { useCallback, useEffect, useRef, useState } from 'react';

/** Copy text to the clipboard with a legacy fallback. Resolves `true` on success. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the legacy path */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

export interface UseCopyResult {
  /** `true` for `timeout` ms after a successful copy — render an inline “Copied” state. */
  copied: boolean;
  copy: (text: string) => Promise<boolean>;
  reset: () => void;
}

/** `const { copied, copy } = useCopy();` → `<button onClick={() => copy(hex)}>{copied ? 'Copied' : 'Copy'}</button>` */
export function useCopy(timeout = 1600): UseCopyResult {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const reset = useCallback(() => {
    window.clearTimeout(timer.current);
    setCopied(false);
  }, []);

  const copy = useCallback(
    async (text: string) => {
      const ok = await copyText(text);
      if (ok) {
        setCopied(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), timeout);
      }
      return ok;
    },
    [timeout],
  );

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return { copied, copy, reset };
}
