"use client";

import Link from "next/link";
import { useProducts, useProduct } from "@/lib/queries/catalog";
import { mapApiProduct } from "@/lib/product-mapper";
import ProductCard from "@/components/shop/ProductCard";
import ProductGallery from "@/components/shop/ProductGallery";
import AddToBag from "@/components/shop/AddToBag";
import { CATEGORY_META, fmtPrice } from "@/lib/products";
import type { Category } from "@/lib/products";
import styles from "@/app/shop/[category]/[product]/page.module.css";

export default function ProductDetailClient({
	productId,
	category,
}: {
	productId: string;
	category: Category;
}) {
	// Step 1: fetch product list to resolve ID → slug
	const {
		data: listData,
		isLoading: listLoading,
		isError: listError,
	} = useProducts();

	const listItem = listData?.find((p) => p.id === productId);
	const slug = listItem?.slug;

	// Step 2: fetch product detail by slug (includes optionValues, full variants)
	const {
		data: detailData,
		isLoading: detailLoading,
		isError: detailError,
	} = useProduct(slug ?? "", !!slug);

	const isLoading = listLoading || (!!slug && detailLoading);
	const isError = listError || detailError;

	// ─── Loading ───────────────────────────────────────────
	if (isLoading) {
		return (
			<div className={`wrap ${styles.pdpWrap}`}>
				<div className={styles.breadcrumb}>
					<div
						className="skeleton-pulse"
						style={{ height: "0.8rem", width: "12rem" }}
					/>
				</div>
				<div className={styles.pdp}>
					<div className={`ph ${styles.pdpImage}`} style={{ height: 400 }} />
					<div className={styles.pdpInfo}>
						<div
							className="skeleton-pulse"
							style={{ height: "1rem", width: "40%", marginBottom: "0.8rem" }}
						/>
						<div
							className="skeleton-pulse"
							style={{ height: "2rem", width: "70%", marginBottom: "1rem" }}
						/>
						<div
							className="skeleton-pulse"
							style={{ height: "1.5rem", width: "30%", marginBottom: "1.5rem" }}
						/>
						<div
							className="skeleton-pulse"
							style={{ height: "3rem", width: "100%" }}
						/>
					</div>
				</div>
			</div>
		);
	}

	// ─── Error / Not found ────────────────────────────────
	if (isError || (!listLoading && !listData)) {
		return (
			<div className={`wrap ${styles.pdpWrap}`} style={{ textAlign: "center" }}>
				<h2 style={{ marginBottom: "1rem" }}>Could not load product</h2>
				<p style={{ color: "var(--ink-soft)" }}>
					<Link href={`/shop/${category}`}>
						Back to {CATEGORY_META[category]?.name ?? "shop"}
					</Link>
				</p>
			</div>
		);
	}

	const apiProduct = detailData ?? listItem;
	if (!apiProduct) {
		return (
			<div className={`wrap ${styles.pdpWrap}`} style={{ textAlign: "center" }}>
				<h2 style={{ marginBottom: "1rem" }}>Product not found</h2>
				<p style={{ color: "var(--ink-soft)" }}>
					<Link href={`/shop/${category}`}>
						Back to {CATEGORY_META[category]?.name ?? "shop"}
					</Link>
				</p>
			</div>
		);
	}

	// ─── Success ──────────────────────────────────────────
	const product = mapApiProduct(apiProduct);
	const meta =
		CATEGORY_META[product.category] ?? CATEGORY_META["ready-to-wear"];

	const allList = (listData ?? []).map(mapApiProduct);
	const related = allList
		.filter((p) => p.category === product.category && p.id !== product.id)
		.slice(0, 3);

	const genderLabel =
		product.gender === "unisex"
			? "Unisex"
			: product.gender.charAt(0).toUpperCase() + product.gender.slice(1);

	return (
		<>
			<div className={`wrap ${styles.pdpWrap}`}>
				{/* ── Breadcrumb ─────────────────────────────────────── */}
				<nav className={styles.breadcrumb} aria-label="Breadcrumb">
					<Link href="/shop">Shop</Link>
					<span aria-hidden="true">›</span>
					<Link href={`/shop/${category}`}>{meta.name}</Link>
					<span aria-hidden="true">›</span>
					<span>{product.name}</span>
				</nav>

				{/* ── Product layout ─────────────────────────────────── */}
				<div className={styles.pdp}>
					{/* Image column */}
					<div className={styles.pdpImage}>
						<ProductGallery
							images={product.images}
							fallback={
								<div className="pdp-gallery">
									<div className="pdp-gallery-viewport">
										<div className="pdp-gallery-slide ph">
											<span className="ph-mono">{product.name[0]}</span>
											<span className="ph-tag">{genderLabel}</span>
											{product.isNew && (
												<span className="prod-new-badge">New</span>
											)}
										</div>
									</div>
								</div>
							}
						/>
					</div>

					{/* Info column */}
					<div className={styles.pdpInfo}>
						<p className={styles.pdpEyebrow}>
							{genderLabel} · {meta.name}
						</p>

						<h1 className={styles.pdpName}>{product.name}</h1>

						<div className={styles.pdpPrices}>
							<p className={styles.pdpPrice}>{fmtPrice(product.retailPrice)}</p>
							{product.wholesalePrice > 0 && (
								<p className={styles.pdpWholesaleHint}>
									Wholesale from {product.moq} units
								</p>
							)}
						</div>

						<AddToBag product={product} />

						{product.description && (
							<div className={styles.pdpDesc}>
								<p className={styles.pdpDescLabel}>About this piece</p>
								<p>{product.description}</p>
							</div>
						)}

						<dl className={styles.pdpMeta}>
							<div>
								<dt>Category</dt>
								<dd>{meta.name}</dd>
							</div>
							<div>
								<dt>Made in</dt>
								<dd>Lagos, Nigeria</dd>
							</div>
							{product.sizes && product.sizes.length > 0 && (
								<div>
									<dt>Available sizes</dt>
									<dd>{product.sizes.join(", ")}</dd>
								</div>
							)}
							<div>
								<dt>MOQ (wholesale)</dt>
								<dd>{product.moq} units</dd>
							</div>
						</dl>
					</div>
				</div>
			</div>

			{/* ── Related products ─────────────────────────────────── */}
			{related.length > 0 && (
				<section className={styles.related}>
					<div className="wrap">
						<header className={styles.relatedHead}>
							<h2 className={styles.relatedTitle}>You might also like</h2>
							<Link href={`/shop/${category}`} className="link-arrow">
								View all →
							</Link>
						</header>
						<div className="prod-grid prod-grid--3 reveal">
							{related.map((p) => (
								<ProductCard key={p.id} product={p} />
							))}
						</div>
					</div>
				</section>
			)}
		</>
	);
}
