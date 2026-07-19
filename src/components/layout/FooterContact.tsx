"use client";

import { MapPin, Phone, Mail } from "lucide-react";
import { WhatsappIcon } from "@/components/ui/BrandIcons";
import { useCompanyProfile } from "@/lib/queries/config";

function FooterContactSkeleton() {
	return (
		<div>
			{[1, 2, 3, 4].map((i) => (
				<div
					key={i}
					className="skeleton-pulse"
					style={{
						height: "0.8rem",
						width: i === 4 ? "13rem" : "9rem",
						borderRadius: "4px",
						marginBottom: "0.5rem",
					}}
				/>
			))}
		</div>
	);
}

export default function FooterContact() {
	const { data, isLoading, isError } = useCompanyProfile();

	if (isLoading) return <FooterContactSkeleton />;
	if (isError || !data) {
		return (
			<div>
				<p
					style={{
						color: "var(--ink-soft)",
						fontStyle: "italic",
						fontSize: "0.85rem",
					}}
				>
					Contact details loading…
				</p>
			</div>
		);
	}

	return (
		<div className="foot-contact-list">
			{data.addressLine && (
				<a
					href={`https://maps.google.com/?q=${encodeURIComponent(data.addressLine + ", " + data.city + ", " + data.state)}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<MapPin strokeWidth={1.7} />
					{data.addressLine}, {data.city}
				</a>
			)}
			{data.phone && (
				<a href={`tel:${data.phone}`}>
					<Phone strokeWidth={1.7} />
					{data.phone}
				</a>
			)}
			{data.email && (
				<a href={`mailto:${data.email}`}>
					<Mail strokeWidth={1.7} />
					{data.email}
				</a>
			)}
			{data.whatsapp && (
				<a
					href={`https://wa.me/${data.whatsapp.replace(/[^\d]/g, "")}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<WhatsappIcon />
					Chat on WhatsApp
				</a>
			)}
		</div>
	);
}
