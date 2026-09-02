/** Code samples for /platforms — kept apart from the page so the page stays readable. Every sample targets the real 1.0.0 outputs. */

export const CODE_CSS = `/* 复制 tokens.css 到项目；workspace 内可直接 @import '@tpvpn/tokens/css' */
@import './tokens.css';

:root { color-scheme: light; }

body {
  background: var(--tp-color-bg-canvas);
  color: var(--tp-color-fg-primary);
  font-family: var(--tp-font-family-sans);
}

.btn-primary {
  height: var(--tp-size-control-md);
  padding-inline: var(--tp-space-4);
  border-radius: var(--tp-radius-md);
  background: var(--tp-color-action-primary-bg);
  color: var(--tp-color-action-primary-fg);
  font-size: var(--tp-typography-label-md-font-size);
  line-height: var(--tp-typography-label-md-line-height);
  font-weight: var(--tp-typography-label-md-font-weight);
  transition: background-color var(--tp-duration-base) var(--tp-easing-standard);
}
.btn-primary:hover { background: var(--tp-color-action-primary-bg-hover); }
.btn-primary:focus-visible { outline: none; box-shadow: var(--tp-elevation-focus); }`;

export const CODE_TAILWIND_CSS = `/* app.css */
@import 'tailwindcss';
@import '@tpvpn/tokens/tailwind'; /* 或复制 theme.css 后 @import './theme.css' */`;

export const CODE_TAILWIND_TSX = `<div className="bg-bg-canvas text-fg-primary">
  <h1 className="text-title-lg">节点</h1>
  <button className="h-control-md rounded-md bg-action-primary-bg px-4 text-label-md text-action-primary-fg shadow-level-1 transition-colors duration-(--duration-base) ease-standard hover:bg-action-primary-bg-hover focus-visible:shadow-focus">
    连接
  </button>
  <span className="text-numeric-sm tabular-nums text-latency-good-fg">42 ms</span>
</div>`;

export const CODE_UI_CSS = `/* app.css — 组件库自带 Tailwind + TP theme + base 层，只引一次 */
@import '@tpvpn/ui/styles.css';
/* 让 Tailwind 扫描组件库源码，生成它用到的工具类（workspace 内为 ../../packages/ui/src） */
@source '../node_modules/@tpvpn/ui/src';`;

export const CODE_UI_TSX = `import '@tpvpn/ui/styles.css'; // 或在 app.css 里 @import
import { Button, ConnectionButton, FlagProvider, NodeCard, Tag, cn } from '@tpvpn/ui';

export function Home({ toggle }: { toggle: () => void }) {
  return (
    <FlagProvider baseUrl={\`\${import.meta.env.BASE_URL}brand/flags/\`}>
      <div className={cn('flex flex-col items-center gap-6')}>
        <Tag tone="game">游戏</Tag>
        <ConnectionButton state="connected" elapsed="00:12:34" onClick={toggle} />
        <NodeCard flagCode="us" title="US · Los Angeles #102" badge={<Tag tone="brand">优质节点</Tag>} latencyMs={38} loadPct={21} />
        <Button>连接</Button>
      </div>
    </FlagProvider>
  );
}`;

export const CODE_DART_THEME = `import 'package:flutter/material.dart';
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
);`;

export const CODE_DART_BUTTON = `FilledButton(
  style: FilledButton.styleFrom(
    backgroundColor: TpTokens.colorActionPrimaryBg,
    foregroundColor: TpTokens.colorActionPrimaryFg,
    minimumSize: const Size.fromHeight(TpTokens.sizeControlMd),
    padding: const EdgeInsets.symmetric(horizontal: TpTokens.space4),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(TpTokens.radiusMd)),
    textStyle: TpTokens.typographyLabelMd,
  ),
  onPressed: connect,
  child: const Text('连接'),
)`;

export const CODE_SWIFT_UIKIT = `import UIKit

final class PrimaryButton: UIButton {
    override init(frame: CGRect) {
        super.init(frame: frame)
        var config = UIButton.Configuration.filled()
        config.baseBackgroundColor = TPTokens.colorActionPrimaryBg
        config.baseForegroundColor = TPTokens.colorActionPrimaryFg
        config.background.cornerRadius = TPTokens.radiusMd
        config.contentInsets = NSDirectionalEdgeInsets(top: 0, leading: TPTokens.space4, bottom: 0, trailing: TPTokens.space4)
        config.attributedTitle = AttributedString("连接", attributes: AttributeContainer([.font: TPTokens.typographyLabelMd.font]))
        configuration = config
        heightAnchor.constraint(equalToConstant: TPTokens.sizeControlMd).isActive = true
        layer.shadowColor = TPTokens.elevationLevel1[0].color.cgColor
        layer.shadowOpacity = TPTokens.elevationLevel1[0].opacity
        layer.shadowOffset = TPTokens.elevationLevel1[0].offset
        layer.shadowRadius = TPTokens.elevationLevel1[0].layerRadius
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }
}`;

export const CODE_SWIFTUI = `import SwiftUI

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
            .animation(.easeOut(duration: TPTokens.durationFast), value: configuration.isPressed)
    }
}`;

export const CODE_KOTLIN = `import androidx.compose.foundation.layout.height
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Shapes
import androidx.compose.material3.Text
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.tpvpn.design.TpTokens

val TpColorScheme = lightColorScheme(
    primary = TpTokens.colorActionPrimaryBg,
    onPrimary = TpTokens.colorActionPrimaryFg,
    background = TpTokens.colorBgCanvas,
    surface = TpTokens.colorBgSurface,
    onSurface = TpTokens.colorFgPrimary,
    outline = TpTokens.colorBorderDefault,
)

@Composable
fun TpTheme(content: @Composable () -> Unit) = MaterialTheme(
    colorScheme = TpColorScheme,
    shapes = Shapes(medium = RoundedCornerShape(TpTokens.radiusMd)),
    content = content,
)

@Composable
fun ConnectButton(onClick: () -> Unit) {
    Button(
        onClick = onClick,
        modifier = Modifier.height(TpTokens.sizeControlMd),
        shape = RoundedCornerShape(TpTokens.radiusMd),
        colors = ButtonDefaults.buttonColors(
            containerColor = TpTokens.colorActionPrimaryBg,
            contentColor = TpTokens.colorActionPrimaryFg,
        ),
    ) {
        Text("连接", style = TpTokens.typographyLabelMd.toTextStyle())
    }
}`;

export const CODE_XML = `<!-- res/values/ 放入 colors.xml 与 dimens.xml 后直接引用 -->
<Button
    android:layout_width="match_parent"
    android:layout_height="@dimen/tp_size_control_md"
    android:paddingHorizontal="@dimen/tp_space_4"
    android:backgroundTint="@color/tp_color_action_primary_bg"
    android:textColor="@color/tp_color_action_primary_fg"
    android:textSize="@dimen/tp_font_size_14"
    android:text="连接" />`;

export const CODE_FIGMA = `{
  "global": {
    "color": { "bg": { "canvas": { "value": "{color.slate.25}", "type": "color", "description": "Page background" } } },
    "radius": { "lg": { "value": "16px", "type": "dimension" } }
  },
  "$themes": [],
  "$metadata": { "tokenSetOrder": ["global"] }
}`;
