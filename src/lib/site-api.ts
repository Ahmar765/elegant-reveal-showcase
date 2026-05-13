export type NavItem = {
  label: string;
  id: string;
};

export type NavigationContent = {
  brand: {
    primary: string;
    accent: string;
  };
  items: NavItem[];
  consultLabel: string;
};

export type HeroStat = {
  value: string;
  label: string;
};

export type HeroContent = {
  eyebrow: string;
  title: string;
  accent: string;
  suffix: string;
  description: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  imageKey: string;
  imageAlt: string;
  provenance: string;
  hoverLabel: string;
  stats: HeroStat[];
};

export type GalleryContent = {
  eyebrow: string;
  title: string;
  accent: string;
  suffix: string;
  description: string;
  quickViewLabel: string;
  requestLabel: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  priceLabel: string;
  priceValue: number;
  imageKey: string;
  year: string;
  description: string;
  materials: string;
  leadTime: string;
  edition: string;
};

export type MaterialItem = {
  id: string;
  name: string;
  origin: string;
  note: string;
  imageKey: string;
};

export type MaterialsContent = {
  eyebrow: string;
  title: string;
  accent: string;
  suffix: string;
  items: MaterialItem[];
};

export type RoomItem = {
  id: string;
  title: string;
  location: string;
  description: string;
  imageUrl: string;
};

export type RoomsContent = {
  eyebrow: string;
  title: string;
  accent: string;
  suffix: string;
  description: string;
  items: RoomItem[];
};

export type TestimonialItem = {
  id: string;
  quote: string;
  author: string;
  role: string;
};

export type PressMention = {
  id: string;
  label: string;
};

export type TestimonialsContent = {
  eyebrow: string;
  items: TestimonialItem[];
  press: PressMention[];
};

export type CtaContent = {
  eyebrow: string;
  title: string;
  accent: string;
  suffix: string;
  description: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
};

export type FooterContent = {
  brand: {
    primary: string;
    accent: string;
  };
  address: string;
  socials: { label: string; url: string }[];
  contactLabel: string;
  copyright: string;
};

export type SiteContent = {
  navigation: NavigationContent;
  hero: HeroContent;
  gallery: GalleryContent;
  materials: MaterialsContent;
  rooms: RoomsContent;
  testimonials: TestimonialsContent;
  cta: CtaContent;
  footer: FooterContent;
};

export type ConfiguratorSection = {
  eyebrow: string;
  title: string;
  accent: string;
  reserveLabel: string;
  previewLabel: string;
  basePrice: number;
};

export type ConfiguratorColor = {
  id: string;
  label: string;
  hex: string;
  imageKey: string;
};

export type ConfiguratorLeg = {
  id: string;
  label: string;
  hex: string;
};

export type ConfiguratorSize = {
  id: string;
  label: string;
  scale: number;
};

export type ConfiguratorOptions = {
  section: ConfiguratorSection;
  colors: ConfiguratorColor[];
  legs: ConfiguratorLeg[];
  sizes: ConfiguratorSize[];
};

export type InquiryContext =
  | {
      source: "consultation";
      context?: null;
    }
  | {
      source: "product";
      context: string;
      productId: string;
      productName: string;
    }
  | {
      source: "configurator";
      context: string;
      configSummary: string;
      configSelection: {
        colorId: string;
        legId: string;
        sizeId: string;
      };
    };

export type InquiryPayload = {
  source: InquiryContext["source"];
  name: string;
  email: string;
  message: string;
  context?: string | null;
  productId?: string | null;
  productName?: string | null;
  configSummary?: string | null;
  configSelection?: {
    colorId: string;
    legId: string;
    sizeId: string;
  } | null;
};

export type InquiryResponse = {
  id: number;
  message: string;
};

type ApiFieldErrors = Record<string, string[] | undefined>;

type ApiErrorPayload = {
  message?: string;
  fieldErrors?: ApiFieldErrors;
};

export class ApiError extends Error {
  status: number;
  fieldErrors?: ApiFieldErrors;

  constructor(status: number, payload: ApiErrorPayload) {
    super(payload.message ?? "Something went wrong while processing the request.");
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = payload.fieldErrors;
  }
}

async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? ((await response.json()) as T | ApiErrorPayload) : null;

  if (!response.ok) {
    throw new ApiError(response.status, (payload as ApiErrorPayload) ?? {});
  }

  return payload as T;
}

export const siteApi = {
  getSiteContent: () => fetchJson<SiteContent>("/api/content/site"),
  getProducts: () => fetchJson<Product[]>("/api/products"),
  getConfiguratorOptions: () => fetchJson<ConfiguratorOptions>("/api/configurator/options"),
  submitInquiry: (payload: InquiryPayload) =>
    fetchJson<InquiryResponse>("/api/inquiries", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
