"use client";

import { useState, useCallback } from "react";
import type { RunwayMedia } from "@/data/runway";
import RunwayGallery from "./RunwayGrid";
import RunwayLightbox from "./RunwayLightbox";

/* ─── Props ─────────────────────────────────────────────────── */
interface RunwayClientProps {
	items: RunwayMedia[];
}

/* ─── Component ─────────────────────────────────────────────── */
export default function RunwayClient({ items }: RunwayClientProps) {
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

	return (
		<>
			<RunwayGallery items={items} onItemClick={openLightbox} />
			<RunwayLightbox
				items={items}
				currentIndex={lightboxIndex}
				onClose={closeLightbox}
				onNavigate={navigateLightbox}
			/>
		</>
	);
}
