"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useCourses } from "@/lib/queries/catalog";
import { mapApiCourses, type CourseDisplay } from "@/lib/course-mapper";
import EnrollPanel from "./EnrollPanel";

export default function CourseListClient() {
	const { data, isLoading, isError } = useCourses();
	const [selectedCourse, setSelectedCourse] = useState<CourseDisplay | null>(
		null,
	);
	const [panelOpen, setPanelOpen] = useState(false);

	function openEnrollPanel(course: CourseDisplay) {
		setSelectedCourse(course);
		setPanelOpen(true);
	}

	function closeEnrollPanel() {
		setPanelOpen(false);
	}

	// ─── Loading ───────────────────────────────────────────
	if (isLoading) {
		return (
			<div className="course-listing">
				{[1, 2, 3].map((i) => (
					<article key={i} className="course-item reveal">
						<div className="ph course-item-img" style={{ height: 200 }}>
							<div
								className="skeleton-pulse"
								style={{ width: "100%", height: "100%" }}
							/>
						</div>
						<div className="course-item-body">
							<div
								className="skeleton-pulse"
								style={{
									height: "0.8rem",
									width: "8rem",
									marginBottom: "0.8rem",
								}}
							/>
							<div
								className="skeleton-pulse"
								style={{
									height: "1.5rem",
									width: "70%",
									marginBottom: "0.6rem",
								}}
							/>
							<div
								className="skeleton-pulse"
								style={{ height: "3rem", width: "100%" }}
							/>
						</div>
					</article>
				))}
			</div>
		);
	}

	// ─── Error ────────────────────────────────────────────
	if (isError) {
		return (
			<div style={{ textAlign: "center", paddingBlock: "3rem" }}>
				<p style={{ color: "var(--ink-soft)", marginBottom: "0.5rem" }}>
					Could not load courses right now.
				</p>
				<p style={{ color: "var(--ink-soft)", fontSize: "0.85rem" }}>
					<a
						href="https://wa.me/2348138683171"
						target="_blank"
						rel="noopener noreferrer"
						style={{ color: "var(--burgundy)" }}
					>
						Contact us on WhatsApp
					</a>{" "}
					for course information.
				</p>
			</div>
		);
	}

	// ─── Empty / success ─────────────────────────────────
	const courses = mapApiCourses(data ?? []);

	if (courses.length === 0) {
		return (
			<div style={{ textAlign: "center", paddingBlock: "3rem" }}>
				<p style={{ color: "var(--ink-soft)" }}>
					No courses available right now. Check back soon or{" "}
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
		);
	}

	return (
		<>
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
								{course.formatLabel} · {course.duration}
							</span>
							<h3>{course.title}</h3>
							<p className="course-item-desc">{course.description}</p>
							<div className="course-fees-table">
								<div className="fee-row">
									<span>Registration</span>
									<strong>{course.registrationFormatted}</strong>
								</div>
								<div className="fee-row">
									<span>Tuition</span>
									<strong>{course.tuitionFormatted}</strong>
								</div>
								<div className="fee-row">
									<span>Certificate</span>
									<strong>{course.certificateFormatted}</strong>
								</div>
								<div className="fee-row">
									<span>Duration</span>
									<strong>{course.duration}</strong>
								</div>
							</div>
							<div className="course-item-actions">
								<button className="btn" onClick={() => openEnrollPanel(course)}>
									Enroll Now
									<ArrowRight className="arw" size={16} strokeWidth={2} />
								</button>
							</div>
						</div>
					</article>
				))}
			</div>

			{/* Enroll slide-in panel */}
			<EnrollPanel
				course={selectedCourse}
				open={panelOpen}
				onClose={closeEnrollPanel}
			/>
		</>
	);
}
