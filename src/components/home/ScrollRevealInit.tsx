"use client";

import { useEffect } from "react";

export default function ScrollRevealInit() {
	useEffect(() => {
		document.documentElement.classList.add("js-reveal");

		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const siblings = [
							...entry.target.parentElement!.querySelectorAll<HTMLElement>(
								":scope > .reveal",
							),
						];
						const idx = Math.max(
							0,
							siblings.indexOf(entry.target as HTMLElement),
						);
						(entry.target as HTMLElement).style.transitionDelay =
							idx * 80 + "ms";
						entry.target.classList.add("in");
						io.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
		);

		/** Observe all current and future .reveal elements */
		function observeReveals() {
			document
				.querySelectorAll<HTMLElement>(".reveal:not(.in)")
				.forEach((el) => io.observe(el));
		}

		observeReveals();

		// Watch for dynamic .reveal elements (e.g. tab-filtered courses)
		const mo = new MutationObserver(observeReveals);
		mo.observe(document.body, { childList: true, subtree: true });

		return () => {
			io.disconnect();
			mo.disconnect();
		};
	}, []);

	return null;
}
