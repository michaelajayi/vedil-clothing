import type { Metadata } from "next";
import ScrollRevealInit from "@/components/home/ScrollRevealInit";

export const metadata: Metadata = {
  title: "Contact Us — Vedil Clothing",
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
            or would like to discuss a garment factory project — reach out and we&apos;ll
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
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
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
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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
                  <div className="contact-info-icon" style={{ background: "#e8f7ee", borderColor: "rgba(37,211,102,.2)", color: "#1da851" }}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.739-.981z" />
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
                <span className="ph-tag">Okota, Lagos — Google Maps</span>
                <span className="ph-mono" style={{ fontSize: "1rem", letterSpacing: ".3em" }}>MAP</span>
              </div>
            </div>

            {/* Contact form */}
            <div className="cform reveal">
              <h3>Send us a message</h3>
              <p className="sub-head">We&apos;ll get back to you within 24 hours.</p>
              <form>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="c-name">Full name</label>
                    <input id="c-name" type="text" placeholder="Your name" autoComplete="name" />
                  </div>
                  <div className="field">
                    <label htmlFor="c-phone">Phone number</label>
                    <input id="c-phone" type="tel" placeholder="+234 …" autoComplete="tel" />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="c-email">Email address</label>
                  <input id="c-email" type="email" placeholder="you@example.com" autoComplete="email" />
                </div>
                <div className="field">
                  <label htmlFor="c-subject">Subject</label>
                  <select id="c-subject">
                    <option value="">Select a topic…</option>
                    <option value="order">Order enquiry</option>
                    <option value="academy">Academy / courses</option>
                    <option value="factory">Garment factory project</option>
                    <option value="wholesale">Wholesale partnership</option>
                    <option value="other">Something else</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="c-message">Message</label>
                  <textarea id="c-message" rows={5} placeholder="How can we help you?" />
                </div>
                <button type="submit" className="btn">
                  Send Message
                  <svg className="arw" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
