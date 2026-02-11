// Incarnation Construction - Company Constants

// Product Images - Cement
import ultratechPpc from "@/assets/products/ultratech-ppc.jpg";
import accGold from "@/assets/products/acc-gold.jpg";
import ambujaCement from "@/assets/products/ambuja-cement.jpg";
import shreeCement from "@/assets/products/shree-cement.jpg";
import birlaWhite from "@/assets/products/birla-white.jpg";
import dalmiaCement from "@/assets/products/dalmia-cement.jpg";

// Product Images - TMT Bars
import tataTiscon from "@/assets/products/tata-tiscon.jpg";
import jswNeosteel from "@/assets/products/jsw-neosteel.jpg";
import sailTmt from "@/assets/products/sail-tmt.jpg";

// Product Images - Bricks
import redBricks from "@/assets/products/red-bricks.jpg";
import flyAshBricks from "@/assets/products/fly-ash-bricks.jpg";
import aacBlocks from "@/assets/products/aac-blocks.jpg";

// Product Images - Sand & Aggregates
import riverSand from "@/assets/products/river-sand.jpg";
import crushedStone from "@/assets/products/crushed-stone.jpg";
import mSand from "@/assets/products/m-sand.jpg";

// Product Images - Paints
import asianPaintsApex from "@/assets/products/asian-paints-apex.jpg";
import bergerPaints from "@/assets/products/berger-paints.jpg";
import nerolacPaints from "@/assets/products/nerolac-paints.jpg";
import duluxPaints from "@/assets/products/dulux-paints.jpg";

// Product Images - Electrical
import finolexWire from "@/assets/products/finolex-wire.jpg";
import havellsWire from "@/assets/products/havells-wire.jpg";
import polycabWire from "@/assets/products/polycab-wire.jpg";
import vguardWire from "@/assets/products/vguard-wire.jpg";

// Product Images - Plumbing
import supremePipes from "@/assets/products/supreme-pipes.jpg";
import astralPipes from "@/assets/products/astral-pipes.jpg";
import princePipes from "@/assets/products/prince-pipes.jpg";
import ashirvadPipes from "@/assets/products/ashirvad-pipes.jpg";

// Product Images - Tiles
import kajariaTiles from "@/assets/products/kajaria-tiles.jpg";
import somanyTiles from "@/assets/products/somany-tiles.jpg";
import johnsonTiles from "@/assets/products/johnson-tiles.jpg";
import orientTiles from "@/assets/products/orient-tiles.jpg";

export const COMPANY = {
  name: "Increnation Construction",
  phone: "+91 9186193662",
  phoneClean: "919186193662",
  email: "Tinkudeshwal499@gmail.com",
  whatsappMessage: "Hello! I'm interested in your construction materials.",
  address: "India",
  tagline: "Building Tomorrow, Today",
  description: "Your trusted partner for quality construction materials. We provide cement, TMT bars, bricks, sand, and more at competitive prices.",
} as const;

export const SOCIAL_LINKS = {
  whatsapp: `https://wa.me/${COMPANY.phoneClean}?text=${encodeURIComponent(COMPANY.whatsappMessage)}`,
  phone: `tel:${COMPANY.phone}`,
  email: `mailto:${COMPANY.email}`,
} as const;

export const CATEGORIES = [
  { id: "cement", name: "Cement", icon: "Package", description: "Premium quality cement brands", productCount: 6 },
  { id: "tmt-bars", name: "TMT Bars", icon: "Cylinder", description: "High-strength steel bars", productCount: 3 },
  { id: "bricks", name: "Bricks", icon: "Layers", description: "Red bricks & fly ash bricks", productCount: 3 },
  { id: "sand", name: "Sand & Aggregates", icon: "Mountain", description: "River sand & crushed stone", productCount: 3 },
  { id: "paints", name: "Paints", icon: "Paintbrush", description: "Interior & exterior paints", productCount: 4 },
  { id: "electrical", name: "Electrical", icon: "Zap", description: "Wires, switches & fixtures", productCount: 4 },
  { id: "plumbing", name: "Plumbing", icon: "Droplets", description: "Pipes, fittings & fixtures", productCount: 4 },
  { id: "tiles", name: "Tiles & Flooring", icon: "Grid3X3", description: "Floor & wall tiles", productCount: 4 },
] as const;

