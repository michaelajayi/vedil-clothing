"use client";

import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";
import { useProducts } from "@/lib/queries/catalog";
import { mapApiProducts } from "@/lib/product-mapper";

export default function ProductListClient() {
	const { data, isLoading, isError } = useProducts();

	// ─── Loading ───────────────────────────────────────────
	if (isLoading) {
		return (
			<div className="new-in-grid-skeleton">
				<div className="wrap">
					<header className="new-in-head-skeleton">
						<div
							className="skeleton-pulse"
							style={{ height: "2rem", width: "10rem" }}
						/>
						<div
							className="skeleton-pulse"
							style={{ height: "1rem", width: "6rem" }}
						/>
					</header>
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
										style={{
											height: "1rem",
											width: "70%",
											marginBottom: ".5rem",
										}}
									/>
									<div
										className="skeleton-pulse"
										style={{ height: "1rem", width: "40%" }}
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	// ─── Error ────────────────────────────────────────────
	if (isError) {
		return (
			<div
				className="wrap"
				style={{ textAlign: "center", paddingBlock: "3rem" }}
			>
				<p style={{ color: "var(--ink-soft)", marginBottom: "1rem" }}>
					Could not load products right now.
				</p>
				<Link href="/contact" className="btn btn--ghost">
					Contact us about stock
				</Link>
			</div>
		);
	}

	// ─── Empty ────────────────────────────────────────────
	const products = mapApiProducts(data ?? []);
	if (products.length === 0) {
		return null; // Hide the "New In" section when no products
	}

	// ─── Success ──────────────────────────────────────────
	// Show first 4 as "New In"
	const featured = products.slice(0, 4);

	return (
		<div className="wrap">
			<header className="new-in-head">
				<div>
					<h2 className="new-in-title">
						New <em>In</em>
					</h2>
					<p className="new-in-meta">Fresh from the studio · Limited pieces</p>
				</div>
				<Link href="/shop/ready-to-wear" className="link-arrow">
					View all →
				</Link>
			</header>
			<div className="new-in-grid">
				{featured.map((p) => (
					<ProductCard key={p.id} product={p} />
				))}
			</div>
		</div>
	);
}
