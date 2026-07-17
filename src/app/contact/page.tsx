import type { Metadata } from "next";
import ScrollRevealInit from "@/components/home/ScrollRevealInit";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";

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
						Whether you have a question about an order, want to enquire about
						our academy, or would like to discuss a garment factory project,
						reach out and we&apos;ll be happy to help.
					</p>
				</div>
			</section>

			<section>
				<div className="wrap">
					<div className="contact-layout">
						{/* Contact info */}
						<div>
							<h2
								className="reveal"
								style={{
									fontSize: "clamp(1.6rem,3vw,2.2rem)",
									marginBottom: "2rem",
								}}
							>
								Find us
							</h2>
							<ContactInfo />
						</div>

						{/* Contact form */}
						<div className="cform reveal">
							<h3>Send us a message</h3>
							<p className="sub-head">
								We&apos;ll get back to you within 24 hours.
							</p>
							<ContactForm />
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
