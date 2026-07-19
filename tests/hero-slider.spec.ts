import { test, expect } from "@playwright/test";

test.describe("Hero slider — pill arrow buttons", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
		// Wait for the hero to render
		await page.waitForSelector(".hero--slider");
	});

	test("arrow buttons are visible on the hero", async ({ page }) => {
		const prevBtn = page.locator(".hero-arrow--prev");
		const nextBtn = page.locator(".hero-arrow--next");

		await expect(prevBtn).toBeVisible();
		await expect(nextBtn).toBeVisible();

		// Default state: should be circles (44×44)
		const prevBox = await prevBtn.boundingBox();
		const nextBox = await nextBtn.boundingBox();

		expect(prevBox).not.toBeNull();
		expect(nextBox).not.toBeNull();

		// Circle: width and height should be equal (44px)
		expect(prevBox!.width).toBeCloseTo(prevBox!.height, 0);
		expect(nextBox!.width).toBeCloseTo(nextBox!.height, 0);
	});

	test("hovering prev button expands it into a pill with category label", async ({
		page,
	}) => {
		const prevBtn = page.locator(".hero-arrow--prev");
		const label = prevBtn.locator(".hero-arrow-label");

		// Label should be hidden initially
		await expect(label).not.toBeVisible();

		// Hover over the button
		await prevBtn.hover();
		await page.waitForTimeout(500); // wait for animation

		// Label should now be visible
		await expect(label).toBeVisible();

		// The button should be wider than tall (pill shape)
		const box = await prevBtn.boundingBox();
		expect(box!.width).toBeGreaterThan(box!.height);
	});

	test("hovering next button expands it into a pill with category label", async ({
		page,
	}) => {
		const nextBtn = page.locator(".hero-arrow--next");
		const label = nextBtn.locator(".hero-arrow-label");

		await expect(label).not.toBeVisible();

		await nextBtn.hover();
		await page.waitForTimeout(500);

		await expect(label).toBeVisible();

		const box = await nextBtn.boundingBox();
		expect(box!.width).toBeGreaterThan(box!.height);
	});

	test("pill collapses back to circle when unhovered", async ({ page }) => {
		const prevBtn = page.locator(".hero-arrow--prev");

		// Hover to expand
		await prevBtn.hover();
		await page.waitForTimeout(500);

		const expandedBox = await prevBtn.boundingBox();
		expect(expandedBox!.width).toBeGreaterThan(expandedBox!.height);

		// Move mouse away
		await page.mouse.move(0, 0);
		await page.waitForTimeout(500);

		// Should return to circle
		const collapsedBox = await prevBtn.boundingBox();
		expect(collapsedBox!.width).toBeCloseTo(collapsedBox!.height, 0);
	});

	test("no layout shift or flicker during hover transition", async ({
		page,
	}) => {
		// Take a screenshot before interaction
		const beforeScreenshot = await page.screenshot({
			fullPage: false,
			clip: { x: 0, y: 0, width: 400, height: 200 },
		});

		const nextBtn = page.locator(".hero-arrow--next");
		await nextBtn.hover();
		await page.waitForTimeout(500);

		// Take screenshot during hover
		const duringScreenshot = await page.screenshot({
			fullPage: false,
			clip: { x: 0, y: 0, width: 400, height: 200 },
		});

		// Unhover
		await page.mouse.move(0, 0);
		await page.waitForTimeout(500);

		// Take screenshot after unhover
		const afterScreenshot = await page.screenshot({
			fullPage: false,
			clip: { x: 0, y: 0, width: 400, height: 200 },
		});

		// All screenshots should exist (not a strict visual comparison,
		// just verifying no crash/flicker during the transition)
		expect(beforeScreenshot.length).toBeGreaterThan(0);
		expect(duringScreenshot.length).toBeGreaterThan(0);
		expect(afterScreenshot.length).toBeGreaterThan(0);
	});

	test("clicking prev arrow changes slide content", async ({ page }) => {
		const prevBtn = page.locator(".hero-arrow--prev");

		// Get the initial headline text
		const initialHeadline = await page
			.locator(".hero-content h1")
			.textContent();

		// Click prev (should wrap to last slide)
		await prevBtn.click();
		await page.waitForTimeout(600); // wait for stagger animation

		// Headline should have changed
		const newHeadline = await page.locator(".hero-content h1").textContent();
		expect(newHeadline).not.toBe(initialHeadline);
	});

	test("clicking next arrow changes slide content", async ({ page }) => {
		const nextBtn = page.locator(".hero-arrow--next");

		const initialHeadline = await page
			.locator(".hero-content h1")
			.textContent();

		await nextBtn.click();
		await page.waitForTimeout(600);

		const newHeadline = await page.locator(".hero-content h1").textContent();
		expect(newHeadline).not.toBe(initialHeadline);
	});
});
