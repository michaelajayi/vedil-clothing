// ─────────────────────────────────────────────────────────
// Course Mapper — transforms API course items into shapes
// the academy page component can render.
// ─────────────────────────────────────────────────────────

import type { ApiCourseListItem } from "@/types/api";

export interface CourseDisplay {
	id: string;
	slug: string;
	title: string;
	description: string | null;
	duration: string;
	format: string;
	/** Label for display: "LIVE" → "In-person", "SELF_PACED" → "Online" */
	formatLabel: string;
	/** Naira — from default variant's first price tier */
	tuition: number;
	/** Full tuition as formatted string (includes the fee breakdown) */
	tuitionFormatted: string;
	registrationFormatted: string;
	certificateFormatted: string;
	instructorName: string;
	phColor: string;
	variantId: string;
}

const FORMAT_MAP: Record<string, string> = {
	LIVE: "In-person",
	SELF_PACED: "Online",
	HYBRID: "Hybrid",
};

const PH_COLORS = [
	"linear-gradient(135deg, #6E1F2A 0%, #4a141a 100%)",
	"linear-gradient(135deg, #B07A3C 0%, #8a5e2e 100%)",
	"linear-gradient(135deg, #2A211B 0%, #4a3a32 100%)",
];

/**
 * Map a single course from the API response to the frontend display type.
 * Pricing: the API uses variant + priceTier model (kobo).
 * We use the single fee (tuition) since the registration/certificate
 * breakdown is deferred per the integration plan.
 */
export function mapApiCourse(
	api: ApiCourseListItem,
	index: number,
): CourseDisplay {
	const defaultVariant =
		api.variants.find((v) => v.isDefault) ?? api.variants[0];
	const priceTiers = defaultVariant?.priceTiers ?? [];
	const tuitionKobo = priceTiers.length > 0 ? priceTiers[0].amount : 0;
	const tuitionNaira = tuitionKobo / 100;

	const deliveryMode = api.courseProfile?.deliveryMode ?? "SELF_PACED";
	const duration = api.courseProfile?.durationText ?? "TBD";

	// The integration plan defers registration fee breakdown.
	// For now, the single tuition covers everything.
	const formattedTuition = `₦${tuitionNaira.toLocaleString("en-NG")}`;

	return {
		id: api.id,
		slug: api.slug,
		title: api.name,
		description: api.description,
		duration,
		format: deliveryMode,
		formatLabel: FORMAT_MAP[deliveryMode] ?? deliveryMode,
		tuition: tuitionNaira,
		tuitionFormatted: formattedTuition,
		registrationFormatted: `Included in ${formattedTuition}`,
		certificateFormatted: "Included",
		instructorName: api.courseProfile?.instructorName ?? "Vedil Academy",
		phColor: PH_COLORS[index % PH_COLORS.length],
		variantId: defaultVariant?.id ?? "",
	};
}

export function mapApiCourses(list: ApiCourseListItem[]): CourseDisplay[] {
	return list.map(mapApiCourse);
}
