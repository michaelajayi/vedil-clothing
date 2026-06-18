import Link from "next/link";

const ArrowIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export default function ShopSection() {
  return (
    <section id="shop">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">The Shop</span>
          <h2>Shop by category</h2>
          <p>Thoughtfully tailored ready-to-wear for every body and every occasion — designed, cut and finished in Lagos.</p>
        </div>

        <div className="cat-grid">
          <article className="cat-card men reveal">
            <div className="ph"><span className="ph-mono">M</span><span className="ph-tag">Men · Image</span></div>
            <div className="body">
              <h3>Men</h3>
              <p className="sub">Clothing &amp; Accessories</p>
              <Link href="/shop/men" className="link-arrow">Browse Men <ArrowIcon /></Link>
            </div>
          </article>

          <article className="cat-card women reveal">
            <div className="ph"><span className="ph-mono">W</span><span className="ph-tag">Women · Image</span></div>
            <div className="body">
              <h3>Women</h3>
              <p className="sub">Clothing &amp; Accessories</p>
              <Link href="/shop/women" className="link-arrow">Browse Women <ArrowIcon /></Link>
            </div>
          </article>

          <article className="cat-card kids reveal">
            <div className="ph"><span className="ph-mono">C</span><span className="ph-tag">Children · Image</span></div>
            <div className="body">
              <h3>Children</h3>
              <p className="sub">Clothing &amp; Accessories</p>
              <Link href="/shop/children" className="link-arrow">Browse Children <ArrowIcon /></Link>
            </div>
          </article>
        </div>

        <div className="cat-sub">
          <article className="sub-card acc reveal">
            <div className="ph" aria-hidden="true" />
            <div>
              <h3>Accessories</h3>
              <p>Headwraps, bags, belts and finishing touches that complete the look.</p>
              <Link href="/shop/accessories" className="link-arrow">Shop Accessories <ArrowIcon /></Link>
            </div>
          </article>
          <article className="sub-card new reveal">
            <div className="ph" aria-hidden="true" />
            <div>
              <h3>New Arrivals</h3>
              <p>Just in — fresh cuts and seasonal colours, restocked every week.</p>
              <Link href="/shop/new-arrivals" className="link-arrow">See What&apos;s New <ArrowIcon /></Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
