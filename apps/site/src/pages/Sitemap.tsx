import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { NAV, DOC_ITEMS } from '@/app/routes';
import { PageHeader, Section } from '@/components/docs';
export default function Sitemap() {
 return <><PageHeader eyebrow={`System index / ${DOC_ITEMS.length} pages`} title="网站地图" en="Everything, in its place." description="从品牌基础到原生交互，一份完整索引。" actions={<Link to="/downloads" className="reference-download">下载品牌素材 ↗</Link>} /><div className="grid gap-x-10 lg:grid-cols-2">{NAV.map(section => <Section key={section.id} id={`map-${section.id}`} title={section.title} en={`${section.en} · ${section.items.length}`}><ul className="divide-y divide-border-subtle">{section.items.map(item => <li key={item.path}><Link to={item.path} className="flex min-h-12 items-center justify-between gap-4 py-3 text-fg-secondary hover:text-fg-brand"><span>{item.title}</span><ArrowUpRight className="size-4 shrink-0" aria-hidden /></Link></li>)}</ul></Section>)}</div></>;
}
