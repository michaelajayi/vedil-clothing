import type { Metadata } from "next";
import { MapPin, Phone, Mail } from "lucide-react";
import { WhatsappIcon } from "@/components/ui/BrandIcons";
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
                    <MapPin strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4>Visit us</h4>
                    <p>No. 95 Ago Palace Way</p>
                    <p>Okota, Lagos, Nigeria</p>
                  </div>
                </div>

                <div className="contact-info-item reveal">
                  <div className="contact-info-icon">
                    <Phone strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4>Call us</h4>
                    <a href="tel:+2348138683171">+234 813 868 3171</a>
                  </div>
                </div>

                <div className="contact-info-item reveal">
                  <div className="contact-info-icon">
                    <Mail strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4>Email us</h4>
                    <a href="mailto:hello@vedilclothing.com">hello@vedilclothing.com</a>
                  </div>
                </div>

                <div className="contact-info-item reveal">
                  <div className="contact-info-icon" style={{ background: "rgba(37,211,102,.08)", borderColor: "rgba(37,211,102,.18)", color: "#1a9e47" }}>
                    <WhatsappIcon filled={false} />
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
