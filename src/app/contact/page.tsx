import type { Metadata } from "next";
import ScrollRevealInit from "@/components/home/ScrollRevealInit";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Vedil Clothing",
  description:
    "Get in touch with Vedil Clothing. Visit our store at No. 95 Ago Palace Way, Okota, Lagos, or send us a message.",
};

export default function ContactPage() {
  return (
    <main>
      <ScrollRevealInit />

      {/* Page hero */}
      <section className="page-hero">
        <div className="wrap">
          <span className="eyebrow reveal">Get in touch</span>
          <h1 className="reveal">
            We&apos;d love to <em>hear from you.</em>
          </h1>
          <p className="reveal">
            Whether you have a question about an order, want to enquire about our academy,
            or would like to discuss a garment factory project, reach out and we&apos;ll
            be happy to help.
          </p>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="contact-layout">

            {/* Contact info */}
            <div>
              <h2 className="reveal" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", marginBottom: "2rem" }}>
                Find us
              </h2>
              <div className="contact-info-list">
                <div className="contact-info-item reveal">
                  <div className="contact-info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                      <circle cx="12" cy="9" r="2.5" />
                    </svg>
                  </div>
                  <div>
                    <h4>Visit us</h4>
                    <p>No. 95 Ago Palace Way</p>
                    <p>Okota, Lagos, Nigeria</p>
                  </div>
                </div>

                <div className="contact-info-item reveal">
                  <div className="contact-info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.94.36 1.86.7 2.73a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.35-1.35a2 2 0 012.11-.45c.87.34 1.79.57 2.73.7A2 2 0 0122 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <h4>Call us</h4>
                    <a href="tel:+2348138683171">+234 813 868 3171</a>
                  </div>
                </div>

                <div className="contact-info-item reveal">
                  <div className="contact-info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M22 7l-10 6L2 7" />
                    </svg>
                  </div>
                  <div>
                    <h4>Email us</h4>
                    <a href="mailto:hello@vedilclothing.com">hello@vedilclothing.com</a>
                  </div>
                </div>

                <div className="contact-info-item reveal">
                  <div className="contact-info-icon" style={{ background: "rgba(37,211,102,.08)", borderColor: "rgba(37,211,102,.18)", color: "#1a9e47" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                    </svg>
                  </div>
                  <div>
                    <h4>WhatsApp</h4>
                    <a href="https://wa.me/2348138683171" target="_blank" rel="noopener noreferrer">
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="ph contact-map reveal">
                <span className="ph-tag">Okota, Lagos · Google Maps</span>
                <span className="ph-mono" style={{ fontSize: "1rem", letterSpacing: ".3em" }}>MAP</span>
              </div>
            </div>

            {/* Contact form */}
            <div className="cform reveal">
              <h3>Send us a message</h3>
              <p className="sub-head">We&apos;ll get back to you within 24 hours.</p>
              <ContactForm />
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
