import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
	CreateContactInquiryPayload,
	ContactInquiryResponse,
	CreateFactoryInquiryPayload,
	FactoryInquiryResponse,
} from "@/types/api";

// ─── Contact Inquiries ───────────────────────────────────

export function useSubmitContact() {
	return useMutation({
		mutationFn: (payload: CreateContactInquiryPayload) =>
			api.post<ContactInquiryResponse>("/api/contact-inquiries", payload),
	});
}

// ─── Factory Inquiries ───────────────────────────────────

export function useSubmitFactoryInquiry() {
	return useMutation({
		mutationFn: (payload: CreateFactoryInquiryPayload) => {
			const formData = new FormData();
			formData.append("name", payload.name);
			formData.append("phone", payload.phone);
			formData.append("email", payload.email);
			formData.append("service", payload.service);
			formData.append("details", payload.details);
			if (payload.files) {
				for (const file of payload.files) {
					formData.append("files", file);
				}
			}
			return api.upload<FactoryInquiryResponse>(
				"/api/factory-inquiries",
				formData,
			);
		},
	});
}
