import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { InquiryContext, Product, siteApi } from "@/lib/site-api";

const Index = () => {
  const [consultOpen, setConsultOpen] = useState(false);
  const [context, setContext] = useState<InquiryContext | null>(null);

  const siteContentQuery = useQuery({
    queryKey: ["site-content"],
    queryFn: siteApi.getSiteContent,
    staleTime: 60_000,
  });

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: siteApi.getProducts,
    staleTime: 60_000,
  });

  const configuratorQuery = useQuery({
    queryKey: ["configurator-options"],
    queryFn: siteApi.getConfiguratorOptions,
    staleTime: 60_000,
  });

  const openConsult = (ctx: InquiryContext = { source: "consultation" }) => {
    setContext(ctx);
    setConsultOpen(true);
  };

  const handleProductRequest = (product: Product) => {
    openConsult({
      source: "product",
      context: product.name,
      productId: product.id,
      productName: product.name,
    });
  };

  const handleConfigReserve = (selection: {
    summary: string;
    configSelection: {
      colorId: string;
      legId: string;
      sizeId: string;
    };
  }) => {
    openConsult({
      source: "configurator",
      context: selection.summary,
      configSummary: selection.summary,
      configSelection: selection.configSelection,
    });
  };

  const isLoading =
    siteContentQuery.isLoading || productsQuery.isLoading || configuratorQuery.isLoading;
  const hasError =
    siteContentQuery.isError || productsQuery.isError || configuratorQuery.isError;

  if (isLoading) {
    return (
      <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
        <CursorLight />
        <div className="flex min-h-screen items-center justify-center px-8 text-center">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold/70">Maison Lumière</p>
            <h1 className="mt-4 font-serif text-4xl text-ivory">Preparing the atelier…</h1>
          </div>
        </div>
      </main>
    );
  }

  if (
    hasError ||
    !siteContentQuery.data ||
    !productsQuery.data ||
    !configuratorQuery.data
  ) {
    return (
      <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
        <CursorLight />
        <div className="flex min-h-screen items-center justify-center px-8 text-center">
          <div className="max-w-xl">
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold/70">Unable to load</p>
            <h1 className="mt-4 font-serif text-4xl text-ivory">The Maison Lumière experience is temporarily unavailable.</h1>
            <p className="mt-4 text-ivory/60 font-light">
              Please refresh the page or ensure the local API is running.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const siteContent = siteContentQuery.data;
  const products = productsQuery.data;
  const configurator = configuratorQuery.data;

  return (
    <main className="relative bg-background text-foreground overflow-x-hidden">
      <CursorLight />
      <Navbar content={siteContent.navigation} onOpenConsult={() => openConsult()} />
      <Hero content={siteContent.hero} onOpenConsult={() => openConsult()} />
      <Gallery content={siteContent.gallery} products={products} onRequest={handleProductRequest} />
      <Materials content={siteContent.materials} />
      <Rooms content={siteContent.rooms} />
      <Configurator content={configurator} onReserve={handleConfigReserve} />
      <Testimonials content={siteContent.testimonials} />
      <FinalCTA content={siteContent.cta} onConsult={() => openConsult()} />
      <Footer content={siteContent.footer} onConsult={() => openConsult()} />

      <ConsultationModal
        open={consultOpen}
        context={context}
        onClose={() => {
          setConsultOpen(false);
          setContext(null);
        }}
      />
    </main>
  );
};

export default Index;
