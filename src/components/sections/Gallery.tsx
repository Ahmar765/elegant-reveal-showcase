import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { resolveAsset } from "@/lib/assets";
import { GalleryContent, Product } from "@/lib/site-api";

interface GalleryProps {
  content: GalleryContent;
  products: Product[];
  onRequest: (product: Product) => void;
}

export function Gallery({ content, products, onRequest }: GalleryProps) {
  const [open, setOpen] = useState<Product | null>(null);

  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const mx = (e.clientX - r.left) / r.width - 0.5;
    const my = (e.clientY - r.top) / r.height - 0.5;
    const img = e.currentTarget.querySelector<HTMLImageElement>("[data-tilt]");
    if (img) {
      img.style.transform = `perspective(900px) rotateY(${mx * 14}deg) rotateX(${-my * 10}deg) translateY(-12px) scale(1.04)`;
    }
  };
  const resetTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const img = e.currentTarget.querySelector<HTMLImageElement>("[data-tilt]");
    if (img) img.style.transform = "perspective(900px) rotateY(0) rotateX(0) translateY(0) scale(1)";
  };

  return (
    <section id="atelier" className="relative py-32 px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-end justify-between gap-8 mb-20 flex-wrap">
          <div>
            <div className="flex items-center gap-3 text-[11px] tracking-[0.35em] uppercase text-gold/80 mb-6">
              <span className="w-8 h-px bg-gold/60" />
              {content.eyebrow}
            </div>
            <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[1] tracking-tight text-ivory max-w-2xl">
              {content.title} <span className="italic text-gradient-gold">{content.accent}</span> {content.suffix}
            </h2>
          </div>
          <p className="max-w-sm text-ivory/60 font-light leading-relaxed">
            {content.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group"
            >
              <button
                type="button"
                onClick={() => setOpen(p)}
                className="block w-full text-left"
              >
                <div
                  className="relative h-[420px] glass-panel rounded-sm overflow-hidden"
                  onMouseMove={handleTilt}
                  onMouseLeave={resetTilt}
                  style={{ perspective: "1000px" }}
                >
                  <img
                    data-tilt
                    src={resolveAsset(p.imageKey)}
                    alt={`${p.name} — ${p.category}`}
                    width={1024}
                    height={1024}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover will-change-transform"
                    style={{ transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)" }}
                  />

                  {/* Gold reflection underneath on hover */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-12 left-1/2 -translate-x-1/2 w-3/4 h-24 rounded-full opacity-0 group-hover:opacity-80 transition-opacity duration-700"
                    style={{
                      background: "radial-gradient(ellipse, hsl(38 60% 60% / 0.55), transparent 70%)",
                      filter: "blur(24px)",
                    }}
                  />

                  <div className="absolute top-5 left-5 text-[10px] tracking-[0.3em] uppercase text-ivory/70">
                    N° 0{i + 1}
                  </div>
                  <div className="absolute top-5 right-5 text-[10px] tracking-[0.3em] uppercase text-gold">
                    {p.year}
                  </div>

                  {/* Hover quick-view chip */}
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 text-[10px] tracking-[0.3em] uppercase text-onyx bg-gold px-4 py-2">
                    {content.quickViewLabel}
                  </div>
                </div>

                <div className="pt-6 flex items-end justify-between">
                  <div>
                    <div className="text-[10px] tracking-[0.3em] uppercase text-ivory/50 mb-2">{p.category}</div>
                    <div className="font-serif text-2xl text-ivory group-hover:text-gold transition-colors duration-700">
                      {p.name}
                    </div>
                  </div>
                  <div className="text-sm text-ivory/70 font-light">{p.priceLabel}</div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-onyx/85 backdrop-blur-md"
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl glass-panel rounded-sm overflow-hidden grid md:grid-cols-2"
            >
              <div className="h-[480px] relative bg-onyx">
                <img src={resolveAsset(open.imageKey)} alt={open.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-12 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-4">
                    {open.category} · {open.year}
                  </div>
                  <h3 className="font-serif text-5xl text-ivory mb-6">{open.name}</h3>
                  <p className="text-ivory/65 leading-relaxed font-light">
                    {open.description}
                  </p>
                  <div className="hairline mt-8 mb-8 opacity-50" />
                  <dl className="grid grid-cols-2 gap-y-3 text-sm">
                    <dt className="text-ivory/50 uppercase tracking-widest text-[10px]">Materials</dt>
                    <dd className="text-ivory/85">{open.materials}</dd>
                    <dt className="text-ivory/50 uppercase tracking-widest text-[10px]">Lead time</dt>
                    <dd className="text-ivory/85">{open.leadTime}</dd>
                    <dt className="text-ivory/50 uppercase tracking-widest text-[10px]">Edition</dt>
                    <dd className="text-ivory/85">{open.edition}</dd>
                  </dl>
                </div>
                <div className="mt-8 flex items-center justify-between gap-4">
                  <div className="font-serif text-3xl text-ivory">{open.priceLabel}</div>
                  <button
                    onClick={() => {
                      onRequest(open);
                      setOpen(null);
                    }}
                    className="btn-gold"
                  >
                    {content.requestLabel}
                  </button>
                </div>
              </div>
              <button
                onClick={() => setOpen(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full border border-ivory/20 text-ivory/70 hover:text-gold hover:border-gold transition-colors duration-500"
                aria-label="Close"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
