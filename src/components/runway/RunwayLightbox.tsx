"use client";

import { useEffect, useCallback, useRef } from "react";
import {
	X,
	ChevronLeft,
	ChevronRight,
	Maximize2,
	Minimize2,
} from "lucide-react";
import type { RunwayMedia } from "@/data/runway";

/* ─── Props ─────────────────────────────────────────────────── */
interface RunwayLightboxProps {
	items: RunwayMedia[];
	/** Currently displayed index, or null when closed */
	currentIndex: number | null;
	onClose: () => void;
	onNavigate: (index: number) => void;
}

/* ─── Component ─────────────────────────────────────────────── */
export default function RunwayLightbox({
	items,
	currentIndex,
	onClose,
	onNavigate,
}: RunwayLightboxProps) {
	const isOpen = currentIndex !== null;
	const videoRef = useRef<HTMLVideoElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const isFullscreenRef = useRef(false);

	/* ── Keyboard navigation ──────────────────────────────── */
	useEffect(() => {
		if (!isOpen) return;

		const handleKey = (e: KeyboardEvent) => {
			switch (e.key) {
				case "Escape":
					onClose();
					break;
				case "ArrowLeft":
					if (currentIndex !== null) {
						onNavigate((currentIndex - 1 + items.length) % items.length);
					}
					break;
				case "ArrowRight":
					if (currentIndex !== null) {
						onNavigate((currentIndex + 1) % items.length);
					}
					break;
			}
		};

		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [isOpen, currentIndex, items.length, onClose, onNavigate]);

	/* ── Lock body scroll ─────────────────────────────────── */
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	/* ── Play/pause video when navigating ─────────────────── */
	useEffect(() => {
		if (!isOpen || currentIndex === null) return;

		const item = items[currentIndex];
		if (item.type === "video" && videoRef.current) {
			videoRef.current.play().catch(() => {
				/* autoplay blocked — ignore */
			});
		}
	}, [isOpen, currentIndex, items]);

	/* ── Backdrop click ───────────────────────────────────── */
	const handleBackdrop = useCallback(
		(e: React.MouseEvent) => {
			if (e.target === containerRef.current) {
				onClose();
			}
		},
		[onClose],
	);

	/* ── Fullscreen toggle ────────────────────────────────── */
	const toggleFullscreen = useCallback(async () => {
		if (!containerRef.current) return;

		try {
			if (!document.fullscreenElement) {
				await containerRef.current.requestFullscreen();
				isFullscreenRef.current = true;
			} else {
				await document.exitFullscreen();
				isFullscreenRef.current = false;
			}
		} catch {
			/* Fullscreen API not available — ignore */
		}
	}, []);

	/* ── Render ────────────────────────────────────────────── */
	if (!isOpen || currentIndex === null) return null;

	const item = items[currentIndex];
	const isVideo = item.type === "video";

	return (
		<div
			className={`runway-lightbox${isOpen ? " open" : ""}`}
			ref={containerRef}
			onClick={handleBackdrop}
			role="dialog"
			aria-modal="true"
			aria-label={`Media ${currentIndex + 1} of ${items.length}`}
		>
			{/* Wrapper */}
			<div className="runway-lightbox-wrapper">
				{/* Close */}
				<button
					className="runway-lightbox-close"
					onClick={onClose}
					aria-label="Close lightbox"
				>
					<X strokeWidth={1.7} />
				</button>

				{/* Previous */}
				{items.length > 1 && (
					<button
						className="runway-lightbox-nav runway-lightbox-nav--prev"
						onClick={() =>
							onNavigate((currentIndex - 1 + items.length) % items.length)
						}
						aria-label="Previous"
					>
						<ChevronLeft strokeWidth={1.7} />
					</button>
				)}

				{/* Media */}
				<div className="runway-lightbox-media">
					{isVideo ? (
						<video
							ref={videoRef}
							src={item.url}
							poster={item.poster}
							controls
							playsInline
							aria-label={item.alt}
						/>
					) : (
						<img src={item.url} alt={item.alt} draggable={false} />
					)}
				</div>

				{/* Next */}
				{items.length > 1 && (
					<button
						className="runway-lightbox-nav runway-lightbox-nav--next"
						onClick={() => onNavigate((currentIndex + 1) % items.length)}
						aria-label="Next"
					>
						<ChevronRight strokeWidth={1.7} />
					</button>
				)}

				{/* Counter */}
				{items.length > 1 && (
					<span className="runway-lightbox-counter" aria-live="polite">
						{currentIndex + 1} / {items.length}
					</span>
				)}

				{/* Fullscreen */}
				<button
					className="runway-lightbox-fs"
					onClick={toggleFullscreen}
					aria-label={
						document.fullscreenElement ? "Exit fullscreen" : "Fullscreen"
					}
				>
					{document.fullscreenElement ? (
						<Minimize2 strokeWidth={1.7} />
					) : (
						<Maximize2 strokeWidth={1.7} />
					)}
				</button>
			</div>
		</div>
	);
}
