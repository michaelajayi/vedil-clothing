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
							<img
								src="https://res.cloudinary.com/jqaitieh/image/upload/v1784491169/logo_p1utgu.png"
								alt="Vedil Clothing"
								className="logo-img"
							/>
						</div>
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
								<Link href="/shop/ready-to-wear">Ready to Wear</Link>
							</li>
							<li>
								<Link href="/shop/africa-my-heritage">Africa My Heritage</Link>
							</li>
							<li>
								<Link href="/shop/accessories">Accessories</Link>
							</li>
						</ul>
					</div>

					<div className="foot-col">
						<h4>It&apos;s Fun to Sew</h4>
						<ul>
							<li>
								<Link href="/fun-to-sew#in-person">In-person Classes</Link>
							</li>
							<li>
								<Link href="/fun-to-sew#online">Online Courses</Link>
							</li>
						</ul>
					</div>

					<div className="foot-col">
						<h4>Garment Factory</h4>
						<ul>
							<li>
								<Link href="/garment-factory">Factory Services</Link>
							</li>
							<li>
								<Link href="/garment-factory#quote">Request a Quote</Link>
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
								<Link href="/runway">Runway</Link>
							</li>
							<li>
								<Link href="/contact">Contact</Link>
							</li>
							<li>
								<Link href="/faq">FAQ</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="foot-bottom">
					<span>
						© 2026 Vedil Clothing. All rights reserved. Made in Lagos, Nigeria.
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
