import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { NAV } from '@/app/routes';
import { HomeSection } from './HomeSection';

/** A real sitemap, generated from the same manifest as navigation and search. */
export function SystemMap() {
  return (
    <HomeSection id="sitemap" eyebrow="SYSTEM MAP" title="找到你需要的规范。" description="品牌定义我们是谁，基础定义共同语言，组件与模式定义每一次操作。">
      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {NAV.map((section, index) => (
          <div key={section.id} className="border-t border-border-default pt-5">
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <h3 className="text-title-sm text-fg-primary">{section.title}</h3>
              <span className="font-mono text-[13px] text-fg-muted">0{index + 1}</span>
            </div>
            <details open>
              <summary className="cursor-pointer py-3 text-sm text-fg-secondary">{section.en} · {section.items.length} 项规范</summary>
              <ul className="mt-2">
                {section.items.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="flex min-h-11 items-center justify-between gap-3 rounded-md px-3 py-2 text-sm text-fg-secondary hover:bg-blue-50 hover:text-blue-700">
                      {item.title}<ArrowUpRight className="size-4" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        ))}
      </div>
      <Link to="/sitemap" className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm text-blue-700">查看完整网站地图 <ArrowUpRight className="size-4" aria-hidden /></Link>
    </HomeSection>
  );
}
