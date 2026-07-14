import { motion } from "framer-motion";
import { useState } from "react";
import { resolveAsset } from "@/lib/assets";
import { MaterialsContent } from "@/lib/site-api";

interface MaterialsProps {
  content: MaterialsContent;
}

export function Materials({ content }: MaterialsProps) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="materials" className="relative py-20 sm:py-32 px-5 sm:px-8 bg-onyx">
      <div className="mx-auto max-w-[1400px]">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="flex items-center justify-center gap-3 text-[11px] tracking-[0.35em] uppercase text-gold/80 mb-6">
            <span className="w-8 h-px bg-gold/60" />
            {content.eyebrow}
            <span className="w-8 h-px bg-gold/60" />
          </div>
          <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] text-ivory">
            {content.title} <span className="italic text-gradient-gold">{content.accent}</span> {content.suffix}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.items.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setActive(m.id)}
              onMouseLeave={() => setActive(null)}
              className="group relative cursor-pointer"
              style={{ perspective: "1200px" }}
            >
              <div
                className="relative h-[380px] glass-panel rounded-sm overflow-hidden transition-transform duration-700"
                style={{
                  transform: active === m.id ? "rotateY(8deg) rotateX(-4deg)" : "rotateY(0) rotateX(0)",
                  transformStyle: "preserve-3d",
                }}
              >
                <img
                  src={resolveAsset(m.imageKey)}
                  alt={`${m.name} from ${m.origin}`}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.4s]"
                  style={{ transform: active === m.id ? "scale(1.12)" : "scale(1)" }}
                />

                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-onyx via-onyx/85 to-transparent">
                  <div className="text-[10px] tracking-[0.3em] uppercase text-gold/80 mb-2">{m.origin}</div>
                  <div className="font-serif text-2xl text-ivory mb-2">{m.name}</div>
                  <p
                    className="text-ivory/65 text-sm font-light leading-relaxed transition-all duration-700 overflow-hidden"
                    style={{
                      maxHeight: active === m.id ? "120px" : "0px",
                      opacity: active === m.id ? 1 : 0,
                    }}
                  >
                    {m.note}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
