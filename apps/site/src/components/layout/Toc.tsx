import { useEffect, useState, type RefObject } from 'react';
import { useLocation } from 'react-router';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/cn';

interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

/** Heading label: `data-toc-label` wins; otherwise visible child texts joined with spaces (skips the anchor link). */
function headingLabel(h: HTMLHeadingElement): string {
  if (h.dataset.tocLabel) return h.dataset.tocLabel;
  return Array.from(h.childNodes)
    .filter((n) => !(n instanceof HTMLAnchorElement))
    .map((n) => n.textContent?.trim() ?? '')
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ');
}

function collectHeadings(root: HTMLElement | null): Heading[] {
  if (!root) return [];
  const nodes = root.querySelectorAll<HTMLHeadingElement>('h2[id], h3[id]');
  return Array.from(nodes)
    .filter((h) => h.id && !h.dataset.tocIgnore)
    .map((h) => ({ id: h.id, text: headingLabel(h), level: h.tagName === 'H2' ? 2 : 3 }));
}

/** Right rail (≥ xl, 220px): builds from h2/h3 in the article and tracks the active one. */
export function Toc({ containerRef }: { containerRef: RefObject<HTMLElement | null> }) {
  const { pathname } = useLocation();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Collect headings once the (lazy) page has rendered, and again on DOM changes.
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    let timer = 0;
    const update = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setHeadings(collectHeadings(root)), 80);
    };
    update();
    const mo = new MutationObserver(update);
    mo.observe(root, { childList: true, subtree: true, characterData: true });
    return () => {
      mo.disconnect();
      window.clearTimeout(timer);
    };
  }, [containerRef, pathname]);

  // Track the active heading.
  useEffect(() => {
    if (headings.length === 0) {
      setActiveId(null);
      return;
    }
    const visible = new Map<string, boolean>();
    const pick = () => {
      const first = headings.find((h) => visible.get(h.id));
      if (first) {
        setActiveId(first.id);
        return;
      }
      // none in view → the last heading that scrolled above the fold
      let last: string | null = null;
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el && el.getBoundingClientRect().top < 120) last = h.id;
      }
      if (last) setActiveId(last);
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting);
        pick();
      },
      { rootMargin: '-72px 0px -60% 0px', threshold: [0, 1] },
    );
    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) io.observe(el);
    }
    pick();
    return () => io.disconnect();
  }, [headings]);

  return (
    <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-[220px] shrink-0 overflow-y-auto overscroll-contain py-8 pl-6 xl:block">
      {headings.length > 0 && (
        <nav aria-label="本页目录">
          <p className="eyebrow mb-3 text-fg-muted">本页目录</p>
          <ul className="flex flex-col border-l border-border-default">
            {headings.map((h) => {
              const active = h.id === activeId;
              return (
                <li key={h.id}>
                  <a
                    href={`#${h.id}`}
                    aria-current={active ? 'location' : undefined}
                    className={cn(
                      '-ml-px block border-l-2 py-1 pr-2 text-[13px] leading-5 transition-colors duration-200',
                      h.level === 3 ? 'pl-6' : 'pl-3',
                      active
                        ? 'border-blue-600 font-medium text-blue-700'
                        : 'border-transparent text-fg-muted hover:border-border-strong hover:text-fg-primary',
                    )}
                  >
                    {h.text}
                  </a>
                </li>
              );
            })}
          </ul>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="mt-6 inline-flex items-center gap-1 text-[12px] text-fg-muted transition-colors hover:text-fg-primary"
          >
            <ArrowUp className="size-3.5" aria-hidden />
            回到顶部
          </a>
        </nav>
      )}
    </aside>
  );
}
