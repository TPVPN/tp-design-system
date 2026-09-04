import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, ChevronRight, Globe2, Home, Power, Settings, ShieldCheck, Wifi } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, Switch } from '@tpvpn/ui';
import { PageHeader, Section } from '@/components/docs';
import './mobile.css';

const nodes = ['香港 · Hong Kong', '日本 · Tokyo', '新加坡 · Singapore'];
type Platform = 'ios' | 'android';
export function MobilePlayground({ platform, reduce = false }: { platform: Platform; reduce?: boolean }) {
  const pickerTrigger = useRef<HTMLButtonElement>(null);
  const systemReduce = useReducedMotion();
  const quiet = reduce || systemReduce;
  const [state, setState] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [tab, setTab] = useState('首页');
  const [picker, setPicker] = useState(false);
  const [query, setQuery] = useState('');
  const [node, setNode] = useState(nodes[0]);
  const [fail, setFail] = useState(false);
  const [auto, setAuto] = useState(true);
  const [kill, setKill] = useState(true);
  useEffect(() => {
    if (state !== 'connecting') return;
    const timer = setTimeout(() => setState(fail ? 'error' : 'connected'), 1600);
    return () => clearTimeout(timer);
  }, [state, fail]);
  const label = { idle: '点按连接', connecting: '取消连接', connected: '断开连接', error: '重试连接' }[state];
  return <div className="native-demo">
    <div className={`native-phone ${platform}`}>
      <div className="native-status" aria-hidden="true"><span>9:41</span><span>••• <Wifi size={14} /> ▰</span></div>
      <header className="native-heading"><span className="native-kicker">TP VPN</span><h3>{tab === '首页' ? '轻松连接世界' : tab}</h3><p>Light Mode · {platform === 'ios' ? 'iOS' : 'Android'}</p></header>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={tab} className="native-body" initial={{ opacity: quiet ? 1 : 0, y: quiet ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: quiet ? 1 : 0 }} transition={{ duration: quiet ? 0 : .18 }}>
          {tab === '首页' && <>
            <div className="native-connect-area">
              <motion.button className={`native-power ${state}`} aria-label={label} onClick={() => setState(state === 'connecting' || state === 'connected' ? 'idle' : 'connecting')} whileTap={quiet ? undefined : { scale: .96 }} transition={{ duration: quiet ? 0 : .12 }}>
                <motion.span animate={{ rotate: state === 'connecting' && !quiet ? 360 : 0 }} transition={{ duration: quiet ? 0 : 1.4, repeat: state === 'connecting' && !quiet ? 1 : 0, ease: 'linear' }}>
                  {state === 'connected' ? <ShieldCheck size={42} /> : <Power size={42} />}
                </motion.span>
              </motion.button>
              <p role="status" className="native-state">{{ idle: '尚未连接', connecting: '正在建立连接…', connected: '已连接 · 演示状态', error: '连接未成功，请重试' }[state]}</p>
              <p>{label}</p>
            </div>
            <button ref={pickerTrigger} className="native-row" onClick={() => setPicker(true)}><Globe2 size={22} /><span><strong>{node}</strong><small>当前节点 · 示例数据</small></span><ChevronRight size={18} /></button>
            <div className="native-note"><ShieldCheck size={18} /><span>WireGuard · 示例连接</span></div>
          </>}
          {tab === '节点' && <><label className="native-search">搜索节点<input value={query} onChange={e => setQuery(e.target.value)} placeholder="国家或城市" /></label><div className="native-list">{nodes.filter(n => n.toLowerCase().includes(query.toLowerCase())).map(n => <button className="native-row" key={n} onClick={() => { setNode(n); setState('idle'); setTab('首页'); }}><Globe2 size={20} /><span>{n}</span>{n === node && <Check size={20} aria-label="已选择" />}</button>)}{!nodes.some(n => n.toLowerCase().includes(query.toLowerCase())) && <p role="status">未找到节点。试试其他国家或城市。</p>}</div></>}
          {tab === '设置' && <div className="native-list"><label className="native-row"><span><strong>自动连接</strong><small>打开 App 后尝试连接</small></span><Switch checked={auto} onCheckedChange={setAuto} aria-label="自动连接" /></label><label className="native-row"><span><strong>网络保护</strong><small>连接中断时阻止流量 · 演示</small></span><Switch checked={kill} onCheckedChange={setKill} aria-label="网络保护" /></label><div className="native-note">设置预览</div></div>}
        </motion.div>
      </AnimatePresence>
      <nav className="native-tabs" aria-label={`${platform} 示例导航`}>{[[Home, '首页'], [Globe2, '节点'], [Settings, '设置']].map(([Icon, title]) => { const I = Icon as typeof Home; const t = title as string; return <button key={t} aria-current={tab === t ? 'page' : undefined} onClick={() => setTab(t)}><I size={22} /><span>{t}</span></button>; })}</nav>
      <div className="native-homebar" aria-hidden="true" />
    </div>
    <label className="native-test"><Switch checked={fail} onCheckedChange={setFail} aria-label="模拟连接失败" />模拟连接失败，再点按连接</label>
    <Dialog open={picker} onOpenChange={setPicker}><DialogContent className={`max-w-sm ${quiet ? 'native-reduce' : ''}`} onCloseAutoFocus={event => { event.preventDefault(); pickerTrigger.current?.focus(); }}><DialogTitle>选择连接节点</DialogTitle><DialogDescription>切换节点将清除当前演示连接状态。</DialogDescription>{nodes.map(n => <button className="native-row" key={n} onClick={() => { setNode(n); setState('idle'); setPicker(false); }}><Globe2 size={20} /><span>{n}</span>{n === node && <Check size={20} />}</button>)}</DialogContent></Dialog>
  </div>;
}

