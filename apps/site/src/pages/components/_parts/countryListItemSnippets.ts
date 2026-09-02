/** Platform code samples for the CountryListItem page (kept out of the page file to keep it focused). */
export const DART = `/// 国家 / 线路列表行：高 72、圆旗 40、三段元数据；选中时左侧 3px 蓝条 + 浅蓝底。
class CountryListItem extends StatelessWidget {
  const CountryListItem({
    super.key,
    required this.flagCode,
    required this.name,
    required this.latencyMs,
    required this.lossPct,
    required this.loadPct,
    this.tag,
    this.selected = false,
    this.onTap,
  });

  final String flagCode;
  final String name;
  final int latencyMs;
  final double lossPct;
  final double loadPct;
  final Widget? tag;
  final bool selected;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final tone = latencyToneOf(latencyMs);
    return Semantics(
      button: onTap != null,
      selected: selected,
      child: InkWell(
        onTap: onTap,
        child: Container(
          constraints: const BoxConstraints(minHeight: TpTokens.countryListItemHeight), // 72
          padding: const EdgeInsets.symmetric(horizontal: TpTokens.countryListItemPaddingX), // 16
          decoration: BoxDecoration(
            color: selected ? TpTokens.countryListItemSelectedBg : null, // blue-50
            border: Border(
              left: BorderSide(
                width: 3,
                color: selected ? TpTokens.countryListItemSelectedIndicator : Colors.transparent, // blue-500
              ),
            ),
          ),
          child: Row(children: [
            TpFlag(code: flagCode, size: TpTokens.countryListItemFlagSize, semanticLabel: name), // 40
            const SizedBox(width: TpTokens.space3),
            Expanded(
              child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(children: [
                  Flexible(child: Text(name, style: TpTokens.typographyHeadline, overflow: TextOverflow.ellipsis)),
                  if (tag != null) ...[const SizedBox(width: 8), tag!],
                ]),
                Text.rich(
                  TextSpan(children: [
                    const TextSpan(text: '延迟 '),
                    TextSpan(text: '$latencyMs ms', style: TextStyle(fontWeight: FontWeight.w600, color: tone.fg)),
                    TextSpan(text: ' · 丢包 \${lossPct.toStringAsFixed(1)}% · 负载 \${loadPct.round()}%'),
                  ]),
                  style: TpTokens.typographyCaption.copyWith(
                    color: TpTokens.colorFgMuted,
                    fontFeatures: const [FontFeature.tabularFigures()],
                  ),
                ),
              ]),
            ),
            Icon(Icons.chevron_right_rounded, size: 20, color: selected ? TpTokens.colorFgBrand : TpTokens.colorFgPlaceholder),
          ]),
        ),
      ),
    );
  }
}`;
