import { Link } from 'react-router';
import { SITE } from '@/app/routes';
import { LogoMark } from '@/components/brand/LogoMark';

const COLUMNS: { title: string; links: { label: string; to?: string; href?: string }[] }[] = [
  {
    title: '品牌',
    links: [
      { label: 'Logo', to: '/brand/logo' },
      { label: 'App Icon', to: '/brand/app-icon' },
      { label: '品牌色彩', to: '/brand/color' },
      { label: '字体', to: '/brand/typography' },
      { label: '语调与文案', to: '/brand/voice' },
    ],
  },
  {
    title: '资源',
    links: [
      { label: '组件总览', to: '/components' },
      { label: '平台接入', to: '/platforms' },
      { label: '下载中心', to: '/downloads' },
      { label: '更新日志', to: '/changelog' },
      { label: 'GitHub', href: SITE.github },
    ],
  },
  {
    title: '法律',
    links: [
      { label: '代码许可 (MIT)', href: `${SITE.github}/tp-design-system/blob/main/LICENSE` },
      { label: '品牌资产许可', href: `${SITE.github}/tp-design-system/blob/main/LICENSE-BRAND.md` },
      { label: '第三方许可', href: `${SITE.github}/tp-design-system/blob/main/README.md#licenses` },
    ],
  },
];

const FOUNDATIONS = ['Tailwind CSS', 'shadcn/ui', 'Radix', 'Lucide', 'Inter', 'circle-flags'];

export function SiteFooter() {
  return (
    <footer className="border-t border-border-default bg-bg-surface">
      <div className="mx-auto max-w-[1360px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
          <div className="max-w-xs">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <LogoMark size={28} title="" />
              <span className="font-semibold tracking-tight text-fg-primary">{SITE.shortName}</span>
              <span className="text-fg-muted">{SITE.label}</span>
              <span className="sr-only"> · 首页</span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-fg-secondary">
              为可信连接而设计。跨 iOS、Android、Web 与 Figma 的品牌、Token、组件与资产。
            </p>
            <p className="mt-3 font-mono text-xs text-fg-muted">v{SITE.version}</p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="eyebrow mb-4 text-fg-muted">{col.title}</p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.to ? (
                      <Link to={l.to} className="text-sm text-fg-secondary transition-colors hover:text-fg-primary">
                        {l.label}
                      </Link>
                    ) : (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-fg-secondary transition-colors hover:text-fg-primary"
                      >
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-border-subtle pt-6 text-xs text-fg-muted md:flex-row md:items-center md:justify-between">
          <p>© {SITE.year} TP VPN. 品牌资产保留所有权利；代码以 MIT 许可发布。</p>
          <p>
            Built on open-source foundations:{' '}
            {FOUNDATIONS.map((f, i) => (
              <span key={f}>
                {i > 0 && <span aria-hidden> · </span>}
                <span className="text-fg-secondary">{f}</span>
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
