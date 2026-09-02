/** Platform code samples for the Button page (kept out of the page file to keep it focused). */
export const DART = `// Flutter · forui FButton（tp-app 采用）——高度 44、圆角 12、blue-600 底白字由主题统一提供
FButton(
  style: FButtonStyle.primary,
  onPress: connect,
  label: const Text('连接'),
)

// 无 forui 时的 Material 等价写法（同一批 TpTokens 常量）
FilledButton(
  style: FilledButton.styleFrom(
    backgroundColor: TpTokens.colorActionPrimaryBg,      // #046BEF
    foregroundColor: TpTokens.colorActionPrimaryFg,      // #FFFFFF
    disabledBackgroundColor: TpTokens.colorActionDisabledBg,
    disabledForegroundColor: TpTokens.colorActionDisabledFg,
    minimumSize: const Size(0, TpTokens.sizeControlMd),  // 44
    padding: const EdgeInsets.symmetric(horizontal: TpTokens.space5), // 20
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(TpTokens.radiusMd), // 12
    ),
    textStyle: TpTokens.typographyLabelMd,               // 14/20 · 500
  ),
  onPressed: connect,
  child: const Text('连接'),
)`;

export const SWIFT = `import SwiftUI

struct PrimaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: TPTokens.typographyLabelMd.size, weight: .medium))
            .frame(minHeight: TPTokens.sizeControlMd)                 // 44
            .padding(.horizontal, TPTokens.space5)                    // 20
            .background(Color(TPTokens.colorActionPrimaryBg))         // #046BEF
            .foregroundStyle(Color(TPTokens.colorActionPrimaryFg))
            .clipShape(RoundedRectangle(cornerRadius: TPTokens.radiusMd, style: .continuous)) // 12
            .scaleEffect(configuration.isPressed ? 0.98 : 1)
            .animation(.easeOut(duration: 0.1), value: configuration.isPressed)
    }
}

Button("连接", action: connect).buttonStyle(PrimaryButtonStyle())`;
