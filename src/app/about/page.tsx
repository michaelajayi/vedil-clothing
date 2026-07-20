import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Truck, Gift, Award, Heart } from "lucide-react";
import ScrollRevealInit from "@/components/home/ScrollRevealInit";
import ImageMedia from "@/components/ui/ImageMedia";

export const metadata: Metadata = {
	title: "About Us | Vedil Clothing",
	description:
		"Founded in 2012 by Vivian Duru, Vedil Clothing is a Nigerian fashion brand that thrives on creativity, collaboration, and a deep love for the art of fashion.",
};

export default function AboutPage() {
	return (
		<main>
			<ScrollRevealInit />

			{/* ── Hero ── */}
			<section className="page-hero">
				<div className="wrap">
					<span className="eyebrow reveal">Our story</span>
					<h1 className="reveal">
						Fashion that <em>empowers</em>
						<br />
						from Lagos, for the world.
					</h1>
					<p className="reveal">
						Founded in 2012, Vedil Clothing is a Nigerian fashion house that
						thrives on creativity, collaboration, and a deep love for the art of
						fashion.
					</p>
				</div>
			</section>

			{/* ── Founder story ── */}
			<section>
				<div className="wrap">
					<div className="about-story">
						<div className="about-photos reveal">
							<ImageMedia src="https://res.cloudinary.com/jqaitieh/image/upload/v1784489036/about_page_vivian_owner_main_image_kudxph.webp" alt="Founder, Vivian Duru" className="about-photo-main" />
							<ImageMedia src="https://res.cloudinary.com/jqaitieh/image/upload/v1784489038/about_page_vivian_owner_supporting_image_fzjkiz.webp" alt="Studio, Lagos" className="about-photo-float" />
						</div>

						<div>
							<span className="eyebrow reveal">About us</span>
							<h2
								className="reveal"
								style={{
									fontSize: "clamp(1.8rem,3.5vw,2.6rem)",
									marginBlock: "1rem 1.2rem",
								}}
							>
								Welcome to Vedil Clothing
							</h2>
							<p
								className="reveal"
								style={{
									color: "var(--ink-soft)",
									fontSize: "1.05rem",
									lineHeight: 1.75,
									marginBottom: "1.2rem",
								}}
							>
								Welcome to Vedil Clothing, a brand where passion for fashion
								meets timeless elegance. Founded in 2012 by the visionary{" "}
								<strong style={{ color: "var(--ink)" }}>Vivian Duru</strong>,
								Vedil Clothing is a Nigerian fashion brand that thrives on
								creativity, collaboration, and a deep love for the art of
								fashion.
							</p>
							<p
								className="reveal"
								style={{
									color: "var(--ink-soft)",
									fontSize: "1.05rem",
									lineHeight: 1.75,
									marginBottom: "2rem",
								}}
							>
								Our team of dedicated designers and artisans work together to
								bring dreams to life, creating beautiful pieces that resonate
								with our clients&apos; unique styles and preferences. From
								ready-to-wear to custom couture, we serve men, women, and
								children across all walks of life.
							</p>
							<Link href="/shop" className="btn reveal">
								Shop the Collection
								<ArrowRight
									className="arw"
									size={16}
									strokeWidth={2}
									aria-hidden
								/>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* ── Our goal + Mission / Vision ── */}
			<section style={{ background: "var(--paper)", borderRadius: "36px" }}>
				<div className="wrap" style={{ paddingBlock: "clamp(3rem,6vw,5rem)" }}>
					{/* Big editorial goal statement */}
					<div
						style={{
							textAlign: "center",
							marginBottom: "clamp(3rem,6vw,5rem)",
						}}
					>
						<span
							className="eyebrow reveal"
							style={{
								justifyContent: "center",
								marginBottom: "2rem",
								display: "inline-flex",
							}}
						>
							Our goal
						</span>
						<h2
							className="reveal"
							style={{
								fontSize: "clamp(2.6rem,6vw,5rem)",
								lineHeight: 1.1,
								letterSpacing: "-.02em",
								maxWidth: "900px",
								margin: "0 auto",
							}}
						>
							To create timeless fashion that{" "}
							<em
								style={{
									fontStyle: "italic",
									color: "var(--burgundy)",
									fontWeight: 400,
								}}
							>
								empowers individuals
							</em>{" "}
							and supports sustainable livelihoods.
						</h2>
					</div>

					<div className="mv-grid">
						<div className="mv-card reveal">
							<span className="eyebrow" style={{ marginBottom: "1rem" }}>
								Mission
							</span>
							<h3>What we do</h3>
							<p>
								To creatively and passionately create timeless fashion items
								that meet our clients&apos; unique preferences, with care,
								skill, and attention in every stitch.
							</p>
						</div>
						<div className="mv-card reveal">
							<span className="eyebrow" style={{ marginBottom: "1rem" }}>
								Vision
							</span>
							<h3>Where we&apos;re going</h3>
							<p>
								To be the fashion brand known for creating opportunities for
								everyday tailors and artisans for sustainable livelihood across
								Lagos and Nigeria.
							</p>
							<Link
								href="/fun-to-sew"
								className="link-arrow reveal"
								style={{ marginTop: "1.2rem", display: "inline-flex" }}
							>
								Learn to sew with us
								<ArrowRight size={15} strokeWidth={2} aria-hidden />
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* ── Made to Measure CTA ── */}
			<section>
				<div className="wrap">
					<div className="made-measure">
						<ImageMedia src="https://res.cloudinary.com/jqaitieh/image/upload/v1784489036/garment_factory_main_image_zj8l7c.webp" alt="Vedil garment factory" />
						<div className="inner">
							<span
								className="eyebrow reveal"
								style={{
									color: "#f4d9a8",
									marginBottom: "1.6rem",
									display: "inline-flex",
									alignItems: "center",
									gap: ".6rem",
								}}
							>
								<span
									style={{
										display: "inline-block",
										width: 26,
										height: 1,
										background: "#f4d9a8",
										opacity: 0.6,
									}}
								/>
								Garment Factory
							</span>
							<p
								className="made-measure-title reveal"
								style={{ fontFamily: "var(--font-display, 'Fraunces'), serif" }}
							>
								Made to
								<br />
								Measure
							</p>
							<p className="sub reveal">We go beyond just making the item.</p>
							<Link
								href="/garment-factory"
								className="btn reveal"
								style={{ marginTop: "2.2rem", display: "inline-flex" }}
							>
								Garment Factory
								<ArrowRight
									className="arw"
									size={16}
									strokeWidth={2}
									aria-hidden
								/>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* ── Our promise ── */}
			<section style={{ background: "var(--paper)", borderRadius: "36px" }}>
				<div className="wrap" style={{ paddingBlock: "clamp(3rem,6vw,5rem)" }}>
					<div className="sec-head center reveal">
						<span className="eyebrow">Our promise</span>
						<h2>The standards we hold ourselves to</h2>
						<p>
							Every order, every interaction. This is how we show up for you.
						</p>
					</div>

					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
							gap: "1.4rem",
						}}
					>
						{(
							[
								{
									label: "Prompt delivery",
									desc: "Your order arrives exactly when we say it will.",
									icon: <Truck size={26} strokeWidth={1.5} aria-hidden />,
								},
								{
									label: "Precise packaging",
									desc: "Every piece handled with care from start to finish.",
									icon: <Gift size={26} strokeWidth={1.5} aria-hidden />,
								},
								{
									label: "Value guaranteed",
									desc: "Quality you can feel at every price point.",
									icon: <Award size={26} strokeWidth={1.5} aria-hidden />,
								},
								{
									label: "Client satisfaction",
									desc: "We stay with you until you're completely satisfied.",
									icon: <Heart size={26} strokeWidth={1.5} aria-hidden />,
								},
							] as { label: string; desc: string; icon: React.ReactNode }[]
						).map(({ label, desc, icon }) => (
							<div key={label} className="why-card reveal">
								<div className="why-icon">{icon}</div>
								<h3 style={{ fontSize: "1.1rem", marginBottom: ".5rem" }}>
									{label}
								</h3>
								<p>{desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>
		</main>
	);
}
