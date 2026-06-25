import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ScrollRevealInit from "@/components/home/ScrollRevealInit";
import ProductCard from "@/components/shop/ProductCard";
import AddToBag from "@/components/shop/AddToBag";
import {
  CATEGORY_META,
  getProduct,
  getRelated,
  isValidCategory,
  fmtPrice,
} from "@/lib/products";
import styles from "./page.module.css";

type Props = {
  params: Promise<{ category: string; product: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, product: productId } = await params;
  if (!isValidCategory(category)) return {};
  const product = getProduct(productId);
  if (!product) return {};
  return {
    title: `${product.name} | Vedil Clothing`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { category, product: productId } = await params;

  if (!isValidCategory(category)) notFound();

  const product = getProduct(productId);
  if (!product || product.category !== category) notFound();

  const meta = CATEGORY_META[category];
  const related = getRelated(product);

  const genderLabel =
    product.gender === "unisex"
      ? "Unisex"
      : product.gender.charAt(0).toUpperCase() + product.gender.slice(1);

  return (
    <main>
      <ScrollRevealInit />

      <div className={`wrap ${styles.pdpWrap}`}>
        {/* ── Breadcrumb ─────────────────────────────────────────── */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/shop">Shop</Link>
          <span aria-hidden="true">›</span>
          <Link href={`/shop/${category}`}>{meta.name}</Link>
          <span aria-hidden="true">›</span>
          <span>{product.name}</span>
        </nav>

        {/* ── Product layout ─────────────────────────────────────── */}
        <div className={styles.pdp}>
          {/* Image column */}
          <div className={`ph ${styles.pdpImage}`}>
            <span className="ph-mono">{product.name[0]}</span>
            <span className="ph-tag">{genderLabel}</span>
            {product.isNew && <span className="prod-new-badge">New</span>}
          </div>

          {/* Info column */}
          <div className={styles.pdpInfo}>
            <p className={styles.pdpEyebrow}>
              {genderLabel} · {meta.name}
            </p>

            <h1 className={styles.pdpName}>{product.name}</h1>

            <div className={styles.pdpPrices}>
              <p className={styles.pdpPrice}>{fmtPrice(product.retailPrice)}</p>
              <p className={styles.pdpWholesaleHint}>
                Wholesale from {product.moq} units
              </p>
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
              {product.sizes && (
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

      {/* ── Related products ─────────────────────────────────────── */}
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
    </main>
  );
}
