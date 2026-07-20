"use client";

import type { ReactNode } from "react";

/* ─── Props ─────────────────────────────────────────────────── */
export interface ImageMediaProps {
	/** Cloudinary (or any) image URL */
	src: string;
	/** Descriptive text → aria-label */
	alt: string;
	/** Optional aspect-ratio override, e.g. "16/10" */
	aspectRatio?: string;
	/** background-position override, default "center" */
	objectPosition?: string;
	/** Additional classes (e.g. "reveal", "about-photo-main") */
	className?: string;
	/** Shorthand for adding the `reveal` scroll-animation class */
	reveal?: boolean;
	/** Disable the hover scale+glow effect (default: true) */
	hoverable?: boolean;
	/** Children rendered inside the wrapper */
	children?: ReactNode;
}

/* ─── Component ─────────────────────────────────────────────── */
export default function ImageMedia({
	src,
	alt,
	aspectRatio,
	objectPosition = "center",
	className,
	reveal: doReveal,
	hoverable = true,
	children,
}: ImageMediaProps) {
	const classes = [
		"ph",
		"img-media",
		hoverable && "img-media--hover",
		doReveal && "reveal",
		className,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<div
			className={classes}
			style={{
				backgroundImage: `url(${src})`,
				backgroundPosition: objectPosition,
				aspectRatio: aspectRatio ?? undefined,
			}}
			aria-label={alt}
			role="img"
		>
			{children}
		</div>
	);
}