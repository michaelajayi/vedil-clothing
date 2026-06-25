import type { Metadata } from "next";
import Link from "next/link";
import ScrollRevealInit from "@/components/home/ScrollRevealInit";
import ProductCard from "@/components/shop/ProductCard";
import { CATEGORY_META, getFeatured } from "@/lib/products";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Shop | Vedil Clothing",
};

const COLLECTIONS = [
  { slug: "africa-my-heritage", num: "01" },
  { slug: "ready-to-wear",      num: "02" },
  { slug: "accessories",        num: "03" },
] as const;

export default function ShopPage() {
  const featured = getFeatured();

  return (
    <main className={styles.root}>
      <ScrollRevealInit />

      {/* ── Editorial Intro ──────────────────────────────────── */}
      <section className={styles.intro}>
        <div className={styles.introType}>
          <p className={styles.introSeason}>The Collections · 2025</p>
          <h1 className={styles.introHead}>
            Made<br />
            in <em>Lagos.</em><br />
            Worn every<br />
            <em>where.</em>
          </h1>
        </div>
        <aside className={styles.introAside}>
          <p>
            Three collections — Ankara heritage, ready-to-wear, and accessories
            — all designed, cut, and finished in our Lagos studio since 2012.
          </p>
          <a href="#collections" className={styles.scrollCta}>
            Scroll to explore ↓
          </a>
        </aside>
      </section>

      {/* ── Collection Covers ────────────────────────────────── */}
      <section id="collections" className={styles.covers}>
        {COLLECTIONS.map(({ slug, num }) => {
          const meta = CATEGORY_META[slug];
          return (
            <Link
              key={slug}
              href={`/shop/${slug}`}
              className={styles.cover}
              data-cat={slug}
            >
              <div className={styles.coverBg} />
              <span className={styles.coverNum} aria-hidden="true">{num}</span>
              <div className={styles.coverBody}>
                <span className={styles.coverEyebrow}>{meta.tagline}</span>
                <h2 className={styles.coverTitle}>{meta.name}</h2>
                <p className={styles.coverDesc}>{meta.description}</p>
                <span className={styles.coverCta}>Explore Collection →</span>
              </div>
            </Link>
          );
        })}
      </section>

      {/* ── New In — wide editorial ───────────────────────────── */}
      <section className={styles.newIn}>
        <div className="wrap">
          <header className={styles.newInHead}>
            <div>
              <h2 className={styles.newInTitle}>
                New <em>In</em>
              </h2>
              <p className={styles.newInMeta}>Fresh from the studio · Limited pieces</p>
            </div>
            <Link href="/shop/ready-to-wear" className="link-arrow">
              View all →
            </Link>
          </header>
          <div className={styles.newInGrid}>
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <footer className={styles.newInFoot}>
            <Link href="/shop/africa-my-heritage" className="btn">
              Shop Ankara Heritage
            </Link>
            <Link href="/shop/ready-to-wear" className="link-arrow">
              Ready to Wear →
            </Link>
          </footer>
        </div>
      </section>

      {/* ── Founder Quote ────────────────────────────────────── */}
      <section className={styles.quoteSection}>
        <div className="wrap">
          <blockquote className={styles.quote}>
            <p>
              "We don't just make clothes — we make statements. Each piece is cut and
              finished in Lagos, ready to travel the world."
            </p>
            <cite>— Vivian Duru, Founder · Est. 2012</cite>
          </blockquote>
        </div>
      </section>
    </main>
  );
}
