"use client";

import { useState, useCallback, useEffect } from "react";
import { X, Loader, ArrowLeft, Check } from "lucide-react";
import {
	useCourseEnroll,
	useSendOtp,
	useVerifyOtp,
} from "@/lib/queries/enrollment";
import type { CourseDisplay } from "@/lib/course-mapper";

// ─── Helpers ──────────────────────────────────────────────

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isOtp = (v: string) => /^\d{6}$/.test(v);

type Step = "email" | "verify" | "pay";

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
	// ── State ──
	const [step, setStep] = useState<Step>("email");
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [verificationToken, setVerificationToken] = useState<string | null>(
		null,
	);
	const [error, setError] = useState<string | null>(null);

	const sendOtp = useSendOtp();
	const verifyOtpMutation = useVerifyOtp();
	const enroll = useCourseEnroll();

	// Reset when a mutation completes (clear transient errors)
	const clearError = useCallback(() => setError(null), []);

	// ── Step 1: Send OTP ──
	const handleSendOtp = useCallback(async () => {
		if (!isEmail(email)) return;
		setError(null);

		try {
			await sendOtp.mutateAsync(email.trim());
			setStep("verify");
		} catch (err: unknown) {
			setError(
				err instanceof Error
					? err.message
					: "Failed to send verification code. Please try again.",
			);
		}
	}, [email, sendOtp]);

	// ── Step 2: Verify OTP ──
	const handleVerifyOtp = useCallback(async () => {
		if (!isOtp(otp)) return;
		setError(null);

		try {
			const result = await verifyOtpMutation.mutateAsync({
				email: email.trim(),
				otp: otp.trim(),
			});
			setVerificationToken(result.verificationToken);
			setStep("pay");
		} catch (err: unknown) {
			setError(
				err instanceof Error
					? err.message
					: "Invalid verification code. Please try again.",
			);
		}
	}, [email, otp, verifyOtpMutation]);

	// ── Step 3: Pay ──
	const handlePay = useCallback(async () => {
		if (!verificationToken) return;
		setError(null);

		try {
			const result = await enroll.mutateAsync({
				email: email.trim(),
				variantId: course.variantId,
				verificationToken,
			});

			onPaySuccess(result);
		} catch (err: unknown) {
			setError(
				err instanceof Error
					? err.message
					: "Something went wrong. Please try again.",
			);
		}
	}, [email, verificationToken, enroll, course.variantId, onPaySuccess]);

	// ── Go back to email step ──
	const handleBack = useCallback(() => {
		setStep("email");
		setError(null);
	}, []);

	// ── Pending states ──
	const isPending =
		sendOtp.isPending || verifyOtpMutation.isPending || enroll.isPending;

	// ── Shared: course info header ──
	const courseInfo = (
		<>
			<div className="enroll-course-info">
				<p className="enroll-course-title">{course.title}</p>
				<p className="enroll-course-meta">
					{course.formatLabel} · {course.duration}
				</p>
			</div>

			<div className="enroll-total-section">
				<p className="enroll-total-label">Total</p>
				<p className="enroll-total-amount">{course.tuitionFormatted}</p>
			</div>

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
		</>
	);

	// ── Step indicator ──
	const stepIndicator = (
		<div className="enroll-steps">
			<div
				className={`enroll-step-dot${step === "email" ? " active" : ""}${step !== "email" ? " done" : ""}`}
			>
				{step !== "email" ? <Check size={12} strokeWidth={3} /> : 1}
			</div>
			<div className="enroll-step-line" />
			<div
				className={`enroll-step-dot${step === "verify" ? " active" : ""}${step === "pay" ? " done" : ""}`}
			>
				{step === "pay" ? <Check size={12} strokeWidth={3} /> : 2}
			</div>
			<div className="enroll-step-line" />
			<div className={`enroll-step-dot${step === "pay" ? " active" : ""}`}>
				3
			</div>
		</div>
	);

	// ── Step: Email ──
	if (step === "email") {
		return (
			<div className="enroll-panel-body">
				{courseInfo}

				<div className="enroll-email-section">
					<label htmlFor="enroll-email">Email address</label>
					<input
						id="enroll-email"
						type="email"
						placeholder="you@example.com"
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							clearError();
						}}
						autoComplete="email"
						inputMode="email"
						disabled={isPending}
					/>
				</div>

				{error && <p className="enroll-error">{error}</p>}

				<button
					className="btn enroll-pay-btn"
					onClick={handleSendOtp}
					disabled={!isEmail(email) || isPending}
				>
					{sendOtp.isPending ? (
						<>
							<Loader size={18} strokeWidth={2} className="enroll-spin" />
							Sending code…
						</>
					) : (
						"Send verification code"
					)}
				</button>

				<p className="enroll-footer-note">
					We&apos;ll send a 6-digit code to this email
				</p>
			</div>
		);
	}

	// ── Step: Verify OTP ──
	if (step === "verify") {
		return (
			<div className="enroll-panel-body">
				{stepIndicator}

				<div className="enroll-verify-section">
					<p className="enroll-verify-heading">Check your email</p>
					<p className="enroll-verify-sub">
						We sent a 6-digit code to <strong>{email}</strong>
					</p>

					<label htmlFor="enroll-otp">Verification code</label>
					<input
						id="enroll-otp"
						type="text"
						inputMode="numeric"
						placeholder="000 000"
						maxLength={6}
						value={otp}
						onChange={(e) => {
							setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
							clearError();
						}}
						disabled={isPending}
						autoComplete="one-time-code"
					/>

					<button
						className="btn enroll-pay-btn"
						onClick={handleVerifyOtp}
						disabled={!isOtp(otp) || isPending}
					>
						{verifyOtpMutation.isPending ? (
							<>
								<Loader
									size={18}
									strokeWidth={2}
									className="enroll-spin"
								/>
								Verifying…
							</>
						) : (
							"Verify code"
						)}
					</button>

					{error && <p className="enroll-error">{error}</p>}

					<button
						className="enroll-back-btn"
						onClick={handleBack}
						disabled={isPending}
					>
						<ArrowLeft size={14} strokeWidth={2} />
						Use a different email
					</button>
				</div>
			</div>
		);
	}

	// ── Step: Pay ──
	return (
		<div className="enroll-panel-body">
			{stepIndicator}

			{courseInfo}

			<div className="enroll-email-section">
				<label htmlFor="enroll-email">Email address</label>
				<input
					id="enroll-email"
					type="email"
					value={email}
					readOnly
					disabled
					tabIndex={-1}
				/>
			</div>

			{error && <p className="enroll-error">{error}</p>}

			<button
				className="btn enroll-pay-btn"
				onClick={handlePay}
				disabled={isPending}
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

			<p className="enroll-footer-note">
				Email verified · Secured by Paystack · SSL encrypted
			</p>
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
