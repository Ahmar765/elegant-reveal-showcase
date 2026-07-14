import { motion } from "framer-motion";
import { CtaContent, FooterContent } from "@/lib/site-api";

interface FinalCTAProps {
  content: CtaContent;
  onConsult: () => void;
}

export function FinalCTA({ content, onConsult }: FinalCTAProps) {
  const goCollection = () =>
    document.getElementById("atelier")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="contact" className="relative py-24 sm:py-40 px-5 sm:px-8 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(800px circle at 50% 100%, hsl(38 55% 60% / 0.15), transparent 60%)",
        }}
      />
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-center gap-3 text-[11px] tracking-[0.35em] uppercase text-gold/80 mb-8">
            <span className="w-8 h-px bg-gold/60" />
            {content.eyebrow}
            <span className="w-8 h-px bg-gold/60" />
          </div>
          <h2 className="font-serif text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] text-ivory">
            {content.title} <span className="italic text-gradient-gold">{content.accent}</span>
            <br /> {content.suffix}
          </h2>
          <p className="mt-8 max-w-xl mx-auto text-ivory/60 font-light leading-relaxed">
            {content.description}
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
            <button onClick={goCollection} className="btn-gold">{content.primaryActionLabel}</button>
            <button onClick={onConsult} className="btn-ghost-luxury">{content.secondaryActionLabel}</button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer({ content, onConsult }: { content: FooterContent; onConsult: () => void }) {
  return (
    <footer className="border-t border-ivory/10 px-8 py-12">
      <div className="mx-auto max-w-[1400px] flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="font-serif text-xl text-ivory">{content.brand.primary}</span>
          <span className="font-serif italic text-xl text-gradient-gold">{content.brand.accent}</span>
        </div>
        <div className="text-[10px] tracking-[0.3em] uppercase text-ivory/40">
          {content.address}
        </div>
        <div className="flex gap-6 text-[10px] tracking-[0.3em] uppercase text-ivory/50">
          <button onClick={onConsult} className="hover:text-gold transition-colors duration-500">{content.contactLabel}</button>
          {content.socials.map((social) => (
            <a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors duration-500"
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-[1400px] mt-8 text-center text-[10px] tracking-[0.3em] uppercase text-ivory/30">
        {content.copyright}
      </div>
    </footer>
  );
}
