"use client";

import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";
import { useProducts } from "@/lib/queries/catalog";
import {
	mapApiProducts,
	filterByCollection,
	filterByGender,
} from "@/lib/product-mapper";
import type { Category } from "@/lib/products";

export default function CategoryGridClient({
	category,
	activeGender,
}: {
	category: Category;
	activeGender: string;
}) {
	const { data, isLoading, isError } = useProducts();

	// ─── Loading ───────────────────────────────────────────
	if (isLoading) {
		return (
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
					gap: "1.5rem",
				}}
			>
				{[1, 2, 3, 4].map((i) => (
					<div key={i} className="prod-card">
						<div className="ph" style={{ height: 280 }}>
							<div
								className="skeleton-pulse"
								style={{ width: "100%", height: "100%" }}
							/>
						</div>
						<div className="prod-info">
							<div
								className="skeleton-pulse"
								style={{ height: "1rem", width: "70%", marginBottom: ".5rem" }}
							/>
							<div
								className="skeleton-pulse"
								style={{ height: "1rem", width: "40%" }}
							/>
						</div>
					</div>
				))}
			</div>
		);
	}

	// ─── Error ────────────────────────────────────────────
	if (isError) {
		return (
			<p className="shop-empty">
				Could not load products.{" "}
				<Link href="/contact" className="link-arrow">
					Contact us →
				</Link>
			</p>
		);
	}

	// ─── Empty / success ─────────────────────────────────
	const all = mapApiProducts(data ?? []);
	const byCollection = filterByCollection(all, category);
	const products = filterByGender(byCollection, activeGender);

	if (products.length === 0) {
		return (
			<p className="shop-empty">
				Nothing here yet.{" "}
				<Link href="/contact" className="link-arrow">
					Ask us about stock →
				</Link>
			</p>
		);
	}

	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
				gap: "1.5rem",
			}}
		>
			{products.map((p) => (
				<ProductCard key={p.id} product={p} />
			))}
		</div>
	);
}
