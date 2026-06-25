import Link from "next/link";
import { ArrowRight } from "lucide-react";

const ArrowIcon = () => <ArrowRight size={15} strokeWidth={2} />;

export default function ShopSection() {
  return (
    <section id="shop">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">The Shop</span>
          <h2>Shop by category</h2>
          <p>Thoughtfully tailored ready-to-wear for every body and every occasion, designed, cut and finished in Lagos.</p>
        </div>

        <div className="cat-grid">
          <article className="cat-card heritage reveal">
            <div className="ph"><span className="ph-mono">A</span><span className="ph-tag">Africa My Heritage · Image</span></div>
            <div className="body">
              <h3>Africa My Heritage</h3>
              <p className="sub">Ankara · African prints</p>
              <Link href="/shop/africa-my-heritage" className="link-arrow">Browse Heritage <ArrowIcon /></Link>
            </div>
          </article>

          <article className="cat-card rtw reveal">
            <div className="ph"><span className="ph-mono">R</span><span className="ph-tag">Ready to Wear · Image</span></div>
            <div className="body">
              <h3>Ready to Wear</h3>
              <p className="sub">Everyday dressing, elevated</p>
              <Link href="/shop/ready-to-wear" className="link-arrow">Browse Ready to Wear <ArrowIcon /></Link>
            </div>
          </article>

          <article className="cat-card acc reveal">
            <div className="ph"><span className="ph-mono">Ac</span><span className="ph-tag">Accessories · Image</span></div>
            <div className="body">
              <h3>Accessories</h3>
              <p className="sub">The finishing touch</p>
              <Link href="/shop/accessories" className="link-arrow">Browse Accessories <ArrowIcon /></Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
