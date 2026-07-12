import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
	ApiCart,
	AddToCartPayload,
	UpdateCartItemPayload,
} from "@/types/api";

// ─── Cart queries ────────────────────────────────────────

export const cartOptions = (sessionId: string) =>
	queryOptions({
		queryKey: ["cart", sessionId],
		queryFn: () => api.get<ApiCart>(`/api/cart/${sessionId}`),
		staleTime: 0, // always fresh — cart changes frequently
		refetchInterval: 30_000, // poll every 30s for multi-tab sync
	});

// ─── Cart mutations ──────────────────────────────────────

export function useAddToCart(sessionId: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: AddToCartPayload) =>
			api.post<ApiCart>(`/api/cart/${sessionId}/items`, payload),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["cart", sessionId] });
		},
	});
}

export function useUpdateCartItem(sessionId: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({
			itemId,
			payload,
		}: {
			itemId: string;
			payload: UpdateCartItemPayload;
		}) => api.patch<ApiCart>(`/api/cart/${sessionId}/items/${itemId}`, payload),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["cart", sessionId] });
		},
	});
}

export function useRemoveFromCart(sessionId: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (itemId: string) =>
			api.delete<ApiCart>(`/api/cart/${sessionId}/items/${itemId}`),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["cart", sessionId] });
		},
	});
}
