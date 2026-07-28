// ─────────────────────────────────────────────────────────
// Product Mapper — transforms API response shapes into
// the old frontend Product type for backward compat with
// ProductCard, AddToBag, and detail page components.
// ─────────────────────────────────────────────────────────

import type { ApiProductListItem, ApiVariant } from "@/types/api";
import type { Category, Gender } from "@/lib/products";

// ─── Display type (close to old Product) ────────────────

export interface ProductDisplay {
	id: string;
	/**
	 * Kept as slug for future URL use; for now ProductCard
	 * uses id in urls, so this is informational.
	 */
	slug: string;
	name: string;
	description?: string;
	/** Maps API "Shop" → our collection slug; default "ready-to-wear" */
	category: Category;
	/** Defaults to "unisex" until backend adds gender */
	gender: Gender;
	/** Naira — from default variant's first price tier */
	retailPrice: number;
	/** Naira — from a wholesale tier if one exists, else 0 */
	wholesalePrice: number;
	/** Min quantity for first tier; wholesale min if available */
	moq: number;
	/** Created within 30 days gets treated as new */
	isNew: boolean;
	featured?: boolean;
	/** Extracted from variant optionValues where optionType name is "Size" */
	sizes?: string[];
	/** All variant option groups — size, color, etc. — for generic chip rendering */
	optionGroups: OptionGroup[];
	/** Full variants for potential client-side switching */
	variants: ApiVariant[];
	/** Primary image URL or null */
	imageUrl: string | null;
	/** All product images (for gallery) */
	images: Array<{
		id: string;
		url: string;
		altText: string | null;
		isPrimary: boolean;
		width: number | null;
		height: number | null;
	}>;
}

// ─── Price extraction helpers ───────────────────────────

interface PriceInfo {
	retailPriceNaira: number;
	retailMinQty: number;
	wholesalePriceNaira: number | null;
	wholesaleMinQty: number | null;
}

function extractPrices(variants: ApiVariant[], productMoq: number): PriceInfo {
	const defaultVariant = variants.find((v) => v.isDefault) ?? variants[0];

	if (!defaultVariant || !defaultVariant.priceTiers.length) {
		return {
			retailPriceNaira: 0,
			retailMinQty: 1,
			wholesalePriceNaira: null,
			wholesaleMinQty: null,
		};
	}

	// Sort tiers by minQuantity ascending
	const tiers = [...defaultVariant.priceTiers].sort(
		(a, b) => a.minQuantity - b.minQuantity,
	);

	const retailTier = tiers[0];
	const retailPriceNaira = retailTier.amount / 100;
	const retailMinQty = retailTier.minQuantity;

	// Find the wholesale tier at or nearest to the product's MOQ
	// Prefer exact match, then the first tier with minQuantity >= moq
	// If no tier reaches MOQ, use the highest tier available
	const wholesaleTier =
		tiers.find((t) => t.minQuantity === productMoq) ??
		tiers.find((t) => t.minQuantity >= productMoq) ??
		tiers[tiers.length - 1];

	// Only treat it as wholesale if it's different from the retail tier
	const isWholesale =
		wholesaleTier && wholesaleTier.minQuantity > retailTier.minQuantity;

	return {
		retailPriceNaira,
		retailMinQty,
		wholesalePriceNaira: isWholesale ? wholesaleTier!.amount / 100 : null,
		wholesaleMinQty: isWholesale ? wholesaleTier!.minQuantity : null,
	};
}

// ─── Option groups extraction (generic) ─────────────────
// Extracts ALL unique option type × value pairs from variants,
// grouped by option type name. This handles Size, Color,
// Material, or any future option type the backend sends.

export interface OptionGroup {
	name: string;
	values: string[];
}

function extractOptionGroups(variants: ApiVariant[]): OptionGroup[] {
	const groups = new Map<string, Set<string>>();

	for (const variant of variants) {
		for (const ov of variant.optionValues ?? []) {
			const typeName = ov.optionValue?.optionType?.name;
			const value = ov.optionValue?.value;
			if (typeName && value) {
				if (!groups.has(typeName)) {
					groups.set(typeName, new Set());
				}
				groups.get(typeName)!.add(value);
			}
		}
	}

	return Array.from(groups.entries()).map(([name, values]) => ({
		name,
		values: Array.from(values).sort(),
	}));
}

