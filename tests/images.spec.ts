import { test, expect } from "@playwright/test";

test.describe("Image placement visual check", () => {
	test("homepage academy section image is visible and well-positioned", async ({
		page,
	}) => {
		await page.goto("/");
		// Wait for scroll reveal animations to settle
		await page.waitForTimeout(1500);

		// Scroll to academy section
		const academySection = page.locator("#academy");
		await academySection.scrollIntoViewIfNeeded();
		await page.waitForTimeout(1000);

		// The academy image is the .ph inside .academy-top
		const academyImage = page.locator(".academy-top .ph");
		await expect(academyImage).toBeVisible();

		// Take screenshot for visual review
		await page.screenshot({
			path: "tests/screenshots/academy-section.png",
			fullPage: false,
		});
	});

	test("about page founder photos are visible", async ({ page }) => {
		await page.goto("/about");
		await page.waitForTimeout(1500);

		// Check main photo
		const mainPhoto = page.locator(".about-photo-main");
		await expect(mainPhoto).toBeVisible();

		// Check supporting photo
		const supportingPhoto = page.locator(".about-photo-float");
		await expect(supportingPhoto).toBeVisible();

		// Check Made to Measure CTA image
		const madeMeasure = page.locator(".made-measure .ph");
		await expect(madeMeasure).toBeVisible();

		await page.screenshot({
			path: "tests/screenshots/about-page.png",
			fullPage: true,
		});
	});

	test("garment factory page images are visible", async ({ page }) => {
		await page.goto("/garment-factory");
		await page.waitForTimeout(1500);

		// Bulk production image
		const bulkImage = page.locator(".service-split").first().locator(".ph");
		await expect(bulkImage).toBeVisible();

		// Custom orders image
		const customImage = page.locator(".service-split.flip").locator(".ph");
		await expect(customImage).toBeVisible();

		// Wholesale image
		const wholesaleImage = page.locator(".service-split").last().locator(".ph");
		await expect(wholesaleImage).toBeVisible();

		await page.screenshot({
			path: "tests/screenshots/garment-factory-page.png",
			fullPage: true,
		});
	});

	test("fun-to-sew page image is visible", async ({ page }) => {
		await page.goto("/fun-to-sew");
		await page.waitForTimeout(1500);

		const academyImage = page.locator(".academy-top .ph");
		await expect(academyImage).toBeVisible();

		await page.screenshot({
			path: "tests/screenshots/fun-to-sew-page.png",
			fullPage: false,
		});
	});

	test("homepage hero slider has background images", async ({ page }) => {
		await page.goto("/");
		await page.waitForTimeout(1500);

		const heroBg = page.locator(".hero-slider-bg");
		await expect(heroBg).toBeVisible();

		// Check that the background uses a url() (has an image, not just gradient)
		const bgStyle = await heroBg.getAttribute("style");
		expect(bgStyle).toContain("url(");

		await page.screenshot({
			path: "tests/screenshots/hero-slider.png",
			fullPage: false,
		});
	});

	test("homepage factory section image is visible", async ({ page }) => {
		await page.goto("/");
		await page.waitForTimeout(1500);

		const factorySection = page.locator("#factory");
		await factorySection.scrollIntoViewIfNeeded();
		await page.waitForTimeout(1000);

		const factoryImage = factorySection.locator(".factory .ph");
		await expect(factoryImage).toBeVisible();

		await page.screenshot({
			path: "tests/screenshots/factory-section.png",
			fullPage: false,
		});
	});
});