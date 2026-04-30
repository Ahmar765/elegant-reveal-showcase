import { Navbar } from "@/components/Navbar";
import { CursorLight } from "@/components/CursorLight";
import { Hero } from "@/components/sections/Hero";
import { Gallery } from "@/components/sections/Gallery";
import { Materials } from "@/components/sections/Materials";
import { Rooms } from "@/components/sections/Rooms";
import { Configurator } from "@/components/sections/Configurator";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCTA, Footer } from "@/components/sections/FinalCTA";

const Index = () => {
  return (
    <main className="relative bg-background text-foreground overflow-x-hidden">
      <CursorLight />
      <Navbar />
      <Hero />
      <Gallery />
      <Materials />
      <Rooms />
      <Configurator />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  );
};

export default Index;
