// ─────────────────────────────────────────────────────────
// Course Enrollment — direct purchase (bypasses cart)
// ─────────────────────────────────────────────────────────

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface CourseEnrollPayload {
	email: string;
	variantId: string;
	/** Verification token from POST /api/email-verification/verify-otp */
	verificationToken: string;
}

export interface CourseEnrollResponse {
	orderReference: string;
	authorizationUrl: string;
}

export interface SendOtpResponse {
	message: string;
}

export interface VerifyOtpResponse {
	verificationToken: string;
}

/**
 * Send a 6-digit OTP to the student's email.
 */
export function useSendOtp() {
	return useMutation({
		mutationFn: (email: string) =>
			api.post<SendOtpResponse>("/api/email-verification/send-otp", { email }),
	});
}

/**
 * Verify the OTP and receive a short-lived verification token.
 * Pass this token to useCourseEnroll.
 */
export function useVerifyOtp() {
	return useMutation({
		mutationFn: (payload: { email: string; otp: string }) =>
			api.post<VerifyOtpResponse>(
				"/api/email-verification/verify-otp",
				payload,
			),
	});
}

/**
 * Enroll a student in a course — creates an order and
 * enrollment record on the backend, bypassing the cart.
 *
 * Requires a verificationToken obtained from useVerifyOtp.
 *
 * Returns a Paystack authorizationUrl that the frontend
 * redirects to.
 */
export function useCourseEnroll() {
	return useMutation({
		mutationFn: (payload: CourseEnrollPayload) =>
			api.post<CourseEnrollResponse>("/api/courses/enroll", payload),
	});
}
