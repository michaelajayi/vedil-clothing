// ─────────────────────────────────────────────────────────
// Cart utility helpers — variant resolution, enrichment
// ─────────────────────────────────────────────────────────

import type { ApiVariant } from "@/types/api";
import type { ProductDisplay } from "@/lib/product-mapper";

/**
 * Find the best variant ID for a product, optionally matching a size.
 *
 * - If a size is given, finds the variant whose optionValues include
 *   an option named "Size" with that value.
 * - If no size, returns the default variant (or first variant).
 * - Falls back to the default/first variant.
 */
export function resolveVariantId(
	variants: ApiVariant[],
	size?: string | null,
): string | null {
	if (!variants.length) return null;

	if (size) {
		const sizeLower = size.toLowerCase();
		const matched = variants.find((v) =>
			v.optionValues?.some(
				(ov) =>
					ov.optionValue?.optionType?.name?.toLowerCase() === "size" &&
					ov.optionValue?.value?.toLowerCase() === sizeLower,
			),
		);
		if (matched) return matched.id;
	}

	const defaultVariant = variants.find((v) => v.isDefault) ?? variants[0];
	return defaultVariant.id;
}

/**
 * Find the best variant ID by matching ALL selected option types.
 *
 * For example, if the user selected { Size: "XL", Color: "Red" },
 * this returns the variant whose optionValues match both.
 *
 * Falls back to the default variant (or first) when no options selected.
 */
export function resolveVariantIdByOptions(
	variants: ApiVariant[],
	selectedOptions: Record<string, string>,
): string | null {
	if (!variants.length) return null;

	const entries = Object.entries(selectedOptions);

	if (entries.length === 0) {
		return variants.find((v) => v.isDefault)?.id ?? variants[0]?.id ?? null;
	}

	const matched = variants.find((v) =>
		entries.every(([type, value]) =>
			v.optionValues?.some(
				(ov) =>
					ov.optionValue?.optionType?.name === type &&
					ov.optionValue?.value === value,
			),
		),
	);

	return matched?.id ?? null;
}

/**
 * Product lookup keyed by variantId — built from a product list.
 * Used to enrich backend cart items with product display info.
 */
export type VariantProductMap = Map<string, ProductDisplay>;

export function buildVariantProductMap(
	products: ProductDisplay[],
): VariantProductMap {
	const map: VariantProductMap = new Map();
	for (const product of products) {
		for (const variant of product.variants) {
			map.set(variant.id, product);
		}
	}
	return map;
}

/**
 * Find the size string for a given variantId within a product.
 */
export function resolveSizeForVariant(
	product: ProductDisplay,
	variantId: string,
): string | undefined {
	const variant = product.variants.find((v) => v.id === variantId);
	if (!variant) return undefined;

	const sizeOv = variant.optionValues?.find(
		(ov) => ov.optionValue?.optionType?.name?.toLowerCase() === "size",
	);
	return sizeOv?.optionValue?.value ?? undefined;
}

/**
 * Determine if two variantIds represent the same product (not same size).
 */
export function isSameProduct(
	variantIdA: string,
	variantIdB: string,
	variantMap: VariantProductMap,
): boolean {
	const productA = variantMap.get(variantIdA);
	const productB = variantMap.get(variantIdB);
	if (!productA || !productB) return false;
	return productA.id === productB.id;
}

/**
 * Check if a backend cart item already exists in a local cart item list
 * by matching variantId (so we don't duplicate across sizes).
 */
export function findCartItemByVariantId(
	items: { variantId: string }[],
	variantId: string,
): { variantId: string } | undefined {
	return items.find((i) => i.variantId === variantId);
}
