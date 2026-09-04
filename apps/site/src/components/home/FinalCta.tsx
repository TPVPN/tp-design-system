import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Download } from 'lucide-react';
import { SITE } from '@/app/routes';
import { useReveal, VIEWPORT_ONCE } from '@/lib/motion';

export function FinalCta() {
  const { container, item } = useReveal({ stagger: 0.08 });
  return (
    <section aria-labelledby="cta-title" className="pb-20 lg:pb-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_ONCE}
          className="relative overflow-hidden rounded-2xl border border-blue-100 bg-blue-50/60 px-6 py-12 text-center text-fg-primary sm:px-14 lg:py-16"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(60%_80%_at_80%_0%,#ffffff_0%,transparent_60%)]"
            aria-hidden
          />
          <motion.p variants={item} className="eyebrow text-fg-brand">
            Ready when you are
          </motion.p>
          <motion.h2 variants={item} id="cta-title" className="mt-3 text-display-sm sm:text-display-md">
            把系统带进你的产品。
          </motion.h2>
          <motion.p variants={item} className="mx-auto mt-4 max-w-[46ch] text-body-lg text-fg-secondary">
            从组件文档开始，或直接下载品牌与 Token 资产包。所有文件随 v{SITE.version} 一起发布。
          </motion.p>
          <motion.div variants={item} className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/components"
              className="inline-flex min-h-12 items-center gap-2 rounded-md bg-action-primary-bg px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-action-primary-bg-hover"
            >
              浏览组件
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              to="/downloads"
              className="inline-flex min-h-12 items-center gap-2 rounded-md border border-border-default bg-bg-surface px-6 py-3 text-[15px] font-medium text-fg-primary transition-colors hover:border-blue-300"
            >
              <Download className="size-4" aria-hidden />
              下载资产
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