export const FEATURED_PRODUCTS = [
  // Cement Products
  {
    id: "1",
    name: "UltraTech Cement PPC",
    category: "cement",
    price: 380,
    originalPrice: 420,
    unit: "per bag (50kg)",
    image: ultratechPpc,
    rating: 4.8,
    reviews: 156,
    inStock: true,
    isNew: false,
    isFeatured: true,
  },
  {
    id: "2",
    name: "ACC Gold Cement",
    category: "cement",
    price: 395,
    originalPrice: 430,
    unit: "per bag (50kg)",
    image: accGold,
    rating: 4.7,
    reviews: 98,
    inStock: true,
    isNew: false,
    isFeatured: true,
  },
  {
    id: "3",
    name: "Ambuja Cement PPC",
    category: "cement",
    price: 385,
    originalPrice: 415,
    unit: "per bag (50kg)",
    image: ambujaCement,
    rating: 4.8,
    reviews: 134,
    inStock: true,
    isNew: false,
    isFeatured: true,
  },
  {
    id: "4",
    name: "Shree Cement PPC",
    category: "cement",
    price: 370,
    originalPrice: 400,
    unit: "per bag (50kg)",
    image: shreeCement,
    rating: 4.6,
    reviews: 89,
    inStock: true,
    isNew: true,
    isFeatured: true,
  },
  {
    id: "5",
    name: "Birla White Cement",
    category: "cement",
    price: 450,
    originalPrice: 500,
    unit: "per bag (50kg)",
    image: birlaWhite,
    rating: 4.7,
    reviews: 112,
    inStock: true,
    isNew: false,
    isFeatured: true,
  },
  {
    id: "6",
    name: "Dalmia Cement PPC",
    category: "cement",
    price: 365,
    originalPrice: 395,
    unit: "per bag (50kg)",
    image: dalmiaCement,
    rating: 4.5,
    reviews: 78,
    inStock: true,
    isNew: true,
    isFeatured: true,
  },
  // TMT Bars
  {
    id: "7",
    name: "TATA Tiscon TMT Bar",
    category: "tmt-bars",
    price: 65,
    originalPrice: 72,
    unit: "per kg",
    image: tataTiscon,
    rating: 4.9,
    reviews: 203,
    inStock: true,
    isNew: false,
    isFeatured: true,
  },
  {
    id: "8",
    name: "JSW Neosteel TMT Bar",
    category: "tmt-bars",
    price: 62,
    originalPrice: 68,
    unit: "per kg",
    image: jswNeosteel,
    rating: 4.8,
    reviews: 167,
    inStock: true,
    isNew: true,
    isFeatured: true,
  },
  {
    id: "9",
    name: "SAIL TMT Steel Bar",
    category: "tmt-bars",
    price: 58,
    originalPrice: 65,
    unit: "per kg",
    image: sailTmt,
    rating: 4.6,
    reviews: 134,
    inStock: true,
    isNew: false,
    isFeatured: true,
  },
  // Bricks
  {
    id: "10",
    name: "Red Clay Bricks",
    category: "bricks",
    price: 8,
    originalPrice: 10,
    unit: "per piece",
    image: redBricks,
    rating: 4.4,
    reviews: 245,
    inStock: true,
    isNew: false,
    isFeatured: true,
  },
  {
    id: "11",
    name: "Fly Ash Bricks",
    category: "bricks",
    price: 6,
    originalPrice: 8,
    unit: "per piece",
    image: flyAshBricks,
    rating: 4.5,
    reviews: 178,
    inStock: true,
    isNew: false,
    isFeatured: true,
  },
  {
    id: "12",
    name: "AAC Blocks",
    category: "bricks",
    price: 55,
    originalPrice: 65,
    unit: "per piece",
    image: aacBlocks,
    rating: 4.7,
    reviews: 156,
    inStock: true,
    isNew: true,
    isFeatured: true,
  },
  // Sand & Aggregates
  {
    id: "13",
    name: "River Sand (Fine)",
    category: "sand",
    price: 2800,
    originalPrice: 3200,
    unit: "per ton",
    image: riverSand,
    rating: 4.6,
    reviews: 167,
    inStock: true,
    isNew: false,
    isFeatured: true,
  },
  {
    id: "14",
    name: "Crushed Stone Aggregate",
    category: "sand",
    price: 1800,
    originalPrice: 2100,
    unit: "per ton",
    image: crushedStone,
    rating: 4.5,
    reviews: 123,
    inStock: true,
    isNew: false,
    isFeatured: true,
  },
  {
    id: "15",
    name: "M-Sand (Manufactured)",
    category: "sand",
    price: 2500,
    originalPrice: 2900,
    unit: "per ton",
    image: mSand,
    rating: 4.6,
    reviews: 98,
    inStock: true,
    isNew: true,
    isFeatured: true,
  },
  // Paints
  {
    id: "16",
    name: "Asian Paints Apex",
    category: "paints",
    price: 4500,
    originalPrice: 5200,
    unit: "per 20L",
    image: asianPaintsApex,
    rating: 4.7,
    reviews: 87,
    inStock: true,
    isNew: false,
    isFeatured: true,
  },
  {
    id: "17",
    name: "Berger Paints Silk",
    category: "paints",
    price: 4200,
    originalPrice: 4800,
    unit: "per 20L",
    image: bergerPaints,
    rating: 4.6,
    reviews: 76,
    inStock: true,
    isNew: false,
    isFeatured: true,
  },
  {
    id: "18",
    name: "Nerolac Beauty Paints",
    category: "paints",
    price: 4100,
    originalPrice: 4700,
    unit: "per 20L",
    image: nerolacPaints,
    rating: 4.5,
    reviews: 92,
    inStock: true,
    isNew: true,
    isFeatured: true,
  },
  {
    id: "19",
    name: "Dulux Velvet Touch",
    category: "paints",
    price: 4800,
    originalPrice: 5500,
    unit: "per 20L",
    image: duluxPaints,
    rating: 4.8,
    reviews: 64,
    inStock: true,
    isNew: false,
    isFeatured: true,
  },
  // Electrical
  {
    id: "20",
    name: "Finolex Electrical Wire",
    category: "electrical",
    price: 2800,
    originalPrice: 3200,
    unit: "per 90m coil",
    image: finolexWire,
    rating: 4.8,
    reviews: 124,
    inStock: true,
    isNew: false,
    isFeatured: true,
  },
  {
    id: "21",
    name: "Havells Electrical Wire",
    category: "electrical",
    price: 3100,
    originalPrice: 3500,
    unit: "per 90m coil",
    image: havellsWire,
    rating: 4.9,
    reviews: 156,
    inStock: true,
    isNew: false,
    isFeatured: true,
  },
  {
    id: "22",
    name: "Polycab FR Cable",
    category: "electrical",
    price: 2900,
    originalPrice: 3300,
    unit: "per 90m coil",
    image: polycabWire,
    rating: 4.7,
    reviews: 98,
    inStock: true,
    isNew: true,
    isFeatured: true,
  },
  {
    id: "23",
    name: "V-Guard Electrical Wire",
    category: "electrical",
    price: 2700,
    originalPrice: 3100,
    unit: "per 90m coil",
    image: vguardWire,
    rating: 4.6,
    reviews: 87,
    inStock: true,
    isNew: false,
    isFeatured: true,
  },
  // Plumbing
  {
    id: "24",
    name: "Supreme CPVC Pipes",
    category: "plumbing",
    price: 450,
    originalPrice: 520,
    unit: "per 3m pipe",
    image: supremePipes,
    rating: 4.5,
    reviews: 76,
    inStock: true,
    isNew: false,
    isFeatured: true,
  },
  {
    id: "25",
    name: "Astral CPVC Pipes",
    category: "plumbing",
    price: 420,
    originalPrice: 480,
    unit: "per 3m pipe",
    image: astralPipes,
    rating: 4.6,
    reviews: 89,
    inStock: true,
    isNew: false,
    isFeatured: true,
  },
  {
    id: "26",
    name: "Prince UPVC Pipes",
    category: "plumbing",
    price: 380,
    originalPrice: 440,
    unit: "per 3m pipe",
    image: princePipes,
    rating: 4.5,
    reviews: 67,
    inStock: true,
    isNew: true,
    isFeatured: true,
  },
  {
    id: "27",
    name: "Ashirvad CPVC Pipes",
    category: "plumbing",
    price: 410,
    originalPrice: 470,
    unit: "per 3m pipe",
    image: ashirvadPipes,
    rating: 4.4,
    reviews: 54,
    inStock: true,
    isNew: false,
    isFeatured: true,
  },
  // Tiles & Flooring
  {
    id: "28",
    name: "Kajaria Floor Tiles",
    category: "tiles",
    price: 85,
    originalPrice: 100,
    unit: "per sq ft",
    image: kajariaTiles,
    rating: 4.8,
    reviews: 145,
    inStock: true,
    isNew: false,
    isFeatured: true,
  },
  {
    id: "29",
    name: "Somany Wall Tiles",
    category: "tiles",
    price: 75,
    originalPrice: 90,
    unit: "per sq ft",
    image: somanyTiles,
    rating: 4.6,
    reviews: 112,
    inStock: true,
    isNew: true,
    isFeatured: true,
  },
  {
    id: "30",
    name: "Johnson Bathroom Tiles",
    category: "tiles",
    price: 95,
    originalPrice: 115,
    unit: "per sq ft",
    image: johnsonTiles,
    rating: 4.7,
    reviews: 98,
    inStock: true,
    isNew: false,
    isFeatured: true,
  },
  {
    id: "31",
    name: "Orient Vitrified Tiles",
    category: "tiles",
    price: 110,
    originalPrice: 130,
    unit: "per sq ft",
    image: orientTiles,
    rating: 4.5,
    reviews: 76,
    inStock: true,
    isNew: true,
    isFeatured: true,
  },
];

