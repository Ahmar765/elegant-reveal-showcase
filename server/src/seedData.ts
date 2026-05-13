export const siteSections = {
  navigation: {
    brand: {
      primary: "Maison",
      accent: "Lumière",
    },
    items: [
      { label: "Collection", id: "atelier" },
      { label: "Materials", id: "materials" },
      { label: "Showroom", id: "showroom" },
      { label: "Configure", id: "configure" },
      { label: "Journal", id: "press" },
    ],
    consultLabel: "Book a Visit",
  },
  hero: {
    eyebrow: "The 2026 Atelier Collection",
    title: "Crafted for",
    accent: "Timeless",
    suffix: "Living.",
    description:
      "A private atelier of master craftsmen sculpting Italian leather, walnut and stone into furniture meant to outlast a lifetime.",
    primaryActionLabel: "Explore Collection",
    secondaryActionLabel: "Visit the Atelier",
    imageKey: "heroChair",
    imageAlt: "Aurelia luxury lounge chair in oxblood Italian leather",
    provenance: "Est. Milano · 1962",
    hoverLabel: "Hover · Discover",
    stats: [
      { value: "62", label: "Years of craft" },
      { value: "14", label: "Master ateliers" },
      { value: "∞", label: "Refinement" },
    ],
  },
  gallery: {
    eyebrow: "Signature pieces",
    title: "The",
    accent: "Atelier",
    suffix: "Selection.",
    description:
      "Each piece is composed by a single master craftsman, signed and numbered. Hover to bring it to light.",
    quickViewLabel: "Quick View",
    requestLabel: "Request Piece",
  },
  materials: {
    eyebrow: "Materials & craftsmanship",
    title: "The",
    accent: "noble matter",
    suffix: "of every piece.",
  },
  rooms: {
    eyebrow: "The room experience",
    title: "Curated",
    accent: "interiors",
    suffix: ".",
    description: "Drag the canvas. Move your cursor. Step into our private interiors.",
  },
  testimonials: {
    eyebrow: "Trusted in private interiors worldwide",
  },
  cta: {
    eyebrow: "Maison Lumière",
    title: "Bring",
    accent: "luxury",
    suffix: "into your space.",
    description:
      "Reserve a private consultation with one of our atelier directors. We will visit, measure, sketch, and craft.",
    primaryActionLabel: "View Collection",
    secondaryActionLabel: "Book Consultation",
  },
  footer: {
    brand: {
      primary: "Maison",
      accent: "Lumière",
    },
    address: "Via della Spiga 14 · 20121 Milano · Italia",
    socials: [
      { label: "Instagram", url: "https://instagram.com" },
      { label: "Pinterest", url: "https://pinterest.com" },
    ],
    contactLabel: "Contact",
    copyright: "© MMXXVI Maison Lumière · All works signed and numbered",
  },
} as const;

export const products = [
  {
    id: "chair",
    name: "Aurelia Lounge",
    category: "Seating",
    priceLabel: "€ 8,400",
    priceValue: 8400,
    imageKey: "productChair",
    year: "MMXXVI",
    description:
      "Hand-stitched in our Milanese atelier across 84 hours. The aurelia lounge explores the silent dialogue between brushed brass, Tuscan leather and quiet geometry.",
    materials: "Italian leather · Brass",
    leadTime: "10 - 12 weeks",
    edition: "Numbered, /99",
    sortOrder: 1,
  },
  {
    id: "sofa",
    name: "Belluno Divano",
    category: "Sofa",
    priceLabel: "€ 24,900",
    priceValue: 24900,
    imageKey: "productSofa",
    year: "MMXXVI",
    description:
      "Hand-finished to anchor large living spaces with quiet confidence, the Belluno pairs sculpted volume with soft Italian leather and brushed metal details.",
    materials: "Italian leather · Solid walnut",
    leadTime: "12 - 14 weeks",
    edition: "Numbered, /49",
    sortOrder: 2,
  },
  {
    id: "table",
    name: "Carrara Orbis",
    category: "Table",
    priceLabel: "€ 12,200",
    priceValue: 12200,
    imageKey: "productTable",
    year: "MMXXV",
    description:
      "A sculptural center table balancing Carrara stone and bronze detailing, composed to hold light as much as objects.",
    materials: "Carrara marble · Bronze",
    leadTime: "8 - 10 weeks",
    edition: "Numbered, /60",
    sortOrder: 3,
  },
  {
    id: "lamp",
    name: "Sole d'Oro",
    category: "Lighting",
    priceLabel: "€ 4,750",
    priceValue: 4750,
    imageKey: "productLamp",
    year: "MMXXVI",
    description:
      "Warm metallic glow, disciplined proportions, and hand-finished surfaces define this atelier lighting piece.",
    materials: "Brass · Glass",
    leadTime: "6 - 8 weeks",
    edition: "Numbered, /120",
    sortOrder: 4,
  },
] as const;

