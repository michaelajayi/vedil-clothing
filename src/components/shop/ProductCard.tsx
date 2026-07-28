"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { fmtPrice } from "@/lib/products";
import { resolveVariantId } from "@/lib/cart-utils";
import type { ProductDisplay } from "@/lib/product-mapper";

export default function ProductCard({ product }: { product: ProductDisplay }) {
	const router = useRouter();
	const { addItem } = useCart();

	const href = `/shop/${product.category}/${product.id}`;
	const defaultVariantId = resolveVariantId(product.variants, null);

	function navigateToProduct(e: React.MouseEvent) {
		// Don't navigate if clicking on the Add to Bag button
		if ((e.target as HTMLElement).closest(".prod-quick")) return;
		router.push(href);
	}

	function addToBag(e: React.MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (!defaultVariantId) return;
		addItem({
			id: defaultVariantId,
			productId: product.id,
			name: product.name,
			retailPrice: product.retailPrice,
			wholesalePrice: product.wholesalePrice,
			moq: product.moq,
			category: product.category,
			kind: "PHYSICAL",
		});
	}

	const genderLabel =
		product.gender === "unisex"
			? "Unisex"
			: product.gender.charAt(0).toUpperCase() + product.gender.slice(1);

	return (
		<article className="prod-card" onClick={navigateToProduct}>
			<div className="ph prod-img">
				{product.imageUrl && (
					<img
						src={product.imageUrl}
						alt={product.name}
						loading="lazy"
						style={{
							width: "100%",
							height: "100%",
							objectFit: "cover",
							position: "absolute",
							inset: 0,
						}}
					/>
				)}
				{product.isNew && <span className="prod-new-badge">New</span>}
				<button
					className="prod-quick"
					onClick={addToBag}
					aria-label={`Add ${product.name} to bag`}
				>
					Add to Bag
				</button>
			</div>
			<div className="prod-info">
				<h3 className="prod-name">
					<Link href={href} className="prod-card-link">
						{product.name}
					</Link>
				</h3>
				<p className="prod-price">{fmtPrice(product.retailPrice)}</p>
				{product.wholesalePrice > 0 && (
					<p className="prod-wholesale">
						Buy {product.moq}+ &middot; {fmtPrice(product.wholesalePrice)}
					</p>
				)}
			</div>
		</article>
	);
}
