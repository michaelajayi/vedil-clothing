// ─────────────────────────────────────────────────────────
// Vedil Clothing — Size Charts (single source of truth)
// ─────────────────────────────────────────────────────────
// All size chart content lives here. Edit measurements in this
// file — every consumer (product detail modal, future size-guide
// page) reads from SIZE_CHARTS.
//
// Source: docs/SIZE_CHARTS.md (business-supplied, all values in
// inches). Measurement strings are transcribed verbatim — ranges
// use en-dashes exactly as supplied.
//
// Owner: add/update charts below. Keep rows sorted by size.
// ─────────────────────────────────────────────────────────

export type SizeChartId = "women" | "men" | "men-trousers" | "kiddies";

export interface SizeChartColumn {
	/** Stable identifier, e.g. "bust" */
	key: string;
	/** Column header, e.g. "Bust (in)" */
	label: string;
}

export interface SizeChartRow {
	/** Size label, e.g. "8", "XS", "1" */
	size: string;
	/** One value per column, in the same order as `columns` */
	measurements: string[];
}

export interface MeasureInstruction {
	label: string;
	body: string;
}

export interface SizeChart {
	id: SizeChartId;
	title: string;
	/** Displayed unit, e.g. "inches" */
	unit: string;
	columns: SizeChartColumn[];
	rows: SizeChartRow[];
	instructions: MeasureInstruction[];
	fitNote: string;
	/** Optional path to a per-chart measurement guide image
	 *  (e.g. a diagram showing where to measure on the body). */
	image?: { src: string; width: number; height: number };
}

// Shared fit recommendation — all four charts carry the same note.
const FIT_NOTE =
	"If you are between two sizes, we recommend choosing the larger size for a more comfortable fit.";

