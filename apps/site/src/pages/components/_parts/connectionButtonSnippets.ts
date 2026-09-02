/** Platform code samples for the ConnectionButton page (kept out of the page file to keep it focused). */
export const DART = `/// 连接按钮：128（手机）/ 160（平板 / 桌面），connecting 外环 1.2s 旋转，connected 径向渐变 + 光晕。
class ConnectionButton extends StatefulWidget {
  const ConnectionButton({super.key, required this.state, required this.onTap, this.desktop = false});
  final TpConnectionState state; // disconnected · connecting · connected · error
  final VoidCallback onTap;
  final bool desktop;
  @override
  State<ConnectionButton> createState() => _ConnectionButtonState();
}

class _ConnectionButtonState extends State<ConnectionButton> with SingleTickerProviderStateMixin {
  late final _ring = AnimationController(
    vsync: this,
    duration: TpTokens.connectionButtonDuration, // 1200ms = duration.connect
  )..repeat();

  @override
  Widget build(BuildContext context) {
    final connected = widget.state == TpConnectionState.connected;
    final connecting = widget.state == TpConnectionState.connecting;
    final size = widget.desktop ? TpTokens.connectionButtonSizeDesktop : TpTokens.connectionButtonSizeMobile; // 160 / 128
    final reduceMotion = MediaQuery.disableAnimationsOf(context);

    return Semantics(
      button: true,
      toggled: connected,
      label: connected ? '已连接' : '连接',
      child: GestureDetector(
        onTap: widget.onTap,
        child: SizedBox.square(
          dimension: size,
          child: Stack(alignment: Alignment.center, children: [
            if (connecting)
              RotationTransition(
                turns: reduceMotion ? const AlwaysStoppedAnimation(0) : _ring,
                child: CustomPaint(
                  size: Size.square(size + 16),
                  painter: RingArcPainter( // 88/300 弧线，strokeWidth = ring-width 2
                    color: TpTokens.connectionButtonConnectingRing,
                    width: TpTokens.connectionButtonRingWidth,
                  ),
                ),
              ),
            AnimatedContainer(
              duration: TpTokens.durationModerate, // 300ms
              curve: TpTokens.easingStandard,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: connected ? null : TpTokens.connectionButtonDisconnectedBg,
                gradient: connected
                    ? const RadialGradient( // gradient.connected
                        center: Alignment(-0.4, -0.6),
                        radius: 1.2,
                        colors: [Color(0xFF3D8BFF), Color(0xFF1677FF), Color(0xFF0158C9)],
                        stops: [0, 0.6, 1],
                      )
                    : null,
                border: Border.all(
                  width: TpTokens.connectionButtonRingWidth,
                  color: connected ? Colors.transparent : TpTokens.connectionButtonDisconnectedRing, // slate-200
                ),
                boxShadow: connected ? TpTokens.connectionButtonConnectedShadow : TpTokens.elevationLevel2, // brand-glow-lg
              ),
              child: Icon(
                Icons.power_settings_new_rounded,
                size: TpTokens.connectionButtonIconSize, // 48
                color: connected ? TpTokens.connectionButtonConnectedFg : TpTokens.connectionButtonDisconnectedFg,
              ),
            ),
          ]),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _ring.dispose();
    super.dispose();
  }
}`;

export const SWIFT = `import SwiftUI

struct ConnectionButtonView: View {
    enum State { case disconnected, connecting, connected, error }
    let state: State
    let action: () -> Void
    @State private var angle = 0.0
    @Environment(\\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        Button(action: action) {
            ZStack {
                if state == .connecting {
                    Circle()
                        .trim(from: 0, to: 0.23)                       // 88 / 380 ≈ 弧线
                        .stroke(Color(TPTokens.connectionButtonConnectingRing),
                                style: StrokeStyle(lineWidth: TPTokens.connectionButtonRingWidth, lineCap: .round))
                        .padding(-8)
                        .rotationEffect(.degrees(angle))
                        .onAppear {
                            guard !reduceMotion else { return }
                            withAnimation(.linear(duration: TPTokens.durationConnect).repeatForever(autoreverses: false)) { angle = 360 } // 1.2s
                        }
                }
                Circle()
                    .fill(state == .connected
                          ? AnyShapeStyle(RadialGradient( // gradient.connected
                                colors: [Color(red: 0.24, green: 0.55, blue: 1.0), Color(TPTokens.colorBlue500), Color(TPTokens.colorBlue700)],
                                center: UnitPoint(x: 0.3, y: 0.2), startRadius: 0, endRadius: 150))
                          : AnyShapeStyle(Color(TPTokens.connectionButtonDisconnectedBg)))
                    .overlay(Circle().stroke(Color(TPTokens.connectionButtonDisconnectedRing),
                                             lineWidth: state == .connected ? 0 : TPTokens.connectionButtonRingWidth))
                    .shadow(color: Color(TPTokens.colorBlue500).opacity(state == .connected ? 0.45 : 0), radius: 30, y: 10) // brand-glow-lg
                Image(systemName: "power")
                    .font(.system(size: 44, weight: .semibold))
                    .foregroundStyle(state == .connected
                                     ? Color(TPTokens.connectionButtonConnectedFg)
                                     : Color(TPTokens.connectionButtonDisconnectedFg))
            }
            .frame(width: TPTokens.sizeConnectionButtonMobile, height: TPTokens.sizeConnectionButtonMobile) // 128
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(.isToggle)
        .accessibilityLabel(state == .connected ? "已连接" : "连接")
    }
}`;
