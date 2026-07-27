"use client";

import type { RunwayMedia } from "@/data/runway";
import RunwayMediaItem from "./RunwayMediaItem";

/* ─── Props ─────────────────────────────────────────────────── */
interface RunwayGalleryProps {
	items: RunwayMedia[];
	onItemClick: (index: number) => void;
}

/* ─── Component ─────────────────────────────────────────────── */
export default function RunwayGallery({
	items,
	onItemClick,
}: RunwayGalleryProps) {
	return (
		<section className="runway-gallery">
			<div className="wrap">
				<div className="runway-masonry">
					{items.map((item, i) => (
						<RunwayMediaItem
							key={`${item.url}-${i}`}
							item={item}
							index={i}
							onClick={onItemClick}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
