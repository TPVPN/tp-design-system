import { useMemo } from 'react';
import { Braces, FileCode } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@tpvpn/ui';
import { ButtonLink, Callout, CodeBlock, DocTable, DownloadCard, Grid, PageHeader, Prose, Section, SubSection } from '@/components/docs';
import {
  CODE_CSS,
  CODE_DART_BUTTON,
  CODE_DART_THEME,
  CODE_FIGMA,
  CODE_KOTLIN,
  CODE_SWIFTUI,
  CODE_SWIFT_UIKIT,
  CODE_TAILWIND_CSS,
  CODE_TAILWIND_TSX,
  CODE_UI_CSS,
  CODE_UI_TSX,
  CODE_XML,
} from './_parts/platformSnippets';
import { TOKEN_DIST_FILES, tokenDistFiles, useFileSizes, type TokenDistFile } from './_parts/tokenFiles';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const NAMING: { path: string; css: string; tw: string; native: string; xml: string; figma: string }[] = [
  { path: 'color.bg.canvas', css: '--tp-color-bg-canvas', tw: '--color-bg-canvas → bg-bg-canvas', native: 'colorBgCanvas', xml: '@color/tp_color_bg_canvas', figma: 'color.bg.canvas' },
  { path: 'radius.lg', css: '--tp-radius-lg', tw: '--radius-lg → rounded-lg', native: 'radiusLg', xml: '@dimen/tp_radius_lg', figma: 'radius.lg' },
  {
    path: 'typography.title-lg',
    css: '--tp-typography-title-lg-font-size · -line-height · -font-weight · -letter-spacing',
    tw: '--text-title-lg → text-title-lg',
    native: 'typographyTitleLg（TextStyle / TPTextStyle / TpTextStyle）',
    xml: '—（仅原始值 @dimen/tp_font_size_24）',
    figma: 'typography.title-lg → Text Style',
  },
  {
    path: 'elevation.level-2',
    css: '--tp-elevation-level-2',
    tw: '--shadow-level-2 → shadow-level-2',
    native: 'elevationLevel2（List<BoxShadow> / [TPShadow] / List<TpShadow>）',
    xml: '—',
    figma: 'elevation.level-2 → Effect Style',
  },
  { path: 'space.4', css: '--tp-space-4', tw: '--spacing: 0.25rem → p-4 / gap-4', native: 'space4', xml: '@dimen/tp_space_4', figma: 'space.4' },
  { path: 'size.control.md', css: '--tp-size-control-md', tw: '--spacing-control-md → h-control-md', native: 'sizeControlMd', xml: '@dimen/tp_size_control_md', figma: 'size.control.md' },
  { path: 'duration.base', css: '--tp-duration-base', tw: '--duration-base → duration-(--duration-base)', native: 'durationBase（Duration / TimeInterval / Int ms）', xml: '—', figma: 'duration.base' },
  { path: 'easing.standard', css: '--tp-easing-standard', tw: '--ease-standard → ease-standard', native: 'easingStandard（Cubic / [CGFloat] / FloatArray）', xml: '—', figma: 'easing.standard' },
];

