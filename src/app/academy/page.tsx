import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { WhatsappIcon } from "@/components/ui/BrandIcons";
import ScrollRevealInit from "@/components/home/ScrollRevealInit";
import CourseListClient from "@/components/academy/CourseListClient";

// ─── Student handbook config ────────────────────────────────
// Replace with the actual PDF URL when you have it
const HANDBOOK_URL = "/student-handbook.pdf";

export const metadata: Metadata = {
	title: "It's Fun to Sew Academy | Vedil Clothing",
	description:
		"Join hundreds of fashion enthusiasts at the It's Fun to Sew Academy. In-person sewing classes in Lagos from basic to advanced, each with certificate on completion.",
};

export default function AcademyPage() {
	return (
		<main>
			<ScrollRevealInit />

			{/* Page hero */}
			<section className="page-hero">
				<div className="wrap">
					<span className="eyebrow reveal">It&apos;s Fun to Sew Academy</span>
					<h1 className="reveal">
						Learn to sew.
						<br />
						<em>Build a career.</em>
					</h1>
					<p className="reveal">
						Join hundreds of fashion enthusiasts and upgrade your skills to
						another level. Learning how to sew at Vedil Clothing is always fun;
						attention is paid to every student&apos;s unique learning needs. We
						have a conducive learning environment and a sewing machine for each
						student.
					</p>
				</div>
			</section>

			{/* Academy intro */}
			<section className="academy" style={{ paddingBlock: 0 }}>
				<div className="wrap" style={{ paddingBlock: "clamp(3rem,6vw,5rem)" }}>
					<div className="academy-top">
						<div>
							<span className="eyebrow reveal">The Academy</span>
							<h2 className="reveal">
								Our training places emphasis on <em>practical hands-on</em>{" "}
								sewing skills.
							</h2>
							<p className="reveal">
								They are structured in a way to help participants learn and
								master the craft. Intending students are advised to take the
								courses in that order to avoid difficulty in catching up. We
								however have a foundation course to enable intending
								participants gain understanding before proceeding to
								Intermediate class.
							</p>

							{/* Student handbook */}
							<a
								href={HANDBOOK_URL}
								target="_blank"
								rel="noopener noreferrer"
								className="handbook-link reveal"
							>
								<BookOpen size={16} />
								Download Student Handbook
							</a>

							<div className="academy-feats reveal">
								<span className="chip">Certificate on completion</span>
								<span className="chip">Sewing machine per student</span>
								<span className="chip">Small class sizes</span>
								<span className="chip">Hands-on from day one</span>
							</div>
						</div>
						<div className="ph reveal">
							<span className="ph-tag">Academy studio</span>
							<span className="ph-mono">A</span>
						</div>
					</div>
				</div>
			</section>

			{/* Course listing — live from API */}
			<section>
				<div className="wrap">
					<div className="sec-head">
						<span className="eyebrow reveal">Sewing classes</span>
						<h2 className="reveal">Our courses</h2>
						<p className="reveal">
							All fees listed below. Each course includes registration, tuition,
							and a completion certificate.
						</p>
					</div>

					<CourseListClient />
				</div>
			</section>

			{/* CTA */}
			<section style={{ background: "var(--paper)", borderRadius: "36px" }}>
				<div
					className="wrap"
					style={{ paddingBlock: "clamp(3rem,6vw,4.5rem)" }}
				>
					<div className="sec-head center">
						<span className="eyebrow reveal">Ready to start?</span>
						<h2 className="reveal">Not sure which class to take?</h2>
						<p className="reveal">
							Reach out to us on WhatsApp, we&apos;ll help you pick the right
							course for your current skill level and goals.
						</p>
					</div>
					<div style={{ textAlign: "center" }}>
						<a
							href="https://wa.me/2348138683171"
							target="_blank"
							rel="noopener noreferrer"
							className="btn reveal"
						>
							Chat with us on WhatsApp
							<WhatsappIcon size={17} />
						</a>
					</div>
				</div>
			</section>
			{/* Student Handbook — floating button */}
			<a
				href={HANDBOOK_URL}
				target="_blank"
				rel="noopener noreferrer"
				className="handbook-float"
			>
				<BookOpen size={17} />
				Handbook
			</a>
		</main>
	);
}
