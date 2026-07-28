import type { Metadata } from "next";
import { runwayEvents } from "@/data/runway";
import RunwayClient from "@/components/runway/RunwayClient";
import ScrollRevealInit from "@/components/home/ScrollRevealInit";
import "@/styles/runway.css";

export const metadata: Metadata = {
	title: "Runway | Vedil Clothing",
	description:
		"Explore Vedil Clothing's runway shows and fashion events — past and present.",
};

export default function RunwayPage() {
	return (
		<main>
			<ScrollRevealInit />

			{/* ── Hero ── */}
			<section className="runway-page-hero">
				<div className="wrap">
					<span className="eyebrow reveal">Runway</span>
					<h1 className="reveal">
						Our <em>Collections</em>
					</h1>
					<p className="runway-page-hero-text reveal">
						A journey through Vedil Clothing&apos;s runway shows and fashion
						events — from Africa Fashion Week Nigeria to Epic Fashion Week and
						beyond.
					</p>
				</div>
			</section>

			{/* ── Events — rendered on the client ── */}
			<RunwayClient events={runwayEvents} />
		</main>
	);
}
