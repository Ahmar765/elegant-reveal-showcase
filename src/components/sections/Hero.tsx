import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import heroChair from "@/assets/hero-chair.jpg";

interface HeroProps {
  onOpenConsult: () => void;
}

export function Hero({ onOpenConsult }: HeroProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const [auto, setAuto] = useState(0);

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
      className="relative min-h-screen w-full overflow-hidden bg-onyx"
    >
      {/* Backdrop gradient */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 70% 30%, hsl(38 40% 18% / 0.6), transparent 60%), radial-gradient(ellipse at 20% 90%, hsl(30 8% 4%), hsl(30 10% 6%))",
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
              ["--dx" as any]: `${(Math.random() - 0.5) * 80}px`,
              ["--dy" as any]: `${-80 - Math.random() * 200}px`,
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

      {/* Center hero chair image */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-[min(720px,75vw)] aspect-square">
          {/* Glow under chair */}
          <div
            aria-hidden
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-32 rounded-full"
            style={{
              background: "radial-gradient(ellipse, hsl(38 60% 55% / 0.45), transparent 70%)",
              filter: "blur(30px)",
            }}
          />
          <img
            ref={imgRef}
            src={heroChair}
            alt="Aurelia luxury lounge chair in oxblood Italian leather"
            width={1024}
            height={1024}
            className="relative w-full h-full object-contain animate-fade-in-soft will-change-transform"
            style={{
              transition: "transform 0.9s cubic-bezier(0.16,1,0.3,1)",
              filter: "drop-shadow(0 60px 80px rgba(0,0,0,0.7))",
            }}
          />
        </div>
      </div>

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(30_12%_4%/0.85)_100%)]" />

      {/* Foreground content */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-8 pt-40 pb-24 min-h-screen flex flex-col justify-between">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 text-[11px] tracking-[0.35em] uppercase text-gold/80"
        >
          <span className="w-8 h-px bg-gold/60" />
          The 2026 Atelier Collection
        </motion.div>

        <div className="max-w-2xl">
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
            className="mt-10 flex flex-wrap items-center gap-5 pointer-events-auto"
          >
            <button onClick={() => scrollTo("atelier")} className="btn-gold">
              Explore Collection
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </button>
            <button onClick={onOpenConsult} className="btn-ghost-luxury">Visit the Atelier</button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 1.5 }}
          className="flex items-end justify-between gap-8 text-ivory/60"
        >
          <div className="text-[10px] tracking-[0.4em] uppercase">Est. Milano · 1962</div>
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
            ↓ Hover · Discover
          </div>
        </motion.div>
      </div>
    </section>
  );
}
