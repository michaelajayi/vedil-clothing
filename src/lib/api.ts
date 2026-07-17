// ─────────────────────────────────────────────────────────
// Base API client for Vedil Clothing backend
// ─────────────────────────────────────────────────────────
// Usage: import { api } from "@/lib/api";
//        const products = await api.get("/api/products");
//        const product = await api.get(`/api/products/${slug}`);
//        const result = await api.post("/api/checkout/initiate", body);
// ─────────────────────────────────────────────────────────

const BASE_URL =
	(process.env.NEXT_PUBLIC_API_URL as string | undefined) ??
	"http://localhost:4000";

// Re-export so consumers can use it if they need the raw value
export { BASE_URL };

// ─── Error types ─────────────────────────────────────────

export class ApiError extends Error {
	status: number;
	body: unknown;

	constructor(status: number, body: unknown) {
		super(`API error ${status}`);
		this.name = "ApiError";
		this.status = status;
		this.body = body;
	}

	/**
	 * Extract a human-readable message string from a NestJS error response body.
	 * NestJS ValidationPipe returns: { message: string | string[], error: string, statusCode: number }
	 * Falls back to the generic HTTP status message if nothing useful is in the body.
	 */
	readableMessage(): string {
		if (!this.body || typeof this.body !== "object") return this.message;
		const body = this.body as Record<string, unknown>;
		const msg = body.message;
		if (typeof msg === "string") return msg;
		if (Array.isArray(msg) && msg.length > 0)
			return msg.filter((m) => typeof m === "string").join(". ");
		if (typeof body.error === "string") return body.error;
		return this.message;
	}
}

// ─── Request helpers ─────────────────────────────────────

interface RequestOptions {
	/** Admin API key (X-Admin-Key header) */
	adminKey?: string;
	/** Additional headers to merge */
	headers?: Record<string, string>;
	/** AbortSignal for cancellation */
	signal?: AbortSignal;
	/** Override cache strategy (default: no-store for mutations, undefined for GETs) */
	cache?: RequestCache;
}

async function request<T>(
	method: string,
	path: string,
	body?: unknown,
	options?: RequestOptions,
): Promise<T> {
	const url = `${BASE_URL}${path}`;

	const headers: Record<string, string> = {
		...(options?.headers ?? {}),
	};

	// Admin auth
	if (options?.adminKey) {
		headers["X-Admin-Key"] = options.adminKey;
	}

	// Default JSON for non-FormData bodies
	if (body !== undefined && !(body instanceof FormData)) {
		headers["Content-Type"] = "application/json";
	}

	const res = await fetch(url, {
		method,
		headers,
		body:
			body instanceof FormData
				? body
				: body !== undefined
					? JSON.stringify(body)
					: undefined,
		signal: options?.signal,
		cache: options?.cache,
	});

	if (!res.ok) {
		let errorBody: unknown;
		try {
			errorBody = await res.json();
		} catch {
			errorBody = await res.text().catch(() => null);
		}
		throw new ApiError(res.status, errorBody);
	}

	// 204 No Content
	if (res.status === 204) return undefined as T;

	return res.json() as Promise<T>;
}

// ─── Public API ──────────────────────────────────────────

export const api = {
	get<T>(path: string, options?: RequestOptions): Promise<T> {
		return request<T>("GET", path, undefined, options);
	},

	post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
		return request<T>("POST", path, body, options);
	},

	patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
		return request<T>("PATCH", path, body, options);
	},

	put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
		return request<T>("PUT", path, body, options);
	},

	delete<T>(path: string, options?: RequestOptions): Promise<T> {
		return request<T>("DELETE", path, undefined, options);
	},

	/** Upload multipart form data (POST) */
	upload<T>(
		path: string,
		formData: FormData,
		options?: RequestOptions,
	): Promise<T> {
		return request<T>("POST", path, formData, options);
	},
};
