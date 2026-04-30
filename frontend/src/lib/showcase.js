// Curated stock imagery (Unsplash CDN) used for hero, lookbook, and product fallbacks
// when no admin-uploaded image is available.
const u = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const HERO_IMAGES = {
  main: u('photo-1490481651871-ab68de25d43d', 1800),
  side: u('photo-1485518882345-15568b007407', 1200),
};

export const CATEGORY_IMAGES = {
  Abayas: u('photo-1485518882345-15568b007407'),
  Kaftans: u('photo-1583391733956-3750e0ff4e8b'),
  Dresses: u('photo-1469334031218-e382a71b716b'),
  'Evening Wear': u('photo-1566174053879-31528523f8ae'),
  Accessories: u('photo-1611591437281-460bfbe1220a'),
};

export const LOOKBOOK = [
  u('photo-1490481651871-ab68de25d43d'),
  u('photo-1469334031218-e382a71b716b'),
  u('photo-1485518882345-15568b007407'),
  u('photo-1583391733956-3750e0ff4e8b'),
  u('photo-1566174053879-31528523f8ae'),
  u('photo-1539109136881-3be0616acf4b'),
  u('photo-1515886657613-9f3515b0c78f'),
  u('photo-1502716119720-b23a93e5fe1b'),
];

export const SHOWCASE_PRODUCTS = [
  {
    id: 's-1',
    name: 'Noor Embroidered Abaya',
    category: 'Abayas',
    price: 2400,
    image: u('photo-1485518882345-15568b007407'),
  },
  {
    id: 's-2',
    name: 'Layali Silk Kaftan',
    category: 'Kaftans',
    price: 3200,
    image: u('photo-1583391733956-3750e0ff4e8b'),
  },
  {
    id: 's-3',
    name: 'Yasmin Pearl Dress',
    category: 'Dresses',
    price: 2800,
    image: u('photo-1469334031218-e382a71b716b'),
  },
  {
    id: 's-4',
    name: 'Saharah Evening Gown',
    category: 'Evening Wear',
    price: 4500,
    image: u('photo-1566174053879-31528523f8ae'),
  },
  {
    id: 's-5',
    name: 'Zahra Crystal Abaya',
    category: 'Abayas',
    price: 3600,
    image: u('photo-1539109136881-3be0616acf4b'),
  },
  {
    id: 's-6',
    name: 'Amira Chiffon Kaftan',
    category: 'Kaftans',
    price: 2200,
    image: u('photo-1515886657613-9f3515b0c78f'),
  },
  {
    id: 's-7',
    name: 'Layla Velvet Dress',
    category: 'Dresses',
    price: 3100,
    image: u('photo-1502716119720-b23a93e5fe1b'),
  },
  {
    id: 's-8',
    name: 'Diana Sequin Gown',
    category: 'Evening Wear',
    price: 5200,
    image: u('photo-1490481651871-ab68de25d43d'),
  },
];

export const TESTIMONIALS = [
  {
    quote:
      'The craftsmanship is exquisite. My Eid abaya from RAS turned heads at every gathering — it felt like I was wearing an heirloom.',
    name: 'Fatima Al Maktoum',
    role: 'Dubai',
  },
  {
    quote:
      'Finally a label that understands what modern modesty looks like. The kaftan I bought is a permanent fixture in my wardrobe.',
    name: 'Sara Hassan',
    role: 'Abu Dhabi',
  },
  {
    quote:
      'I shipped my evening gown to London — the packaging alone felt like a gift. The fit was flawless.',
    name: 'Rania Khoury',
    role: 'London',
  },
];
