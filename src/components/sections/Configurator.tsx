import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { resolveAsset } from "@/lib/assets";
import { ConfiguratorColor, ConfiguratorLeg, ConfiguratorOptions, ConfiguratorSize } from "@/lib/site-api";

interface ConfiguratorProps {
  content: ConfiguratorOptions;
  onReserve: (selection: {
    summary: string;
    configSelection: {
      colorId: string;
      legId: string;
      sizeId: string;
    };
  }) => void;
}

export function Configurator({ content, onReserve }: ConfiguratorProps) {
  const initialColor = content.colors[0];
  const initialLeg = content.legs[0];
  const initialSize = content.sizes[1] ?? content.sizes[0];
  const [color, setColor] = useState<ConfiguratorColor>(initialColor);
  const [leg, setLeg] = useState<ConfiguratorLeg>(initialLeg);
  const [size, setSize] = useState<ConfiguratorSize>(initialSize);

  const previewImage = useMemo(() => resolveAsset(color.imageKey), [color.imageKey]);
  const composedSummary = `Aurelia · ${color.label} leather · ${leg.label} legs · ${size.label}`;

  return (
    <section id="configure" className="relative py-32 px-8 bg-onyx">
      <div className="mx-auto max-w-[1400px]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 text-[11px] tracking-[0.35em] uppercase text-gold/80 mb-6">
            <span className="w-8 h-px bg-gold/60" />
            {content.section.eyebrow}
            <span className="w-8 h-px bg-gold/60" />
          </div>
          <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] text-ivory">
            {content.section.title} <span className="italic text-gradient-gold">{content.section.accent}</span>.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Image viewport */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="lg:col-span-7 h-[600px] glass-panel rounded-sm relative overflow-hidden flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={color.id}
                src={previewImage}
                alt={`Aurelia chair in ${color.label}`}
                width={1024}
                height={1024}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-[80%] max-h-[90%] object-contain"
                style={{
                  transform: `scale(${size.scale})`,
                  transition: "transform 0.9s cubic-bezier(0.16,1,0.3,1)",
                  filter: `drop-shadow(0 50px 60px rgba(0,0,0,0.6)) ${
                    leg.id === "blackened" ? "hue-rotate(-15deg) saturate(0.85)" : leg.id === "silver" ? "hue-rotate(180deg) saturate(0.4) brightness(1.05)" : ""
                  }`,
                }}
              />
            </AnimatePresence>

            <div className="absolute top-6 left-6 text-[10px] tracking-[0.3em] uppercase text-ivory/60">
              Aurelia · {size.label}
            </div>
            <div className="absolute bottom-6 right-6 text-[10px] tracking-[0.3em] uppercase text-gold/80">
              {content.section.previewLabel}
            </div>
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(600px circle at 70% 25%, hsl(38 60% 65% / 0.18), transparent 60%)",
              }}
            />
          </motion.div>

          {/* Controls */}
          <div className="lg:col-span-5 space-y-10">
            <Group label="Leather">
              <div className="grid grid-cols-4 gap-3">
                {content.colors.map((c) => (
                  <Swatch key={c.id} active={color.id === c.id} hex={c.hex} label={c.label} onClick={() => setColor(c)} />
                ))}
              </div>
            </Group>

            <Group label="Leg Finish">
              <div className="grid grid-cols-3 gap-3">
                {content.legs.map((l) => (
                  <Swatch key={l.id} active={leg.id === l.id} hex={l.hex} label={l.label} onClick={() => setLeg(l)} />
                ))}
              </div>
            </Group>

            <Group label="Proportion">
              <div className="grid grid-cols-3 gap-3">
                {content.sizes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSize(s)}
                    className={`group py-4 px-3 border text-[11px] tracking-[0.25em] uppercase transition-all duration-700 ${
                      size.id === s.id
                        ? "border-gold text-gold bg-gold/5"
                        : "border-ivory/15 text-ivory/65 hover:border-ivory/40 hover:text-ivory"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </Group>

            <div className="hairline opacity-50" />

            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-ivory/50 mb-1">From</div>
                <div className="font-serif text-3xl text-ivory">€ {(content.section.basePrice * size.scale).toFixed(0)}</div>
              </div>
              <button
                onClick={() =>
                  onReserve({
                    summary: composedSummary,
                    configSelection: {
                      colorId: color.id,
                      legId: leg.id,
                      sizeId: size.id,
                    },
                  })
                }
                className="btn-gold"
              >
                {content.section.reserveLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-gold/70 mb-4">
        <span className="w-6 h-px bg-gold/50" />
        {label}
      </div>
      {children}
    </div>
  );
}

function Swatch({ hex, label, active, onClick }: { hex: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-2 transition-transform duration-500 hover:-translate-y-1"
    >
      <span
        className={`block w-full h-14 rounded-sm border transition-all duration-700 ${
          active ? "border-gold shadow-[0_0_20px_hsl(38_55%_65%/0.4)]" : "border-ivory/15 group-hover:border-ivory/40"
        }`}
        style={{ background: hex }}
      />
      <span
        className={`text-[9px] tracking-[0.25em] uppercase transition-colors duration-500 ${
          active ? "text-gold" : "text-ivory/55 group-hover:text-ivory"
        }`}
      >
        {label}
      </span>
    </button>
  );
}
