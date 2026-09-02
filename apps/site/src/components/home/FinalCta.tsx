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
          className="relative overflow-hidden rounded-3xl bg-gradient-primary px-8 py-14 text-center text-white shadow-brand-glow sm:px-14 lg:py-20"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(60%_80%_at_80%_0%,#ffffff_0%,transparent_60%)]"
            aria-hidden
          />
          <motion.p variants={item} className="eyebrow text-white/70">
            Ready when you are
          </motion.p>
          <motion.h2 variants={item} id="cta-title" className="mt-3 text-display-sm sm:text-display-md">
            把系统带进你的产品。
          </motion.h2>
          <motion.p variants={item} className="mx-auto mt-4 max-w-[46ch] text-body-lg text-white/85">
            从组件文档开始，或直接下载品牌与 Token 资产包。所有文件随 v{SITE.version} 一起发布。
          </motion.p>
          <motion.div variants={item} className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/components"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-white px-6 text-[15px] font-medium text-blue-700 shadow-level-2 transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:shadow-level-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              浏览组件
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              to="/downloads"
              className="inline-flex h-12 items-center gap-2 rounded-md border border-white/40 px-6 text-[15px] font-medium text-white transition-colors duration-200 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
