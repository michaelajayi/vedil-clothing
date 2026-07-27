/* ─── Runway Media ─────────────────────────────────────────────
 * Owner: paste new Cloudinary URLs into the runwayMedia array.
 *   type: "image" | "video"
 *   url:  raw Cloudinary or image URL
 *   alt:  descriptive text
 *   poster: optional video thumbnail (Cloudinary image URL)
 *   aspectRatio: optional CSS aspect-ratio override
 *     — Use when file metadata is wrong (e.g. landscape video reports as portrait)
 *     — Omit for images — the browser will use the image's intrinsic dimensions
 */

export interface RunwayMedia {
	type: "image" | "video";
	url: string;
	alt: string;
	poster?: string;
	/**
	 * CSS aspect-ratio value, e.g. "3/4", "16/9", "1/1".
	 * When omitted, the browser uses the media's intrinsic dimensions.
	 * Set this when the file metadata is wrong (e.g. a landscape video
	 * that reports as portrait).
	 */
	aspectRatio?: string;
}

export const runwayMedia: RunwayMedia[] = [
	{
		type: "image",
		url: "https://res.cloudinary.com/jqaitieh/image/upload/v1785191409/africa_fashion_week_nigeria_2018_high_quality_sm1qzo.jpg",
		alt: "Africa Fashion Week Nigeria 2018 — runway look",
	},
	{
		type: "video",
		url: "https://res.cloudinary.com/jqaitieh/video/upload/v1785191480/africa_fashion_week_nigeria_2018_low_quality_aikqp3.mp4",
		alt: "Africa Fashion Week Nigeria 2018 — runway walk",
		// Video file reports portrait metadata but content is landscape
		aspectRatio: "16/9",
	},
];
