"use client";

import { useState, useCallback, useEffect } from "react";
import { X, Loader } from "lucide-react";
import { useCourseEnroll } from "@/lib/queries/enrollment";
import type { CourseDisplay } from "@/lib/course-mapper";

// ─── Props ────────────────────────────────────────────────

interface EnrollPanelProps {
	course: CourseDisplay | null;
	open: boolean;
	onClose: () => void;
}

// ─── Inner content — keyed by course to reset form state ──

function EnrollPanelForm({
	course,
	onPaySuccess,
}: {
	course: CourseDisplay;
	onPaySuccess: (result: {
		orderReference: string;
		authorizationUrl: string;
	}) => void;
}) {
	const [email, setEmail] = useState("");
	const [error, setError] = useState<string | null>(null);
	const enroll = useCourseEnroll();

	const isValidEmail = email.includes("@") && email.includes(".");

	const handleSubmit = useCallback(async () => {
		if (!isValidEmail) return;

		setError(null);

		try {
			const result = await enroll.mutateAsync({
				email: email.trim(),
				variantId: course.variantId,
			});

			onPaySuccess(result);
		} catch (err: unknown) {
			const message =
				err instanceof Error
					? err.message
					: "Something went wrong. Please try again.";
			setError(message);
		}
	}, [email, isValidEmail, enroll, course.variantId, onPaySuccess]);

	return (
		<div className="enroll-panel-body">
			{/* Course info */}
			<div className="enroll-course-info">
				<p className="enroll-course-title">{course.title}</p>
				<p className="enroll-course-meta">
					{course.formatLabel} · {course.duration}
				</p>
			</div>

			{/* Total — prominent */}
			<div className="enroll-total-section">
				<p className="enroll-total-label">Total</p>
				<p className="enroll-total-amount">{course.tuitionFormatted}</p>
			</div>

			{/* Fee breakdown */}
			<div className="enroll-breakdown">
				<p className="enroll-breakdown-heading">Fee Breakdown</p>
				<div className="enroll-breakdown-row">
					<span>Registration</span>
					<strong>{course.registrationFormatted}</strong>
				</div>
				<div className="enroll-breakdown-row">
					<span>Tuition</span>
					<strong>{course.tuitionFormatted}</strong>
				</div>
				<div className="enroll-breakdown-row">
					<span>Certificate</span>
					<strong>{course.certificateFormatted}</strong>
				</div>
				<div className="enroll-breakdown-row">
					<span>Duration</span>
					<strong>{course.duration}</strong>
				</div>
			</div>

			{/* Email input */}
			<div className="enroll-email-section">
				<label htmlFor="enroll-email">Email address</label>
				<input
					id="enroll-email"
					type="email"
					placeholder="you@example.com"
					value={email}
					onChange={(e) => {
						setEmail(e.target.value);
						setError(null);
					}}
					autoComplete="email"
					inputMode="email"
					disabled={enroll.isPending}
				/>
			</div>

			{/* Error */}
			{error && <p className="enroll-error">{error}</p>}

			{/* Pay button */}
			<button
				className="btn enroll-pay-btn"
				onClick={handleSubmit}
				disabled={!isValidEmail || enroll.isPending}
			>
				{enroll.isPending ? (
					<>
						<Loader size={18} strokeWidth={2} className="enroll-spin" />
						Processing…
					</>
				) : (
					`Pay ${course.tuitionFormatted}`
				)}
			</button>

			<p className="enroll-footer-note">Secured by Paystack · SSL encrypted</p>
		</div>
	);
}

// ─── Panel wrapper (always mounted for animation) ─────────

export default function EnrollPanel({
	course,
	open,
	onClose,
}: EnrollPanelProps) {
	// Close on Escape
	useEffect(() => {
		if (!open) return;
		function handleKey(e: KeyboardEvent) {
			if (e.key === "Escape") onClose();
		}
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [open, onClose]);

	// On successful enrollment — store order ref and redirect
	const handlePaySuccess = useCallback(
		async (result: { orderReference: string; authorizationUrl: string }) => {
			sessionStorage.setItem("vedil_last_order_ref", result.orderReference);
			window.location.href = result.authorizationUrl;
		},
		[],
	);

	return (
		<>
			{/* Backdrop */}
			<div
				className={`enroll-overlay${open ? " open" : ""}`}
				onClick={onClose}
				aria-hidden="true"
			/>

			{/* Panel */}
			<aside
				className={`enroll-panel${open ? " open" : ""}`}
				aria-label="Enroll in course"
				aria-modal="true"
				role="dialog"
			>
				{/* Header */}
				<div className="enroll-panel-head">
					<h2>Enroll in Course</h2>
					<button className="icon-btn" onClick={onClose} aria-label="Close">
						<X strokeWidth={2} />
					</button>
				</div>

				{/* Form — keyed by variantId so state resets on course change */}
				{course && (
					<EnrollPanelForm
						key={course.variantId}
						course={course}
						onPaySuccess={handlePaySuccess}
					/>
				)}
			</aside>
		</>
	);
}