export const TESTIMONIALS = [
  {
    id: "1",
    name: "Rajesh Kumar",
    role: "Civil Contractor",
    content: "Incarnation Construction has been our go-to supplier for 5 years. Their cement and TMT bars quality is exceptional, and delivery is always on time.",
    rating: 5,
    avatar: "RK",
  },
  {
    id: "2",
    name: "Priya Sharma",
    role: "Home Builder",
    content: "Built my dream home with materials from Incarnation. The prices were competitive and the team helped me choose the right products for my needs.",
    rating: 5,
    avatar: "PS",
  },
  {
    id: "3",
    name: "Mohammed Ali",
    role: "Construction Manager",
    content: "Reliable, professional, and excellent customer service. They understand construction needs and provide quality materials consistently.",
    rating: 5,
    avatar: "MA",
  },
];

export const WHY_CHOOSE_US = [
  {
    title: "Quality Assured",
    description: "All products are sourced from trusted brands and undergo strict quality checks",
    icon: "ShieldCheck",
  },
  {
    title: "Best Prices",
    description: "Competitive wholesale prices with no hidden charges",
    icon: "IndianRupee",
  },
  {
    title: "Fast Delivery",
    description: "Quick delivery to your construction site across the region",
    icon: "Truck",
  },
  {
    title: "Expert Support",
    description: "Our team helps you choose the right materials for your project",
    icon: "Headphones",
  },
];

export const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Categories", href: "/categories" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];
