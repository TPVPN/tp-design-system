# 平台接入 / Platform Integration

> 站点路由：`/platforms` · 产物目录：`packages/tokens/dist/` · 下载：站点 `/downloads` → 「Token 全格式」ZIP

## 0. 命名映射 / Naming

| 层 | 示例 |
|---|---|
| token 路径 | `color.bg.canvas` · `radius.lg` · `typography.title-lg` · `elevation.level-2` |
| CSS | `--tp-color-bg-canvas` · `--tp-radius-lg` · `--tp-typography-title-lg-font-size` · `--tp-elevation-level-2` |
| Tailwind v4 | `--color-bg-canvas`（`bg-bg-canvas`）· `--radius-lg`（`rounded-lg`）· `--text-title-lg`（`text-title-lg`）· `--shadow-level-2`（`shadow-level-2`） |
| Dart | `TpTokens.colorBgCanvas` · `TpTokens.radiusLg` · `TpTokens.typographyTitleLg` · `TpTokens.elevationLevel2` |
| Swift | `TPTokens.colorBgCanvas` · `TPTokens.radiusLg` |
| Kotlin | `TpTokens.colorBgCanvas` · `TpTokens.radiusLg` |
| Android XML | `@color/tp_color_bg_canvas` · `@dimen/tp_radius_lg` |
| Figma | 集合 `TP VPN` → `color/bg/canvas` |

## 1. Web · CSS 变量 / CSS

文件：`dist/css/tokens.css`（`:root { --tp-…: … }`，颜色 hex、尺寸 px、阴影已拼字符串）。

```bash
# workspace 内
import '@tpvpn/tokens/css';
# 或直接复制 packages/tokens/dist/css/tokens.css
```

```css
@import '@tpvpn/tokens/css';

:root { color-scheme: light; }
body { background: var(--tp-color-bg-canvas); color: var(--tp-color-fg-primary); font-family: var(--tp-font-family-sans); }
.btn-primary {
  height: var(--tp-size-control-md);
  padding-inline: var(--tp-space-4);
  border-radius: var(--tp-radius-md);
  background: var(--tp-color-action-primary-bg);
  color: var(--tp-color-action-primary-fg);
  font-size: var(--tp-typography-label-md-font-size);
  line-height: var(--tp-typography-label-md-line-height);
  font-weight: var(--tp-typography-label-md-font-weight);
  transition: background var(--tp-duration-base) var(--tp-easing-standard);
}
.btn-primary:hover { background: var(--tp-color-action-primary-bg-hover); }
.btn-primary:focus-visible { box-shadow: var(--tp-elevation-focus); outline: none; }
```

## 2. Web · Tailwind v4 / Tailwind

文件：`dist/tailwind/theme.css`（`@theme { … }`，含 `--color-*`、`--text-*`、`--radius-*`、`--shadow-*`、`--ease-*`、`--font-sans/--font-mono`、`--breakpoint-*`、`--container-*`、`--spacing: 0.25rem`）。

```css
/* app.css */
@import 'tailwindcss';
@import '@tpvpn/tokens/tailwind';
```

```tsx
<div className="bg-bg-canvas text-fg-primary">
  <h1 className="text-title-lg">节点</h1>
  <button className="h-11 rounded-md bg-action-primary-bg px-4 text-label-md text-action-primary-fg shadow-level-1 hover:bg-action-primary-bg-hover focus-visible:shadow-focus">
    连接
  </button>
  <span className="text-numeric-sm tabular-nums text-status-success-fg">42 ms</span>
</div>
```

Next.js（tp-web）：把 `theme.css` 复制到 `app/tokens.css` 并在 `globals.css` 顶部 `@import './tokens.css'`；升级 token 时整文件覆盖。

## 3. React 组件 / `@tpvpn/ui`

```tsx
import '@tpvpn/ui/styles.css';           // tailwind + theme + base
import { ConnectionButton, NodeCard, Tag, cn } from '@tpvpn/ui';

<ConnectionButton state="connected" elapsed="00:12:34" onClick={toggle} />
<Tag tone="game" icon={<Gamepad2 size={16} />}>游戏</Tag>
```

peer 依赖：react ^19、react-dom ^19；组件依赖 `radix-ui`、`lucide-react`、`motion`。

## 4. Flutter / Dart

文件：`dist/dart/tp_tokens.dart`。`abstract final class TpTokens`，包含 `Color`、`double`、`FontWeight`、`TextStyle`、`Duration`、`Curve`、`List<BoxShadow>` 常量。

步骤：

1. 复制到 `tp-app/lib/core/theme/tp_tokens.dart`（升级时整文件覆盖，不手改）。
2. `ThemeData` 映射：

