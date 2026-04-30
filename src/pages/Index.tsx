import { useState } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { CursorLight } from "@/components/CursorLight";
import { ConsultationModal } from "@/components/ConsultationModal";
import { Hero } from "@/components/sections/Hero";
import { Gallery } from "@/components/sections/Gallery";
import { Materials } from "@/components/sections/Materials";
import { Rooms } from "@/components/sections/Rooms";
import { Configurator } from "@/components/sections/Configurator";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCTA, Footer } from "@/components/sections/FinalCTA";

const Index = () => {
  const [consultOpen, setConsultOpen] = useState(false);
  const [context, setContext] = useState<string | null>(null);

  const openConsult = (ctx?: string) => {
    setContext(ctx ?? null);
    setConsultOpen(true);
  };

  const handleProductRequest = (productName: string) => {
    toast.success(`${productName} added to your inquiry.`, {
      description: "Complete the consultation form to confirm your reservation.",
    });
    openConsult(productName);
  };

  const handleConfigReserve = (summary: string) => {
    toast.success("Composition saved.", { description: summary });
    openConsult(summary);
  };

  return (
    <main className="relative bg-background text-foreground overflow-x-hidden">
      <CursorLight />
      <Navbar onOpenConsult={() => openConsult()} />
      <Hero onOpenConsult={() => openConsult()} />
      <Gallery onRequest={handleProductRequest} />
      <Materials />
      <Rooms />
      <Configurator onReserve={handleConfigReserve} />
      <Testimonials />
      <FinalCTA onConsult={() => openConsult()} />
      <Footer onConsult={() => openConsult()} />

      <ConsultationModal
        open={consultOpen}
        context={context}
        onClose={() => setConsultOpen(false)}
      />
    </main>
  );
};

export default Index;
