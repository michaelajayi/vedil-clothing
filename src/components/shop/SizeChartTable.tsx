"use client";

import { useEffect, useRef } from "react";
import type { SizeChart } from "@/data/size-charts";

/**
 * Renders a size chart's measurement table with semantic markup.
 *
 * - `<table>` / `<thead>` / `<th scope>` / `<tbody>` / `<td>`
 * - The size column is a `<th scope="row">` on each row
 * - Wrapped in a horizontally scrollable region so wide charts
 *   (e.g. Kiddies, 6 measurement columns) stay usable on mobile;
 *   the size column sticks to the left edge while scrolling.
 * - The wrapper toggles `data-scrollable` / `data-at-end` so the
 *   CSS can show a right-edge fade while more columns exist (and
 *   hide it once the user scrolls to the end).
 */
export function SizeChartTable({ chart }: { chart: SizeChart }) {
	const wrapRef = useRef<HTMLDivElement>(null);
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const wrap = wrapRef.current;
		const scroller = scrollRef.current;
		if (!wrap || !scroller) return;

		const update = () => {
			const scrollable = scroller.scrollWidth > scroller.clientWidth + 1;
			const atEnd =
				scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 1;
			wrap.dataset.scrollable = String(scrollable);
			wrap.dataset.atEnd = String(scrollable && atEnd);
		};

		update();
		const observer = new ResizeObserver(update);
		observer.observe(scroller);
		const table = scroller.querySelector("table");
		if (table) observer.observe(table);
		scroller.addEventListener("scroll", update, { passive: true });
		window.addEventListener("resize", update);

		return () => {
			observer.disconnect();
			scroller.removeEventListener("scroll", update);
			window.removeEventListener("resize", update);
		};
	}, []);

	return (
		<div className="sizechart-scroll-wrap" ref={wrapRef}>
			<div
				className="sizechart-scroll"
				role="region"
				aria-label={`${chart.title} measurements`}
				tabIndex={0}
				ref={scrollRef}
			>
				<table className="sizechart-table">
					<caption className="sr-only">
						{chart.title}, all measurements in {chart.unit}
					</caption>
					<thead>
						<tr>
							<th scope="col">Size</th>
							{chart.columns.map((column) => (
								<th scope="col" key={column.key}>
									{column.label}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{chart.rows.map((row) => (
							<tr key={row.size}>
								<th scope="row">{row.size}</th>
								{row.measurements.map((value, index) => (
									<td key={index}>{value}</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
