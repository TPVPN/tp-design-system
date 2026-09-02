/** Platform code samples for the NodeCard page (kept out of the page file to keep it focused). */
export const DART = `/// 节点卡片：圆角 16、内边距 16、level-1 阴影；hover / 按下抬到 level-2；选中 blue-500 描边 + blue-50 底。
class NodeCard extends StatelessWidget {
  const NodeCard({
    super.key,
    required this.title,
    required this.latencyMs,
    required this.loadPct,
    this.flagCode,
    this.selected = false,
    this.onTap,
  });

  final String title;
  final int latencyMs;
  final int loadPct;
  final String? flagCode;
  final bool selected;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final tone = latencyToneOf(latencyMs); // <80 good · ≤180 fair · >180 poor
    return Semantics(
      button: onTap != null,
      selected: selected,
      label: '$title，延迟 $latencyMs 毫秒',
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(TpTokens.nodeCardRadius),
        child: AnimatedContainer(
          duration: TpTokens.durationBase, // 200ms
          curve: TpTokens.easingStandard,
          padding: const EdgeInsets.all(TpTokens.nodeCardPadding), // 16
          decoration: BoxDecoration(
            color: selected ? TpTokens.colorBgBrandSoft : TpTokens.nodeCardBg,
            borderRadius: BorderRadius.circular(TpTokens.nodeCardRadius), // 16
            border: Border.all(color: selected ? TpTokens.colorBorderBrand : TpTokens.nodeCardBorder),
            boxShadow: TpTokens.nodeCardShadow, // level-1（hover: nodeCardShadowHover）
          ),
          child: Row(children: [
            flagCode != null
                ? TpFlag(code: flagCode!, size: TpTokens.sizeFlagLg) // 40
                : const Icon(Icons.public_rounded, size: 24, color: TpTokens.colorFgSecondary),
            const SizedBox(width: TpTokens.nodeCardGap), // 12
            Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(title, style: TpTokens.typographyHeadline, overflow: TextOverflow.ellipsis),
                Text.rich(TextSpan(children: [
                  const TextSpan(text: '延迟 '),
                  TextSpan(text: '$latencyMs', style: TextStyle(fontWeight: FontWeight.w600, color: tone.fg)),
                  TextSpan(text: ' ms · 负载 $loadPct%'),
                ]), style: TpTokens.typographyCaption.copyWith(color: TpTokens.nodeCardMetaFg)),
              ]),
            ),
            TpSignalBars(latencyMs: latencyMs), // 4 格，按延迟着色
            const Icon(Icons.chevron_right_rounded, size: 20, color: TpTokens.colorFgPlaceholder),
          ]),
        ),
      ),
    );
  }
}`;
