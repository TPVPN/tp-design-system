import * as React from 'react';
import { CircleCheck, CircleX, Info, TriangleAlert, X, type LucideIcon } from 'lucide-react';
import { Toast as ToastPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type ToastTone = 'neutral' | 'success' | 'warning' | 'error' | 'info';

export interface ToastActionOptions {
  /** Button text, e.g. 「撤销」. */
  label: string;
  onClick: () => void;
  /** Screen-reader alternative (Radix `altText`). Defaults to `label`. */
  altText?: string;
}

export interface ToastOptions {
  title: string;
  description?: string;
  /** @default 'neutral' */
  tone?: ToastTone;
  /** Milliseconds before auto-dismiss. `Infinity` keeps it open. @default 4000 */
  duration?: number;
  action?: ToastActionOptions;
}

export interface ToastItem extends ToastOptions {
  id: string;
  tone: ToastTone;
  duration: number;
  /** `false` while the exit animation plays. */
  open: boolean;
}

export interface ToastHandle {
  id: string;
  dismiss: () => void;
  update: (options: Partial<ToastOptions>) => void;
}

/* ------------------------------------------------------------------ */
/* Store (useSyncExternalStore)                                        */
/* ------------------------------------------------------------------ */

/** Maximum toasts on screen — the oldest is dismissed when a fourth arrives. */
export const TOAST_LIMIT = 3;
/** Default auto-dismiss delay in ms. */
export const TOAST_DURATION = 4000;
/** Delay before a dismissed toast is removed from the store (≥ exit animation). */
const REMOVE_DELAY = 400;

type Listener = () => void;

let toasts: readonly ToastItem[] = [];
let sequence = 0;
const listeners = new Set<Listener>();
const removeTimers = new Map<string, ReturnType<typeof setTimeout>>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return toasts;
}

const EMPTY: readonly ToastItem[] = [];
function getServerSnapshot() {
  return EMPTY;
}

