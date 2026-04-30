import { useRef } from "react";
import { motion } from "framer-motion";
import { HeroScene } from "../three/Scenes";

export function Hero() {
  const mouse = useRef({ x: 0, y: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    mouse.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    mouse.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  return (
    <section
      id="collection"
      ref={wrapRef}
      onMouseMove={onMove}
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* 3D Canvas backdrop */}
      <div className="absolute inset-0">
        <HeroScene mouse={mouse} />
      </div>

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(30_12%_4%/0.85)_100%)]" />

      {/* Foreground content */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-8 pt-40 pb-24 min-h-screen flex flex-col justify-between">
        {/* Top label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 text-[11px] tracking-[0.35em] uppercase text-gold/80"
        >
          <span className="w-8 h-px bg-gold/60" />
          The 2026 Atelier Collection
        </motion.div>

        {/* Headline */}
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[clamp(3.5rem,9vw,8.5rem)] leading-[0.95] tracking-tight text-ivory"
          >
            Crafted for
            <br />
            <span className="italic text-gradient-gold font-light">Timeless</span>{" "}
            <span className="font-light">Living.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 max-w-md text-base text-ivory/65 leading-relaxed font-light"
          >
            A private atelier of master craftsmen sculpting Italian leather, walnut and stone
            into furniture meant to outlast a lifetime.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap items-center gap-5"
          >
            <a href="#showroom" className="btn-gold">
              Explore Collection
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>
            <a href="#atelier" className="btn-ghost-luxury">Visit the Atelier</a>
          </motion.div>
        </div>

        {/* Bottom row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 1.5 }}
          className="flex items-end justify-between gap-8 text-ivory/60"
        >
          <div className="text-[10px] tracking-[0.4em] uppercase">
            Est. Milano · 1962
          </div>
          <div className="hidden md:flex items-center gap-12 text-xs tracking-widest">
            <div className="flex flex-col gap-1">
              <span className="font-serif text-3xl text-ivory">62</span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-ivory/50">Years of craft</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-serif text-3xl text-ivory">14</span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-ivory/50">Master ateliers</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-serif text-3xl text-ivory">∞</span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-ivory/50">Refinement</span>
            </div>
          </div>
          <div className="text-[10px] tracking-[0.4em] uppercase animate-float-soft">
            ↓ Drag · Hover · Discover
          </div>
        </motion.div>
      </div>
    </section>
  );
}
