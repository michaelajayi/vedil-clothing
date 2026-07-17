// ─────────────────────────────────────────────────────────
// Course Enrollment — direct purchase (bypasses cart)
// ─────────────────────────────────────────────────────────

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface CourseEnrollPayload {
	email: string;
	variantId: string;
}

export interface CourseEnrollResponse {
	orderReference: string;
	authorizationUrl: string;
}

/**
 * Enroll a student in a course — creates an order and
 * enrollment record on the backend, bypassing the cart.
 *
 * Returns a Paystack authorizationUrl that the frontend
 * redirects to (B1 — no frontend SDK needed).
 */
export function useCourseEnroll() {
	return useMutation({
		mutationFn: (payload: CourseEnrollPayload) =>
			api.post<CourseEnrollResponse>("/api/courses/enroll", payload),
	});
}
