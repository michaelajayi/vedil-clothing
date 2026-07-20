import { test } from "@playwright/test";

const POSITIONS = [
	"center top",
	"center 20%",
	"center 30%",
	"center 40%",
	"center 50%",
	"center 60%",
	"center 70%",
	"center bottom",
];

test.describe("Academy image position iteration", () => {
	for (const pos of POSITIONS) {
		test(`position: ${pos}`, async ({ page }) => {
			// Override the element's background position via evaluate
			await page.goto("/", { waitUntil: "networkidle" });
			await page.waitForTimeout(2000);

			// First, inject a style override
			await page.addStyleTag({
				content: `.academy-top .ph { background-position: ${pos} !important; }`,
			});

			// Scroll to academy section
			const academySection = page.locator("#academy");
			await academySection.scrollIntoViewIfNeeded();
			await page.waitForTimeout(1000);

			await page.screenshot({
				path: `tests/screenshots/academy-academy-pos-${pos.replace(/\s+/g, "-").replace(/%/g, "pct")}.png`,
				fullPage: false,
			});
		});
	}
});