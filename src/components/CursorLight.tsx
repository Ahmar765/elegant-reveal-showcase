import { useEffect, useRef } from "react";

/** Mouse-follow gold spotlight overlay across the entire viewport. */
export function CursorLight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx, cy = ty;
    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const tick = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      el.style.setProperty("--mx", `${cx}px`);
      el.style.setProperty("--my", `${cy}px`);
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    tick();
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5] mix-blend-screen"
      style={{
        background:
          "radial-gradient(600px circle at var(--mx) var(--my), hsl(38 70% 65% / 0.10), transparent 60%)",
      }}
    />
  );
}
