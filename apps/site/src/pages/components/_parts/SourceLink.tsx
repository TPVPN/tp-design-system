import { CopyButton } from '@/components/docs';

export interface SourceLinkProps {
  /** Repository path of the component source, e.g. `packages/ui/src/components/tp/tag.tsx`. */
  path: string;
  /** Named exports shown in the import chip, e.g. `['Tag', 'sceneIcon']`. */
  exports: string[];
}

/**
 * PageHeader actions for a component page: the source path and a copy-pastable import line.
 * Both are plain text chips with copy buttons (no dead links).
 */
export function SourceLink({ path, exports }: SourceLinkProps) {
  const importLine = `import { ${exports.join(', ')} } from '@tpvpn/ui';`;
  return (
    <>
      <Chip label="源码" text={path} />
      <Chip label="导入" text={importLine} />
    </>
  );
}

function Chip({ label, text }: { label: string; text: string }) {
  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-md border border-border-default bg-bg-surface py-1 pr-1 pl-3 shadow-level-1">
      <span className="eyebrow shrink-0 text-fg-muted">{label}</span>
      <span className="truncate font-mono text-[12px] text-fg-secondary" title={text}>
        {text}
      </span>
      <CopyButton text={text} size="sm" />
    </span>
  );
}
