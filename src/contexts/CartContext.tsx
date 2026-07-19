"use client";

import {
	createContext,
	useContext,
	useReducer,
	useState,
	useEffect,
	useCallback,
	ReactNode,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getCartSessionId, rotateCartSession } from "@/lib/cart-session";
import { useProducts, useCourses } from "@/lib/queries/catalog";

import type { ApiCart, ApiCartItem, AddToCartPayload } from "@/types/api";

// ─── Types ───────────────────────────────────────────────

export type CartItem = {
	/** variantId — used as stable identity across sessions */
	id: string;
	/** Backend cart item ID, needed for update/delete mutations */
	backendCartItemId?: string;
	name: string;
	retailPrice: number;
	wholesalePrice: number | null;
	moq: number;
	quantity: number;
	size?: string;
	category?: string;
	kind?: "PHYSICAL" | "COURSE";
};

type CartState = {
	items: CartItem[];
	isOpen: boolean;
	/** Tracks whether we've seeded from localStorage on mount */
	seeded: boolean;
};

type CartAction =
	| { type: "ADD"; item: Omit<CartItem, "quantity"> }
	| { type: "REMOVE"; id: string }
	| { type: "SET_QTY"; id: string; quantity: number }
	| { type: "CLEAR" }
	| { type: "RESET_AFTER_CHECKOUT" }
	| { type: "OPEN" }
	| { type: "CLOSE" }
	| { type: "HYDRATE"; items: CartItem[] }
	| { type: "UPDATE_BACKEND_ID"; localId: string; backendCartItemId: string }
	| { type: "REPLACE_ITEM"; item: CartItem };

export { fmtPrice } from "@/lib/products";

// ─── Price helper ────────────────────────────────────────

export function effectivePrice(item: CartItem): number {
	if (
		item.wholesalePrice !== null &&
		item.wholesalePrice > 0 &&
		item.quantity >= item.moq
	) {
		return item.wholesalePrice;
	}
	return item.retailPrice;
}

// ─── Reducer ─────────────────────────────────────────────

function reducer(state: CartState, action: CartAction): CartState {
	switch (action.type) {
		case "ADD": {
			const existing = state.items.find((i) => i.id === action.item.id);
			if (existing) {
				return {
					...state,
					isOpen: true,
					items: state.items.map((i) =>
						i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i,
					),
				};
			}
			return {
				...state,
				isOpen: true,
				items: [...state.items, { ...action.item, quantity: 1 }],
			};
		}
		case "REMOVE":
			return { ...state, items: state.items.filter((i) => i.id !== action.id) };
		case "SET_QTY":
			if (action.quantity < 1) {
				return {
					...state,
					items: state.items.filter((i) => i.id !== action.id),
				};
			}
			return {
				...state,
				items: state.items.map((i) =>
					i.id === action.id ? { ...i, quantity: action.quantity } : i,
				),
			};
		case "CLEAR":
			return { ...state, items: [] };
		case "RESET_AFTER_CHECKOUT":
			// Full reset: clear items and unseed so the re-seed effect skips
			// (the session has been rotated, so the old backend cart won't match)
			return { items: [], isOpen: false, seeded: false };
		case "OPEN":
			return { ...state, isOpen: true };
		case "CLOSE":
			return { ...state, isOpen: false };
		case "HYDRATE":
			return { ...state, items: action.items, seeded: true };
		case "UPDATE_BACKEND_ID":
			return {
				...state,
				items: state.items.map((i) =>
					i.id === action.localId
						? { ...i, backendCartItemId: action.backendCartItemId }
						: i,
				),
			};
		case "REPLACE_ITEM":
			return {
				...state,
				items: state.items.map((i) =>
					i.id === action.item.id ? action.item : i,
				),
			};
		default:
			return state;
	}
}

// ─── Context ─────────────────────────────────────────────

