import * as React from 'react';
import { Search, X } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface SearchBarProps extends Omit<React.ComponentProps<'input'>, 'value' | 'onChange' | 'size'> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Called after the clear button resets the value to "". */
  onClear?: () => void;
  /** Class for the outer field (className applies to the outer field as well). */
  inputClassName?: string;
}

function SearchBar({
  value,
  onChange,
  placeholder = '搜索国家、城市或节点',
  onClear,
  className,
  inputClassName,
  disabled,
  ...props
}: SearchBarProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const clear = () => {
    onChange('');
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <div
      role="search"
      data-slot="search-bar"
      data-disabled={disabled || undefined}
      className={cn(
        'relative flex h-control-md w-full items-center rounded-md border border-border-default bg-bg-surface text-fg-primary',
        'transition-[border-color,box-shadow,background-color] duration-(--duration-base) ease-standard',
        'hover:border-border-strong focus-within:border-border-focus focus-within:shadow-focus focus-within:hover:border-border-focus',
        'data-[disabled]:border-action-disabled-border data-[disabled]:bg-action-disabled-bg',
        className,
      )}
    >
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 size-5 text-fg-muted"
        strokeWidth={1.75}
      />
      <input
        ref={inputRef}
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        spellCheck={false}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={props['aria-labelledby'] ? undefined : (props['aria-label'] ?? placeholder)}
        disabled={disabled}
        data-slot="search-bar-input"
        className={cn(
          'h-full w-full min-w-0 bg-transparent pr-11 pl-11 text-body-md text-fg-primary outline-none placeholder:text-fg-placeholder',
          'disabled:cursor-not-allowed disabled:text-action-disabled-fg',
          '[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none',
          inputClassName,
        )}
        {...props}
      />
      {value ? (
        <button
          type="button"
          aria-label="清除搜索"
          data-slot="search-bar-clear"
          onClick={clear}
          disabled={disabled}
          className={cn(
            'absolute right-0 flex size-11 items-center justify-center rounded-md text-fg-secondary',
            'transition-colors duration-(--duration-fast) outline-none hover:bg-slate-200 hover:text-fg-primary focus-visible:shadow-focus',
          )}
        >
          <X className="size-4" strokeWidth={2} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

export { SearchBar };