// ─── Size extraction ────────────────────────────────────
// Kept for backward compat; callers should prefer optionGroups.

function extractSizes(variants: ApiVariant[]): string[] {
	const sizeSet = new Set<string>();

	for (const variant of variants) {
		for (const ov of variant.optionValues ?? []) {
			if (ov.optionValue?.optionType?.name?.toLowerCase() === "size") {
				sizeSet.add(ov.optionValue.value);
			}
		}
	}

	return Array.from(sizeSet).sort();
}

// ─── Category mapping ───────────────────────────────────
// The backend currently uses a single "Shop" category.
// We map it to our frontend collection taxonomy.
// Over time the backend will add proper collections.

const CATEGORY_MAP: Record<string, string> = {
	shop: "ready-to-wear",
	"africa-my-heritage": "africa-my-heritage",
	"ready-to-wear": "ready-to-wear",
	accessories: "accessories",
};

const VALID_COLLECTIONS = new Set([
	"ready-to-wear",
	"africa-my-heritage",
	"accessories",
]);

function mapCategory(apiSlug: string): Category {
	return (CATEGORY_MAP[apiSlug] as Category) ?? "ready-to-wear";
}

// ─── Gender heuristic ───────────────────────────────────
// Until the backend provides a gender field, we infer from
// product name + attributes, defaulting to unisex.

function inferGender(
	name: string,
	_attributes?: { name: string; value: string }[],
): Gender {
	const lower = name.toLowerCase();
	if (/\b(women|female|lady|girl)\b/.test(lower)) return "women";
	if (/\b(men|male|man|boy)\b/.test(lower)) return "men";
	if (/\b(kids|child|baby|unisex)\b/.test(lower)) return "unisex";
	return "unisex";
}

// ─── "New" heuristic ────────────────────────────────────

function isRecentlyCreated(createdAt: string): boolean {
	const created = new Date(createdAt).getTime();
	const thirtyDays = 30 * 24 * 60 * 60 * 1000;
	return Date.now() - created < thirtyDays;
}

// ─── Main mapper ────────────────────────────────────────

export function mapApiProduct(api: ApiProductListItem): ProductDisplay {
	const prices = extractPrices(api.variants, api.moq);

	// Use real API fields when available, fall back to heuristics
	const gender =
		api.gender != null
			? (api.gender.toLowerCase() as Gender)
			: inferGender(api.name);

	const isNew =
		api.isNew != null ? api.isNew : isRecentlyCreated(api.createdAt);

	const featured = api.featured ?? false;

	return {
		id: api.id,
		slug: api.slug,
		name: api.name,
		description: api.description ?? undefined,
		category: mapCategory(api.category.slug),
		gender,
		retailPrice: prices.retailPriceNaira,
		wholesalePrice: prices.wholesalePriceNaira ?? 0,
		moq: api.moq, // Use the product's own MOQ field
		isNew,
		featured,
		sizes: extractSizes(api.variants),
		optionGroups: extractOptionGroups(api.variants),
		variants: api.variants,
		imageUrl: api.images?.[0]?.file?.url ?? null,
		images: (api.images ?? []).map((img) => ({
			id: img.id,
			url: img.file.url,
			altText: img.file.altText,
			isPrimary: img.isPrimary,
			width: img.file.width,
			height: img.file.height,
		})),
	};
}

export function mapApiProducts(list: ApiProductListItem[]): ProductDisplay[] {
	return list.map(mapApiProduct);
}

// ─── Category helpers ───────────────────────────────────

export function filterByCollection(
	products: ProductDisplay[],
	categorySlug: string,
): ProductDisplay[] {
	if (!VALID_COLLECTIONS.has(categorySlug)) return [];
	return products.filter((p) => p.category === categorySlug);
}

export function filterByGender(
	products: ProductDisplay[],
	gender: string,
): ProductDisplay[] {
	if (!gender || gender === "all") return products;
	return products.filter((p) => p.gender === gender);
}

export function findProductById(
	products: ProductDisplay[],
	id: string,
): ProductDisplay | undefined {
	return products.find((p) => p.id === id);
}
