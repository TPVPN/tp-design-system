import type { ReactNode } from 'react';
import { Callout, CodeBlock } from '@/components/docs';

export interface PlatformRow {
  /** Web side (component / token / class). */
  web: ReactNode;
  flutter: ReactNode;
  ios: ReactNode;
}

export interface PlatformMappingProps {
  rows: PlatformRow[];
  /** Dart snippet rendered under the table. */
  dart?: string;
  dartFilename?: string;
  /** Optional Swift snippet. */
  swift?: string;
  swiftFilename?: string;
  children?: ReactNode;
}

/** “Flutter / iOS 对应” block: mapping table inside an info Callout + code snippets. */
export function PlatformMapping({ rows, dart, dartFilename = 'lib/widgets/example.dart', swift, swiftFilename = 'Example.swift', children }: PlatformMappingProps) {
  return (
    <>
      <Callout tone="info" title="Flutter / iOS 对应">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-left text-[13px] leading-5">
            <thead>
              <tr className="text-xs text-fg-secondary">
                <th className="pr-4 pb-2 font-medium">Web</th>
                <th className="pr-4 pb-2 font-medium">Flutter · forui + TpTokens</th>
                <th className="pb-2 font-medium">iOS · SwiftUI + TPTokens</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className="border-t border-status-info-border/70 align-top">
                  <td className="py-1.5 pr-4 text-fg-primary">{row.web}</td>
                  <td className="py-1.5 pr-4 text-fg-secondary">{row.flutter}</td>
                  <td className="py-1.5 text-fg-secondary">{row.ios}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {children}
      </Callout>
      {dart && <CodeBlock code={dart} lang="dart" filename={dartFilename} />}
      {swift && <CodeBlock code={swift} lang="swift" filename={swiftFilename} />}
    </>
  );
}
