import { motion } from "framer-motion";
import { TestimonialsContent } from "@/lib/site-api";

interface TestimonialsProps {
  content: TestimonialsContent;
}

export function Testimonials({ content }: TestimonialsProps) {
  return (
    <section id="press" className="relative py-32 px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 text-[11px] tracking-[0.35em] uppercase text-gold/80 mb-6">
            <span className="w-8 h-px bg-gold/60" />
            {content.eyebrow}
            <span className="w-8 h-px bg-gold/60" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {content.items.map((q, i) => (
            <motion.figure
              key={q.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="relative glass-panel rounded-sm p-10 lift-on-hover animate-float-soft"
              style={{ animationDelay: `${i * 1.2}s` }}
            >
              <div className="font-serif text-6xl text-gold/60 leading-none mb-4">"</div>
              <blockquote className="font-serif text-xl text-ivory/90 italic leading-relaxed font-light">
                {q.quote}
              </blockquote>
              <figcaption className="mt-8 pt-6 border-t border-ivory/10">
                <div className="text-ivory text-sm">{q.author}</div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-ivory/50 mt-1">{q.role}</div>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <div className="hairline opacity-40 mb-10" />
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {content.press.map((p) => (
            <span
              key={p.id}
              className="font-serif italic text-lg text-ivory/40 hover:text-gold transition-colors duration-700 cursor-default"
            >
              {p.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
