import { motion } from "framer-motion";
import { NavigationContent } from "@/lib/site-api";

interface NavbarProps {
  content: NavigationContent;
  onOpenConsult: () => void;
}

export function Navbar({ content, onOpenConsult }: NavbarProps) {
  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      className="fixed top-0 left-0 right-0 z-40 bg-onyx/60 backdrop-blur-md"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-4 sm:py-6 flex items-center justify-between gap-3">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 sm:gap-3 group shrink-0"
        >
          <span className="font-serif text-lg sm:text-2xl tracking-wide text-ivory">{content.brand.primary}</span>
          <span className="font-serif italic text-lg sm:text-2xl text-gradient-gold">{content.brand.accent}</span>
        </button>
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {content.items.map((it) => (
            <button
              key={it.id}
              onClick={() => goTo(it.id)}
              className="reveal-line text-[11px] tracking-[0.25em] uppercase text-ivory/75 hover:text-gold transition-colors duration-500"
            >
              {it.label}
            </button>
          ))}
        </nav>
        <button
          onClick={onOpenConsult}
          className="text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-ivory/85 border border-gold/40 px-3 sm:px-5 py-2 sm:py-2.5 hover:bg-gold/10 hover:border-gold transition-all duration-700 whitespace-nowrap"
        >
          {content.consultLabel}
        </button>
      </div>
      <div className="hairline mx-5 sm:mx-8 opacity-40" />
    </motion.header>
  );
}
