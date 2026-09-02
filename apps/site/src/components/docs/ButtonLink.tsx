import type { VariantProps } from 'class-variance-authority';
import { Link, type LinkProps } from 'react-router';
import { buttonVariants } from '@tpvpn/ui/components/ui/button';
import { cn } from '@/lib/cn';

export type ButtonLinkProps = LinkProps & VariantProps<typeof buttonVariants>;

/**
 * React Router <Link> that looks exactly like the kit's <Button> (same cva variants),
 * for in-app navigation CTAs. For external URLs use `<a className={buttonVariants({...})}>`.
 */
export function ButtonLink({ variant = 'primary', size = 'md', pill = false, className, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonVariants({ variant, size, pill }), className)} {...props} />;
}

export { buttonVariants };