export const configurator = {
  section: {
    eyebrow: "Bespoke configurator",
    title: "Compose your",
    accent: "Aurelia",
    reserveLabel: "Reserve Yours",
    previewLabel: "Live preview",
    basePrice: 8400,
  },
  colors: [
    { id: "oxblood", label: "Oxblood", hex: "#3a1418", imageKey: "chairOxblood", sortOrder: 1 },
    { id: "cognac", label: "Cognac", hex: "#7a4a2a", imageKey: "chairCognac", sortOrder: 2 },
    { id: "ivory", label: "Ivory", hex: "#e8d9bd", imageKey: "chairIvory", sortOrder: 3 },
    { id: "midnight", label: "Midnight", hex: "#15181f", imageKey: "chairMidnight", sortOrder: 4 },
  ],
  legs: [
    { id: "brass", label: "Brushed Brass", hex: "#c9a064", sortOrder: 1 },
    { id: "blackened", label: "Blackened Steel", hex: "#1a1a1a", sortOrder: 2 },
    { id: "silver", label: "Polished Nickel", hex: "#c0c4c8", sortOrder: 3 },
  ],
  sizes: [
    { id: "petite", label: "Petite", scale: 0.85, sortOrder: 1 },
    { id: "signature", label: "Signature", scale: 1, sortOrder: 2 },
    { id: "grand", label: "Grand", scale: 1.12, sortOrder: 3 },
  ],
} as const;

export const materials = [
  {
    id: "leather",
    name: "Italian Leather",
    origin: "Toscana, IT",
    note: "Vegetable-tanned across six weeks. Patinas with light.",
    imageKey: "materialLeather",
    sortOrder: 1,
  },
  {
    id: "walnut",
    name: "Canaletto Walnut",
    origin: "Lombardia, IT",
    note: "Cut from sustainably managed forests, hand-oiled.",
    imageKey: "materialWalnut",
    sortOrder: 2,
  },
  {
    id: "marble",
    name: "Bianco Carrara",
    origin: "Apuan Alps, IT",
    note: "Quarried in single blocks. Veined and polished by hand.",
    imageKey: "materialMarble",
    sortOrder: 3,
  },
  {
    id: "metal",
    name: "Brushed Brass",
    origin: "Brescia, IT",
    note: "Solid brass, brushed and lacquered for warmth.",
    imageKey: "materialBrass",
    sortOrder: 4,
  },
] as const;

export const rooms = [
  {
    id: "penthouse",
    title: "Penthouse Living",
    location: "Milano · Brera",
    description: "Floor-to-ceiling glass framing the Duomo, anchored by the Belluno divano.",
    imageUrl:
      "https://images.unsplash.com/photo-1618219740975-d40978bb7378?auto=format&fit=crop&w=1800&q=80",
    sortOrder: 1,
  },
  {
    id: "studio",
    title: "Minimal Studio",
    location: "Como · Lake House",
    description: "An exercise in restraint - Carrara stone, oak floors, late afternoon light.",
    imageUrl:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1800&q=80",
    sortOrder: 2,
  },
  {
    id: "office",
    title: "Executive Lounge",
    location: "Roma · Palazzo",
    description: "Quiet authority. Walnut, brushed brass, and the Aurelia chair in oxblood.",
    imageUrl:
      "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=1800&q=80",
    sortOrder: 3,
  },
] as const;

export const testimonials = [
  {
    id: "elena-rossi",
    quote:
      "Maison Lumiere don't make furniture. They compose silence. The Aurelia in my Milano flat has become the room itself.",
    author: "Elena Rossi",
    role: "Architect · Studio ER",
    sortOrder: 1,
  },
  {
    id: "hiroshi-tanaka",
    quote:
      "Every detail is whispered. The brass softens, the leather darkens, and the piece grows more itself each year.",
    author: "Hiroshi Tanaka",
    role: "Collector · Tokyo",
    sortOrder: 2,
  },
  {
    id: "charlotte-devereux",
    quote:
      "Few ateliers in Europe still work like this. Hand, eye, time. It is, quite simply, a craft of inheritance.",
    author: "Charlotte Devereux",
    role: "Editor · Maison & Objet",
    sortOrder: 3,
  },
] as const;

export const pressMentions = [
  { id: "architectural-digest", label: "Architectural Digest", sortOrder: 1 },
  { id: "wallpaper", label: "Wallpaper*", sortOrder: 2 },
  { id: "domus", label: "Domus", sortOrder: 3 },
  { id: "elle-decor", label: "Elle Decor", sortOrder: 4 },
  { id: "monocle", label: "Monocle", sortOrder: 5 },
] as const;
