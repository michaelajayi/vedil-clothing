"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCourses } from "@/lib/queries/catalog";
import { mapApiCourses, type CourseDisplay } from "@/lib/course-mapper";
import EnrollPanel from "@/components/academy/EnrollPanel";
import ImageMedia from "@/components/ui/ImageMedia";

// ─── Helpers ──────────────────────────────────────────────

/** Fisher-Yates shuffle, pick `count` random items from `arr`. */
function pickRandom<T>(arr: T[], count: number): T[] {
	const shuffled = [...arr];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled.slice(0, count);
}

const ENROLL_LABEL: Record<string, string> = {
	"In-person": "One-time enrolment",
	Online: "Lifetime access",
	Hybrid: "Per course",
};

// ─── Skeleton (loading state) ─────────────────────────────

function SkeletonCard() {
	return (
		<article className="course-card reveal">
			<div className="ph" style={{ aspectRatio: "16/10" }}>
				<div
					className="skeleton-pulse"
					style={{ width: "100%", height: "100%" }}
				/>
			</div>
			<div className="course-body">
				<div
					className="skeleton-pulse"
					style={{
						height: "0.75rem",
						width: "8rem",
						marginBottom: "0.6rem",
					}}
				/>
				<div
					className="skeleton-pulse"
					style={{
						height: "1.5rem",
						width: "70%",
						marginBottom: "0.5rem",
					}}
				/>
				<div
					className="skeleton-pulse"
					style={{ height: "3rem", width: "100%", marginBottom: "1rem" }}
				/>
				<div
					className="skeleton-pulse"
					style={{ height: "2.5rem", width: "100%" }}
				/>
			</div>
		</article>
	);
}

// ─── Main component ───────────────────────────────────────

export default function AcademySection() {
	const { data, isLoading, isError } = useCourses();
	const [selectedCourse, setSelectedCourse] = useState<CourseDisplay | null>(
		null,
	);
	const [panelOpen, setPanelOpen] = useState(false);

	// Pick 3 random courses — stable while data reference stays the same.
	// Each fresh page load fetches a new response from the cache/network,
	// so `data` is a new reference and we get a fresh random selection.
	const featured = useMemo(() => {
		if (!data || data.length === 0) return [];
		return pickRandom(mapApiCourses(data), Math.min(3, data.length));
	}, [data]);

	const openEnrollPanel = useCallback((course: CourseDisplay) => {
		setSelectedCourse(course);
		setPanelOpen(true);
	}, []);

	const closeEnrollPanel = useCallback(() => {
		setPanelOpen(false);
	}, []);

	// ── Render ───────────────────────────────────────────

	const hasCourses = featured.length > 0;

	return (
		<section className="academy" id="academy" style={{ paddingBlock: 0 }}>
			<div className="wrap">
				<div className="academy-top">
					<div>
						<span className="eyebrow reveal">It&apos;s Fun to Sew</span>
						<h2 className="reveal">
							Learn to sew, the <em>joyful</em> way.
						</h2>
						<p className="reveal">
							Whether you dream of sewing for your family or starting a label of
							your own, our classes meet you exactly where you are. Learn from
							master tailors in our Lagos studio, or follow along at your own
							pace online, with real feedback, warm guidance, and a community
							that cheers you on.
						</p>
						<div className="academy-feats reveal">
							<span className="chip">In-person classes</span>
							<span className="chip">Self-paced online</span>
							<span className="chip">Beginner friendly</span>
							<span className="chip">Certificate on completion</span>
						</div>
					</div>
					<ImageMedia
						src="https://res.cloudinary.com/jqaitieh/image/upload/v1784498008/garment_factory__if1jvz.webp"
						alt="It's Fun to Sew academy"
						className="reveal"
					/>
				</div>

				{/* Course grid */}
				<div className="course-grid">
					{isLoading ? (
						<>
							<SkeletonCard />
							<SkeletonCard />
							<SkeletonCard />
						</>
					) : isError || !hasCourses ? (
						<div
							style={{
								gridColumn: "1 / -1",
								textAlign: "center",
								paddingBlock: "3rem",
							}}
						>
							<p style={{ color: "var(--ink-soft)", marginBottom: "0.5rem" }}>
								{isError
									? "Could not load courses right now."
									: "No courses available right now."}
							</p>
							<p style={{ color: "var(--ink-soft)", fontSize: "0.85rem" }}>
								Check back soon or{" "}
								<a
									href="https://wa.me/2348138683171"
									target="_blank"
									rel="noopener noreferrer"
									style={{ color: "var(--burgundy)" }}
								>
									contact us
								</a>{" "}
								for upcoming sessions.
							</p>
						</div>
					) : (
						featured.map((course) => (
							<article key={course.id} className="course-card reveal">
								{course.image ? (
									<ImageMedia
										src={course.image}
										alt={course.title}
										aspectRatio="16/10"
										objectPosition="top"
										hoverable={false}
									/>
								) : (
									<div
										className="ph"
										style={
											{ background: course.phColor } as React.CSSProperties
										}
									/>
								)}
								<div className="course-body">
									<span className="course-format">
										{course.formatLabel} &middot; {course.duration}
									</span>
									<h3>{course.title}</h3>
									<p>{course.description}</p>
									<div className="course-foot">
										<div className="price">
											{course.tuitionFormatted}
											<small>
												{ENROLL_LABEL[course.formatLabel] ?? "Per course"}
											</small>
										</div>
										<button
											className="btn btn--enroll"
											onClick={() => openEnrollPanel(course)}
										>
											Enroll
										</button>
									</div>
								</div>
							</article>
						))
					)}
				</div>

				<div className="academy-view-all reveal">
					<Link href="/fun-to-sew" className="link-arrow">
						View All Courses
						<ArrowRight size={15} strokeWidth={2} />
					</Link>
				</div>
			</div>

			{/* Enroll slide-in panel */}
			<EnrollPanel
				course={selectedCourse}
				open={panelOpen}
				onClose={closeEnrollPanel}
			/>
		</section>
	);
}
