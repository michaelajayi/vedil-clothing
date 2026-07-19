"use client";

import { useState, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { useCourses } from "@/lib/queries/catalog";
import { mapApiCourses, type CourseDisplay } from "@/lib/course-mapper";
import EnrollPanel from "./EnrollPanel";

const FORMAT_TABS = [
	{ value: "live", label: "In-person", num: "01" },
	{ value: "self-paced", label: "Online", num: "02" },
] as const;

const FORMAT_EMPTY_MESSAGES: Record<string, string> = {
	live: "No in-person courses available right now. Check back soon or",
	"self-paced": "No online courses available right now. Check back soon or",
};

const FORMAT_MAP_TO_API: Record<string, string> = {
	live: "LIVE",
	"self-paced": "SELF_PACED",
};

export default function CourseListClient() {
	const { data, isLoading, isError } = useCourses();
	const [activeTab, setActiveTab] = useState<string | null>(null);
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

	const allCourses = useMemo(() => mapApiCourses(data ?? []), [data]);

	const courses = useMemo(() => {
		if (!activeTab) return allCourses;
		const apiFormat = FORMAT_MAP_TO_API[activeTab];
		if (!apiFormat) return allCourses;
		return allCourses.filter((c) => c.format === apiFormat);
	}, [allCourses, activeTab]);

	// ─── Tabs ─────────────────────────────────────────────
	const tabs = (
		<div className="format-switcher">
			<nav className="format-switcher-nav" aria-label="Course format">
				<button
					className={`format-tab${!activeTab ? " format-tab--active" : ""}`}
					onClick={() => setActiveTab(null)}
				>
					<span className="format-tab-num">All</span>
				</button>
				{FORMAT_TABS.map(({ value, label, num }) => (
					<button
						key={value}
						className={`format-tab${activeTab === value ? " format-tab--active" : ""}`}
						onClick={() => setActiveTab(value)}
					>
						<span className="format-tab-num">{num}</span>
						{label}
					</button>
				))}
			</nav>
		</div>
	);

	// ─── Loading ───────────────────────────────────────────
	if (isLoading) {
		return (
			<>
				{tabs}
				<div className="course-listing">
					{[1, 2, 3].map((i) => (
						<article key={i} className="course-item">
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
			</>
		);
	}

	// ─── Error ────────────────────────────────────────────
	if (isError) {
		return (
			<>
				{tabs}
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
			</>
		);
	}

	// ─── Empty ────────────────────────────────────────────
	if (courses.length === 0) {
		const emptyMsg =
			(activeTab && FORMAT_EMPTY_MESSAGES[activeTab]) ??
			"No courses available right now. Check back soon or";

		return (
			<>
				{tabs}
				<div style={{ textAlign: "center", paddingBlock: "3rem" }}>
					<p style={{ color: "var(--ink-soft)" }}>
						{emptyMsg}{" "}
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
			</>
		);
	}

	return (
		<>
			{tabs}

			<div className="course-listing">
				{courses.map((course) => (
					<article key={course.id} className="course-item reveal">
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
