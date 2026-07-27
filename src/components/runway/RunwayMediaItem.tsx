"use client";

import { useRef, useCallback } from "react";
import { Play } from "lucide-react";
import type { RunwayMedia } from "@/data/runway";

/* ─── Props ─────────────────────────────────────────────────── */
interface RunwayMediaItemProps {
	item: RunwayMedia;
	/** 0-based index for the lightbox */
	index: number;
	onClick: (index: number) => void;
}

/* ─── Component ─────────────────────────────────────────────── */
export default function RunwayMediaItem({
	item,
	index,
	onClick,
}: RunwayMediaItemProps) {
	const videoRef = useRef<HTMLVideoElement>(null);

	const handleMouseEnter = useCallback(() => {
		if (item.type === "video" && videoRef.current) {
			videoRef.current.play().catch(() => {
				/* autoplay blocked — ignore */
			});
		}
	}, [item.type]);

	const handleMouseLeave = useCallback(() => {
		if (item.type === "video" && videoRef.current) {
			videoRef.current.pause();
			videoRef.current.currentTime = 0;
		}
	}, [item.type]);

	const handleClick = useCallback(() => {
		onClick(index);
	}, [onClick, index]);

	return (
		<div
			className="runway-masonry-item"
			role="button"
			tabIndex={0}
			aria-label={`View ${item.alt}`}
			onClick={handleClick}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					handleClick();
				}
			}}
		>
			{item.type === "image" ? (
				<img
					src={item.url}
					alt={item.alt}
					loading="lazy"
					draggable={false}
					style={{ aspectRatio: item.aspectRatio ?? undefined }}
					data-ratio={item.aspectRatio ? "fixed" : undefined}
				/>
			) : (
				<video
					ref={videoRef}
					src={item.url}
					muted
					playsInline
					preload="metadata"
					aria-label={item.alt}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					style={{ aspectRatio: item.aspectRatio ?? undefined }}
				/>
			)}

			{/* Play icon overlay for videos */}
			{item.type === "video" && (
				<div className="runway-play-btn" aria-hidden>
					<Play strokeWidth={1.5} fill="currentColor" />
				</div>
			)}
		</div>
	);
}
