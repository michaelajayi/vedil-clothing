import { test, expect } from "@playwright/test";

const PRODUCT_URL = "/shop/ready-to-wear/f8f56ea8-a7d1-4bd8-af26-ebe8a5ce42fd";

test.describe("Product detail page layout", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(PRODUCT_URL);
		// Wait for the product data to load (skeleton disappears, product name visible)
		await page.waitForSelector(`h1:has-text("Vedil Signature Tee")`, {
			timeout: 15000,
		});
		await page.waitForLoadState("networkidle");
	});

	test("product image column does not overlap with footer", async ({
		page,
	}) => {
		// ── 1. Find the image/gallery via the h1's parent structure ──
		// h1 → .pdpInfo → .pdp → .pdpImage (first child)
		const h1 = page.locator("h1:has-text('Vedil Signature Tee')");
		await expect(h1).toBeVisible();
		const pdpGrid = h1.locator("..").locator("..");
		await expect(pdpGrid).toBeVisible();

		const imageCol = pdpGrid.locator("> div").first();
		await expect(imageCol).toBeVisible();

		const imageBox = await imageCol.boundingBox();
		expect(imageBox).not.toBeNull();

		// ── 2. Find the footer ──
		const footer = page.locator("footer");
		await expect(footer).toBeVisible();

		const footerBox = await footer.boundingBox();
		expect(footerBox).not.toBeNull();

		// ── 3. Find the main content area ──
		const main = page.locator("main");
		const mainBox = await main.boundingBox();
		expect(mainBox).not.toBeNull();

		// ── 4. Check for overlap ──
		const imageBottom = imageBox!.y + imageBox!.height;
		const mainBottom = mainBox!.y + mainBox!.height;
		const footerTop = footerBox!.y;

		test.info().annotations.push({
			type: "layout",
			description: [
				`Image column bottom: ${Math.round(imageBottom)}px`,
				`Main content bottom: ${Math.round(mainBottom)}px`,
				`Footer top: ${Math.round(footerTop)}px`,
				`Image Y: ${Math.round(imageBox!.y)}, Height: ${Math.round(imageBox!.height)}`,
				`Viewport height: ${page.viewportSize()?.height}px`,
			].join("\n"),
		});

		expect(imageBottom).toBeLessThanOrEqual(mainBottom + 2);
		expect(mainBottom).toBeLessThanOrEqual(footerTop + 2);
		expect(imageBottom).toBeLessThanOrEqual(footerTop + 2);
	});

	test("product image is positioned within the grid and not shifted down", async ({
		page,
	}) => {
		const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
		await expect(breadcrumb).toBeVisible();

		const breadcrumbBox = await breadcrumb.boundingBox();
		expect(breadcrumbBox).not.toBeNull();

		// Find the grid via the breadcrumb's parent → next sibling
		const breadcrumbParent = breadcrumb.locator("..");
		const pdpGrid = breadcrumbParent.locator("> div").first();
		await expect(pdpGrid).toBeVisible();

		const imageCol = pdpGrid.locator("> div").first();
		await expect(imageCol).toBeVisible();

		const imageBox = await imageCol.boundingBox();
		expect(imageBox).not.toBeNull();

		const breadcrumbBottom = breadcrumbBox!.y + breadcrumbBox!.height;
		const imageTop = imageBox!.y;

		test.info().annotations.push({
			type: "spacing",
			description: [
				`Breadcrumb bottom: ${Math.round(breadcrumbBottom)}px`,
				`Image top: ${Math.round(imageTop)}px`,
				`Gap: ${Math.round(imageTop - breadcrumbBottom)}px`,
			].join("\n"),
		});

		const gap = imageTop - breadcrumbBottom;
		expect(gap).toBeGreaterThanOrEqual(0);
		expect(gap).toBeLessThanOrEqual(100);
	});

	test("two-column layout aligns correctly on desktop", async ({ page }) => {
		if ((page.viewportSize()?.width ?? 0) < 1024) return;

		const h1 = page.locator("h1:has-text('Vedil Signature Tee')");
		await expect(h1).toBeVisible();
		const pdpInfo = h1.locator("..");
		const pdpGrid = pdpInfo.locator("..");
		await expect(pdpGrid).toBeVisible();

		const imageCol = pdpGrid.locator("> div").first();
		await expect(imageCol).toBeVisible();
		await expect(pdpInfo).toBeVisible();

		const imageBox = await imageCol.boundingBox();
		const infoBox = await pdpInfo.boundingBox();
		expect(imageBox).not.toBeNull();
		expect(infoBox).not.toBeNull();

		// On desktop: image should be on the left, info on the right
		expect(imageBox!.x).toBeLessThan(infoBox!.x);

		// Info should not be above the image (align-items: start means same start)
		const topDiff = Math.abs(imageBox!.y - infoBox!.y);
		expect(topDiff).toBeLessThanOrEqual(10);

		// Image column should take roughly half (1fr of 1fr 1fr)
		const gridWidth = imageBox!.width + infoBox!.width;
		const imageRatio = imageBox!.width / gridWidth;
		expect(imageRatio).toBeGreaterThan(0.35);
		expect(imageRatio).toBeLessThan(0.65);
	});

	test("gallery viewport is visible and contains slides", async ({ page }) => {
		// Check that the gallery viewport exists
		const viewport = page.locator(".pdp-gallery-viewport");
		await expect(viewport).toBeVisible();

		// Slides should exist
		const slides = page.locator(".pdp-gallery-slide");
		await expect(slides.first()).toBeVisible();

		// Verify images are loaded inside slides
		const imgs = slides.locator("img").first();
		await expect(imgs).toBeVisible();

		// Check thumbnails if the product has multiple images
		const thumbs = page.locator(".pdp-gallery-thumbs");
		const thumbCount = await thumbs.count();
		if (thumbCount > 0) {
			await expect(thumbs).toBeVisible();
			const thumbButtons = thumbs.locator("button");
			const count = await thumbButtons.count();
			expect(count).toBeGreaterThan(1);
		}
	});

	test("visual layout regression check", async ({ page }) => {
		await page.evaluate(() => window.scrollTo(0, 0));
		await page.waitForTimeout(500);

		await expect(page).toHaveScreenshot("pdp-full-page.png", {
			fullPage: true,
			maxDiffPixels: 500,
		});
	});
});
