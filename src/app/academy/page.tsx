import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { WhatsappIcon } from "@/components/ui/BrandIcons";
import ScrollRevealInit from "@/components/home/ScrollRevealInit";

export const metadata: Metadata = {
	title: "It's Fun to Sew Academy | Vedil Clothing",
	description:
		"Join hundreds of fashion enthusiasts at the It's Fun to Sew Academy. In-person sewing classes in Lagos from basic to advanced, each with certificate on completion.",
};

const courses: {
	id: string;
	title: string;
	duration: string;
	format: string;
	description: string;
	registration: string;
	tuition: string;
	certificate: string;
	phColor: string;
}[] = [];

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

			{/* Course listing */}
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

					<div className="course-listing">
						{courses.map((course, i) => (
							<article
								key={course.id}
								className={`course-item${i % 2 !== 0 ? " alt" : ""} reveal`}
							>
								<div
									className="ph course-item-img"
									style={{ background: course.phColor } as React.CSSProperties}
								>
									<span className="ph-tag">{course.title}</span>
								</div>
								<div className="course-item-body">
									<span className="course-duration-badge">
										{course.format} · {course.duration}
									</span>
									<h3>{course.title}</h3>
									<p className="course-item-desc">{course.description}</p>
									<div className="course-fees-table">
										<div className="fee-row">
											<span>Registration</span>
											<strong>{course.registration}</strong>
										</div>
										<div className="fee-row">
											<span>Tuition</span>
											<strong>{course.tuition}</strong>
										</div>
										<div className="fee-row">
											<span>Certificate</span>
											<strong>{course.certificate}</strong>
										</div>
										<div className="fee-row">
											<span>Duration</span>
											<strong>{course.duration}</strong>
										</div>
									</div>
									<div className="course-item-actions">
										<a
											href="https://wa.me/2348138683171"
											target="_blank"
											rel="noopener noreferrer"
											className="btn"
										>
											Register Now
											<ArrowRight className="arw" size={16} strokeWidth={2} />
										</a>
										<a
											href="https://wa.me/2348138683171"
											target="_blank"
											rel="noopener noreferrer"
											className="btn btn--ghost"
										>
											Student Handbook
										</a>
									</div>
								</div>
							</article>
						))}
					</div>
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
		</main>
	);
}
