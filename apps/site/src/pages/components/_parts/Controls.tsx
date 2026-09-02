import { useId } from 'react';
import { Switch } from '@tpvpn/ui/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@tpvpn/ui/components/ui/toggle-group';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedProps<T extends string> {
  /** Visible group label (also the accessible name). */
  label: string;
  value: T;
  options: readonly SegmentOption<T>[];
  onChange: (value: T) => void;
}

/** Labelled single-select segment built on the kit's ToggleGroup — for Preview toolbars. */
export function Segmented<T extends string>({ label, value, options, onChange }: SegmentedProps<T>) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-fg-muted">{label}</span>
      <ToggleGroup
        type="single"
        variant="outline"
        size="sm"
        value={value}
        onValueChange={(next) => {
          // Radix emits "" when the active item is clicked again — keep the current value instead.
          if (next) onChange(next as T);
        }}
        aria-label={label}
        className="flex-wrap"
      >
        {options.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value} className="px-2.5 text-xs">
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

export interface SwitchControlProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

/** Labelled small Switch for Preview toolbars. */
export function SwitchControl({ label, checked, onCheckedChange }: SwitchControlProps) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2 text-xs text-fg-secondary select-none">
      <Switch id={id} size="sm" checked={checked} onCheckedChange={onCheckedChange} />
      {label}
    </label>
  );
}

/** Builds a JSX attribute string from `[name, value]` pairs; falsy values are dropped, `true` renders bare. */
export function jsxAttrs(pairs: Array<[string, string | number | boolean | null | undefined]>): string {
  return pairs
    .filter(([, v]) => v !== false && v !== null && v !== undefined && v !== '')
    .map(([k, v]) => (v === true ? k : typeof v === 'number' ? `${k}={${v}}` : `${k}="${v}"`))
    .join(' ');
}
