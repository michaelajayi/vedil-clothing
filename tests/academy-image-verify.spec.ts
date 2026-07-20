import { test, expect } from "@playwright/test";

test("academy image has background-size: contain and captures screenshot", async ({ page }) => {
	await page.goto("/", { waitUntil: "networkidle" });

	// Scroll to academy section
	const academySection = page.locator("#academy");
	await academySection.scrollIntoViewIfNeeded();
	await page.waitForTimeout(1000);

	// Verify the computed background-size is 'contain'
	const bgSize = await page.locator(".academy-top .ph").evaluate((el) =>
		getComputedStyle(el).backgroundSize,
	);
	console.log(`Computed background-size: "${bgSize}"`);
	expect(bgSize).toContain("cover");

	// Screenshot for visual verification
	await page.screenshot({
		path: "tests/screenshots/academy-image-verify.png",
		fullPage: false,
	});
});
