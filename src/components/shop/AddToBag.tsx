"use client";

import { useState, useMemo } from "react";
import { useCart } from "@/contexts/CartContext";
import { fmtPrice } from "@/lib/products";
import { resolveVariantId } from "@/lib/cart-utils";
import type { ProductDisplay } from "@/lib/product-mapper";

export default function AddToBag({ product }: { product: ProductDisplay }) {
	const { addItem } = useCart();
	const hasSizes = !!product.sizes?.length;
	const [selectedSize, setSelectedSize] = useState<string | null>(
		hasSizes ? null : "one-size",
	);
	const [added, setAdded] = useState(false);

	const defaultVariantId = useMemo(
		() => resolveVariantId(product.variants, null),
		[product.variants],
	);

	function handleAdd() {
		const size = selectedSize === "one-size" ? null : selectedSize;
		const variantId = resolveVariantId(product.variants, size);

		if (!variantId) return;

		addItem({
			id: variantId,
			name: product.name,
			retailPrice: product.retailPrice,
			wholesalePrice: product.wholesalePrice,
			moq: product.moq,
			category: product.category,
			size: size ?? undefined,
			kind: "PHYSICAL",
		});
		setAdded(true);
		setTimeout(() => setAdded(false), 1800);
	}

	return (
		<div className="atb">
			{hasSizes && (
				<div className="atb-sizes">
					<p className="atb-size-label">Size</p>
					<div className="atb-chips">
						{product.sizes!.map((s) => (
							<button
								key={s}
								className={`size-chip${selectedSize === s ? " size-chip--active" : ""}`}
								onClick={() => setSelectedSize(s)}
								aria-pressed={selectedSize === s}
							>
								{s}
							</button>
						))}
					</div>
				</div>
			)}

			<button
				className={`btn atb-btn${added ? " atb-btn--added" : ""}`}
				onClick={handleAdd}
				disabled={!selectedSize || !defaultVariantId}
				aria-disabled={!selectedSize || !defaultVariantId}
			>
				{added
					? "Added ✓"
					: hasSizes && !selectedSize
						? "Select a size"
						: "Add to Bag"}
			</button>

			{product.wholesalePrice > 0 && (
				<p className="atb-ws-note">
					Buy {product.moq}+ units for wholesale pricing —{" "}
					<strong>{fmtPrice(product.wholesalePrice)}</strong> per unit
				</p>
			)}
		</div>
	);
}
