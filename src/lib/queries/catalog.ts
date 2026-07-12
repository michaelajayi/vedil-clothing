import { queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
	ApiProductListItem,
	ApiProductDetail,
	ApiCourseListItem,
	ApiCourseDetail,
} from "@/types/api";

// ─── Products (Physical) ─────────────────────────────────

export const productsOptions = (category?: string) =>
	queryOptions({
		queryKey: ["products", "list", category ?? "all"],
		queryFn: () =>
			api.get<ApiProductListItem[]>(
				category ? `/api/products?category=${category}` : "/api/products",
			),
		staleTime: 60 * 1000, // 1 min — products may change
	});

export const productOptions = (slug: string) =>
	queryOptions({
		queryKey: ["products", "detail", slug],
		queryFn: () => api.get<ApiProductDetail>(`/api/products/${slug}`),
		staleTime: 60 * 1000,
	});

// ─── Courses ─────────────────────────────────────────────

export const coursesOptions = () =>
	queryOptions({
		queryKey: ["courses", "list"],
		queryFn: () => api.get<ApiCourseListItem[]>("/api/courses"),
		staleTime: 60 * 1000,
	});

export const courseOptions = (slug: string) =>
	queryOptions({
		queryKey: ["courses", "detail", slug],
		queryFn: () => api.get<ApiCourseDetail>(`/api/courses/${slug}`),
		staleTime: 60 * 1000,
	});
