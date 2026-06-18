import Link from "next/link";

export default function Footer() {
  return (
    <footer id="contact">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <div className="logo">Ve<b>dil</b><span className="dot" style={{ color: "var(--gold)" }}>.</span></div>
            <p>A Lagos fashion house — ready-to-wear, the It&apos;s Fun to Sew Academy, and a garment factory for brands that mean business.</p>
            <div className="foot-contact">
              <a href="mailto:hello@vedilclothing.com">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 7l-10 6L2 7" />
                </svg>
                hello@vedilclothing.com
              </a>
              <a href="tel:+2348138683171">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.94.36 1.86.7 2.73a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.35-1.35a2 2 0 012.11-.45c.87.34 1.79.57 2.73.7A2 2 0 0122 16.92z" />
                </svg>
                +234 813 868 3171
              </a>
              <a href="https://wa.me/2348138683171" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.739-.981z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
            <div className="socials">
              <a href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="#" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a href="#" aria-label="TikTok">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8.245a6.5 6.5 0 003.8 1.22V6.69a3.8 3.8 0 01-.8-.08 3.83 3.83 0 01-3-3.61H13.2v12.6a2.32 2.32 0 11-1.63-2.22V9.93a5.6 5.6 0 00-.69-.04 5.62 5.62 0 105.62 5.62V8.69a8.93 8.93 0 00-.5-.45z" />
                </svg>
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
