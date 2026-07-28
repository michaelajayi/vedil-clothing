"use client";

import { useState, useMemo, useCallback } from "react";
import { useCart } from "@/contexts/CartContext";
import { fmtPrice } from "@/lib/products";
import { resolveVariantIdByOptions } from "@/lib/cart-utils";
import type { ProductDisplay } from "@/lib/product-mapper";

/**
 * Build a map of option type name → selected value from the option groups.
 * Initializes the first option in each group as the default selection.
 */
function initSelections(
	groups: { name: string; values: string[] }[],
): Record<string, string> {
	const selections: Record<string, string> = {};
	for (const group of groups) {
		if (group.values.length > 0) {
			selections[group.name] = group.values[0];
		}
	}
	return selections;
}

export default function AddToBag({ product }: { product: ProductDisplay }) {
	const { addItem } = useCart();
	const groups = product.optionGroups;
	const [selections, setSelections] = useState<Record<string, string>>(
		initSelections(groups),
	);
	const [added, setAdded] = useState(false);

	const variantId = useMemo(
		() => resolveVariantIdByOptions(product.variants, selections),
		[product.variants, selections],
	);

	const allSelected = groups.every((g) => selections[g.name] != null);

	const handleAdd = useCallback(() => {
		if (!variantId) return;

		addItem({
			id: variantId,
			productId: product.id,
			name: product.name,
			retailPrice: product.retailPrice,
			wholesalePrice: product.wholesalePrice,
			moq: product.moq,
			category: product.category,
			options: { ...selections },
			size: selections["Size"] ?? undefined,
			kind: "PHYSICAL",
		});
		setAdded(true);
		setTimeout(() => setAdded(false), 1800);
	}, [variantId, product, selections, addItem]);

	return (
		<div className="atb">
			{/* ── Option chip rows ──────────────────────────────── */}
			{groups.map((group) => (
				<div key={group.name} className="atb-sizes">
					<p className="atb-size-label">{group.name}</p>
					<div className="atb-chips">
						{group.values.map((value) => (
							<button
								key={value}
								className={`size-chip${selections[group.name] === value ? " size-chip--active" : ""}`}
								onClick={() =>
									setSelections((prev) => ({ ...prev, [group.name]: value }))
								}
								aria-pressed={selections[group.name] === value}
							>
								{value}
							</button>
						))}
					</div>
				</div>
			))}

			{/* ── Add to Bag button ────────────────────────────── */}
			<button
				className={`btn atb-btn${added ? " atb-btn--added" : ""}`}
				onClick={handleAdd}
				disabled={!allSelected || !variantId}
				aria-disabled={!allSelected || !variantId}
			>
				{added ? "Added ✓" : !allSelected ? "Select all options" : "Add to Bag"}
			</button>

			{/* ── Wholesale hint ───────────────────────────────── */}
			{product.wholesalePrice > 0 && (
				<p className="atb-ws-note">
					Buy {product.moq}+ units for wholesale pricing —{" "}
					<strong>{fmtPrice(product.wholesalePrice)}</strong> per unit
				</p>
			)}
		</div>
	);
}
