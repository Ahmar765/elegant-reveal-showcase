import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RoomsContent } from "@/lib/site-api";

interface RoomsProps {
  content: RoomsContent;
}

export function Rooms({ content }: RoomsProps) {
  const [active, setActive] = useState(0);
  const [drag, setDrag] = useState({ x: 0, dragging: false, startX: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      setParallax({ x, y });
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  const room = content.items[active] ?? content.items[0];

  return (
    <section id="showroom" className="relative py-20 sm:py-32 px-5 sm:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-end justify-between gap-8 mb-16 flex-wrap">
          <div>
            <div className="flex items-center gap-3 text-[11px] tracking-[0.35em] uppercase text-gold/80 mb-6">
              <span className="w-8 h-px bg-gold/60" />
              {content.eyebrow}
            </div>
            <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[1] text-ivory max-w-2xl">
              {content.title} <span className="italic text-gradient-gold">{content.accent}</span>{content.suffix}
            </h2>
          </div>
          <p className="max-w-sm text-ivory/60 font-light">
            {content.description}
          </p>
        </div>

        <div
          ref={wrapRef}
          className="relative h-[460px] sm:h-[560px] lg:h-[640px] rounded-sm overflow-hidden glass-panel cursor-grab active:cursor-grabbing select-none"
          onMouseDown={(e) => setDrag({ x: drag.x, dragging: true, startX: e.clientX - drag.x })}
          onMouseUp={() => setDrag((d) => ({ ...d, dragging: false }))}
          onMouseLeave={() => setDrag((d) => ({ ...d, dragging: false }))}
          onMouseMove={(e) => {
            if (drag.dragging) {
              const nx = Math.max(-80, Math.min(80, e.clientX - drag.startX));
              setDrag({ ...drag, x: nx });
            }
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={room.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
              style={{
                transform: `translate(${parallax.x * -20 + drag.x}px, ${parallax.y * -10}px) scale(1.08)`,
                transition: drag.dragging ? "none" : "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              <img src={room.imageUrl} alt={room.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-onyx/70 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Floating cinematic light */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(500px circle at 70% 30%, hsl(38 70% 70% / 0.18), transparent 60%)",
            }}
          />

          {/* Caption */}
          <AnimatePresence mode="wait">
            <motion.div
              key={room.id + "-cap"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-10 left-10 max-w-md"
            >
              <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-3">{room.location}</div>
              <h3 className="font-serif text-5xl text-ivory mb-3">{room.title}</h3>
              <p className="text-ivory/75 font-light">{room.description}</p>
            </motion.div>
          </AnimatePresence>

          {/* Room selector */}
          <div className="absolute bottom-10 right-10 flex flex-col gap-3">
            {content.items.map((r, i) => (
              <button
                key={r.id}
                onClick={() => setActive(i)}
                className={`group flex items-center gap-3 text-right transition-all duration-700 ${
                  active === i ? "text-gold" : "text-ivory/50 hover:text-ivory"
                }`}
              >
                <span className="text-[10px] tracking-[0.3em] uppercase">{r.title}</span>
                <span
                  className={`block h-px transition-all duration-700 ${
                    active === i ? "w-12 bg-gold" : "w-4 bg-ivory/40 group-hover:w-8"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
