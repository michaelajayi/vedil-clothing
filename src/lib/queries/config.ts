import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiCompanyProfile, ApiSiteConfig } from "@/types/api";

// ─── Company Profile ─────────────────────────────────────

export const companyProfileOptions = () =>
	queryOptions({
		queryKey: ["company-profile"],
		queryFn: () => api.get<ApiCompanyProfile>("/api/company-profile"),
		staleTime: 5 * 60 * 1000, // 5 min — rarely changes
	});

export function useCompanyProfile() {
	return useQuery(companyProfileOptions());
}

// ─── Site Config ─────────────────────────────────────────

export const siteConfigOptions = () =>
	queryOptions({
		queryKey: ["site-config"],
		queryFn: () => api.get<ApiSiteConfig>("/api/config/public"),
		staleTime: 5 * 60 * 1000,
	});

export function useSiteConfig() {
	return useQuery(siteConfigOptions());
}
