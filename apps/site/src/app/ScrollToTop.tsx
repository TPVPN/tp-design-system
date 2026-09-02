import { useEffect } from 'react';
import { useLocation } from 'react-router';

const HEADER_OFFSET = 88;

/**
 * On pathname change: scroll to top (instantly — the page-enter animation handles the motion).
 * With a hash: wait for the (lazy) page to render, then scroll to the anchor.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    let raf = 0;
    const attempt = () => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
        window.scrollTo({ top, behavior: 'instant' });
        return;
      }
      if (tries++ < 60) raf = requestAnimationFrame(attempt);
    };
    raf = requestAnimationFrame(attempt);
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);

  return null;
}