type CartContextValue = {
	items: CartItem[];
	isOpen: boolean;
	itemCount: number;
	subtotal: number;
	sessionId: string;
	addItem: (item: Omit<CartItem, "quantity">) => void;
	removeItem: (id: string) => void;
	setQty: (id: string, quantity: number) => void;
	clearCart: () => void;
	/**
	 * Reset the cart after a successful checkout:
	 * clears local state, clears localStorage cart data,
	 * and rotates the session UUID so the next page load
	 * starts with a fresh backend cart.
	 */
	resetCart: () => void;
	openCart: () => void;
	closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

// ─── Local storage keys ──────────────────────────────────

const CART_STORAGE_KEY = "vedil_cart";

// ─── Provider ────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(reducer, {
		items: [],
		isOpen: false,
		seeded: false,
	});

	const [sessionId, setSessionId] = useState<string>(() => getCartSessionId());
	const queryClient = useQueryClient();

	// ── Backend cart query ─────────────────────────────────
	const { data: serverCart, isSuccess: cartLoaded } = useQuery({
		queryKey: ["cart", sessionId],
		queryFn: () => api.get<ApiCart>(`/api/cart/${sessionId}`),
		enabled: !!sessionId,
		staleTime: 0,
		refetchInterval: 30_000,
	});

	const { data: coursesData } = useCourses();
	const { data: productsData } = useProducts();

	// ── Cart mutations ─────────────────────────────────────
	const addToBackend = useMutation({
		mutationFn: (payload: AddToCartPayload) =>
			api.post<ApiCart>(`/api/cart/${sessionId}/items`, payload),
		onSuccess: (result) => {
			queryClient.setQueryData(["cart", sessionId], result);
			// Update local items with backend IDs so subsequent mutations work
			const addedItem = result.items[result.items.length - 1];
			if (addedItem) {
				dispatch({
					type: "UPDATE_BACKEND_ID",
					localId: addedItem.variantId,
					backendCartItemId: addedItem.id,
				});
			}
		},
	});

	const removeFromBackend = useMutation({
		mutationFn: (backendItemId: string) =>
			api.delete<ApiCart>(`/api/cart/${sessionId}/items/${backendItemId}`),
		onSuccess: (result) => {
			queryClient.setQueryData(["cart", sessionId], result);
		},
	});

	const updateBackendQty = useMutation({
		mutationFn: ({
			backendItemId,
			quantity,
		}: {
			backendItemId: string;
			quantity: number;
		}) =>
			api.patch<ApiCart>(`/api/cart/${sessionId}/items/${backendItemId}`, {
				quantity,
			}),
		onSuccess: (result) => {
			queryClient.setQueryData(["cart", sessionId], result);
		},
	});

	// ── Restore cart from localStorage on mount ────────────
	useEffect(() => {
		try {
			const raw = localStorage.getItem(CART_STORAGE_KEY);
			if (raw) dispatch({ type: "HYDRATE", items: JSON.parse(raw) });
			else dispatch({ type: "HYDRATE", items: [] });
		} catch {
			dispatch({ type: "HYDRATE", items: [] });
		}
	}, []);

	// ── Seed local items from backend cart on load ─────────
	// This ensures any items added in a previous session (via another tab)
	// are reflected locally.
	useEffect(() => {
		if (!cartLoaded || !serverCart || !state.seeded) return;

		// Only seed if local cart is empty or has placeholder names that we can now enrich
		const hasPlaceholders = state.items.some((i) =>
			i.name.startsWith("Product ("),
		);
		if (state.items.length > 0 && !hasPlaceholders) return;

		if (!serverCart.items.length) return;

		// We have backend items — enrich them with courses and products catalogs.
		const enriched: CartItem[] = serverCart.items.map((bci: ApiCartItem) => {
			const matchedCourse = coursesData?.find((c) =>
				c.variants.some((v) => v.id === bci.variantId),
			);

			const matchedProduct = productsData?.find((p) =>
				p.variants.some((v) => v.id === bci.variantId),
			);

			if (matchedCourse) {
				return {
					id: bci.variantId,
					backendCartItemId: bci.id,
					name: matchedCourse.name,
					retailPrice: bci.unitPrice / 100,
					wholesalePrice: null,
					moq: 1,
					quantity: bci.quantity,
					kind: "COURSE",
				};
			}

			if (matchedProduct) {
				const variant =
					matchedProduct.variants.find((v) => v.id === bci.variantId) ||
					matchedProduct.variants[0];
				// Find the wholesale price at the product's MOQ
				const tiers = [...(variant.priceTiers ?? [])].sort(
					(a, b) => a.minQuantity - b.minQuantity,
				);
				const wholesaleTier =
					tiers.find((t) => t.minQuantity === matchedProduct.moq) ??
					tiers.find((t) => t.minQuantity >= matchedProduct.moq) ??
					tiers[tiers.length - 1];
				const isWholesale =
					wholesaleTier && wholesaleTier.minQuantity > tiers[0].minQuantity;

				return {
					id: bci.variantId,
					backendCartItemId: bci.id,
					name: matchedProduct.name,
					retailPrice: (tiers[0]?.amount ?? bci.unitPrice) / 100,
					wholesalePrice: isWholesale
						? wholesaleTier!.amount / 100
						: null,
					moq: matchedProduct.moq,
					quantity: bci.quantity,
					size:
						variant.optionValues?.find(
							(ov) =>
								ov.optionValue?.optionType?.name?.toLowerCase() === "size",
						)?.optionValue?.value || undefined,
					category: matchedProduct.category?.name,
					kind: "PHYSICAL",
				};
			}

			// Fallback: minimal details
			return {
				id: bci.variantId,
				backendCartItemId: bci.id,
				name: `Product (${bci.variantId.slice(0, 8)}…)`,
				retailPrice: bci.unitPrice / 100,
				wholesalePrice: null,
				moq: 1,
				quantity: bci.quantity,
				kind: "PHYSICAL",
			};
		});

		dispatch({ type: "HYDRATE", items: enriched });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cartLoaded, serverCart, state.seeded, coursesData, productsData]);

	// ── Persist to localStorage whenever items change ──────
	useEffect(() => {
		if (state.seeded) {
			localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
		}
	}, [state.items, state.seeded]);

	// ── Lock page scroll while drawer is open ──────────────
	useEffect(() => {
		document.body.style.overflow = state.isOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [state.isOpen]);

	// ── Derived values ────────────────────────────────────
	const itemCount = state.items.reduce((s, i) => s + i.quantity, 0);
	const subtotal = state.items.reduce(
		(s, i) => s + effectivePrice(i) * i.quantity,
		0,
	);

	// ── Actions ───────────────────────────────────────────
	const addItem = useCallback(
		(item: Omit<CartItem, "quantity">) => {
			// Optimistic local update
			dispatch({ type: "ADD", item });
			// Sync to backend
			addToBackend.mutate({ variantId: item.id, quantity: 1 });
		},
		[addToBackend],
	);

	const removeItem = useCallback(
		(id: string) => {
			const found = state.items.find((i) => i.id === id);
			// Optimistic local remove
			dispatch({ type: "REMOVE", id });
			// Sync to backend
			if (found?.backendCartItemId) {
				removeFromBackend.mutate(found.backendCartItemId);
			}
		},
		[state.items, removeFromBackend],
	);

	const setQty = useCallback(
		(id: string, quantity: number) => {
			const found = state.items.find((i) => i.id === id);
			// Optimistic local update
			dispatch({ type: "SET_QTY", id, quantity });
			// Sync to backend (remove if qty < 1)
			if (quantity < 1) {
				if (found?.backendCartItemId) {
					removeFromBackend.mutate(found.backendCartItemId);
				}
			} else if (found?.backendCartItemId) {
				updateBackendQty.mutate({
					backendItemId: found.backendCartItemId,
					quantity,
				});
			}
		},
		[state.items, removeFromBackend, updateBackendQty],
	);

	const clearCart = useCallback(() => {
		dispatch({ type: "CLEAR" });
		// Clear all items from backend
		for (const item of state.items) {
			if (item.backendCartItemId) {
				removeFromBackend.mutate(item.backendCartItemId);
			}
		}
	}, [state.items, removeFromBackend]);

	const resetCart = useCallback(() => {
		dispatch({ type: "RESET_AFTER_CHECKOUT" });
		localStorage.removeItem(CART_STORAGE_KEY);
		const newId = rotateCartSession();
		setSessionId(newId);
	}, []);

	const openCart = useCallback(() => dispatch({ type: "OPEN" }), []);
	const closeCart = useCallback(() => dispatch({ type: "CLOSE" }), []);

	return (
		<CartContext.Provider
			value={{
				items: state.items,
				isOpen: state.isOpen,
				itemCount,
				subtotal,
				sessionId,
				addItem,
				removeItem,
				setQty,
				clearCart,
				resetCart,
				openCart,
				closeCart,
			}}
		>
			{children}
		</CartContext.Provider>
	);
}

// ─── Hook ────────────────────────────────────────────────

export function useCart(): CartContextValue {
	const ctx = useContext(CartContext);
	if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
	return ctx;
}
