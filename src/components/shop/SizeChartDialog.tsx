"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Ruler } from "lucide-react";
import Image from "next/image";
import { TapeMeasureIcon } from "@/components/ui/TapeMeasureIcon";
import { SizeChartTable } from "@/components/shop/SizeChartTable";
import type { SizeChart } from "@/data/size-charts";

/**
 * "Size guide" trigger + modal dialog for a single size chart.
 *
 * Renders a small text-link style trigger next to the size option
 * chips on the product detail page. The dialog shows:
 *   - chart title + unit note
 *   - measurement table (SizeChartTable)
 *   - "How to measure" definition list
 *   - shared fit recommendation
 *
 * Radix Dialog provides focus trapping, ESC to close, and
 * accessible labelling out of the box.
 */
export function SizeChartDialog({ chart }: { chart: SizeChart }) {
	const [showMeasureGuide, setShowMeasureGuide] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	// Lock body scroll while the dialog is open — prevents the page
	// behind the modal from scrolling on mobile when swiping within
	// the size chart table. Uses overflow + position: fixed + touch-action
	// for reliable behavior across iOS Safari and Android Chrome.
	useEffect(() => {
		if (isOpen) {
			const scrollY = window.scrollY;
			document.body.style.overflow = "hidden";
			document.body.style.position = "fixed";
			document.body.style.top = `-${scrollY}px`;
			document.body.style.width = "100%";
			document.body.style.touchAction = "none";
		} else {
			const top = document.body.style.top;
			document.body.style.overflow = "";
			document.body.style.position = "";
			document.body.style.top = "";
			document.body.style.width = "";
			document.body.style.touchAction = "";
			if (top) {
				window.scrollTo(0, parseInt(top) * -1);
			}
		}
		return () => {
			document.body.style.overflow = "";
			document.body.style.position = "";
			document.body.style.top = "";
			document.body.style.width = "";
			document.body.style.touchAction = "";
		};
	}, [isOpen]);

	return (
		<Dialog.Root onOpenChange={setIsOpen}>
			<Dialog.Trigger asChild>
				<button type="button" className="size-guide-trigger">
					<Ruler size={14} strokeWidth={1.9} aria-hidden="true" />
					Size guide
				</button>
			</Dialog.Trigger>

			<Dialog.Portal>
				<Dialog.Overlay className="sizechart-overlay" />
				<Dialog.Content className="sizechart-content">
					<Dialog.Close asChild>
						<button
							type="button"
							className="sizechart-close"
							aria-label="Close size chart"
						>
							<X size={20} strokeWidth={1.8} />
						</button>
					</Dialog.Close>

					<Dialog.Title className="sizechart-title">{chart.title}</Dialog.Title>
					<p className="sizechart-unit">All measurements are in {chart.unit}.</p>

					<SizeChartTable chart={chart} />

					<section
						className="sizechart-measure"
						aria-labelledby="sizechart-measure-title"
					>
						<h3 id="sizechart-measure-title" className="sizechart-section-title">
							How to measure
						</h3>

						{chart.image && (
							<div
								className={`sizechart-image-panel${showMeasureGuide ? " open" : ""}`}
							>
								<button
									type="button"
									className="sizechart-image-toggle"
									onClick={() => setShowMeasureGuide((v) => !v)}
									aria-expanded={showMeasureGuide}
									aria-controls="sizechart-image-content"
								>
									<span>{showMeasureGuide ? "Close" : "Open"} measurement guide</span>
									<span className="sizechart-image-icon" aria-hidden>
										<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
											<line
												x1="8"
												y1="2"
												x2="8"
												y2="14"
												stroke="currentColor"
												strokeWidth="1.5"
												strokeLinecap="round"
												className="sizechart-v-line"
											/>
											<line
												x1="2"
												y1="8"
												x2="14"
												y2="8"
												stroke="currentColor"
												strokeWidth="1.5"
												strokeLinecap="round"
											/>
										</svg>
									</span>
								</button>
								<div
									className="sizechart-image-reveal"
									id="sizechart-image-content"
									role="region"
									aria-label={`Measurement guide for ${chart.title}`}
								>
									<div className="sizechart-image-inner">
										<Image
											src={chart.image.src}
											alt="Measurement guide showing where to measure on the body"
											width={chart.image.width}
											height={chart.image.height}
											className="sizechart-measure-image"
											sizes="(max-width: 480px) calc(100vw - 3.5rem), 664px"
											loading="lazy"
										/>
									</div>
								</div>
							</div>
						)}
					</section>

					<p className="sizechart-fit">
						<TapeMeasureIcon size={15} aria-hidden="true" />
						{chart.fitNote}
					</p>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
