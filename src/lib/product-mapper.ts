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
	/** Full variants for potential client-side switching */
	variants: ApiVariant[];
	/** Primary image URL or null */
	imageUrl: string | null;
}

// ─── Price extraction helpers ───────────────────────────

interface PriceInfo {
	retailPriceNaira: number;
	retailMinQty: number;
	wholesalePriceNaira: number | null;
	wholesaleMinQty: number | null;
}

function extractPrices(variants: ApiVariant[]): PriceInfo {
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

	// If a second tier exists, treat it as wholesale pricing
	const wholesaleTier = tiers.length > 1 ? tiers[1] : null;
	const wholesalePriceNaira = wholesaleTier ? wholesaleTier.amount / 100 : null;
	const wholesaleMinQty = wholesaleTier ? wholesaleTier.minQuantity : null;

	return {
		retailPriceNaira,
		retailMinQty,
		wholesalePriceNaira,
		wholesaleMinQty,
	};
}

// ─── Size extraction ────────────────────────────────────

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
	const prices = extractPrices(api.variants);

	return {
		id: api.id,
		slug: api.slug,
		name: api.name,
		description: api.description ?? undefined,
		category: mapCategory(api.category.slug),
		gender: inferGender(api.name),
		retailPrice: prices.retailPriceNaira,
		wholesalePrice: prices.wholesalePriceNaira ?? 0,
		moq: prices.wholesaleMinQty ?? prices.retailMinQty,
		isNew: isRecentlyCreated(api.createdAt),
		sizes: extractSizes(api.variants),
		variants: api.variants,
		imageUrl: api.images?.[0]?.file?.url ?? null,
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
