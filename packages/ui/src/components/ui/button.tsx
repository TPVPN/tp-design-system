import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'group/button relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md whitespace-nowrap select-none',
    'transition-[background-color,border-color,color,box-shadow,transform] duration-(--duration-base) ease-standard',
    'outline-none focus-visible:shadow-focus active:scale-[0.98]',
    'aria-disabled:pointer-events-none disabled:pointer-events-none disabled:shadow-none',
    'disabled:border-action-disabled-border disabled:bg-action-disabled-bg disabled:text-action-disabled-fg',
    'aria-invalid:border-status-error-solid',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  ],
  {
    variants: {
      variant: {
        primary:
          'bg-action-primary-bg text-action-primary-fg shadow-level-1 hover:bg-action-primary-bg-hover active:bg-action-primary-bg-pressed',
        /** shadcn alias of `primary`. */
        default:
          'bg-action-primary-bg text-action-primary-fg shadow-level-1 hover:bg-action-primary-bg-hover active:bg-action-primary-bg-pressed',
        secondary:
          'bg-action-secondary-bg text-action-secondary-fg hover:bg-action-secondary-bg-hover active:bg-action-secondary-bg-pressed',
        ghost:
          'bg-transparent text-action-ghost-fg hover:bg-action-ghost-bg-hover active:bg-action-ghost-bg-pressed disabled:bg-transparent',
        outline:
          'border border-action-outline-border bg-action-outline-bg text-action-outline-fg hover:border-action-outline-border-hover hover:bg-action-outline-bg-hover',
        destructive:
          'bg-action-destructive-bg text-action-destructive-fg shadow-level-1 hover:bg-action-destructive-bg-hover',
        link: 'h-auto rounded-none px-0 text-fg-link underline-offset-4 hover:text-fg-link-hover hover:underline active:scale-100 disabled:bg-transparent',
      },
      size: {
        sm: "h-control-sm px-3 text-label-md has-[>svg]:px-2.5 [&_svg:not([class*='size-'])]:size-4",
        md: 'h-control-md px-5 text-label-md has-[>svg]:px-4',
        /** shadcn alias of `md`. */
        default: 'h-control-md px-5 text-label-md has-[>svg]:px-4',
        lg: 'h-control-lg px-6 text-label-lg has-[>svg]:px-5',
        xl: 'h-control-xl px-7 text-label-lg has-[>svg]:px-6',
        icon: 'size-control-md',
        'icon-sm': "size-control-sm [&_svg:not([class*='size-'])]:size-4",
        'icon-lg': "size-control-lg [&_svg:not([class*='size-'])]:size-6",
      },
      pill: {
        true: 'rounded-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      pill: false,
    },
  },
);

export type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /** Render the child element instead of a <button> (Radix Slot). */
    asChild?: boolean;
    /** Shows a spinner, sets aria-busy and blocks interaction while keeping the variant colours. */
    loading?: boolean;
  };

function Button({
  className,
  variant = 'primary',
  size = 'md',
  pill = false,
  loading = false,
  asChild = false,
  onClick,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button';

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    if (loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      className={cn(buttonVariants({ variant, size, pill }), className)}
      onClick={handleClick}
      {...props}
    >
      {asChild ? (
        // Radix Slot requires exactly one child — never prepend the spinner here.
        children
      ) : (
        <>
          {loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
          {children}
        </>
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
