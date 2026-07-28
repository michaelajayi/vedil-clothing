"use client";

import { useState, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import type { RunwayEvent, RunwayMedia } from "@/data/runway";
import RunwayMediaItem from "./RunwayMediaItem";
import RunwayLightbox from "./RunwayLightbox";

/* ─── Props ─────────────────────────────────────────────────── */
interface RunwayTemp2Props {
	events: RunwayEvent[];
}

/* ─── Component ─────────────────────────────────────────────── */
export default function RunwayTemp2({ events }: RunwayTemp2Props) {
	/* ── State: card grid vs detail view ──────────────────── */
	const [selectedEvent, setSelectedEvent] = useState<RunwayEvent | null>(null);

	/* ── Lightbox state ───────────────────────────────────── */
	const [lightboxData, setLightboxData] = useState<{
		items: RunwayMedia[];
		index: number;
	} | null>(null);

	const openLightbox = useCallback((items: RunwayMedia[], index: number) => {
		setLightboxData({ items, index });
	}, []);

	const closeLightbox = useCallback(() => {
		setLightboxData(null);
	}, []);

	const navigateLightbox = useCallback((index: number) => {
		setLightboxData((prev) => (prev ? { ...prev, index } : null));
	}, []);

	/* ── Navigation ───────────────────────────────────────── */
	const handleCardClick = useCallback((event: RunwayEvent) => {
		/* Only navigate if the event has media */
		if (event.collections.some((c) => c.media.length > 0)) {
			setSelectedEvent(event);
		}
	}, []);

	const handleBack = useCallback(() => {
		setSelectedEvent(null);
	}, []);

	/* ═══════════════════════════════════════════════════════════
	   DETAIL VIEW
	   ═══════════════════════════════════════════════════════════ */
	if (selectedEvent) {
		const collectionsWithMedia = selectedEvent.collections.filter(
			(c) => c.media.length > 0,
		);
		const hasMedia = collectionsWithMedia.length > 0;

		return (
			<div className="rt2-detail">
				{/* ── Back button (pill badge) ── */}
				<button
					className="rt2-detail-back reveal"
					onClick={handleBack}
					aria-label="Back to all events"
				>
					<ArrowLeft strokeWidth={1.7} />
					All Events
				</button>

				{/* ── Event header ── */}
				<div className="rt2-detail-header reveal">
					<span className="rt2-detail-year">{selectedEvent.year}</span>
					<h2 className="rt2-detail-name">{selectedEvent.name}</h2>
					{selectedEvent.subtitle && (
						<span className="rt2-detail-subtitle">
							{selectedEvent.subtitle}
						</span>
					)}
				</div>

				{/* ── Collections with media ── */}
				{hasMedia
					? collectionsWithMedia.map((collection) => {
							const description = collection.description;
							const descriptionParagraphs = description.split("\n\n");

							return (
								<div key={collection.id} className="rt2-detail-collection">
									<div className="rt2-detail-col-header reveal">
										<h3 className="rt2-detail-col-name">{collection.name}</h3>
										{description && (
											<div className="rt2-detail-col-desc">
												{descriptionParagraphs.length > 1 ? (
													descriptionParagraphs.map((para, i) => (
														<p key={i}>{para}</p>
													))
												) : (
													<p>{description}</p>
												)}
											</div>
										)}
									</div>

									<div className="rt2-gallery-section reveal">
										<span className="rt2-gallery-label">Looks</span>
										<div className="rt2-detail-grid">
											{collection.media.map((item, i) => (
												<RunwayMediaItem
													key={`${item.url}-${i}`}
													item={item}
													index={i}
													onClick={(idx) => openLightbox(collection.media, idx)}
												/>
											))}
										</div>
									</div>
								</div>
							);
						})
					: null}

				{/* ── Lightbox ── */}
				{lightboxData && (
					<RunwayLightbox
						items={lightboxData.items}
						currentIndex={lightboxData.index}
						onClose={closeLightbox}
						onNavigate={navigateLightbox}
					/>
				)}
			</div>
		);
	}

	/* ═══════════════════════════════════════════════════════════
	   CARD GRID VIEW
	   ═══════════════════════════════════════════════════════════ */
	return (
		<div className="rt2-card-grid">
			{events.map((event) => {
				/* First image from the first collection with media */
				const firstMedia = event.collections
					.flatMap((c) => c.media)
					.find((m) => m.type === "image");
				const hasMedia = event.collections.some((c) => c.media.length > 0);

				/* ── Empty card ── */
				if (!hasMedia) {
					return (
						<div key={event.id} className="rt2-card rt2-card--empty reveal">
							<div className="rt2-card-empty-content">
								<div className="rt2-card-empty-icon">✦</div>
								<span className="rt2-card-year">{event.year}</span>
								<span className="rt2-card-name">{event.name}</span>
								<p className="rt2-card-empty-label">Media coming soon</p>
							</div>
						</div>
					);
				}

				/* ── Active card (clickable) ── */
				return (
					<div
						key={event.id}
						className="rt2-card reveal"
						role="button"
						tabIndex={0}
						aria-label={`View ${event.name}`}
						onClick={() => handleCardClick(event)}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								handleCardClick(event);
							}
						}}
					>
						{firstMedia && (
							<img
								src={firstMedia.url}
								alt={firstMedia.alt}
								className="rt2-card-image"
								loading="lazy"
								draggable={false}
							/>
						)}
						<div className="rt2-card-overlay">
							<span className="rt2-card-year">{event.year}</span>
							<span className="rt2-card-name">{event.name}</span>
							{event.subtitle && (
								<span className="rt2-card-subtitle">{event.subtitle}</span>
							)}
							<span className="rt2-card-cta">View Collection</span>
						</div>
					</div>
				);
			})}
		</div>
	);
}
