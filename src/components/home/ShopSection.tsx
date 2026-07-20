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
            <div className="ph" style={{ backgroundImage: "url(https://res.cloudinary.com/jqaitieh/image/upload/v1784491341/homepage_section_two_accessories_zopl7p.webp)", backgroundSize: "cover", backgroundPosition: "center" }} />
            <div className="body">
              <h3>Africa My Heritage</h3>
              <p className="sub">Ankara · African prints</p>
              <Link href="/shop/africa-my-heritage" className="link-arrow">Browse Heritage <ArrowIcon /></Link>
            </div>
          </article>

          <article className="cat-card rtw reveal">
            <div className="ph" style={{ backgroundImage: "url(https://res.cloudinary.com/jqaitieh/image/upload/v1784490649/homepage_section_two_ready_to_wear_image_fpa54a.webp)", backgroundSize: "cover", backgroundPosition: "center" }} />
            <div className="body">
              <h3>Ready to Wear</h3>
              <p className="sub">Everyday dressing, elevated</p>
              <Link href="/shop/ready-to-wear" className="link-arrow">Browse Ready to Wear <ArrowIcon /></Link>
            </div>
          </article>

          <article className="cat-card acc reveal">
            <div className="ph" style={{ backgroundImage: "url(https://res.cloudinary.com/jqaitieh/image/upload/v1784489040/wholesale_intro_homagepage_sfcfc6.webp)", backgroundSize: "cover", backgroundPosition: "center" }} />
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
