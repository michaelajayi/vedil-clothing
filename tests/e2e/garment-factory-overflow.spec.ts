import { test, expect } from "@playwright/test";

test("garment factory has no horizontal overflow on mobile — deep check", async ({
	page,
}) => {
	await page.setViewportSize({ width: 375, height: 812 });
	await page.goto("/garment-factory", { waitUntil: "networkidle" });

	// Wait for fonts and images to settle
	await page.waitForTimeout(500);

	const detail = await page.evaluate(() => {
		const doc = document.documentElement;
		const body = document.body;

		// Check for actual overflow vs scrollbar presence
		const hasHScroll = doc.scrollWidth > doc.clientWidth;

		// Find ALL elements with width greater than viewport
		const all = document.querySelectorAll("*");
		const wide: {
			tag: string;
			id: string;
			cls: string;
			w: number;
			pw: number;
			ow: string;
		}[] = [];
		for (const el of all) {
			const rect = el.getBoundingClientRect();
			const p = el.parentElement;
			if (rect.width > doc.clientWidth + 1) {
				wide.push({
					tag: el.tagName,
					id: el.id || "(none)",
					cls:
						el.className && typeof el.className === "string"
							? el.className.slice(0, 120)
							: "",
					w: Math.round(rect.width),
					pw: p ? Math.round(p.getBoundingClientRect().width) : -1,
					ow: getComputedStyle(el).overflowX,
				});
			}
		}

		// Also check if any container has overflow-x: auto/scroll
		const scrollable: { tag: string; id: string; cls: string; ox: string }[] =
			[];
		for (const el of all) {
			const s = getComputedStyle(el);
			if (s.overflowX === "auto" || s.overflowX === "scroll") {
				const rect = el.getBoundingClientRect();
				if (rect.width > 0) {
					const canScroll = el.scrollWidth > el.clientWidth;
					if (canScroll) {
						scrollable.push({
							tag: el.tagName,
							id: el.id || "(none)",
							cls:
								el.className && typeof el.className === "string"
									? el.className.slice(0, 100)
									: "",
							ox: s.overflowX,
						});
					}
				}
			}
		}

		return {
			docScrollW: doc.scrollWidth,
			docClientW: doc.clientWidth,
			hasHScroll,
			bodyOverflowX: getComputedStyle(body).overflowX,
			htmlOverflowX: getComputedStyle(doc).overflowX,
			wide: wide.slice(0, 20),
			scrollable: scrollable.slice(0, 20),
		};
	});

	console.log("Detail:", JSON.stringify(detail, null, 2));
	expect(detail.hasHScroll).toBe(false);
});
