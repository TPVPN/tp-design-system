import { useState } from 'react';
import { Button } from '@tpvpn/ui';
import { PageHeader, Section, CodeBlock } from '@/components/docs';
import rules from '../../../public/reference/ai-design-standard.json';
import '../mobile/mobile.css';
const prompt = `Create a TP VPN social Main KV, LIGHT MODE ONLY.
Canvas: 1536x1024, landscape 3:2. Background #FAFBFF / white (75%); primary accent #1677FF (15–20%); cool neutral remainder.
Style: restrained editorial 3D, matte white ceramic, frosted glass, soft daylight, subtle contact shadows. One clear focal object.
Subject: [one blue path passing through a white ring / frosted globe with blue orbits / white shield with blue core / white ribbons becoming one blue path].
Composition: subject on right 50%; left 45% quiet for separately typeset headline. Keep at least 8% safe margin.
Do NOT generate any logo, letters, UI, words or watermark. Do NOT use dark mode, neon, purple-pink gradients, glossy chrome, stock security clichés, fake metrics or unsupported security claims.
After generation: overlay the official TP VPN SVG unchanged; add an editable Inter English or PingFang SC / Noto Sans SC Chinese headline. Never raster-generate or redraw the logo.
Check: one focal object, original brand blue, clean text zone, realistic geometry, light background, no accidental glyphs. Export source image and record full prompt.`;
export default function AIGuidelines() {
 const [copied, setCopied] = useState(false);
 return <><PageHeader eyebrow="Agent-ready brand specification" title="让 AI 第一次就理解品牌" en="Clear constraints. Consistent output." description="提示词、品牌约束与验收标准，设计师和 AI Agent 共用。" /><Section id="workflow" title="三步形成一张可用的 KV"><div className="reference-grid">{[['01 · 读约束', '读取下方 JSON、品牌色、官方 SVG 与完整提示词。保持主色和 Logo 不变，全 Light Mode。'], ['02 · 生成主视觉', '每次只生成一个主题；将标题区留白。不要让模型生成 Logo、文字、产品截图或未经确认的功能。'], ['03 · 排版与验收', '叠加官方矢量标识与可编辑文字；按目标比例重排。检查安全区、对比度、文字及品牌主张，保留原图和提示词。']].map(([title, body]) => <article className="reference-card" key={title}><h3>{title}</h3><p>{body}</p></article>)}</div></Section><Section id="prompt" title="可直接使用的主提示词"><Button variant="outline" onClick={async () => { try { await navigator.clipboard.writeText(prompt); setCopied(true); } catch { setCopied(false); } }}>{copied ? '已复制' : '复制提示词'}</Button><div className="mt-4"><CodeBlock code={prompt} lang="text" filename="TP-VPN-Main-KV.prompt" /></div></Section><Section id="contract" title="机器可读的设计标准"><div className="flex flex-wrap gap-6 mb-6"><a className="reference-download" href="/reference/ai-design-standard.json" download>下载 JSON 标准 ↗</a><a className="reference-download" href="/reference/social/prompts.json" download>下载全部实际生成提示词 ↗</a><a className="reference-download" href="/reference/AI-DESIGN-GUIDE.md" download>下载 Agent 使用说明 ↗</a></div><details><summary className="cursor-pointer py-3 text-fg-secondary">展开完整 JSON 标准</summary><CodeBlock code={JSON.stringify(rules, null, 2)} lang="json" filename="ai-design-standard.json" maxHeight={560} /></details></Section></>;
}
