import { motion } from "framer-motion";

export function Navbar() {
  const items = ["Collection", "Atelier", "Materials", "Showroom", "Journal"];
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      className="fixed top-0 left-0 right-0 z-40"
    >
      <div className="mx-auto max-w-[1400px] px-8 py-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group">
          <span className="font-serif text-2xl tracking-wide text-ivory">Maison</span>
          <span className="font-serif italic text-2xl text-gradient-gold">Lumière</span>
        </a>
        <nav className="hidden md:flex items-center gap-10">
          {items.map((it) => (
            <a
              key={it}
              href={`#${it.toLowerCase()}`}
              className="reveal-line text-[11px] tracking-[0.25em] uppercase text-ivory/75 hover:text-gold transition-colors duration-500"
            >
              {it}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="text-[11px] tracking-[0.25em] uppercase text-ivory/85 border border-gold/40 px-5 py-2.5 hover:bg-gold/10 hover:border-gold transition-all duration-700"
        >
          Book a Visit
        </a>
      </div>
      <div className="hairline mx-8 opacity-40" />
    </motion.header>
  );
}
