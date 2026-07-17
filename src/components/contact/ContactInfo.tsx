"use client";

import { MapPin, Phone, Mail, AlertCircle, RefreshCw } from "lucide-react";
import { WhatsappIcon } from "@/components/ui/BrandIcons";
import { useCompanyProfile } from "@/lib/queries/config";

function InfoSkeleton() {
	return (
		<div className="contact-info-list">
			{["address", "phone", "email", "whatsapp"].map((key) => (
				<div key={key} className="contact-info-item">
					<div className="contact-info-icon skeleton-pulse" />
					<div style={{ flex: 1 }}>
						<div
							className="skeleton-pulse"
							style={{
								height: "0.9rem",
								width: "5rem",
								borderRadius: "4px",
								marginBottom: "0.5rem",
							}}
						/>
						<div
							className="skeleton-pulse"
							style={{
								height: "0.8rem",
								width: "12rem",
								borderRadius: "4px",
							}}
						/>
					</div>
				</div>
			))}
		</div>
	);
}

function InfoError({ onRetry }: { onRetry: () => void }) {
	return (
		<div className="contact-info-list">
			<div
				className="contact-info-item"
				style={{ borderColor: "var(--red-200, #fecaca)" }}
			>
				<div
					className="contact-info-icon"
					style={{
						background: "rgba(239,68,68,.08)",
						borderColor: "rgba(239,68,68,.18)",
						color: "#dc2626",
					}}
				>
					<AlertCircle strokeWidth={1.5} />
				</div>
				<div>
					<h4>Could not load contact info</h4>
					<p style={{ color: "var(--ink-soft)", fontSize: "0.9rem" }}>
						Please try again, or reach out on WhatsApp.
					</p>
					<button
						type="button"
						onClick={onRetry}
						style={{
							marginTop: "0.75rem",
							display: "inline-flex",
							alignItems: "center",
							gap: "0.4rem",
							fontSize: "0.85rem",
							fontWeight: 600,
							color: "var(--ink)",
							background: "none",
							border: "1px solid var(--border)",
							borderRadius: "6px",
							padding: "0.4rem 1rem",
							cursor: "pointer",
						}}
					>
						<RefreshCw size={14} strokeWidth={2} />
						Retry
					</button>
				</div>
			</div>
		</div>
	);
}

export default function ContactInfo() {
	const { data, isLoading, isError, refetch } = useCompanyProfile();

	if (isLoading) return <InfoSkeleton />;
	if (isError) return <InfoError onRetry={() => refetch()} />;

	return (
		<div className="contact-info-list">
			{/* Address */}
			<div className="contact-info-item">
				<div className="contact-info-icon">
					<MapPin strokeWidth={1.5} />
				</div>
				<div>
					<h4>Visit us</h4>
					<p style={{ color: "var(--ink-soft)", fontStyle: "italic" }}>
						{data?.addressLine
							? `${data.addressLine}, ${data.city}`
							: "Lagos, Nigeria"}
					</p>
				</div>
			</div>

			{/* Phone */}
			<div className="contact-info-item">
				<div className="contact-info-icon">
					<Phone strokeWidth={1.5} />
				</div>
				<div>
					<h4>Call us</h4>
					<p style={{ color: "var(--ink-soft)", fontStyle: "italic" }}>
						{data?.phone ?? "Loading phone…"}
					</p>
				</div>
			</div>

			{/* Email */}
			<div className="contact-info-item">
				<div className="contact-info-icon">
					<Mail strokeWidth={1.5} />
				</div>
				<div>
					<h4>Email us</h4>
					<p style={{ color: "var(--ink-soft)", fontStyle: "italic" }}>
						{data?.email ?? "Loading email…"}
					</p>
				</div>
			</div>

			{/* WhatsApp */}
			<div className="contact-info-item">
				<div
					className="contact-info-icon"
					style={{
						background: "rgba(37,211,102,.08)",
						borderColor: "rgba(37,211,102,.18)",
						color: "#1a9e47",
					}}
				>
					<WhatsappIcon filled={false} />
				</div>
				<div>
					<h4>WhatsApp</h4>
					<p style={{ color: "var(--ink-soft)", fontStyle: "italic" }}>
						{data?.whatsapp ?? "Loading WhatsApp…"}
					</p>
				</div>
			</div>
		</div>
	);
}
