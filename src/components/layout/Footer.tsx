import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { WhatsappIcon, InstagramIcon, FacebookIcon, TiktokIcon } from "@/components/ui/BrandIcons";

export default function Footer() {
  return (
    <footer id="contact">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <div className="logo">Ve<b>dil</b><span className="dot" style={{ color: "var(--gold)" }}>.</span></div>
            <p>A Lagos fashion house: ready-to-wear, the It&apos;s Fun to Sew Academy, and a garment factory for brands that mean business.</p>
            <div className="foot-contact">
              <a href="mailto:hello@vedilclothing.com">
                <Mail strokeWidth={1.7} />
                hello@vedilclothing.com
              </a>
              <a href="tel:+2348138683171">
                <Phone strokeWidth={1.7} />
                +234 813 868 3171
              </a>
              <a href="https://wa.me/2348138683171" target="_blank" rel="noopener noreferrer">
                <WhatsappIcon />
                Chat on WhatsApp
              </a>
            </div>
            <div className="socials">
              <a href="#" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href="#" aria-label="TikTok">
                <TiktokIcon />
              </a>
            </div>
          </div>

          <div className="foot-col">
            <h4>Shop</h4>
            <ul>
              <li><Link href="/shop/men">Men</Link></li>
              <li><Link href="/shop/women">Women</Link></li>
              <li><Link href="/shop/children">Children</Link></li>
              <li><Link href="/shop/accessories">Accessories</Link></li>
              <li><Link href="/shop/new-arrivals">New Arrivals</Link></li>
            </ul>
          </div>

          <div className="foot-col">
            <h4>Learn &amp; Make</h4>
            <ul>
              <li><Link href="/academy">The Academy</Link></li>
              <li><Link href="/academy#in-person">In-person Classes</Link></li>
              <li><Link href="/academy#online">Online Courses</Link></li>
              <li><Link href="/garment-factory">Garment Factory</Link></li>
            </ul>
          </div>

          <div className="foot-col">
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/garment-factory#quote">Request a Quote</Link></li>
            </ul>
          </div>
        </div>

        <div className="foot-bottom">
          <span>© 2026 Vedil Clothing. All rights reserved. Made in Lagos, Nigeria.</span>
          <span>
            <Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
