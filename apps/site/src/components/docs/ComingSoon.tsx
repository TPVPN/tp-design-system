import { Construction } from 'lucide-react';
import { findNavItem, findSection } from '@/app/routes';
import { PageHeader } from '@/components/docs/PageHeader';

/** Placeholder page body — replaced by real content pages (see src/pages/README.md). */
export function ComingSoon({ path }: { path: string }) {
  const item = findNavItem(path);
  const section = findSection(path);
  return (
    <>
      <PageHeader
        eyebrow={section ? `${section.title} · ${section.en}` : undefined}
        title={item?.title ?? path}
        en={item?.en}
        description={item?.description}
      />
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-bg-surface px-6 py-20 text-center">
        <div className="flex size-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Construction className="size-6" aria-hidden />
        </div>
        <p className="mt-5 text-title-md text-fg-primary">内容建设中</p>
        <p className="mt-1 text-fg-muted">Coming soon</p>
        {item?.description && <p className="mt-6 max-w-md text-sm leading-6 text-fg-secondary">规划内容：{item.description}</p>}
      </div>
    </>
  );
}
