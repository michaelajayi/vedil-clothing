// ─────────────────────────────────────────────────────────
// Course Mapper — transforms API course items into shapes
// the academy page component can render.
// ─────────────────────────────────────────────────────────

import type { ApiCourseListItem } from "@/types/api";

export interface FeeBreakdownItem {
	label: string;
	amount: number;
	formatted: string;
}

export interface CourseDisplay {
	id: string;
	slug: string;
	title: string;
	description: string | null;
	duration: string;
	format: string;
	/** Label for display: "LIVE" → "In-person", "SELF_PACED" → "Online" */
	formatLabel: string;
	/** Total fee in Naira — sum of fee breakdown */
	tuition: number;
	/** Total fee as formatted Naira string */
	tuitionFormatted: string;
	/** Itemised fee breakdown from the API */
	feeBreakdown: FeeBreakdownItem[];
	instructorName: string;
	phColor: string;
	variantId: string;
	/** URL of the primary (or first) course image, if any */
	image: string | null;
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
 * Pricing: the API returns a feeBreakdown array on courseProfile
 * (each item in kobo). We sum these for the total, and also derive
 * the total from the default variant's first price tier as a fallback
 * when no fee breakdown is available.
 */
export function mapApiCourse(
	api: ApiCourseListItem,
	index: number,
): CourseDisplay {
	const defaultVariant =
		api.variants.find((v) => v.isDefault) ?? api.variants[0];
	const priceTiers = defaultVariant?.priceTiers ?? [];

	const deliveryMode = api.courseProfile?.deliveryMode ?? "SELF_PACED";
	const duration = api.courseProfile?.durationText ?? "TBD";

	// ── Fee breakdown from API ──
	const rawBreakdown = api.courseProfile?.feeBreakdown ?? [];
	const feeBreakdown: FeeBreakdownItem[] = rawBreakdown.map((item) => ({
		label: item.label,
		amount: item.amount / 100,
		formatted: `₦${(item.amount / 100).toLocaleString("en-NG")}`,
	}));

	// ── Total fee ──
	// Prefer fee breakdown sum, fall back to variant price tier.
	const totalNaira =
		feeBreakdown.length > 0
			? feeBreakdown.reduce((sum, item) => sum + item.amount, 0)
			: priceTiers.length > 0
				? priceTiers[0].amount / 100
				: 0;

	const formattedTotal = `₦${totalNaira.toLocaleString("en-NG")}`;

	// ── Image ──
	// Pick the primary image if available, otherwise the first image
	const primaryImage =
		api.images.find((img) => img.isPrimary) ?? api.images[0] ?? null;
	const image = primaryImage?.file?.url ?? null;

	return {
		id: api.id,
		slug: api.slug,
		title: api.name,
		description: api.description,
		duration,
		format: deliveryMode,
		formatLabel: FORMAT_MAP[deliveryMode] ?? deliveryMode,
		tuition: totalNaira,
		tuitionFormatted: formattedTotal,
		feeBreakdown,
		instructorName: api.courseProfile?.instructorName ?? "It's Fun to Sew",
		phColor: PH_COLORS[index % PH_COLORS.length],
		variantId: defaultVariant?.id ?? "",
		image,
	};
}

export function mapApiCourses(list: ApiCourseListItem[]): CourseDisplay[] {
	return list.map(mapApiCourse);
}
