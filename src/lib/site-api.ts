import {
  configurator as configuratorSeed,
  materials as materialsSeed,
  pressMentions,
  products as productsSeed,
  rooms as roomsSeed,
  siteSections,
  testimonials as testimonialsSeed,
} from "../../server/src/seedData";

export type NavItem = { label: string; id: string };

export type NavigationContent = {
  brand: { primary: string; accent: string };
  items: NavItem[];
  consultLabel: string;
};

export type HeroStat = { value: string; label: string };

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

export type TestimonialItem = { id: string; quote: string; author: string; role: string };
export type PressMention = { id: string; label: string };

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
  brand: { primary: string; accent: string };
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

export type ConfiguratorColor = { id: string; label: string; hex: string; imageKey: string };
export type ConfiguratorLeg = { id: string; label: string; hex: string };
export type ConfiguratorSize = { id: string; label: string; scale: number };

export type ConfiguratorOptions = {
  section: ConfiguratorSection;
  colors: ConfiguratorColor[];
  legs: ConfiguratorLeg[];
  sizes: ConfiguratorSize[];
};

export type InquiryContext =
  | { source: "consultation"; context?: null }
  | { source: "product"; context: string; productId: string; productName: string }
  | {
      source: "configurator";
      context: string;
      configSummary: string;
      configSelection: { colorId: string; legId: string; sizeId: string };
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
  configSelection?: { colorId: string; legId: string; sizeId: string } | null;
};

export type InquiryResponse = { id: number; message: string };

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string[] | undefined>;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const strip = <T extends { sortOrder?: number }>(arr: readonly T[]): Omit<T, "sortOrder">[] =>
  arr.map(({ sortOrder: _s, ...rest }) => rest as Omit<T, "sortOrder">);

const siteContent: SiteContent = {
  navigation: siteSections.navigation,
  hero: siteSections.hero as HeroContent,
  gallery: siteSections.gallery,
  materials: { ...siteSections.materials, items: strip(materialsSeed) as MaterialItem[] },
  rooms: { ...siteSections.rooms, items: strip(roomsSeed) as RoomItem[] },
  testimonials: {
    ...siteSections.testimonials,
    items: strip(testimonialsSeed) as TestimonialItem[],
    press: strip(pressMentions) as PressMention[],
  },
  cta: siteSections.cta,
  footer: { ...siteSections.footer, socials: [...siteSections.footer.socials] },
};

const productsList: Product[] = strip(productsSeed) as Product[];

const configuratorOptions: ConfiguratorOptions = {
  section: configuratorSeed.section,
  colors: strip(configuratorSeed.colors) as ConfiguratorColor[],
  legs: strip(configuratorSeed.legs) as ConfiguratorLeg[],
  sizes: strip(configuratorSeed.sizes) as ConfiguratorSize[],
};

const wait = <T>(value: T) => Promise.resolve(value);

export const siteApi = {
  getSiteContent: () => wait(siteContent),
  getProducts: () => wait(productsList),
  getConfiguratorOptions: () => wait(configuratorOptions),
  submitInquiry: (_payload: InquiryPayload): Promise<InquiryResponse> =>
    wait({
      id: Date.now(),
      message:
        "Your request has been received. An atelier director will write to you within one business day.",
    }),
};
