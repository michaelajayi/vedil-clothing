import type { Metadata } from "next";
import Link from "next/link";
import { WhatsappIcon } from "@/components/ui/BrandIcons";
import ScrollRevealInit from "@/components/home/ScrollRevealInit";
import FaqAccordion, { type FaqGroup } from "@/components/faq/FaqAccordion";

export const metadata: Metadata = {
	title: "FAQ | Vedil Clothing",
	description:
		"Answers to common questions about the Vedil Clothing shop, It&apos;s Fun to Sew, and our garment factory — shipping, enrollment, pricing, and more.",
};

const faqs: FaqGroup[] = [
	{
		heading: "General",
		items: [
			{
				q: "Where is Vedil Clothing located?",
				a: "We are at No. 95 Ago Palace Way, Okota, Lagos, Nigeria. You are welcome to visit our studio in person — we recommend calling ahead on +234 813 868 3171 to confirm availability before coming.",
			},
			{
				q: "How do I get in touch?",
				a: "WhatsApp is the fastest way to reach us: +234 813 868 3171. You can also call the same number or send an email to hello@vedilclothing.com. We typically respond within a few hours during business hours.",
			},
			{
				q: "What does Vedil Clothing do?",
				a: "Vedil Clothing is a Lagos-based fashion house with three verticals: a ready-to-wear shop (retail and wholesale), the It        Fun to Sew offering in-person sewing classes, and a garment factory that handles bulk production and custom orders.",
			},
			{
				q: "Are you active on social media?",
				a: "Yes — follow us on Instagram, Facebook, TikTok, and YouTube for new arrivals, class updates, and behind-the-scenes content from the studio.",
			},
		],
	},
	{
		heading: "Shop & Orders",
		items: [
			{
				q: "How do I place an order?",
				a: "Browse the shop, add items to your cart, and check out securely online. Alternatively, you can reach us on WhatsApp (+234 813 868 3171) and we will assist you directly.",
			},
			{
				q: "What payment methods do you accept?",
				a: "We accept debit and credit cards, bank transfer, and USSD payments via Paystack — Nigeria's most trusted payment gateway. All transactions are secure.",
			},
			{
				q: "Do you deliver outside Lagos?",
				a: "Yes. We ship nationwide via DHL and other reputable courier services. Delivery fees and timelines vary by location and will be shown at checkout. You can also self-pickup from our Okota studio or arrange your own dispatch rider.",
			},
			{
				q: "What is wholesale pricing and how does it work?",
				a: "Every product in our shop has both a retail price and a wholesale price. The wholesale price applies automatically once your order quantity meets the minimum order quantity (MOQ) for that product — typically 6 pieces. This makes us a great option for resellers and market traders.",
			},
			{
				q: "What is your return or exchange policy?",
				a: "If an item arrives damaged or significantly different from what was described, contact us within 48 hours of delivery via WhatsApp with photos and your order details. We will arrange a prompt exchange. We do not accept returns for change of mind on ready-to-wear items.",
			},
		],
	},
	{
		heading: "It&apos;s Fun to Sew",
		items: [
			{
				q: "Do I need sewing experience to join the academy?",
				a: "No prior experience is needed for the Basic Sewing Class — it is designed for complete beginners and covers all the fundamentals. For Intermediate and above, we recommend completing the previous level first.",
			},
			{
				q: "In what order should I take the courses?",
				a: "We recommend going in sequence: Basic → Intermediate → Advanced. This order ensures you build a solid foundation before tackling more complex techniques. Specialisation classes like Children's Wear and Menswear require at least basic sewing skills.",
			},
			{
				q: "How do I enroll in a course?",
				a: "Send us a WhatsApp message on +234 813 868 3171 with the name of the course you are interested in. We will confirm availability, walk you through the registration process, and send you payment details.",
			},
			{
				q: "Are sewing machines provided?",
				a: "Yes. Every student has a dedicated sewing machine for the duration of their class. You do not need to bring your own equipment.",
			},
			{
				q: "How many days a week are classes held?",
				a: "Class schedules vary by cohort and are confirmed at the time of enrollment. Reach out to us on WhatsApp for current class timetables and available start dates.",
			},
			{
				q: "What is the Student Handbook?",
				a: "The Student Handbook contains the full course outline for each programme — topics, projects, and what you will be assessed on. It is provided when you enroll and is also available on request before you sign up.",
			},
			{
				q: "Are online classes available?",
				a: "All classes are currently in-person at our Lagos studio. We are exploring an online cohort model but it is not yet available. Follow our social media channels for updates on when this launches.",
			},
		],
	},
	{
		heading: "Garment Factory",
		items: [
			{
				q: "What is the minimum order quantity for bulk production?",
				a: "The minimum order quantity (MOQ) for bulk production is 40 pieces per design. On your first order, you can mix different designs to reach the 40-piece minimum — you are not locked into a single style.",
			},
			{
				q: "How long does production take?",
				a: "Lead times depend on order size, design complexity, and the current production schedule. Share your brief with us and we will give you a realistic timeline before you commit to anything.",
			},
			{
				q: "Can I supply my own fabric?",
				a: "Yes. You can bring your own fabric or we can source it on your behalf. For custom orders, we are also happy to advise on the best fabric choices for your design and intended use.",
			},
			{
				q: "Do you work with individuals or only businesses?",
				a: "Both. We handle bulk orders for brands, retailers, and corporates, as well as custom orders for individuals — from a single bespoke piece to small group orders for events, uniforms, or personal wardrobes.",
			},
			{
				q: "How do I request a quote?",
				a: "Fill in the inquiry form on our Garment Factory page or send us a WhatsApp message with your brief: order type, quantity, fabric details (if known), and your target timeline. We aim to respond within 24 hours.",
			},
		],
	},
];

export default function FaqPage() {
	return (
		<main>
			<ScrollRevealInit />

			{/* Page hero */}
			<section className="page-hero">
				<div className="wrap">
					<span className="eyebrow reveal">Help &amp; Information</span>
					<h1 className="reveal">
						Frequently asked
						<br />
						<em>questions.</em>
					</h1>
					<p className="reveal">
						Everything you need to know about our shop, sewing academy, and
						garment factory. Can&apos;t find your answer?{" "}
						<a
							href="https://wa.me/2348138683171"
							target="_blank"
							rel="noopener noreferrer"
							className="link-arrow"
						>
							Chat with us on WhatsApp
						</a>
						.
					</p>
				</div>
			</section>

			{/* FAQ accordion */}
			<section>
				<div className="wrap">
					<div className="faq-wrap">
						<FaqAccordion groups={faqs} />
					</div>
				</div>
			</section>

			{/* Bottom CTA */}
			<section style={{ background: "var(--paper)", borderRadius: "36px" }}>
				<div
					className="wrap"
					style={{ paddingBlock: "clamp(3rem,6vw,4.5rem)" }}
				>
					<div className="sec-head center">
						<span className="eyebrow reveal">Still need help?</span>
						<h2 className="reveal">We&apos;re always happy to assist.</h2>
						<p className="reveal">
							Reach out directly on WhatsApp — it&apos;s the fastest way to get
							a response from our team.
						</p>
					</div>
					<div
						style={{
							display: "flex",
							gap: "1rem",
							justifyContent: "center",
							flexWrap: "wrap",
						}}
					>
						<a
							href="https://wa.me/2348138683171"
							target="_blank"
							rel="noopener noreferrer"
							className="btn reveal"
						>
							WhatsApp us
							<WhatsappIcon size={17} />
						</a>
						<Link href="/contact" className="btn btn--ghost reveal">
							Contact page
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
}
