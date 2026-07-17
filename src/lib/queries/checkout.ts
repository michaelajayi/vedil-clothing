import { queryOptions, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
	InitiateCheckoutPayload,
	CheckoutResponse,
	CheckoutStatusResponse,
	ApiOrder,
	SendOtpPayload,
	VerifyOtpPayload,
	VerifyOtpResponse,
} from "@/types/api";

// ─── Checkout ────────────────────────────────────────────

export const checkoutStatusOptions = (orderReference: string) =>
	queryOptions({
		queryKey: ["checkout", "status", orderReference],
		queryFn: () =>
			api.get<CheckoutStatusResponse>(`/api/checkout/status/${orderReference}`),
		staleTime: 0,
		refetchInterval: 5_000, // poll every 5s while waiting for payment
	});

export function useInitiateCheckout() {
	return useMutation({
		mutationFn: (payload: InitiateCheckoutPayload) =>
			api.post<CheckoutResponse>("/api/checkout/initiate", payload),
	});
}

// ─── Orders ──────────────────────────────────────────────

export const orderOptions = (orderReference: string) =>
	queryOptions({
		queryKey: ["orders", orderReference],
		queryFn: () => api.get<ApiOrder>(`/api/orders/${orderReference}`),
		staleTime: 30_000,
	});

// ─── Email Verification ─────────────────────────────────

export function useSendOtp() {
	return useMutation({
		mutationFn: (payload: SendOtpPayload) =>
			api.post("/api/email-verification/send-otp", payload),
	});
}

export function useVerifyOtp() {
	return useMutation({
		mutationFn: (payload: VerifyOtpPayload) =>
			api.post<VerifyOtpResponse>("/api/email-verification/verify-otp", payload),
	});
}
