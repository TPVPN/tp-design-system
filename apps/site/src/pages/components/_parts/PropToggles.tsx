import { useId } from 'react';
import { Switch } from '@tpvpn/ui/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@tpvpn/ui/components/ui/toggle-group';

export interface PropSelectOption<T extends string> {
  value: T;
  label?: string;
}

export interface PropSelectProps<T extends string> {
  /** Prop name shown as the group label, e.g. `size`. */
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly PropSelectOption<T>[];
}

/** Single-choice prop switcher for a Preview toolbar (kit ToggleGroup). */
export function PropSelect<T extends string>({ label, value, onChange, options }: PropSelectProps<T>) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-[11px] text-fg-muted">{label}</span>
      <ToggleGroup
        type="single"
        size="sm"
        variant="outline"
        value={value}
        onValueChange={(next) => {
          if (next) onChange(next as T);
        }}
        aria-label={label}
        className="flex-wrap"
      >
        {options.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value} className="h-7 px-2 text-xs">
            {option.label ?? option.value}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

export interface PropSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/** Boolean prop switcher for a Preview toolbar (kit Switch, small). */
export function PropSwitch({ label, checked, onChange }: PropSwitchProps) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2 font-mono text-[11px] text-fg-muted select-none">
      <Switch id={id} size="sm" checked={checked} onCheckedChange={onChange} />
      {label}
    </label>
  );
}
