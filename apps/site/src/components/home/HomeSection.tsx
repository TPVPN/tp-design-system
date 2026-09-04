import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/cn';
import { useReveal, VIEWPORT_ONCE } from '@/lib/motion';

export interface HomeSectionProps {
  id: string;
  eyebrow?: string;
  title: string;
  en?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  /** Extra node placed to the right of the heading (e.g. a link). */
  aside?: ReactNode;
}

/** Home-page section: heading row (reveals on scroll) + content. */
export function HomeSection({ id, eyebrow, title, en, description, children, className, aside }: HomeSectionProps) {
  const { container, item } = useReveal({ stagger: 0.06 });
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn('py-16 lg:py-24', className)}>
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_ONCE}
          className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            {eyebrow && (
              <motion.p variants={item} className="eyebrow text-fg-brand">
                {eyebrow}
              </motion.p>
            )}
            <motion.h2 variants={item} id={`${id}-title`} className="mt-3 text-display-sm text-fg-primary sm:text-display-md">
              {title}
            </motion.h2>
            {en && <motion.p variants={item} lang="en" className="mt-3 text-body-md text-fg-muted">{en}</motion.p>}
            {description && (
              <motion.p variants={item} className="mt-4 max-w-[58ch] text-body-lg text-fg-secondary">
                {description}
              </motion.p>
            )}
          </div>
          {aside && (
            <motion.div variants={item} className="shrink-0">
              {aside}
            </motion.div>
          )}
        </motion.div>
        {children}
      </div>
    </section>
  );
}
