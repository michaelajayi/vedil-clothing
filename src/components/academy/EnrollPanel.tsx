"use client";

import { useState, useCallback, useEffect } from "react";
import { X, Loader, ArrowLeft, Check } from "lucide-react";
import {
	useCourseEnroll,
	useSendOtp,
	useVerifyOtp,
} from "@/lib/queries/enrollment";
import type { CourseDisplay } from "@/lib/course-mapper";
import { useToast } from "@/components/ui/Toast";

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

	const { toast } = useToast();

	const sendOtp = useSendOtp();
	const verifyOtpMutation = useVerifyOtp();
	const enroll = useCourseEnroll();

	// ── Step 1: Send OTP ──
	const handleSendOtp = useCallback(async () => {
		if (!isEmail(email)) return;

		try {
			await sendOtp.mutateAsync(email.trim());
			setStep("verify");
		} catch (err: unknown) {
			toast("Could not send code", {
				description: err instanceof Error ? err.message : "Please try again.",
				variant: "error",
			});
		}
	}, [email, sendOtp, toast]);

	// ── Step 2: Verify OTP ──
	const handleVerifyOtp = useCallback(async () => {
		if (!isOtp(otp)) return;

		try {
			const result = await verifyOtpMutation.mutateAsync({
				email: email.trim(),
				otp: otp.trim(),
			});
			setVerificationToken(result.verificationToken);
			setStep("pay");
		} catch (err: unknown) {
			toast("Verification failed", {
				description:
					err instanceof Error
						? err.message
						: "Incorrect code. Please try again.",
				variant: "error",
			});
		}
	}, [email, otp, verifyOtpMutation, toast]);

	// ── Step 3: Pay ──
	const handlePay = useCallback(async () => {
		if (!verificationToken) return;

		try {
			const result = await enroll.mutateAsync({
				email: email.trim(),
				variantId: course.variantId,
				verificationToken,
			});

			onPaySuccess(result);
		} catch (err: unknown) {
			toast("Enrollment failed", {
				description:
					err instanceof Error
						? err.message
						: "Something went wrong. Please try again.",
				variant: "error",
			});
			// Reset to email step so the user can try a different address
			setStep("email");
			setEmail("");
			setVerificationToken(null);
		}
	}, [email, verificationToken, enroll, course.variantId, onPaySuccess, toast]);

	// ── Go back to email step ──
	const handleBack = useCallback(() => {
		setStep("email");
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
				{course.feeBreakdown.map((fee) => (
					<div key={fee.label} className="enroll-breakdown-row">
						<span>{fee.label}</span>
						<strong>{fee.formatted}</strong>
					</div>
				))}
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
						onChange={(e) => setEmail(e.target.value)}
						autoComplete="email"
						inputMode="email"
						disabled={isPending}
					/>
				</div>

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
						onChange={(e) =>
							setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
						}
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
								<Loader size={18} strokeWidth={2} className="enroll-spin" />
								Verifying…
							</>
						) : (
							"Verify code"
						)}
					</button>

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
