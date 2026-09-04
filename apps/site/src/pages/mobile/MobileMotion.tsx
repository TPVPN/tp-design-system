import { useState } from 'react';
import { Switch } from '@tpvpn/ui';
import { PageHeader, Section } from '@/components/docs';
import { MobilePlayground } from './NativeGuide';
export default function MobileMotion() {
 const [reduce, setReduce] = useState(false);
 return <><PageHeader eyebrow="Motion lab" title="有反馈，不喧宾夺主" en="Motion with a purpose." description="动效只解释变化：按下、连接、切换、出现与退出。没有循环装饰，不用动画掩盖连接等待，也不凭动画判定连接成功。" /><Section id="lab" title="交互实验室" description="点按连接可观察按压与状态切换；在连接中再次点按可取消。选择节点打开弹层，底部导航切换页面。"><label className="native-test mb-6"><Switch checked={reduce} onCheckedChange={setReduce} aria-label="减少动态效果" />减少动态效果（同时尊重系统偏好）</label><MobilePlayground platform="ios" reduce={reduce} /></Section><Section id="recipes" title="关键动效配方"><div className="reference-grid">{[
 ['按压 / Press', '120 ms · scale 1 → .96 → 1；释放恢复。原生优先使用系统 Button 的按压反馈。'],
 ['连接 / Connect', '状态由连接引擎驱动；演示等待 1.6 s。等待时允许取消，错误保持到重试，不自动闪走。'],
 ['页面 / Navigate', '180 ms · opacity + 8 px 位移。保持导航位置不动；不让上一页和下一页同时可交互。'],
 ['弹层 / Present', '200–300 ms · 原生 sheet；打开后焦点进入，关闭后回到触发器。Web 示例采用可键盘关闭的 Dialog。'],
 ['状态 / Feedback', '成功用静态盾牌 + 明确文本。失败保留重试；状态文本使用 live region，避免重复朗读计时。'],
 ['减少动态 / Reduced motion', '取消旋转、缩放、位移；即时切换文字与图标。原生绑定系统 Reduce Motion / 动画时长设置。']
 ].map(([title, body]) => <article key={title} className="reference-card"><h3>{title}</h3><p>{body}</p></article>)}</div></Section></>;
}
