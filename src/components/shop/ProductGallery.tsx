"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";

export interface GalleryImage {
	id: string;
	url: string;
	altText: string | null;
	isPrimary: boolean;
	width: number | null;
	height: number | null;
}

/**
 * Product image gallery with Embla carousel + synced thumbnails.
 * Falls back to rendering children (placeholder content) when no images exist.
 */
export default function ProductGallery({
	images,
	fallback,
}: {
	images: GalleryImage[];
	fallback?: ReactNode;
}) {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [emblaRef, emblaApi] = useEmblaCarousel({
		loop: images.length > 1,
	});

	// Subscribe to Embla slide changes — the initial render already has
	// selectedIndex === 0 which matches the first (starting) slide.
	const onSelect = useCallback(() => {
		if (!emblaApi) return;
		setSelectedIndex(emblaApi.selectedScrollSnap());
	}, [emblaApi]);

	useEffect(() => {
		if (!emblaApi) return;

		emblaApi.on("select", onSelect);
		emblaApi.on("reInit", onSelect);
		return () => {
			emblaApi.off("select", onSelect);
			emblaApi.off("reInit", onSelect);
		};
	}, [emblaApi, onSelect]);

	// ─── Placeholder fallback ───────────────────────────
	if (!images.length) {
		return <>{fallback ?? null}</>;
	}

	return (
		<div className="pdp-gallery">
			{/* ── Main carousel with arrow buttons ───────────── */}
			<div className="pdp-gallery-main">
				{images.length > 1 && (
					<button
						type="button"
						className="pdp-gallery-arrow pdp-gallery-arrow--prev"
						onClick={() => emblaApi?.scrollPrev()}
						aria-label="Previous image"
					>
						<ChevronLeft size={22} strokeWidth={2.5} />
					</button>
				)}

				<div className="pdp-gallery-viewport" ref={emblaRef}>
					<div className="pdp-gallery-container">
						{images.map((img) => (
							<div key={img.id} className="pdp-gallery-slide">
								{img.width && img.height ? (
									<Image
										src={img.url}
										alt={img.altText ?? "Product image"}
										width={img.width}
										height={img.height}
										sizes="(max-width: 768px) 100vw, min(55vw, 600px)"
										className="pdp-gallery-img"
										priority={img.isPrimary}
									/>
								) : (
									<img
										src={img.url}
										alt={img.altText ?? "Product image"}
										className="pdp-gallery-img"
										loading={img.isPrimary ? "eager" : "lazy"}
									/>
								)}
							</div>
						))}
					</div>
				</div>

				{images.length > 1 && (
					<button
						type="button"
						className="pdp-gallery-arrow pdp-gallery-arrow--next"
						onClick={() => emblaApi?.scrollNext()}
						aria-label="Next image"
					>
						<ChevronRight size={22} strokeWidth={2.5} />
					</button>
				)}
			</div>

			{/* ── Thumbnails ─────────────────────────────────── */}
			{images.length > 1 && (
				<div
					className="pdp-gallery-thumbs"
					role="tablist"
					aria-label="Product images"
				>
					{images.map((img, i) => (
						<button
							key={img.id}
							type="button"
							role="tab"
							aria-selected={i === selectedIndex}
							aria-label={`View image ${i + 1}`}
							className={`pdp-gallery-thumb${i === selectedIndex ? " is-active" : ""}`}
							onClick={() => emblaApi?.scrollTo(i)}
						>
							{img.width && img.height ? (
								<Image
									src={img.url}
									alt=""
									width={80}
									height={80}
									className="pdp-gallery-thumb-img"
								/>
							) : (
								<img src={img.url} alt="" className="pdp-gallery-thumb-img" />
							)}
						</button>
					))}
				</div>
			)}

			{/* ── Dot indicators (mobile-friendly) ───────────── */}
			{images.length > 1 && (
				<div className="pdp-gallery-dots" aria-hidden="true">
					{images.map((_, i) => (
						<span
							key={i}
							className={`pdp-gallery-dot${i === selectedIndex ? " is-active" : ""}`}
						/>
					))}
				</div>
			)}
		</div>
	);
}
