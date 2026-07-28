/* ─── Runway Data Model ────────────────────────────────────────
 *
 * Data structure:
 *   Events (chronological) → Collections → Media items
 *
 * Owner: add new events, collections, and media URLs below.
 *   - Upload images/videos to Cloudinary
 *   - Paste the raw Cloudinary URLs into the media array
 *   - For large videos, compress first (ffmpeg) then upload
 *
 * ─── Types ───────────────────────────────────────────────── */

export interface RunwayMedia {
	type: "image" | "video";
	url: string;
	alt: string;
	poster?: string;
	/**
	 * CSS aspect-ratio value, e.g. "3/4", "16/9", "1/1".
	 * Use when the file metadata is incorrect (e.g. a landscape
	 * video that reports as portrait).
	 */
	aspectRatio?: string;
}

export interface RunwayCollection {
	id: string;
	name: string;
	/** Hero body copy shown when this collection is selected */
	description: string;
	media: RunwayMedia[];
}

export interface RunwayEvent {
	id: string;
	name: string;
	/** Line below the event name, e.g. "Africa Fashion Week Nigeria" */
	subtitle: string;
	year: number;
	collections: RunwayCollection[];
}

/* ─── Data ──────────────────────────────────────────────────── *
 *
 * Newest first. Each event appears as a full section on /runway.
 * ──────────────────────────────────────────────────────────── */

export const runwayEvents: RunwayEvent[] = [
	/* ══════════════════════════════════════════════════════════
	   Epic Fashion Week 2026 · Africa Fashion Week Nigeria
	   ══════════════════════════════════════════════════════════ */
	{
		id: "epic-2026",
		name: "Epic Fashion Week 2026",
		subtitle: "Africa Fashion Week Nigeria",
		year: 2026,
		collections: [
			{
				id: "imperial-softness",
				name: "Imperial Softness",
				description: [
					"Woman — a blend of softness and power. VEDIL explores this delicate duality through luxury evening and cocktail dresses.",
					"VEDIL isn't just fashion; it's a celebration of the complex beautiful essence of being a woman. Each masterpiece captures the pure innocence of the girl, the radiant beauty of the lady and the unyielding strength of the grown woman.",
					"It's simply our journey and we celebrate it.",
					"My collection for the Epic Fashion Week 2026; is a nature themed collection that features timeless, natural silhouette. The choice of fabric is intentional to give soft, fairylike appearance.",
				].join("\n\n"),
				media: [
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
				],
			},
			{
				id: "coll-two-2026",
				name: "Collection Two",
				description: "Media coming soon.",
				media: [],
			},
			{
				id: "coll-three-2026",
				name: "Collection Three",
				description: "Media coming soon.",
				media: [],
			},
		],
	},

	/* ══════════════════════════════════════════════════════════
	   Epic Fashion Show 2019
	   ══════════════════════════════════════════════════════════ */
	{
		id: "epic-2019",
		name: "Epic Fashion Show 2019",
		subtitle: "",
		year: 2019,
		collections: [
			{
				id: "coming-soon-2019",
				name: "Coming Soon",
				description: "Media from this event will be added soon.",
				media: [],
			},
		],
	},

	/* ══════════════════════════════════════════════════════════
	   AFWN 2018 · Africa Fashion Week Nigeria
	   ══════════════════════════════════════════════════════════ */
	{
		id: "afwn-2018",
		name: "AFWN 2018",
		subtitle: "Africa Fashion Week Nigeria",
		year: 2018,
		collections: [
			{
				id: "coming-soon-2018",
				name: "Coming Soon",
				description: "Media from this event will be added soon.",
				media: [],
			},
		],
	},
];

/* ─── Helpers ──────────────────────────────────────────────── */

/** Get all media items across all collections for an event */
export function getAllEventMedia(event: RunwayEvent): RunwayMedia[] {
	return event.collections.flatMap((c) => c.media);
}

/** Get the latest event (highest year, first in array) */
export function getLatestEvent(): RunwayEvent {
	return runwayEvents[0];
}
