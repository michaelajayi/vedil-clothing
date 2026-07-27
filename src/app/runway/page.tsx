import type { Metadata } from "next";
import { runwayMedia } from "@/data/runway";
import RunwayClient from "@/components/runway/RunwayClient";
import ScrollRevealInit from "@/components/home/ScrollRevealInit";
import "@/styles/runway.css";

export const metadata: Metadata = {
	title: "Runway | Vedil Clothing",
	description:
		"Imperial Softness Collection — Epic Fashion Week 2026. Explore Vedil Clothing's runway looks and fashion show media.",
};

export default function RunwayPage() {
	return (
		<main>
			<ScrollRevealInit />

			{/* ── Hero ── */}
			<section className="runway-hero">
				<div className="wrap">
					<span className="eyebrow reveal">
						Epic Fashion Week 2026 · Africa Fashion Week Nigeria
					</span>
					<h1 className="reveal">
						Imperial <em>Softness</em> Collection
					</h1>

					<div className="runway-hero-body">
						<div className="runway-hero-text reveal">
							<p>
								Woman — a blend of softness and power. VEDIL explores this
								delicate duality through luxury evening and cocktail dresses.
							</p>
							<p>
								VEDIL isn&apos;t just fashion; it&apos;s a celebration of the
								complex beautiful essence of being a woman. Each masterpiece
								captures the pure innocence of the girl, the radiant beauty of
								the lady and the unyielding strength of the grown woman.
							</p>
							<p>It&apos;s simply our journey and we celebrate it.</p>
							<p>
								My collection for the Epic Fashion Week 2026; is a nature themed
								collection that features timeless, natural silhouette. The
								choice of fabric is intentional to give soft, fairylike
								appearance.
							</p>
						</div>

						<div className="runway-hero-meta reveal">
							<div className="meta-label">Collection</div>
							<p>
								<strong>Imperial Softness</strong> — Nature-themed, timeless
								silhouettes with intentionally soft, fairylike fabrics.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* ── Gallery — rendered on the client ── */}
			<RunwayClient items={runwayMedia} />
		</main>
	);
}
