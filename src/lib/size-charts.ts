// ─────────────────────────────────────────────────────────
// Size Chart Resolver — product → chart
// ─────────────────────────────────────────────────────────
// Pure function: given a product's gender + name/description,
// pick the correct size chart. No new product field is needed —
// the backend already provides `gender`, and the Men's Trousers
// chart is distinguished from the Men's chart by a garment-type
// heuristic on the product name/description.
//
// Business decisions (approved):
//   - women    → Women's chart
//   - children → Kiddies chart
//   - men      → Men's Trousers chart when the product is a
//                bottom/leg garment, else Men's chart
//   - unisex   → Men's chart (unisex garments use a men's block)
// ─────────────────────────────────────────────────────────

import { SIZE_CHARTS, type SizeChart } from "@/data/size-charts";
import type { Gender } from "@/lib/products";

// ─── Trousers heuristic ─────────────────────────────────
// Matches the garment being sold (name) plus garment-identity
// words in the description. "Two-piece" is treated as a bottom
// garment because the distinguishing measurement of a shirt +
// trouser set is the trouser block.
const TROUSERS_RE =
	/\b(trousers?|pants|jeans|shorts|slacks|chinos?|joggers|leggings|palazzo|two[- ]piece|sweatpants)\b/i;

function isTrousersGarment(name: string, description?: string): boolean {
	return TROUSERS_RE.test(name) || TROUSERS_RE.test(description ?? "");
}

export interface SizeChartSubject {
	gender: Gender;
	name: string;
	description?: string;
}

export function resolveSizeChart(subject: SizeChartSubject): SizeChart | null {
	switch (subject.gender) {
		case "women":
			return SIZE_CHARTS.women;
		case "children":
			return SIZE_CHARTS.kiddies;
		case "men":
			return isTrousersGarment(subject.name, subject.description)
				? SIZE_CHARTS["men-trousers"]
				: SIZE_CHARTS.men;
		case "unisex":
			return SIZE_CHARTS.men;
		default:
			return null;
	}
}
