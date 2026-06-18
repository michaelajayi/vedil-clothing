import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero" style={{ padding: 0 }}>
      <div className="ph" aria-hidden="true">
        <span className="ph-tag">Lifestyle image</span>
      </div>
      <div className="hero-meta reveal">
        <b>Est. Lagos</b>
        <span>Ready-to-Wear · Since 2016</span>
      </div>
      <div className="wrap">
        <div className="hero-content">
          <span className="eyebrow reveal">Lagos Fashion House</span>
          <h1 className="reveal">
            Dress in pieces<br />made with <em>intention.</em>
          </h1>
          <p className="reveal">
            Ready-to-wear for the whole family, a sewing school for the curious, and a garment
            factory built for brands. This is Vedil, where craft meets everyday elegance.
          </p>
          <div className="hero-cta reveal">
            <Link href="/shop" className="btn">
              Shop Now
              <svg className="arw" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/academy" className="btn btn--ghost">Explore the Academy</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
