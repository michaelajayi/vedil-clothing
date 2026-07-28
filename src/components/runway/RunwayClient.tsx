"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { RunwayEvent } from "@/data/runway";
import RunwayEventSection from "./RunwayEventSection";

/* ─── Props ─────────────────────────────────────────────────── */
interface RunwayClientProps {
	events: RunwayEvent[];
}

/* ─── Component ─────────────────────────────────────────────── */
export default function RunwayClient({ events }: RunwayClientProps) {
	/* Initialize with the first event so the nav highlights immediately */
	const [activeEvent, setActiveEvent] = useState<string>(
		events.length > 0 ? events[0].id : "",
	);
	const observerRef = useRef<IntersectionObserver | null>(null);
	const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

	/* ── Scroll spy: track which event is in view ──────────── */
	const registerSection = useCallback((id: string, el: HTMLElement | null) => {
		if (el) {
			sectionRefs.current.set(id, el);
		} else {
			sectionRefs.current.delete(id);
		}
	}, []);

	useEffect(() => {
		const elements = Array.from(sectionRefs.current.values());
		if (elements.length === 0) return;

		observerRef.current = new IntersectionObserver(
			(entries) => {
				/* Find the first section that's intersecting or above the fold */
				const visible = entries
					.filter((e) => e.isIntersecting)
					.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

				if (visible.length > 0) {
					const id = visible[0].target.getAttribute("data-event-id");
					if (id) setActiveEvent(id);
				} else {
					/* If nothing is visible, find the nearest section above the fold */
					const above = entries
						.filter((e) => e.boundingClientRect.top < 200)
						.sort(
							(a, b) => b.boundingClientRect.top - a.boundingClientRect.top,
						);
					if (above.length > 0) {
						const id = above[0].target.getAttribute("data-event-id");
						if (id) setActiveEvent(id);
					}
				}
			},
			{ threshold: 0.15, rootMargin: "-80px 0px -30% 0px" },
		);

		elements.forEach((el) => observerRef.current?.observe(el));

		return () => {
			observerRef.current?.disconnect();
		};
	}, [events]);

	/* ── Scroll to event ──────────────────────────────────── */
	const scrollToEvent = useCallback((id: string) => {
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	}, []);

	return (
		<div className="runway-layout">
			{/* ── Sticky event nav (desktop) ── */}
			<nav className="runway-event-nav" aria-label="Runway events by year">
				<div className="runway-event-nav-inner">
					<span className="runway-event-nav-label">Events</span>
					{events.map((event) => (
						<button
							key={event.id}
							className={`runway-event-nav-btn${activeEvent === event.id ? " active" : ""}`}
							onClick={() => scrollToEvent(event.id)}
							aria-current={activeEvent === event.id ? "true" : undefined}
						>
							{event.year}
						</button>
					))}
				</div>
			</nav>

			{/* ── Event sections ── */}
			<div className="runway-sections">
				{events.map((event) => (
					<RunwayEventSection
						key={event.id}
						event={event}
						registerSection={registerSection}
					/>
				))}
			</div>
		</div>
	);
}
