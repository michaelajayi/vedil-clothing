import type { Metadata } from "next";
import Link from "next/link";
import ScrollRevealInit from "@/components/home/ScrollRevealInit";

export const metadata: Metadata = {
  title: "About Us | Vedil Clothing",
  description:
    "Founded in 2012 by Vivian Duru, VEDIL Clothing is a Nigerian fashion brand that thrives on creativity, collaboration, and a deep love for the art of fashion.",
};

export default function AboutPage() {
  return (
    <main>
      <ScrollRevealInit />

      {/* Page hero */}
      <section className="page-hero">
        <div className="wrap">
          <span className="eyebrow reveal">Our story</span>
          <h1 className="reveal">
            Fashion that <em>empowers</em>
            <br />
            from Lagos, for the world.
          </h1>
          <p className="reveal">
            Founded in 2012, VEDIL Clothing is a Nigerian fashion house that thrives on
            creativity, collaboration, and a deep love for the art of fashion.
          </p>
        </div>
      </section>

      {/* Founder story */}
      <section>
        <div className="wrap">
          <div className="about-story">
            <div className="about-photos reveal">
              <div className="ph about-photo-main">
                <span className="ph-tag">Founder, Vivian Duru</span>
                <span className="ph-mono">V</span>
              </div>
              <div className="ph about-photo-float">
                <span className="ph-tag">Collection</span>
              </div>
            </div>
            <div>
              <span className="eyebrow reveal">About us</span>
              <h2
                className="reveal"
                style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)", marginBlock: "1rem 1.2rem" }}
              >
                Welcome to VEDIL Clothing
              </h2>
              <p className="reveal" style={{ color: "var(--ink-soft)", fontSize: "1.05rem", marginBottom: "1.2rem" }}>
                Welcome to VEDIL Clothing, a brand where passion for fashion meets timeless
                elegance. Founded in 2012 by the visionary Vivian Duru, VEDIL Clothing is a
                Nigerian fashion brand that thrives on creativity, collaboration, and a deep
                love for the art of fashion.
              </p>
              <p className="reveal" style={{ color: "var(--ink-soft)", fontSize: "1.05rem", marginBottom: "2rem" }}>
                Our team of dedicated designers and artisans work together to bring dreams to
                life, creating beautiful pieces that resonate with our clients&apos; unique
                styles and preferences. From ready-to-wear to custom couture, we serve men,
                women, and children across all walks of life.
              </p>
              <Link href="/shop" className="btn reveal">
                Shop the Collection
                <svg className="arw" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Goal + Mission/Vision */}
      <section style={{ background: "var(--paper)", borderRadius: "36px" }}>
        <div className="wrap" style={{ paddingBlock: "clamp(3rem,6vw,5rem)" }}>
          <div className="sec-head center">
            <span className="eyebrow reveal">Our goal</span>
            <h2 className="reveal">
              To create timeless fashion that empowers individuals and supports sustainable
              livelihoods.
            </h2>
          </div>
          <div className="mv-grid">
            <div className="mv-card reveal">
              <span className="eyebrow" style={{ marginBottom: "1rem" }}>Mission</span>
              <h3>What we do</h3>
              <p>
                To creatively and passionately create and make timeless fashion items that
                meet our clients&apos; unique preferences, one garment at a time.
              </p>
            </div>
            <div className="mv-card reveal">
              <span className="eyebrow" style={{ marginBottom: "1rem" }}>Vision</span>
              <h3>Where we&apos;re going</h3>
              <p>
                To be the fashion brand known for creating opportunities for everyday
                tailors and artisans for sustainable livelihood across Lagos and Nigeria.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Three offerings */}
      <section>
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow reveal">What we offer</span>
            <h2 className="reveal">Three ways we serve you</h2>
            <p className="reveal">
              Whether you want to buy, learn to sew, or have your designs manufactured at
              scale. Vedil has a home for you.
            </p>
          </div>
          <div className="offer-grid">
            <Link href="/shop" className="offer-card reveal">
              <div className="ph">
                <span className="ph-tag">Shop</span>
                <span className="ph-mono">S</span>
              </div>
              <h3>Shop</h3>
              <p>
                Ready-to-wear for men, women &amp; children. Ankara, African heritage
                prints, and everyday essentials.
              </p>
              <span className="link-arrow">
                Browse now{" "}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
            <Link href="/academy" className="offer-card reveal">
              <div className="ph">
                <span className="ph-tag">Academy</span>
                <span className="ph-mono">A</span>
              </div>
              <h3>It&apos;s Fun to Sew</h3>
              <p>
                In-person sewing classes from basics to advanced. Learn a craft that can
                change your life and career.
              </p>
              <span className="link-arrow">
                View courses{" "}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
            <Link href="/garment-factory" className="offer-card reveal">
              <div className="ph">
                <span className="ph-tag">Garment Factory</span>
                <span className="ph-mono">G</span>
              </div>
              <h3>Garment Factory</h3>
              <p>
                Bulk production, custom orders, and wholesale. Minimum 40 pieces for
                brand production runs.
              </p>
              <span className="link-arrow">
                Get a quote{" "}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Made to Measure CTA */}
      <section>
        <div className="wrap">
          <div className="made-measure reveal">
            <div className="ph" aria-hidden="true" />
            <div className="inner">
              <h2 className="made-measure-title">
                MADE TO
                <br />
                MEASURE.
              </h2>
              <p className="sub">We go beyond just making the item.</p>
              <Link href="/garment-factory" className="btn">
                Garment Factory
                <svg className="arw" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
