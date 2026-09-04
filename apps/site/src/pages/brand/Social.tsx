import { useState } from 'react';
import { PageHeader, Section } from '@/components/docs';
import '../mobile/mobile.css';
import './social.css';
const KVS = [
 { key: 'connection', title: '连接，简单一点。', en: 'A clearer connection.', label: '01 / Connection', description: '蓝色路径穿过白色圆环，以单一视觉焦点表达简单与连接。' },
 { key: 'global', title: '世界，近在眼前。', en: 'A world within reach.', label: '02 / Global', description: '磨砂球体与蓝色轨道，适合全球连接主题。' },
 { key: 'protection', title: '安心，自在前行。', en: 'Move with confidence.', label: '03 / Protection', description: '白色盾牌与蓝色核心，适合保护与安心主题。' },
 { key: 'flow', title: '让专注，自然流动。', en: 'Find your flow.', label: '04 / Flow', description: '流动路径汇聚为清晰方向，适合工作与日常连接内容。' },
];
export default function Social() {
 const [format, setFormat] = useState('landscape');
 const [language, setLanguage] = useState('zh');
 return <><PageHeader eyebrow="TP VPN / Social studio" title="明亮、清晰，一眼就是 TP" en="One brand. More possibilities." description="四套 Light Mode 主视觉，配套可编辑版式与完整生成提示词。" />
 <Section id="main-kv" title="主视觉参考库" en="Main KV collection" description="切换比例与语言，查看同一套视觉的不同排版。">
  <div className="social-toolbar"><label>版式<select value={format} onChange={e => setFormat(e.target.value)}><option value="landscape">横版 · 3:2</option><option value="square">方形 · 1:1</option><option value="portrait">竖版 · 4:5</option><option value="story">Story · 9:16</option></select></label><label>标题语言<select value={language} onChange={e => setLanguage(e.target.value)}><option value="zh">中文</option><option value="en">English</option></select></label></div>
  <div className="social-collection">{KVS.map(kv => <article key={kv.key} className="social-item"><div className={`social-kv ${format}`}><img className="social-art" src={`/reference/social/${kv.key}.png`} alt={kv.description} width={1536} height={1024} loading="lazy" /><img className="social-logo" src="/brand/logo/svg/tp-vpn-logo-horizontal.svg" alt="TP VPN" /><div className="social-copy"><span>CONNECT WITH CLARITY</span><h3 lang={language}>{language === 'zh' ? kv.title : kv.en}</h3><p>{language === 'zh' ? '连接世界，从清晰开始。' : 'Less friction. More possibility.'}</p></div><span className="social-signature">TP VPN · Brand concept</span></div><div className="social-caption"><div><p className="social-label">{kv.label}</p><p>{kv.description}</p></div><div className="social-downloads"><a href={`/reference/social/${kv.key}.png`} download>原图 PNG ↗</a><a href={`/reference/social/${kv.key}.svg`} download>排版 SVG ↗</a></div></div></article>)}</div>
 </Section>
 <Section id="standards" title="每张素材，共用一套标准"><div className="reference-grid">{[
 ['颜色与材质', '全 Light Mode；白 / 极浅灰约 75%，品牌蓝 #1677FF 约 15–20%，其余留给中性色。柔和日光、哑光陶瓷、磨砂玻璃，不用暗黑、霓虹或重金属。'],
 ['Logo 与安全区', '只引用官方 SVG，禁止 AI 重绘。建议横版宽度约画布 12–16%；距边至少 6%，周围保留不少于标识高度一半的空白。'],
 ['字体与文案', '英文 Inter；中文优先 PingFang SC / Noto Sans SC。单张只用一种主语言；标题 1–2 行，中文 8–16 字或英文 3–7 词。正文最多两行。'],
 ['构图与可读性', '主物体一个，视觉焦点一个。文字和物体分区；禁止在复杂材质上压小字。重要文字对比度至少 4.5:1；CTA 每张最多一个。'],
 ['模板尺寸', '内部交付规格：横版 1200×800、方形 1080×1080、竖版 1080×1350、Story 1080×1920。Story 顶 / 底预留约 12% 界面安全区，发布前按目标平台预览。'],
 ['发布检查', '核对 Logo、语言、文字溢出、移动端可读性及素材清晰度。没有实测依据不写节点数、速度、零日志或绝对安全；不出现免费 / 游客模式。']
 ].map(([title, body]) => <article className="reference-card" key={title}><h3>{title}</h3><p>{body}</p></article>)}</div></Section>
 <Section id="assets" title="拿去继续设计" description="SVG 为 1200 × 800 横版，包含嵌入图像、未改动的官方矢量 Logo 与可编辑英文文字。方形、竖版和 Story 在上方展示重排参考；正式发布前在设计工具中按目标尺寸导出。"><div className="flex flex-wrap gap-6"><a className="reference-download" href="/reference/social/prompts.json" download>4 套原始生成提示词 ↗</a><a className="reference-download" href="/reference/ai-design-standard.json" download>AI 品牌规则 JSON ↗</a><a className="reference-download" href="/reference/AI-DESIGN-GUIDE.md" download>设计师 / Agent 使用说明 ↗</a></div></Section></>;
}
