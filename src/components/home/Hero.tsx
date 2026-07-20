import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
	return (
		<section className="hero" style={{ padding: 0 }}>
			<div className="ph" aria-hidden="true" />
			<div className="hero-meta reveal">
				<b>Est. Lagos</b>
				<span>Ready-to-Wear · Since 2012</span>
			</div>
			<div className="wrap">
				<div className="hero-content">
					<span className="eyebrow reveal">Lagos Fashion House</span>
					<h1 className="reveal">
						Dress in pieces
						<br />
						made with <em>intention.</em>
					</h1>
					<p className="reveal">
						Ready-to-wear for the whole family, a sewing school for the curious,
						and a garment factory built for brands. This is Vedil, where craft
						meets everyday elegance.
					</p>
					<div className="hero-cta reveal">
						<Link href="/shop" className="btn">
							Shop Now
							<ArrowRight className="arw" size={16} strokeWidth={2} />
						</Link>
						<Link href="/fun-to-sew" className="btn btn--ghost">
							Explore It's Fun to Sew
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
