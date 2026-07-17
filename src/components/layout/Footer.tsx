import Link from "next/link";
import {
	InstagramIcon,
	FacebookIcon,
	TiktokIcon,
} from "@/components/ui/BrandIcons";
import FooterContact from "./FooterContact";

export default function Footer() {
	return (
		<footer id="contact">
			<div className="wrap">
				<div className="foot-top">
					<div className="foot-brand">
						<div className="logo">
							Ve<b>dil</b>
							<span className="dot" style={{ color: "var(--gold)" }}>
								.
							</span>
						</div>
						<p>
							A Lagos fashion house: ready-to-wear, the It&apos;s Fun to Sew
							Academy, and a garment factory for brands that mean business.
						</p>
						<div className="foot-contact">
							<FooterContact />
						</div>
						<div className="socials">
							<SocialLinks />
						</div>
					</div>

					<div className="foot-col">
						<h4>Shop</h4>
						<ul>
							<li>
								<Link href="/shop/men">Men</Link>
							</li>
							<li>
								<Link href="/shop/women">Women</Link>
							</li>
							<li>
								<Link href="/shop/children">Children</Link>
							</li>
							<li>
								<Link href="/shop/accessories">Accessories</Link>
							</li>
							<li>
								<Link href="/shop/new-arrivals">New Arrivals</Link>
							</li>
						</ul>
					</div>

					<div className="foot-col">
						<h4>Learn &amp; Make</h4>
						<ul>
							<li>
								<Link href="/academy">The Academy</Link>
							</li>
							<li>
								<Link href="/academy#in-person">In-person Classes</Link>
							</li>
							<li>
								<Link href="/academy#online">Online Courses</Link>
							</li>
							<li>
								<Link href="/garment-factory">Garment Factory</Link>
							</li>
						</ul>
					</div>

					<div className="foot-col">
						<h4>Company</h4>
						<ul>
							<li>
								<Link href="/about">About Us</Link>
							</li>
							<li>
								<Link href="/contact">Contact</Link>
							</li>
							<li>
								<Link href="/faq">FAQ</Link>
							</li>
							<li>
								<Link href="/garment-factory#quote">Request a Quote</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="foot-bottom">
					<span>
						© 2026 Vedil Clothing. All rights reserved. Made in Lagos, Nigeria.
					</span>
					<span>
						<Link href="/privacy">Privacy</Link> ·{" "}
						<Link href="/terms">Terms</Link>
					</span>
				</div>
			</div>
		</footer>
	);
}

// ─── Social Links (static URLs — these rarely change) ────

function SocialLinks() {
	return (
		<>
			<a
				href="https://www.instagram.com/vedilclothing"
				aria-label="Instagram"
				target="_blank"
				rel="noopener noreferrer"
			>
				<InstagramIcon />
			</a>
			<a
				href="https://web.facebook.com/people/Vedil-Clothing/"
				aria-label="Facebook"
				target="_blank"
				rel="noopener noreferrer"
			>
				<FacebookIcon />
			</a>
			<a
				href="https://www.tiktok.com/@vedilclothing"
				aria-label="TikTok"
				target="_blank"
				rel="noopener noreferrer"
			>
				<TiktokIcon />
			</a>
		</>
	);
}