const SYNC: [string, string, string][] = [
  ['Web workspace（本仓库 / @tpvpn/ui）', '依赖 workspace:*，随仓库升级', 'CI · tsc'],
  ['tp-web（Next.js）', '覆盖 app/tokens.css', 'git diff'],
  ['Flutter（tp-app）', '覆盖 lib/core/theme/tp_tokens.dart', 'flutter analyze'],
  ['iOS / Android', '覆盖 TPTokens.swift · TpTokens.kt · values/*.xml', '编译'],
  ['Figma', 'Tokens Studio 重新导入并 Export to Figma', '插件 diff'],
];

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function FileCards({ files, sizes }: { files: TokenDistFile[]; sizes: Record<string, number> }) {
  return (
    <Grid cols={2} className="my-6">
      {files.map((f) => (
        <DownloadCard
          key={f.href}
          title={`${f.format}/${f.file}`}
          description={`${f.label} · ${f.platform}`}
          href={f.href}
          bytes={sizes[f.href] ?? f.bytes}
          formats={[f.lang.toUpperCase()]}
          icon={f.lang === 'json' ? <Braces aria-hidden /> : <FileCode aria-hidden />}
          filename={f.file.split('/').pop()}
        />
      ))}
    </Grid>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function PlatformsPage() {
  const urls = useMemo(() => TOKEN_DIST_FILES.map((f) => f.href), []);
  const sizes = useFileSizes(urls);

  return (
    <>
      <PageHeader
        eyebrow="平台 · Platforms"
        title="平台接入"
        en="Platforms"
        description="同一份 DTCG token 源编译出 8 种产物：Web（CSS / Tailwind）、Flutter（Dart）、iOS（Swift）、Android（Kotlin / XML）与 Figma（Tokens Studio）。取文件、贴进项目、用同一套名字。"
        actions={
          <ButtonLink to="/downloads" variant="outline">
            去下载中心取全部格式
          </ButtonLink>
        }
      />

      <Section id="naming" title="命名映射" en="Naming" description="一个 token 路径在每个平台的名字都可以机械推导：kebab 路径 → CSS 变量 → Tailwind 变量 / 类 → camelCase 常量 → snake_case 资源。">
        <DocTable
          caption="token 路径在各平台的名称"
          head={
            <>
              <th>Token 路径</th>
              <th>CSS</th>
              <th>Tailwind v4</th>
              <th>Dart · Swift · Kotlin</th>
              <th>Android XML</th>
              <th>Figma（set global）</th>
            </>
          }
        >
          {NAMING.map((row) => (
            <tr key={row.path}>
              <td>
                <code className="font-mono text-[12px] whitespace-nowrap text-fg-brand">{row.path}</code>
              </td>
              <td>
                <code className="font-mono text-[12px] whitespace-nowrap text-fg-secondary">{row.css}</code>
              </td>
              <td>
                <code className="font-mono text-[12px] whitespace-nowrap text-fg-secondary">{row.tw}</code>
              </td>
              <td>
                <code className="font-mono text-[12px] whitespace-nowrap text-fg-secondary">{row.native}</code>
              </td>
              <td>
                <code className="font-mono text-[12px] whitespace-nowrap text-fg-secondary">{row.xml}</code>
              </td>
              <td>
                <code className="font-mono text-[12px] whitespace-nowrap text-fg-secondary">{row.figma}</code>
              </td>
            </tr>
          ))}
        </DocTable>
        <Prose>
          <p>
            前缀：Dart <code>TpTokens.</code>、Swift <code>TPTokens.</code>、Kotlin <code>TpTokens.</code>、XML <code>tp_</code>、CSS <code>--tp-</code>。
            Tailwind 的 <code>@theme</code> 变量不带前缀，直接映射成工具类；组件层与渐变、z-index、opacity 以 <code>--tp-*</code> / <code>--gradient-*</code> / <code>--z-index-*</code> 形式留在 <code>:root</code>。
          </p>
        </Prose>
      </Section>

      <Section id="platforms" title="按平台接入" en="By platform" description="每个平台：取哪些文件、怎么装、怎么用。所有文件都在 public/tokens/ 下，与 packages/tokens/dist 完全一致。">
        <Tabs defaultValue="web" className="my-6">
          <TabsList variant="line" className="w-full justify-start overflow-x-auto" aria-label="平台">
            <TabsTrigger value="web">Web</TabsTrigger>
            <TabsTrigger value="flutter">Flutter</TabsTrigger>
            <TabsTrigger value="ios">iOS</TabsTrigger>
            <TabsTrigger value="android">Android</TabsTrigger>
            <TabsTrigger value="figma">Figma</TabsTrigger>
          </TabsList>

          <TabsContent value="web">
            <SubSection title="取文件" en="Files" description="任意框架用 CSS 变量；Tailwind v4 项目用 @theme；工具链读 JSON。">
              <FileCards files={[...tokenDistFiles('css'), ...tokenDistFiles('tailwind'), ...tokenDistFiles('json')]} sizes={sizes} />
            </SubSection>
            <SubSection title="CSS 变量" en="CSS custom properties" description="全部 token 以 --tp-* 挂在 :root；颜色 hex、尺寸 px；typography 拆成 -font-size / -line-height / -font-weight / -letter-spacing；阴影已拼成字符串。">
              <CodeBlock lang="css" filename="app.css" code={CODE_CSS} />
            </SubSection>
            <SubSection title="Tailwind v4" en="Tailwind v4" description="theme.css 是一个 @theme 块：--color-*、--text-*、--radius-*、--shadow-*、--ease-*、--font-sans / --font-mono、--breakpoint-*、--container-*、--spacing: 0.25rem。">
              <CodeBlock lang="css" filename="app.css" code={CODE_TAILWIND_CSS} />
              <CodeBlock lang="tsx" filename="Home.tsx" code={CODE_TAILWIND_TSX} />
              <Prose>
                <p>
                  Next.js（tp-web）：把 <code>theme.css</code> 复制到 <code>app/tokens.css</code>，在 <code>globals.css</code> 顶部 <code>@import './tokens.css'</code>；升级 token 时整文件覆盖，不手改。
                </p>
              </Prose>
            </SubSection>
          </TabsContent>

          <TabsContent value="flutter">
            <SubSection title="取文件" en="Files">
              <FileCards files={tokenDistFiles('dart')} sizes={sizes} />
            </SubSection>
            <SubSection title="安装" en="Install" description="abstract final class TpTokens：Color、double、FontWeight、TextStyle、Duration、Curve、List<BoxShadow> 常量。">
              <Prose>
                <ol>
                  <li>
                    复制到 <code>tp-app/lib/core/theme/tp_tokens.dart</code>（升级时整文件覆盖，不手改）。
                  </li>
                  <li>
                    在 <code>pubspec.yaml</code> 声明 Inter（<code>packages/brand/fonts/Inter-*.ttf</code>，OFL）。
                  </li>
                  <li>
                    用下面的 <code>ThemeData</code> 映射；forui 用 <code>FThemeData.light.copyWith(colorScheme: …)</code> 取同一批常量。
                  </li>
                </ol>
              </Prose>
              <CodeBlock lang="dart" filename="tp_theme.dart" code={CODE_DART_THEME} />
              <CodeBlock lang="dart" filename="connect_button.dart" code={CODE_DART_BUTTON} />
              <Prose>
                <p>
                  中文：<code>TextStyle.copyWith(height: 1.6, letterSpacing: 0)</code>；数字 <code>fontFeatures: [FontFeature.tabularFigures()]</code>（numeric-* 角色已内置）。
                  渐变在文件里以注释列出，用 <code>LinearGradient</code> / <code>RadialGradient</code> 自行构建。
                </p>
              </Prose>
            </SubSection>
          </TabsContent>

          <TabsContent value="ios">
            <SubSection title="取文件" en="Files">
              <FileCards files={tokenDistFiles('swift')} sizes={sizes} />
            </SubSection>
            <SubSection title="安装" en="Install" description="enum TPTokens：UIColor、CGFloat、TPTextStyle（.font 给 UIFont）、[TPShadow]（layerRadius 给 CALayer）、TimeInterval、缓动控制点。">
              <Prose>
                <ol>
                  <li>
                    把 <code>TPTokens.swift</code> 加入 target；SwiftUI 用 <code>Color(TPTokens.colorBgCanvas)</code> 包一层。
                  </li>
                  <li>
                    字体：SF Pro 可作 Inter 的等价替代；如需 Inter，把 TTF 加入 target 并在 <code>Info.plist</code> 注册。
                  </li>
                  <li>
                    <code>preferredColorScheme(.light)</code>，不提供暗色资源；圆角用 <code>.continuous</code>。
                  </li>
                </ol>
              </Prose>
              <CodeBlock lang="swift" filename="PrimaryButton.swift" code={CODE_SWIFT_UIKIT} />
              <CodeBlock lang="swift" filename="PrimaryButtonStyle.swift" code={CODE_SWIFTUI} />
            </SubSection>
          </TabsContent>

          <TabsContent value="android">
            <SubSection title="取文件" en="Files" description="Compose 用 TpTokens.kt；Views / XML 把两个 values 文件放进 res/values/。">
              <FileCards files={[...tokenDistFiles('kotlin'), ...tokenDistFiles('android')]} sizes={sizes} />
            </SubSection>
            <SubSection title="Jetpack Compose" en="Compose" description="object TpTokens：Color、Dp、TpTextStyle.toTextStyle()、List<TpShadow>、时长（ms）、CubicBezierEasing 参数。">
              <CodeBlock lang="kotlin" filename="TpTheme.kt" code={CODE_KOTLIN} />
            </SubSection>
            <SubSection title="Views / XML" en="XML" description="colors.xml 为 ARGB；dimens.xml 含间距、圆角、控件尺寸与原始字号（sp）。">
              <CodeBlock lang="xml" filename="layout/connect.xml" code={CODE_XML} />
              <Prose>
                <p>
                  Adaptive icon 背景色引用 <code>@color/tp_color_blue_500</code>；typography 角色与阴影没有 XML 产物，Views 项目请用 Compose 或从 <code>TpTokens.kt</code> 读取。
                </p>
              </Prose>
            </SubSection>
          </TabsContent>

          <TabsContent value="figma">
            <SubSection title="取文件" en="Files">
              <FileCards files={tokenDistFiles('figma')} sizes={sizes} />
            </SubSection>
            <SubSection title="Tokens Studio" en="Tokens Studio" description="单一 set「global」，primitives / semantic / component 三层按路径保留在同一 set，引用如 {color.blue.500} 原样保留由插件解析。">
              <Prose>
                <ol>
                  <li>
                    安装 <strong>Tokens Studio for Figma</strong> 插件。
                  </li>
                  <li>
                    Settings → Sync：选 GitHub 指向本仓库 <code>packages/tokens/dist/figma/tokens.json</code>；或 Tools → Import 选择本地文件。
                  </li>
                  <li>
                    启用 <code>global</code> set（<code>$themes</code> 为空，无需切换主题）。
                  </li>
                  <li>
                    Styles &amp; Variables → <strong>Export to Figma</strong> → 勾选 Variables（集合名 <code>TP VPN</code>，仅 Light 模式）；typography 生成 Text Styles，elevation 生成 Effect Styles。
                  </li>
                  <li>设计稿通过 Variables 绑定颜色 / 圆角 / 间距；token 变更后重复 2–4 步，不要在 Figma 手改 Variable 值。</li>
                </ol>
              </Prose>
              <CodeBlock lang="json" filename="figma/tokens.json（节选）" code={CODE_FIGMA} />
            </SubSection>
          </TabsContent>
        </Tabs>
      </Section>

      <Section id="react-ui" title="React 组件库 @tpvpn/ui" en="React UI kit" description="Web 端不必从 token 手搭：@tpvpn/ui 是 shadcn/ui（Radix）基座 + VPN 专属组件，已用 TP token 换肤，Light only。">
        <CodeBlock lang="css" filename="app.css" code={CODE_UI_CSS} />
        <CodeBlock lang="tsx" filename="Home.tsx" code={CODE_UI_TSX} />
        <Prose>
          <ul>
            <li>
              peer 依赖 react ^19、react-dom ^19；组件依赖 <code>radix-ui</code>、<code>lucide-react</code>、<code>motion</code>、<code>class-variance-authority</code>。
            </li>
            <li>
              <code>styles.css</code> 已包含 <code>@import 'tailwindcss'</code> 与 theme；你的项目再加一条 <code>@source</code> 指向组件库源码，Tailwind 才会生成组件用到的类。
            </li>
            <li>
              <code>Flag</code> 通过 <code>FlagProvider baseUrl</code> 找到圆旗 SVG（<code>public/brand/flags/&lt;code&gt;.svg</code>）；不设置时默认 <code>/brand/flags/</code>。
            </li>
            <li>
              深路径同样可用：<code>@tpvpn/ui/components/ui/button</code>、<code>@tpvpn/ui/components/tp/node-card</code>。
            </li>
          </ul>
        </Prose>
      </Section>

      <Section id="versioning" title="版本与对齐" en="Versioning & sync">
        <Callout title="版本策略：token 就是 API">
          整个仓库共用一个语义化版本号。<strong>删除或重命名任一 semantic / component token、改变 token 类型、Logo 构成或品牌蓝变化 = major</strong>；
          新增 token、新输出格式、新组件、新资产 = minor；数值微调且不改契约（阴影透明度、动效时长 ±50 ms、文档修订）= patch。
          每个产物文件头部注明版本与生成时间；各平台升级 PR 引用 CHANGELOG 的版本号。
        </Callout>
        <DocTable
          caption="各平台的升级方式与校验"
          head={
            <>
              <th>平台</th>
              <th>升级方式</th>
              <th>校验</th>
            </>
          }
        >
          {SYNC.map(([platform, how, check]) => (
            <tr key={platform}>
              <td className="text-fg-primary">{platform}</td>
              <td className="text-fg-secondary">{how}</td>
              <td>
                <code className="font-mono text-[12px] text-fg-secondary">{check}</code>
              </td>
            </tr>
          ))}
        </DocTable>
        <Prose>
          <p>
            废弃流程：旧名与新名同时存在一个 minor 版本（≥ 4 周），旧名值指向新名并在 <code>$description</code> 标注 <code>DEPRECATED:</code>；下一个 major 移除。详见更新日志页的版本策略。
          </p>
        </Prose>
      </Section>
    </>
  );
}