```dart
import 'package:flutter/material.dart';
import 'tp_tokens.dart';

ThemeData tpTheme() => ThemeData(
  useMaterial3: true,
  brightness: Brightness.light,
  scaffoldBackgroundColor: TpTokens.colorBgCanvas,
  colorScheme: ColorScheme.light(
    primary: TpTokens.colorActionPrimaryBg,
    onPrimary: TpTokens.colorActionPrimaryFg,
    surface: TpTokens.colorBgSurface,
    onSurface: TpTokens.colorFgPrimary,
    error: TpTokens.colorStatusErrorSolid,
    outline: TpTokens.colorBorderDefault,
  ),
  fontFamily: 'Inter',
  textTheme: TextTheme(
    headlineMedium: TpTokens.typographyDisplaySm,
    titleLarge: TpTokens.typographyTitleLg,
    titleMedium: TpTokens.typographyTitleMd,
    bodyMedium: TpTokens.typographyBody,
    labelLarge: TpTokens.typographyLabelMd,
    bodySmall: TpTokens.typographyCaption,
  ),
);
```

3. forui：`FThemeData.light.copyWith(colorScheme: …)` 用同一批常量。
4. 中文：`TextStyle.copyWith(height: 1.6, letterSpacing: 0)`；数字 `fontFeatures: [FontFeature.tabularFigures()]`。
5. 字体：`pubspec.yaml` 声明 Inter（`packages/brand/fonts/Inter-*.ttf`，OFL）。

## 5. iOS / Swift

文件：`dist/swift/TPTokens.swift`。`enum TPTokens` + `UIColor` / `CGFloat` / `UIFont.Weight` 常量；SwiftUI 用 `Color(TPTokens.colorBgCanvas)`。

```swift
import SwiftUI

struct PrimaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: TPTokens.typographyLabelMd.size, weight: .medium))
            .frame(maxWidth: .infinity, minHeight: TPTokens.sizeControlMd)
            .padding(.horizontal, TPTokens.space4)
            .background(Color(TPTokens.colorActionPrimaryBg))
            .foregroundStyle(Color(TPTokens.colorActionPrimaryFg))
            .clipShape(RoundedRectangle(cornerRadius: TPTokens.radiusMd, style: .continuous))
            .scaleEffect(configuration.isPressed ? 0.98 : 1)
            .animation(.easeOut(duration: 0.1), value: configuration.isPressed)
    }
}
```

- 字体：SF Pro 可作 Inter 等价替代；如需 Inter，将 TTF 加入 target 并在 `Info.plist` 注册。
- `preferredColorScheme(.light)`；不提供暗色资源。
- 圆角用 `.continuous`，视觉最接近 Figma 圆角。

## 6. Android / Kotlin · Compose · XML

文件：`dist/kotlin/TpTokens.kt`（`object TpTokens { val colorBgCanvas = Color(0xFFFAFBFF); val radiusLg = 16.dp … }`）、`dist/android/values/colors.xml`、`dist/android/values/dimens.xml`。

Compose：

```kotlin
val TpColorScheme = lightColorScheme(
    primary = TpTokens.colorActionPrimaryBg,
    onPrimary = TpTokens.colorActionPrimaryFg,
    background = TpTokens.colorBgCanvas,
    surface = TpTokens.colorBgSurface,
    onSurface = TpTokens.colorFgPrimary,
    outline = TpTokens.colorBorderDefault,
)

@Composable
fun TpTheme(content: @Composable () -> Unit) =
    MaterialTheme(colorScheme = TpColorScheme, shapes = Shapes(medium = RoundedCornerShape(TpTokens.radiusMd)), content = content)
```

XML：把两个文件放入 `res/values/`。

```xml
<Button
    android:layout_height="@dimen/tp_size_control_md"
    android:backgroundTint="@color/tp_color_action_primary_bg"
    android:textColor="@color/tp_color_action_primary_fg" />
```

Adaptive icon 背景色引用 `@color/tp_color_blue_500`（见 [03-app-icon.md](03-app-icon.md)）。

## 7. Figma · Tokens Studio

文件：`dist/figma/tokens.json`（Tokens Studio 格式，单一 set `global`，primitives / semantic / component 三层按路径保留在同一 set 内，引用如 `{color.blue.500}` 原样保留）。

1. 安装 **Tokens Studio for Figma** 插件。
2. Settings → Sync → 选 GitHub（指向本仓库 `packages/tokens/dist/figma/tokens.json`）或 File → Import 本地文件。
3. 启用 `global` set（`$themes` 为空，无需切换主题）。
4. Styles & Variables → **Export to Figma** → 勾选 Variables（集合名 `TP VPN`，仅 Light 模式）。
5. 设计稿中通过 Variables 绑定颜色 / 圆角 / 间距；文字样式由 `typography.*` 生成 Text Styles。
6. token 变更后重复步骤 2–4；不要在 Figma 手改 Variable 值。

## 8. 版本对齐 / Keeping in Sync

| 平台 | 升级方式 | 校验 |
|---|---|---|
| Web workspace | 依赖 `workspace:*`，随仓库 | CI |
| tp-web | 覆盖 `app/tokens.css` | diff |
| Flutter | 覆盖 `tp_tokens.dart` | `flutter analyze` |
| iOS / Android | 覆盖对应文件 | 编译 |
| Figma | 重新导入 | 插件 diff |

每个产物文件头部注明版本与生成时间；升级时在各平台 PR 引用 CHANGELOG 版本号。
