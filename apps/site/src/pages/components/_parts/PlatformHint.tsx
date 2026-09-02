import type { ReactNode } from 'react';
import { Callout, CodeBlock } from '@/components/docs';

export interface PlatformHintProps {
  /** Flutter mapping (widget + `TpTokens.*` names). */
  flutter: ReactNode;
  /** iOS mapping (SwiftUI / UIKit + `TPTokens.*` names). */
  ios: ReactNode;
  /** Dart snippet (required — every component page ships one). */
  dart: string;
  dartFilename?: string;
  /** Optional Swift snippet. */
  swift?: string;
  swiftFilename?: string;
}

/** “Flutter / iOS 对应” block: a Callout with both mappings, followed by the code samples. */
export function PlatformHint({ flutter, ios, dart, dartFilename, swift, swiftFilename }: PlatformHintProps) {
  return (
    <>
      <Callout title="Flutter / iOS 对应">
        <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-[5rem_1fr]">
          <dt className="font-semibold text-fg-primary">Flutter</dt>
          <dd className="min-w-0 break-words text-fg-secondary">{flutter}</dd>
          <dt className="font-semibold text-fg-primary">iOS</dt>
          <dd className="min-w-0 break-words text-fg-secondary">{ios}</dd>
        </dl>
        <p className="mt-2 text-xs text-fg-secondary">
          Token 常量来自 <code>packages/tokens/dist/dart/tp_tokens.dart</code>（<code>TpTokens</code>）与{' '}
          <code>dist/swift/TPTokens.swift</code>（<code>TPTokens</code>），升级时整文件覆盖。
        </p>
      </Callout>
      <CodeBlock code={dart} lang="dart" filename={dartFilename ?? 'lib/widgets/example.dart'} />
      {swift && <CodeBlock code={swift} lang="swift" filename={swiftFilename ?? 'Sources/Example.swift'} />}
    </>
  );
}