export default function NativeGuide({ platform }: { platform: Platform }) {
  const ios = platform === 'ios';
  return <><PageHeader eyebrow="Native experience" title={`${ios ? 'iOS' : 'Android'} UI 组件`} en={ios ? 'Familiar by nature.' : 'Distinctly Android. Clearly TP.'} description="连接、节点与设置。保留平台习惯，共用 TP 品牌语言。" />
    <Section id="playground" title="连接，一次清楚的动作" en="Interactive reference" description="试用连接与取消、失败与重试、节点搜索、节点弹层、底部导航与设置开关。"><MobilePlayground platform={platform} /></Section>
    <Section id="components" title="组件与平台映射"><div className="reference-grid">{(ios ? [
      ['导航与页面', 'NavigationStack + 原生返回。首页可用 Large Title，详情改为 Inline；支持边缘返回手势，不自行复制系统手势。'],
      ['节点与设置', 'List / Section / Toggle。整行可触达；选中节点用勾选符号 + 名称。设置描述允许换行。'],
      ['底部弹层', 'sheet + presentationDetents。中 / 大两档，保留拖拽关闭与焦点恢复；关键权限使用系统对话框。'],
      ['字体与尺寸', 'SF 系统字体及系统中文回退，支持 Dynamic Type。正文 17 pt 起；常规操作目标至少 44 × 44 pt。']
    ] : [
      ['导航与页面', 'Material 3 Scaffold / TopAppBar / NavigationBar。顶层不显示返回；详情尊重系统返回与预测性返回，不拦截根页面退出。'],
      ['节点与设置', 'ListItem / RadioButton / Switch。选择项有明确勾选或单选语义，开关颜色引用品牌色，不照搬 iOS 外形。'],
      ['底部弹层', 'ModalBottomSheet + 原生关闭行为。系统返回先关闭弹层，再返回上一层；输入时处理 IME 与安全区。'],
      ['字体与尺寸', 'Roboto / 系统中文回退，字号使用 sp、布局使用 dp。正文 16 sp 起；触控目标至少 48 × 48 dp。']
    ]).map(([title, body]) => <article className="reference-card" key={title}><h3>{title}</h3><p>{body}</p></article>)}</div></Section>
    <Section id="handoff" title="给原生开发的交付" description="Web 示例不创建 VPN 隧道；原生源码需接入真实状态并在目标工程编译验证。"><a className="reference-download" href={`/reference/native/${ios ? 'TPNativeReference.swift' : 'TPNativeReference.kt'}`} download>下载 {ios ? 'SwiftUI' : 'Jetpack Compose'} 参考源码 ↗</a><p className="mt-4 text-fg-secondary">小屏：内容边距 16；常规手机 20–24；平板限制内容宽度并改为分栏。文字放大时按内容撑高，不裁切状态与操作标签。</p><a className="reference-download" href={ios ? 'https://developer.apple.com/design/human-interface-guidelines/accessibility' : 'https://developer.android.com/develop/ui/compose/accessibility/api-defaults'} target="_blank" rel="noreferrer">{ios ? 'Apple' : 'Android'} 官方无障碍指南 ↗</a></Section></>;
}
