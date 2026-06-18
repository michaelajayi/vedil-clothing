import type { Metadata } from "next";
import ScrollRevealInit from "@/components/home/ScrollRevealInit";
import FactoryForm from "@/components/factory/FactoryForm";

export const metadata: Metadata = {
  title: "Garment Factory | Vedil Clothing",
  description:
    "High-volume bulk production, custom orders, and wholesale. Vedil Clothing's garment factory serves brands, retailers, organisations, and individuals. Minimum 40 pieces for production runs.",
};

export default function GarmentFactoryPage() {
  return (
    <main>
      <ScrollRevealInit />

      {/* Page hero */}
      <section className="page-hero">
        <div className="wrap">
          <span className="eyebrow reveal">Garment Factory</span>
          <h1 className="reveal">
            We go beyond just <em>making the item.</em>
          </h1>
          <p className="reveal">
            From bulk production for brands and corporates to bespoke custom orders and
            wholesale catalogues. Vedil Clothing&apos;s factory delivers exceptional quality
            and craftsmanship at every scale.
          </p>
        </div>
      </section>

      {/* Bulk Production */}
      <section>
        <div className="wrap">
          <div className="service-split">
            <div>
              <span className="eyebrow reveal">High-volume excellence</span>
              <h2 className="reveal" style={{ fontSize: "clamp(1.9rem,3.8vw,2.8rem)", marginBlock: "1rem 1.1rem" }}>
                Bulk Production
              </h2>
              <p className="reveal" style={{ color: "var(--ink-soft)", fontSize: "1.05rem", marginBottom: "1.4rem" }}>
                Our bulk production services are tailored to meet the demands of retailers,
                corporate entities, and large-scale events. With state-of-the-art technology
                and a team of skilled artisans, we ensure each piece upholds the VEDIL
                Clothing standard of timeless elegance and superior craftsmanship.
              </p>
              <ul className="benefits-list reveal">
                <li>High-quality, trend-driven designs</li>
                <li>Competitive pricing with both wholesale and retail margins</li>
                <li>Versatile styles appealing to diverse customer bases</li>
                <li>Fast and reliable production turnaround</li>
                <li>Custom branding: embroidery, labels, etc. (additional cost)</li>
                <li>Color and size variety</li>
                <li>Flexible payment options</li>
                <li>Mix designs to reach the 40-piece minimum on your first order</li>
              </ul>
              <a href="#quote" className="btn reveal">
                Book a Production Run
                <svg className="arw" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            <div className="ph reveal" style={{ background: "linear-gradient(150deg,#7d6347,#c4a070)" } as React.CSSProperties}>
              <span className="ph-tag">Bulk production floor</span>
              <span className="ph-mono">B</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Bulk Production */}
      <section style={{ background: "var(--paper)", borderRadius: "36px" }}>
        <div className="wrap" style={{ paddingBlock: "clamp(3rem,6vw,5rem)" }}>
          <div className="sec-head center">
            <span className="eyebrow reveal">Why choose us</span>
            <h2 className="reveal">Why choose Vedil for bulk production?</h2>
          </div>
          <div className="why-grid">
            <div className="why-card reveal">
              <div className="why-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="5.5" />
                  <path d="M9 13.5L7 21l5-2.5 5 2.5-2-7.5" />
                </svg>
              </div>
              <h3>Quality Assured</h3>
              <p>Every piece is inspected to uphold the VEDIL standard of timeless elegance and superior craftsmanship.</p>
            </div>
            <div className="why-card reveal">
              <div className="why-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 3h14M5 21h14" />
                  <path d="M7 3c0 5 5 7 5 9s-5 4-5 9" />
                  <path d="M17 3c0 5-5 7-5 9s5 4 5 9" />
                </svg>
              </div>
              <h3>Reliable Turnaround</h3>
              <p>We respect deadlines. Our production planning ensures your orders are ready when your business needs them.</p>
            </div>
            <div className="why-card reveal">
              <div className="why-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="6" cy="6" r="3" />
                  <circle cx="6" cy="18" r="3" />
                  <line x1="9" y1="7.5" x2="21" y2="19.5" />
                  <line x1="9" y1="16.5" x2="21" y2="4.5" />
                </svg>
              </div>
              <h3>Skilled Artisans</h3>
              <p>Our team of dedicated tailors and craftspeople bring years of experience to every production run.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Orders */}
      <section>
        <div className="wrap">
          <div className="service-split flip">
            <div>
              <span className="eyebrow reveal">Bespoke service</span>
              <h2 className="reveal" style={{ fontSize: "clamp(1.9rem,3.8vw,2.8rem)", marginBlock: "1rem 1.1rem" }}>
                Custom Orders
              </h2>
              <p className="reveal" style={{ color: "var(--ink-soft)", fontSize: "1.05rem", marginBottom: "1.4rem" }}>
                Our custom order service offers bespoke fashion solutions tailored to your
                unique style. Whether you have a reference photo, a fabric you love, or just
                an idea, collaborate with our talented designers and artisans to create pieces
                that reflect your personal taste and elegance.
              </p>
              <p className="reveal" style={{ color: "var(--ink-soft)", fontSize: "1.05rem", marginBottom: "2rem" }}>
                You can bring your own fabric or let us source it for you. We collect your
                measurements and deliver a garment made precisely to fit.
              </p>
              <a href="#quote" className="btn reveal">
                Book a Custom Order
                <svg className="arw" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            <div className="ph reveal" style={{ background: "linear-gradient(150deg,#6e1f2a,#a8404d)" } as React.CSSProperties}>
              <span className="ph-tag">Custom order in progress</span>
              <span className="ph-mono">C</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Custom */}
      <section>
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow reveal">Why opt for custom</span>
            <h2 className="reveal">Why opt for a custom order?</h2>
          </div>
          <div className="why-grid">
            <div className="why-card reveal">
              <div className="why-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <h3>Personalized Design</h3>
              <p>Create one-of-a-kind items that perfectly suit your style with direct input from our designers.</p>
            </div>
            <div className="why-card reveal">
              <div className="why-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h3>Premium Quality</h3>
              <p>Handcrafted using the finest materials to ensure durability and luxury in every stitch.</p>
            </div>
            <div className="why-card reveal">
              <div className="why-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <h3>Attention to Detail</h3>
              <p>Every aspect of your order, from initial sketch to final stitch, is meticulously crafted to perfection.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Wholesale */}
      <section style={{ background: "var(--paper)", borderRadius: "36px" }}>
        <div className="wrap" style={{ paddingBlock: "clamp(3rem,6vw,5rem)" }}>
          <div className="service-split">
            <div className="ph reveal" style={{ background: "linear-gradient(150deg,#2a211b,#5a4636)" } as React.CSSProperties}>
              <span className="ph-tag">Wholesale catalogue</span>
              <span className="ph-mono">W</span>
            </div>
            <div>
              <span className="eyebrow reveal">Retail partners</span>
              <h2 className="reveal" style={{ fontSize: "clamp(1.9rem,3.8vw,2.8rem)", marginBlock: "1rem 1.1rem" }}>
                Wholesale
              </h2>
              <p className="reveal" style={{ color: "var(--ink-soft)", fontSize: "1.05rem", marginBottom: "1.4rem" }}>
                Vedil Clothing&apos;s wholesale programme offers boutiques, department stores,
                and online retailers high-quality, timeless apparel and accessories. Our
                catalogue, available with a minimum order of 40 pieces, featuring outfits
                offering great fit, comfort, durability, and versatility, with both wholesale
                and retail prices listed for profitable margins.
              </p>
              <ul className="benefits-list reveal">
                <li>Minimum order: 40 pieces (mix designs to reach MOQ)</li>
                <li>Both wholesale and retail prices listed</li>
                <li>Custom branding at additional cost</li>
                <li>Introductory offer: mix designs on first order</li>
                <li>Flexible payment options</li>
              </ul>
              <a href="#quote" className="btn reveal">
                Request Wholesale Catalogue
                <svg className="arw" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry form */}
      <section id="quote">
        <div className="wrap">
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div className="factory-quote reveal">
              <span className="eyebrow" style={{ marginBottom: "1.2rem" }}>Get started</span>
              <h3>Tell us about your project</h3>
              <p>
                Fill in the form below and we&apos;ll reach out to discuss your order. For faster
                responses, you can also{" "}
                <a href="https://wa.me/2348138683171" target="_blank" rel="noopener noreferrer" style={{ color: "var(--burgundy)", fontWeight: 600 }}>
                  message us on WhatsApp
                </a>
                .
              </p>
              <FactoryForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
