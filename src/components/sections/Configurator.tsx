import { useState } from "react";
import { motion } from "framer-motion";
import { ConfigChair } from "../three/Scenes";

const colors = [
  { id: "oxblood", label: "Oxblood", hex: "#3a1418" },
  { id: "cognac", label: "Cognac", hex: "#7a4a2a" },
  { id: "ivory", label: "Ivory", hex: "#e8d9bd" },
  { id: "midnight", label: "Midnight", hex: "#15181f" },
];
const legs = [
  { id: "brass", label: "Brushed Brass", hex: "#c9a064" },
  { id: "blackened", label: "Blackened Steel", hex: "#1a1a1a" },
  { id: "silver", label: "Polished Nickel", hex: "#c0c4c8" },
];
const sizes = [
  { id: "petite", label: "Petite", scale: 0.85 },
  { id: "signature", label: "Signature", scale: 1 },
  { id: "grand", label: "Grand", scale: 1.15 },
];

export function Configurator() {
  const [color, setColor] = useState(colors[0]);
  const [leg, setLeg] = useState(legs[0]);
  const [size, setSize] = useState(sizes[1]);

  return (
    <section id="configure" className="relative py-32 px-8 bg-onyx">
      <div className="mx-auto max-w-[1400px]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 text-[11px] tracking-[0.35em] uppercase text-gold/80 mb-6">
            <span className="w-8 h-px bg-gold/60" />
            Bespoke configurator
            <span className="w-8 h-px bg-gold/60" />
          </div>
          <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] text-ivory">
            Compose your <span className="italic text-gradient-gold">Aurelia</span>.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* 3D viewport */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="lg:col-span-7 h-[600px] glass-panel rounded-sm relative overflow-hidden"
          >
            <ConfigChair color={color.hex} legColor={leg.hex} scale={size.scale} />
            {/* corner badge */}
            <div className="absolute top-6 left-6 text-[10px] tracking-[0.3em] uppercase text-ivory/50">
              Aurelia · {size.label}
            </div>
            <div className="absolute bottom-6 right-6 text-[10px] tracking-[0.3em] uppercase text-gold/70">
              Live preview
            </div>
          </motion.div>

          {/* Controls */}
          <div className="lg:col-span-5 space-y-10">
            <Group label="Leather">
              <div className="grid grid-cols-4 gap-3">
                {colors.map((c) => (
                  <Swatch key={c.id} active={color.id === c.id} hex={c.hex} label={c.label} onClick={() => setColor(c)} />
                ))}
              </div>
            </Group>

            <Group label="Leg Finish">
              <div className="grid grid-cols-3 gap-3">
                {legs.map((l) => (
                  <Swatch key={l.id} active={leg.id === l.id} hex={l.hex} label={l.label} onClick={() => setLeg(l)} />
                ))}
              </div>
            </Group>

            <Group label="Proportion">
              <div className="grid grid-cols-3 gap-3">
                {sizes.map((s) => (
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
                <div className="font-serif text-3xl text-ivory">€ {(8400 * size.scale).toFixed(0)}</div>
              </div>
              <button className="btn-gold">Reserve Yours</button>
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
      <span className={`text-[9px] tracking-[0.25em] uppercase transition-colors duration-500 ${active ? "text-gold" : "text-ivory/55 group-hover:text-ivory"}`}>
        {label}
      </span>
    </button>
  );
}
