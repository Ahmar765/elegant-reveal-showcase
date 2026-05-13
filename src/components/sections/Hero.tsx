import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { resolveAsset } from "@/lib/assets";
import { HeroContent } from "@/lib/site-api";

interface HeroProps {
  content: HeroContent;
  onOpenConsult: () => void;
}

export function Hero({ content, onOpenConsult }: HeroProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const [auto, setAuto] = useState(0);
  const heroImage = resolveAsset(content.imageKey);

  // Slow auto-rotation that mouse can override
  useEffect(() => {
    let raf = 0;
    let t = 0;
    const tick = () => {
      t += 0.004;
      setAuto(Math.sin(t) * 6); // -6deg → +6deg
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  const onMove = (e: React.MouseEvent) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    const mx = ((e.clientX - r.left) / r.width) * 2 - 1; // -1..1
    const my = ((e.clientY - r.top) / r.height) * 2 - 1;
    if (imgRef.current) {
      imgRef.current.style.transform = `perspective(1400px) rotateY(${
        auto + mx * 8
      }deg) rotateX(${-my * 5}deg) translateZ(0)`;
    }
    if (spotRef.current) {
      spotRef.current.style.background = `radial-gradient(500px circle at ${e.clientX - r.left}px ${
        e.clientY - r.top
      }px, hsl(38 70% 70% / 0.28), transparent 60%)`;
    }
  };

  const onLeave = () => {
    if (imgRef.current) {
      imgRef.current.style.transform = `perspective(1400px) rotateY(${auto}deg) rotateX(0deg)`;
    }
    if (spotRef.current) {
      spotRef.current.style.background = "none";
    }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="collection"
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative w-full overflow-hidden bg-onyx"
    >
      {/* Backdrop gradient */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 82% 34%, hsl(38 40% 18% / 0.6), transparent 58%), radial-gradient(ellipse at 20% 90%, hsl(30 8% 4%), hsl(30 10% 6%))",
        }}
      />

      {/* Floating dust */}
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 28 }).map((_, i) => (
          <span
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gold/40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `drift ${10 + Math.random() * 14}s linear ${Math.random() * 8}s infinite`,
              ["--dx" as string]: `${(Math.random() - 0.5) * 80}px`,
              ["--dy" as string]: `${-80 - Math.random() * 200}px`,
            }}
          />
        ))}
      </div>

      {/* Cursor spotlight overlay (local) */}
      <div
        ref={spotRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-screen transition-[background] duration-300"
      />

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(30_12%_4%/0.85)_100%)]" />

      {/* Foreground content */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-10">
        <div className="grid min-h-[100svh] items-center gap-12 pb-14 pt-32 sm:gap-14 sm:pb-16 sm:pt-36 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:gap-16 lg:pb-12 lg:pt-28">
          <div className="max-w-[40rem] text-left">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 text-[11px] tracking-[0.35em] uppercase text-gold/80"
            >
              <span className="h-px w-8 bg-gold/60" />
              {content.eyebrow}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 font-serif text-[clamp(2.9rem,6vw,6.2rem)] leading-[0.92] tracking-tight text-ivory"
            >
              {content.title}
              <br />
              <span className="italic font-light text-gradient-gold">{content.accent}</span>{" "}
              <span className="font-light">{content.suffix}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 max-w-xl text-[15px] leading-7 text-ivory/65 font-light sm:text-base lg:text-lg"
            >
              {content.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-wrap items-center gap-4 pointer-events-auto"
            >
              <button onClick={() => scrollTo("atelier")} className="btn-gold">
                {content.primaryActionLabel}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </button>
              <button onClick={onOpenConsult} className="btn-ghost-luxury">
                {content.secondaryActionLabel}
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, delay: 1.5 }}
              className="mt-10 flex flex-wrap items-end gap-x-8 gap-y-6 border-t border-ivory/10 pt-6 text-ivory/60"
            >
              <div className="text-[10px] tracking-[0.4em] uppercase">{content.provenance}</div>
              <div className="flex items-center gap-8 text-xs tracking-widest">
                {content.stats.map((stat, index) => (
                  <div key={stat.label} className={`${index === 2 ? "hidden sm:flex" : "flex"} flex-col gap-1`}>
                    <span className="font-serif text-[2rem] leading-none text-ivory">{stat.value}</span>
                    <span className="text-[10px] tracking-[0.3em] uppercase text-ivory/50">{stat.label}</span>
                  </div>
                ))}
              </div>
              <div className="text-[10px] tracking-[0.4em] uppercase animate-float-soft lg:ml-auto">
                {content.hoverLabel}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none relative flex w-full justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[620px] lg:mr-0">
              <div
                aria-hidden
                className="absolute inset-x-8 bottom-6 h-28 rounded-full"
                style={{
                  background: "radial-gradient(ellipse, hsl(38 60% 55% / 0.4), transparent 72%)",
                  filter: "blur(32px)",
                }}
              />
              <div
                aria-hidden
                className="absolute -inset-x-2 top-12 bottom-14 rounded-[48%] bg-gold/8 blur-[90px]"
              />
              <img
                ref={imgRef}
                src={heroImage}
                alt={content.imageAlt}
                width={1024}
                height={1024}
                className="relative ml-auto w-full object-contain animate-fade-in-soft will-change-transform"
                style={{
                  transition: "transform 0.9s cubic-bezier(0.16,1,0.3,1)",
                  filter: "drop-shadow(0 60px 80px rgba(0,0,0,0.72))",
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
