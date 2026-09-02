/** Platform code samples for the TabBar page (kept out of the page file to keep it focused). */
export const DART = `/// 底部标签栏：高 56 + 底部安全区，玻璃底 + 顶部 hairline；选中 blue-600、未选 slate-500。
class TpTabBar extends StatelessWidget {
  const TpTabBar({super.key, required this.items, required this.index, required this.onChanged});

  final List<TpTabItem> items; // TpTabItem(icon: IconData, label: String)
  final int index;
  final ValueChanged<int> onChanged;

  @override
  Widget build(BuildContext context) {
    return ClipRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
        child: Container(
          decoration: const BoxDecoration(
            color: TpTokens.tabBarBg, // rgba(255, 255, 255, 0.8)
            border: Border(top: BorderSide(color: TpTokens.tabBarBorder)), // slate-200 hairline
          ),
          child: SafeArea(
            top: false, // 只处理底部安全区（iOS 34pt / Android 手势条）
            child: SizedBox(
              height: TpTokens.tabBarHeight, // 56
              child: Row(
                children: [
                  for (var i = 0; i < items.length; i++)
                    Expanded(
                      child: Semantics(
                        button: true,
                        selected: i == index,
                        label: items[i].label,
                        child: InkWell(
                          onTap: () => onChanged(i),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                items[i].icon,
                                size: 24,
                                color: i == index ? TpTokens.tabBarActiveFg : TpTokens.tabBarInactiveFg,
                              ),
                              const SizedBox(height: 4),
                              Text(
                                items[i].label,
                                style: TpTokens.typographyLabelSm.copyWith(
                                  color: i == index ? TpTokens.tabBarActiveFg : TpTokens.tabBarInactiveFg,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}`;

export const SWIFT = `import SwiftUI

enum Tab { case home, nodes, me }

struct RootView: View {
    @State private var tab: Tab = .home

    var body: some View {
        TabView(selection: $tab) {
            HomeView().tabItem { Label("首页", systemImage: "house") }.tag(Tab.home)
            NodesView().tabItem { Label("节点", systemImage: "globe") }.tag(Tab.nodes)
            AccountView().tabItem { Label("我的", systemImage: "person") }.tag(Tab.me)
        }
        .tint(Color(TPTokens.tabBarActiveFg)) // blue-600；TabView 自动处理底部安全区
        .onAppear {
            let appearance = UITabBarAppearance()
            appearance.configureWithDefaultBackground()           // 系统毛玻璃 ≈ bg.glass
            appearance.stackedLayoutAppearance.normal.iconColor = TPTokens.tabBarInactiveFg // slate-500
            appearance.stackedLayoutAppearance.normal.titleTextAttributes = [.foregroundColor: TPTokens.tabBarInactiveFg]
            UITabBar.appearance().standardAppearance = appearance
            UITabBar.appearance().scrollEdgeAppearance = appearance
        }
    }
}`;
