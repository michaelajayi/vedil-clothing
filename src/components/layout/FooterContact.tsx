"use client";

import { useCompanyProfile } from "@/lib/queries/config";

function FooterContactSkeleton() {
	return (
		<div>
			{[1, 2, 3].map((i) => (
				<div
					key={i}
					className="skeleton-pulse"
					style={{
						height: "0.8rem",
						width: i === 2 ? "12rem" : "9rem",
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
		<div>
			{data.addressLine && (
				<p style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>
					{data.addressLine}, {data.city}, {data.state}
				</p>
			)}
			{data.phone && (
				<p style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>{data.phone}</p>
			)}
			{data.email && (
				<p style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>{data.email}</p>
			)}
		</div>
	);
}