function removeToast(id: string) {
  removeTimers.delete(id);
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

/** Close a toast (plays the exit animation, then removes it). Without `id` closes all. */
export function dismissToast(id?: string) {
  const targets = id ? toasts.filter((t) => t.id === id && t.open) : toasts.filter((t) => t.open);
  if (targets.length === 0) return;
  toasts = toasts.map((t) => (targets.includes(t) ? { ...t, open: false } : t));
  emit();
  for (const t of targets) {
    if (!removeTimers.has(t.id)) removeTimers.set(t.id, setTimeout(() => removeToast(t.id), REMOVE_DELAY));
  }
}

/** Imperative API — works outside React (services, stores, event handlers). */
export function toast(options: ToastOptions): ToastHandle {
  const id = `toast-${++sequence}`;
  const item: ToastItem = {
    ...options,
    id,
    tone: options.tone ?? 'neutral',
    duration: options.duration ?? TOAST_DURATION,
    open: true,
  };

  // Stack at most TOAST_LIMIT: dismiss the oldest open toast(s) first.
  const open = toasts.filter((t) => t.open);
  for (const stale of open.slice(0, Math.max(0, open.length - (TOAST_LIMIT - 1)))) dismissToast(stale.id);

  toasts = [...toasts, item];
  emit();

  return {
    id,
    dismiss: () => dismissToast(id),
    update: (next) => {
      toasts = toasts.map((t) => (t.id === id ? { ...t, ...next, id } : t));
      emit();
    },
  };
}

toast.success = (title: string, options: Omit<ToastOptions, 'title' | 'tone'> = {}) => toast({ ...options, title, tone: 'success' });
toast.warning = (title: string, options: Omit<ToastOptions, 'title' | 'tone'> = {}) => toast({ ...options, title, tone: 'warning' });
toast.error = (title: string, options: Omit<ToastOptions, 'title' | 'tone'> = {}) => toast({ ...options, title, tone: 'error' });
toast.info = (title: string, options: Omit<ToastOptions, 'title' | 'tone'> = {}) => toast({ ...options, title, tone: 'info' });
toast.dismiss = dismissToast;

/** Subscribe to the toast store. Returns the live list plus the imperative helpers. */
export function useToast() {
  const items = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { toasts: items, toast, dismiss: dismissToast };
}

/* ------------------------------------------------------------------ */
/* Presentation                                                        */
/* ------------------------------------------------------------------ */

const toneIcon: Record<Exclude<ToastTone, 'neutral'>, LucideIcon> = {
  success: CircleCheck,
  warning: TriangleAlert,
  error: CircleX,
  info: Info,
};

const toneIconClass: Record<Exclude<ToastTone, 'neutral'>, string> = {
  success: 'text-status-success-solid',
  warning: 'text-status-warning-solid',
  error: 'text-status-error-solid',
  info: 'text-status-info-solid',
};

export interface ToastCardProps extends Omit<React.ComponentProps<typeof ToastPrimitive.Root>, 'title'> {
  item: ToastItem;
}

/** One toast (`<li>`): tone icon · title + description · optional action · close. */
function ToastCard({ item, className, ...props }: ToastCardProps) {
  const tone = item.tone === 'neutral' ? null : item.tone;
  const Icon = tone ? toneIcon[tone] : null;
  const isError = item.tone === 'error';

  return (
    <ToastPrimitive.Root
      data-slot="toast"
      data-tone={item.tone}
      open={item.open}
      onOpenChange={(open) => {
        if (!open) dismissToast(item.id);
      }}
      duration={item.duration}
      type={isError ? 'foreground' : 'background'}
      role={isError ? 'alert' : 'status'}
      className={cn(
        'group/toast pointer-events-auto relative flex w-full items-start gap-3 rounded-lg border border-border-default bg-bg-surface py-3 pr-10 pl-4 text-fg-primary shadow-level-3',
        // enter: 200ms decelerate, 8px rise (mobile) / drop (desktop) · exit: 150ms accelerate
        'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-2 md:data-[state=open]:slide-in-from-top-2',
        'data-[state=open]:duration-(--duration-base) data-[state=open]:ease-decelerate',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-right-full',
        'data-[state=closed]:duration-(--duration-quick) data-[state=closed]:ease-accelerate',
        // swipe (direction: right)
        'data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x) data-[swipe=move]:transition-none',
        'data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform data-[swipe=cancel]:duration-(--duration-base)',
        'data-[swipe=end]:animate-out data-[swipe=end]:fade-out-0 data-[swipe=end]:slide-out-to-right-full',
        className,
      )}
      {...props}
    >
      {Icon && tone && <Icon data-slot="toast-icon" className={cn('mt-0.5 size-5 shrink-0', toneIconClass[tone])} aria-hidden="true" />}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <ToastPrimitive.Title data-slot="toast-title" className="text-label-md text-fg-primary">
          {item.title}
        </ToastPrimitive.Title>
        {item.description ? (
          <ToastPrimitive.Description data-slot="toast-description" className="text-body-sm text-fg-secondary">
            {item.description}
          </ToastPrimitive.Description>
        ) : null}
        {item.action ? (
          <div className="mt-2">
            <ToastPrimitive.Action altText={item.action.altText ?? item.action.label} asChild>
              <Button data-slot="toast-action" size="sm" variant="secondary" onClick={item.action.onClick}>
                {item.action.label}
              </Button>
            </ToastPrimitive.Action>
          </div>
        ) : null}
      </div>
      <ToastPrimitive.Close
        data-slot="toast-close"
        aria-label="关闭"
        className={cn(
          'absolute top-2 right-2 flex size-8 items-center justify-center rounded-full text-fg-muted',
          'transition-[background-color,color] duration-(--duration-fast) hover:bg-bg-surface-sunken hover:text-fg-primary',
          'outline-none focus-visible:shadow-focus',
        )}
      >
        <X className="size-4" aria-hidden="true" />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
}

export interface ToasterProps {
  /** Extra classes for the viewport (`<ol>`). */
  className?: string;
  /** Screen-reader label for the region; `{hotkey}` is replaced by Radix. @default '通知 ({hotkey})' */
  label?: string;
  /** Keyboard shortcut that focuses the viewport. @default ['F8'] */
  hotkey?: string[];
}

/**
 * Mount once near the app root. Renders every toast from the store:
 * bottom-centre on mobile, top-right from `md`; swipe right to dismiss; stacks up to 3.
 */
function Toaster({ className, label = '通知 ({hotkey})', hotkey }: ToasterProps) {
  const { toasts: items } = useToast();

  return (
    <ToastPrimitive.Provider label="通知" duration={TOAST_DURATION} swipeDirection="right" swipeThreshold={50}>
      {items.map((item) => (
        <ToastCard key={item.id} item={item} />
      ))}
      <ToastPrimitive.Viewport
        data-slot="toaster"
        label={label}
        hotkey={hotkey}
        className={cn(
          'pointer-events-none fixed z-[1300] m-0 flex w-full list-none flex-col gap-2 p-4 outline-none',
          // mobile: bottom-centre, above the home indicator
          'bottom-0 left-1/2 max-w-[calc(100%-1rem)] -translate-x-1/2 pb-[max(1rem,env(safe-area-inset-bottom))] sm:max-w-sm',
          // ≥ md: top-right
          'md:inset-auto md:top-4 md:right-4 md:max-w-sm md:translate-x-0 md:p-0',
          className,
        )}
      />
    </ToastPrimitive.Provider>
  );
}

export { Toaster, ToastCard };
