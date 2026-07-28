"use client";

import { useState, useCallback } from "react";
import type { RunwayEvent } from "@/data/runway";
import RunwayGallery from "./RunwayGrid";
import RunwayLightbox from "./RunwayLightbox";

/* ─── Props ─────────────────────────────────────────────────── */
interface RunwayEventSectionProps {
	event: RunwayEvent;
	registerSection: (id: string, el: HTMLElement | null) => void;
}

/* ─── Component ─────────────────────────────────────────────── */
export default function RunwayEventSection({
	event,
	registerSection,
}: RunwayEventSectionProps) {
	/* ── Collection tab state ─────────────────────────────── */
	const [activeCollection, setActiveCollection] = useState(
		event.collections[0]?.id ?? "",
	);
	const currentCollection = event.collections.find(
		(c) => c.id === activeCollection,
	);

	/* ── Lightbox state ───────────────────────────────────── */
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

	const openLightbox = useCallback((index: number) => {
		setLightboxIndex(index);
	}, []);

	const closeLightbox = useCallback(() => {
		setLightboxIndex(null);
	}, []);

	const navigateLightbox = useCallback((index: number) => {
		setLightboxIndex(index);
	}, []);

	/* ── Render ───────────────────────────────────────────── */
	const hasMultipleCollections = event.collections.length > 1;
	const description = currentCollection?.description ?? "";
	const descriptionParagraphs = description.split("\n\n");
	const hasMedia = currentCollection && currentCollection.media.length > 0;

	return (
		<section
			id={event.id}
			className="runway-event-section"
			ref={(el) => registerSection(event.id, el)}
			data-event-id={event.id}
		>
			<div className="wrap">
				{/* ── Event header ── */}
				<div className="runway-event-header reveal">
					<span className="runway-event-year">{event.year}</span>
					<h2 className="runway-event-name">{event.name}</h2>
					{event.subtitle && (
						<span className="runway-event-subtitle">{event.subtitle}</span>
					)}
				</div>

				{/* ── Collection tabs ── */}
				{hasMultipleCollections && (
					<div className="runway-collection-tabs reveal" role="tablist">
						{event.collections.map((collection) => (
							<button
								key={collection.id}
								role="tab"
								className={`runway-collection-tab${activeCollection === collection.id ? " active" : ""}`}
								aria-selected={activeCollection === collection.id}
								onClick={() => setActiveCollection(collection.id)}
							>
								{collection.name}
							</button>
						))}
					</div>
				)}

				{/* ── Collection hero ── */}
				{currentCollection && (
					<div className="runway-collection-hero reveal">
						<h3 className="runway-collection-name">{currentCollection.name}</h3>
						{descriptionParagraphs.length > 1 ? (
							<div className="runway-collection-desc">
								{descriptionParagraphs.map((para, i) => (
									<p key={i}>{para}</p>
								))}
							</div>
						) : (
							<p className="runway-collection-desc">{description}</p>
						)}
					</div>
				)}

				{/* ── Gallery or placeholder ── */}
				{hasMedia ? (
					<RunwayGallery
						items={currentCollection!.media}
						onItemClick={openLightbox}
					/>
				) : (
					<div className="runway-empty-collection reveal">
						<p>Media coming soon.</p>
					</div>
				)}
			</div>

			{/* ── Lightbox ── */}
			{hasMedia && (
				<RunwayLightbox
					items={currentCollection!.media}
					currentIndex={lightboxIndex}
					onClose={closeLightbox}
					onNavigate={navigateLightbox}
				/>
			)}
		</section>
	);
}