export const SIZE_CHARTS: Record<SizeChartId, SizeChart> = {
	// ─── Women's ─────────────────────────────────────────────
	women: {
		id: "women",
		title: "Women's Size Chart",
		unit: "inches",
		image: {
			src: "/size_charts/women_size_chart.jpeg",
			width: 674,
			height: 1134,
		},
		columns: [
			{ key: "bust", label: "Bust (in)" },
			{ key: "waist", label: "Waist (in)" },
			{ key: "hip", label: "Hip (in)" },
		],
		rows: [
			{ size: "8", measurements: ["34", "28", "36"] },
			{ size: "10", measurements: ["36", "30", "38"] },
			{ size: "12", measurements: ["38", "32", "40"] },
			{ size: "14", measurements: ["40", "34", "42"] },
			{ size: "16", measurements: ["42", "36", "44"] },
			{ size: "18", measurements: ["44", "38", "46"] },
			{ size: "20", measurements: ["46", "40", "48"] },
			{ size: "22", measurements: ["48", "42", "50"] },
			{ size: "24", measurements: ["50", "44", "52"] },
			{ size: "26", measurements: ["52", "46", "54"] },
		],
		instructions: [
			{
				label: "Bust",
				body:
					"Measure around the fullest part of your bust, keeping the tape comfortable and level.",
			},
			{
				label: "Waist",
				body:
					"Measure around the natural waistline, which is the smallest part of your waist.",
			},
			{
				label: "Hip",
				body: "Measure around the fullest part of your hips.",
			},
		],
		fitNote: FIT_NOTE,
	},

	// ─── Men's ───────────────────────────────────────────────
	men: {
		id: "men",
		title: "Men's Size Chart",
		unit: "inches",
		image: { src: "/size_charts/men_size_chart.jpeg", width: 648, height: 1118 },
		columns: [
			{ key: "chest", label: "Chest (in)" },
			{ key: "waist", label: "Waist (in)" },
		],
		rows: [
			{ size: "XS", measurements: ["34–35", "28–29.5"] },
			{ size: "S", measurements: ["36–37.5", "30–31.5"] },
			{ size: "M", measurements: ["38–40", "32–34"] },
			{ size: "L", measurements: ["41–44", "35–38"] },
			{ size: "XL", measurements: ["45–48", "39.5–41"] },
			{ size: "2XL", measurements: ["49–52", "41.5–43.5"] },
			{ size: "3XL", measurements: ["53–56", "44–46"] },
			{ size: "4XL", measurements: ["57–60", "46.5–48"] },
			{ size: "5XL", measurements: ["61–64", "48.5–51"] },
			{ size: "6XL", measurements: ["65–67", "52–54"] },
		],
		instructions: [
			{
				label: "Chest",
				body:
					"Measure around the fullest part of your chest, keeping the tape level around your body.",
			},
			{
				label: "Waist",
				body:
					"Measure around your natural waistline, which is the smallest part of your waist.",
			},
		],
		fitNote: FIT_NOTE,
	},

	// ─── Men's Trousers ───────────────────────────────────────
	"men-trousers": {
		id: "men-trousers",
		title: "Men's Trousers Size Chart",
		unit: "inches",
		image: {
			src: "/size_charts/mens_trouser_size_chart.jpeg",
			width: 650,
			height: 1128,
		},
		columns: [
			{ key: "waist", label: "Waist (in)" },
			{ key: "hip", label: "Hip (in)" },
			{ key: "length", label: "Trouser Length (in)" },
		],
		rows: [
			{ size: "XS", measurements: ["25–26", "33–34", "40"] },
			{ size: "S", measurements: ["27–28", "35–36", "41"] },
			{ size: "M", measurements: ["29–30", "39–40", "41"] },
			{ size: "L", measurements: ["31–32", "41–42", "41"] },
			{ size: "XL", measurements: ["35–36", "45–46", "41"] },
			{ size: "2XL", measurements: ["37–38", "47–48", "41"] },
			{ size: "3XL", measurements: ["39–40", "49–50", "42"] },
			{ size: "4XL", measurements: ["41–42", "51–52", "43"] },
			{ size: "5XL", measurements: ["44–45", "53–54", "43"] },
			{ size: "6XL", measurements: ["47–48", "55–56", "44"] },
			{ size: "7XL", measurements: ["47–48", "55–56", "44"] },
			{ size: "8XL", measurements: ["47–48", "55–56", "44"] },
		],
		instructions: [
			{
				label: "Waist",
				body: "Measure around the natural waistline, where you wear your pants.",
			},
			{
				label: "Hip",
				body: "Measure around the fullest part of your hips.",
			},
			{
				label: "Trouser Length",
				body: "Measure from the waist down to your desired length.",
			},
		],
		fitNote: FIT_NOTE,
	},

	// ─── Kiddies ──────────────────────────────────────────────
	kiddies: {
		id: "kiddies",
		title: "Kiddies Size Chart",
		unit: "inches",
		image: { src: "/size_charts/kids_size_chart.jpeg", width: 652, height: 1104 },
		columns: [
			{ key: "chest", label: "Chest (in)" },
			{ key: "waist", label: "Waist (in)" },
			{ key: "hip", label: "Hip (in)" },
			{ key: "shirtLength", label: "Shirt Length (in)" },
			{ key: "dressLength", label: "Dress Length (in)" },
		],
		rows: [
			{ size: "1", measurements: ["20", "19", "21", "16", "22"] },
			{ size: "2", measurements: ["21", "20", "22", "18", "24"] },
			{ size: "3", measurements: ["22", "21", "23", "20", "25"] },
			{ size: "4", measurements: ["22.5", "21", "24", "24", "28"] },
			{ size: "5", measurements: ["23", "22", "25", "24.5", "30"] },
			{ size: "6", measurements: ["24", "23", "26", "26", "32"] },
			{ size: "7", measurements: ["26", "24", "27", "28", "35"] },
			{ size: "8", measurements: ["27.5", "25", "28", "31", "41"] },
			{ size: "9", measurements: ["28", "26", "29", "33", "48"] },
			{ size: "10", measurements: ["29", "27", "30", "33", "48"] },
		],
		instructions: [
			{
				label: "Chest",
				body: "Measure around the fullest part of the chest.",
			},
			{
				label: "Waist",
				body: "Measure around the natural waistline.",
			},
			{
				label: "Hip",
				body: "Measure around the fullest part of the hips.",
			},
			{
				label: "Length",
				body: "Measure from the highest point of the shoulder down.",
			},
		],
		fitNote: FIT_NOTE,
	},
};
