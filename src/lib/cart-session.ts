// ─────────────────────────────────────────────────────────
// Cart Session ID — persisted in localStorage
// Used as the cartSessionId param for all backend cart API
// calls. The backend uses getOrCreateCart(sessionId), so
// any UUID will auto-create a cart on first use.
// ─────────────────────────────────────────────────────────

const STORAGE_KEY = "vedil_cart_session";

function generateUUID(): string {
	// crypto.randomUUID() is available in all modern browsers
	if (typeof crypto !== "undefined" && crypto.randomUUID) {
		return crypto.randomUUID();
	}
	// Fallback for older environments
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

export function getCartSessionId(): string {
	if (typeof window === "undefined") return "";

	let sessionId = localStorage.getItem(STORAGE_KEY);
	if (!sessionId) {
		sessionId = generateUUID();
		localStorage.setItem(STORAGE_KEY, sessionId);
	}
	return sessionId;
}

/**
 * Generate and persist a new session ID, replacing the current one.
 * Use after a successful checkout so the next cart starts fresh
 * instead of re-seeding from the completed order's cart.
 */
export function rotateCartSession(): string {
	const newId = generateUUID();
	localStorage.setItem(STORAGE_KEY, newId);
	return newId;
}
