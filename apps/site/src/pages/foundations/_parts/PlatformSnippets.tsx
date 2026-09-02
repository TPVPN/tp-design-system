import { Tabs, TabsContent, TabsList, TabsTrigger } from '@tpvpn/ui';
import { cn } from '@/lib/cn';
import { CodeBlock } from '@/components/docs';

export interface Snippet {
  id: string;
  /** Tab label, e.g. `CSS`, `Tailwind`, `Dart`, `Swift` */
  label: string;
  lang: string;
  code: string;
  filename?: string;
}

/**
 * “Same token, every platform” tab set. Only the active tab is mounted, so shiki
 * highlights one grammar at a time.
 */
export function PlatformSnippets({
  snippets,
  defaultId,
  label = '代码格式',
  className,
}: {
  snippets: Snippet[];
  defaultId?: string;
  label?: string;
  className?: string;
}) {
  const first = snippets[0];
  if (!first) return null;
  return (
    <Tabs defaultValue={defaultId ?? first.id} className={cn('my-6 gap-3', className)}>
      <TabsList variant="line" aria-label={label} className="w-full justify-start overflow-x-auto">
        {snippets.map((s) => (
          <TabsTrigger key={s.id} value={s.id} className="flex-none">
            {s.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {snippets.map((s) => (
        <TabsContent key={s.id} value={s.id}>
          <CodeBlock code={s.code} lang={s.lang} filename={s.filename} className="my-0" />
        </TabsContent>
      ))}
    </Tabs>
  );
}
