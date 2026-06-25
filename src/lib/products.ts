export type Category = 'africa-my-heritage' | 'ready-to-wear' | 'accessories';
export type Gender = 'women' | 'men' | 'children' | 'unisex';

export type Product = {
  id: string;
  name: string;
  description?: string;
  category: Category;
  gender: Gender;
  retailPrice: number;
  wholesalePrice: number;
  moq: number;
  featured?: boolean;
  isNew?: boolean;
  sizes?: string[];
};

export const CATEGORY_META: Record<Category, { name: string; tagline: string; description: string; mono: string }> = {
  'africa-my-heritage': {
    name: 'Africa My Heritage',
    tagline: 'Ankara · African prints',
    description: 'Vibrant Ankara prints and African fabric traditions reimagined for the modern wardrobe.',
    mono: 'A',
  },
  'ready-to-wear': {
    name: 'Ready to Wear',
    tagline: 'Everyday dressing, elevated',
    description: 'Clean silhouettes and versatile pieces designed for effortless everyday style.',
    mono: 'R',
  },
  'accessories': {
    name: 'Accessories',
    tagline: 'The finishing touch',
    description: 'Hats, jewellery, and style pieces that complete every look.',
    mono: 'Ac',
  },
};

export const PRODUCTS: Product[] = [
  // ─── Africa My Heritage ─────────────────────────────────────────────────────
  {
    id: 'amh-001',
    name: 'Ankara Basket Cape',
    description: 'A statement cape cut from bold Ankara prints, structured at the shoulders and flowing to a relaxed hem. Pairs effortlessly over trousers or a midi skirt for an elevated everyday look.',
    category: 'africa-my-heritage',
    gender: 'women',
    retailPrice: 20000,
    wholesalePrice: 16000,
    moq: 6,
    sizes: ['S','M','L','XL'],
  },
  {
    id: 'amh-002',
    name: 'Ankara Corset Top',
    description: 'A fitted corset silhouette in vibrant Ankara fabric, boned for structure and finished with a clean straight neckline. Style it high-waisted into a wide-leg trouser or wrap skirt.',
    category: 'africa-my-heritage',
    gender: 'women',
    retailPrice: 35000,
    wholesalePrice: 28000,
    moq: 6,
    featured: true,
    isNew: true,
    sizes: ['S','M','L','XL'],
  },
  {
    id: 'amh-003',
    name: 'Menswear 04',
    description: 'A refined two-piece in African wax-print fabric: a relaxed-fit shirt with a mandarin collar and matching straight-cut trousers. Designed for the modern man who carries heritage with ease.',
    category: 'africa-my-heritage',
    gender: 'men',
    retailPrice: 55000,
    wholesalePrice: 44000,
    moq: 6,
    sizes: ['M','L','XL','XXL'],
  },
  {
    id: 'amh-004',
    name: 'Valarie Asymmetric Corset Dress',
    description: 'An asymmetric hemline meets a structured corset bodice in this dramatic Ankara dress. The contrast of traditional print and modern silhouette makes it a standout piece for any occasion.',
    category: 'africa-my-heritage',
    gender: 'women',
    retailPrice: 42000,
    wholesalePrice: 33600,
    moq: 6,
    featured: true,
    sizes: ['S','M','L','XL'],
  },
  // ─── Ready to Wear ──────────────────────────────────────────────────────────
  {
    id: 'rtw-001',
    name: 'DD Asymmetric Two Piece',
    description: 'A coordinated set with an asymmetric draped top and a high-waist skirt. Cut for curves, finished in a lightweight fabric that moves with you from desk to dinner.',
    category: 'ready-to-wear',
    gender: 'women',
    retailPrice: 30000,
    wholesalePrice: 24000,
    moq: 6,
    featured: true,
    sizes: ['M','L','XL','Plus'],
  },
  {
    id: 'rtw-002',
    name: 'Jays Unisex Vintage Shirt',
    description: 'A relaxed, oversized shirt with a vintage-inspired wash and dropped shoulders. Designed for everyone — tuck it in, leave it out, or knot it at the waist.',
    category: 'ready-to-wear',
    gender: 'unisex',
    retailPrice: 12000,
    wholesalePrice: 9500,
    moq: 6,
    featured: true,
    isNew: true,
    sizes: ['S','M','L','XL'],
  },
  {
    id: 'rtw-003',
    name: 'Elena Wrap Jumpsuit',
    description: 'A wrap-front jumpsuit with wide-leg trousers and a self-tie waist. Elegant enough for evenings, comfortable enough for all-day wear.',
    category: 'ready-to-wear',
    gender: 'women',
    retailPrice: 25000,
    wholesalePrice: 20000,
    moq: 6,
    sizes: ['S','M','L','XL'],
  },
  {
    id: 'rtw-004',
    name: 'Nora Crop Top',
    description: 'A sleek cropped top with a square neckline and clean-finished edges. Versatile enough to pair with anything from high-waist jeans to a maxi skirt.',
    category: 'ready-to-wear',
    gender: 'women',
    retailPrice: 15000,
    wholesalePrice: 12000,
    moq: 6,
    sizes: ['XS','S','M','L'],
  },
  {
    id: 'rtw-005',
    name: 'Rose Two Piece',
    description: 'A soft-toned co-ord set featuring a structured blazer top and matching wide-leg trousers. Minimal, polished, and endlessly versatile.',
    category: 'ready-to-wear',
    gender: 'women',
    retailPrice: 28000,
    wholesalePrice: 22400,
    moq: 6,
    sizes: ['M','L','XL'],
  },
  {
    id: 'rtw-006',
    name: 'Queeneth Two Piece',
    description: 'A bold two-piece with an off-shoulder ruffle top and flared skirt. Designed with an inclusive fit and a silhouette that flatters all body types.',
    category: 'ready-to-wear',
    gender: 'women',
    retailPrice: 32000,
    wholesalePrice: 25600,
    moq: 6,
    isNew: true,
    sizes: ['M','L','XL','Plus'],
  },
  // ─── Accessories ────────────────────────────────────────────────────────────
  {
    id: 'acc-001',
    name: 'Ankara Handmade Sun Hat',
    description: 'A wide-brim sun hat handmade from Ankara fabric in our Lagos studio. Structured enough to hold its shape, bold enough to make a statement — the perfect finishing touch.',
    category: 'accessories',
    gender: 'women',
    retailPrice: 10000,
    wholesalePrice: 7500,
    moq: 12,
    featured: true,
    isNew: true,
  },
];

export function fmtPrice(n: number): string {
  return '₦' + n.toLocaleString('en-NG');
}

export function getByCategory(category: Category, gender?: string): Product[] {
  return PRODUCTS.filter(p => {
    if (p.category !== category) return false;
    if (!gender || gender === 'all') return true;
    return p.gender === gender || p.gender === 'unisex';
  });
}

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}

export function getRelated(product: Product, limit = 3): Product[] {
  return PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, limit);
}

export function getFeatured(): Product[] {
  return PRODUCTS.filter(p => p.featured);
}

export function isValidCategory(slug: string): slug is Category {
  return slug in CATEGORY_META;
}
