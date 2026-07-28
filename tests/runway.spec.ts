import { test, expect } from "@playwright/test";

/* ═══════════════════════════════════════════════════════════════
   RUNWAY PAGE — Zimmermann-style Card Grid
   ═══════════════════════════════════════════════════════════════ */

/* ─── Page hero ──────────────────────────────────────────────── */

test("runway page — hero renders with title", async ({ page }) => {
	await page.goto("/runway");
	await expect(page.locator("h1")).toContainText("Our");
	await expect(page.locator("h1 em")).toContainText("Collections");
	await expect(page.locator(".eyebrow")).toContainText("Runway");
	await expect(page).toHaveTitle(/Runway/);
});

/* ─── Card grid ──────────────────────────────────────────────── */

test("runway page — card grid renders correct number of cards", async ({
	page,
}) => {
	await page.goto("/runway");

	// 3 events: 2026 (with media), 2019 (empty), 2018 (empty)
	const cards = page.locator(".rt2-card");
	await expect(cards).toHaveCount(3);
});

test("runway page — cards are in correct order (newest first)", async ({
	page,
}) => {
	await page.goto("/runway");

	const years = page.locator(".rt2-card-year");
	await expect(years.nth(0)).toContainText("2026");
	await expect(years.nth(1)).toContainText("2019");
	await expect(years.nth(2)).toContainText("2018");
});

test("runway page — first card has image and overlay", async ({ page }) => {
	await page.goto("/runway");

	// First card (2026) should have a campaign image
	const firstCard = page.locator(".rt2-card").first();
	await expect(firstCard.locator(".rt2-card-image")).toBeVisible();
	await expect(firstCard.locator(".rt2-card-overlay")).toBeVisible();
	await expect(firstCard.locator(".rt2-card-cta")).toContainText(
		"View Collection",
	);
});

test("runway page — empty cards show placeholder content", async ({ page }) => {
	await page.goto("/runway");

	// Second card (2019) should be empty
	const emptyCard = page.locator(".rt2-card--empty").first();
	await expect(emptyCard).toBeVisible();
	await expect(emptyCard.locator(".rt2-card-empty-label")).toContainText(
		"Media coming soon",
	);
});

/* ─── Click into detail view ─────────────────────────────────── */

test("runway page — clicking a card with media opens detail view", async ({
	page,
}) => {
	await page.goto("/runway");

	// Click the first card (2026 — has media)
	await page.locator(".rt2-card").first().click();
	await page.waitForTimeout(300);

	// Detail view should show event header
	await expect(page.locator(".rt2-detail")).toBeVisible();
	await expect(page.locator(".rt2-detail-name")).toContainText(
		"Epic Fashion Week 2026",
	);
});

test("runway page — detail view shows pill badge back button", async ({
	page,
}) => {
	await page.goto("/runway");

	await page.locator(".rt2-card").first().click();
	await page.waitForTimeout(300);

	// Pill badge should show "All Events"
	await expect(page.locator(".rt2-detail-back")).toBeVisible();
	await expect(page.locator(".rt2-detail-back")).toContainText("All Events");
});

test("runway page — clicking empty card does not navigate", async ({
	page,
}) => {
	await page.goto("/runway");

	// Click the empty card (2019)
	await page.locator(".rt2-card--empty").first().click();
	await page.waitForTimeout(300);

	// Should still be on the card grid view
	await expect(page.locator(".rt2-card-grid")).toBeVisible();
	await expect(page.locator(".rt2-detail")).not.toBeVisible();
});

test("runway page — back button returns to card grid", async ({ page }) => {
	await page.goto("/runway");

	// Click into detail
	await page.locator(".rt2-card").first().click();
	await page.waitForTimeout(300);
	await expect(page.locator(".rt2-detail")).toBeVisible();

	// Click back
	await page.locator(".rt2-detail-back").click();
	await page.waitForTimeout(300);

	// Should be back on card grid
	await expect(page.locator(".rt2-card-grid")).toBeVisible();
	await expect(page.locator(".rt2-detail")).not.toBeVisible();
});

/* ─── Detail view — gallery and lightbox ────────────────────── */

test("runway page — detail view shows gallery with media items", async ({
	page,
}) => {
	await page.goto("/runway");

	await page.locator(".rt2-card").first().click();
	await page.waitForTimeout(300);

	// Should show the collection header and grid
	await expect(page.locator(".rt2-detail-col-name")).toContainText(
		"Imperial Softness",
	);
	const items = page.locator(".rt2-detail-grid .runway-masonry-item");
	await expect(items).toHaveCount(2);
});

test("runway page — gallery section has 'Looks' label", async ({ page }) => {
	await page.goto("/runway");

	await page.locator(".rt2-card").first().click();
	await page.waitForTimeout(300);

	await expect(page.locator(".rt2-gallery-label")).toContainText("Looks");
});

test("runway page — clicking media in detail opens lightbox", async ({
	page,
}) => {
	await page.goto("/runway");

	await page.locator(".rt2-card").first().click();
	await page.waitForTimeout(300);

	// Click first media item
	await page.locator(".rt2-detail-grid .runway-masonry-item").first().click();
	await page.waitForTimeout(500);

	// Lightbox should be open
	await expect(page.locator(".runway-lightbox.open")).toBeVisible();
});

test("runway page — lightbox navigation works", async ({ page }) => {
	await page.goto("/runway");

	await page.locator(".rt2-card").first().click();
	await page.waitForTimeout(300);

	// Click first item
	await page.locator(".rt2-detail-grid .runway-masonry-item").first().click();
	await page.waitForTimeout(500);

	// Click next button
	await page.locator(".runway-lightbox-nav--next").click();
	await page.waitForTimeout(300);

	// Click previous button
	await page.locator(".runway-lightbox-nav--prev").click();
	await page.waitForTimeout(300);

	// Close with Escape
	await page.keyboard.press("Escape");
	await page.waitForTimeout(300);
	await expect(page.locator(".runway-lightbox.open")).not.toBeVisible();
});

test("runway page — lightbox close returns to detail view", async ({
	page,
}) => {
	await page.goto("/runway");

	await page.locator(".rt2-card").first().click();
	await page.waitForTimeout(300);

	// Open lightbox
	await page.locator(".rt2-detail-grid .runway-masonry-item").first().click();
	await page.waitForTimeout(500);

	// Close with Escape
	await page.keyboard.press("Escape");
	await page.waitForTimeout(300);
	await expect(page.locator(".runway-lightbox.open")).not.toBeVisible();

	// Still in detail view
	await expect(page.locator(".rt2-detail")).toBeVisible();
});

/* ─── Description renders as paragraphs ─────────────────────── */

test("runway page — collection description renders as multiple paragraphs", async ({
	page,
}) => {
	await page.goto("/runway");

	await page.locator(".rt2-card").first().click();
	await page.waitForTimeout(300);

	// The description has multiple paragraphs separated by \n\n
	const descParagraphs = page.locator(".rt2-detail-col-desc p");
	const count = await descParagraphs.count();
	expect(count).toBeGreaterThan(1);
});

/* ─── Video aspect ratio ──────────────────────────────────────── */

test("runway page — video has correct aspect ratio and object-fit", async ({
	page,
}) => {
	await page.goto("/runway");

	await page.locator(".rt2-card").first().click();
	await page.waitForTimeout(300);

	// The Imperial Softness video has aspectRatio: "16/9"
	const video = page
		.locator(".rt2-detail-grid .runway-masonry-item video")
		.first();
	await expect(video).toBeVisible();

	// Check the inline style
	const aspectRatio = await video.getAttribute("style");
	expect(aspectRatio).toContain("16 / 9");

	// Check that object-fit is contain (not cover) — shows full frame
	const objectFit = await video.evaluate((el) =>
		window.getComputedStyle(el).getPropertyValue("object-fit"),
	);
	expect(objectFit).toBe("contain");
});

/* ─── Header navigation ──────────────────────────────────────── */

test("runway page — header has Runway link", async ({ page }) => {
	await page.goto("/runway");

	// Desktop nav
	const desktopNav = page.locator("nav a[href='/runway']").first();
	await expect(desktopNav).toBeVisible();
	await expect(desktopNav).toContainText("Runway");
});

/* ─── Responsive ─────────────────────────────────────────────── */

test("runway page — mobile: single column card grid", async ({ page }) => {
	await page.setViewportSize({ width: 375, height: 812 });
	await page.goto("/runway");

	// In single column, the first card should span the full container width
	const gridWidth = await page
		.locator(".rt2-card-grid")
		.evaluate((el) => el.getBoundingClientRect().width);
	const firstCardWidth = await page
		.locator(".rt2-card")
		.first()
		.evaluate((el) => el.getBoundingClientRect().width);

	expect(firstCardWidth).toBeCloseTo(gridWidth, -1);
});

test("runway page — mobile: no horizontal scroll", async ({ page }) => {
	await page.setViewportSize({ width: 375, height: 812 });
	await page.goto("/runway");

	// Document width should not exceed viewport
	const docWidth = await page.evaluate(
		() => document.documentElement.scrollWidth,
	);
	expect(docWidth).toBeLessThanOrEqual(375);
});

test("runway page — mobile: detail view has no horizontal scroll", async ({
	page,
}) => {
	await page.setViewportSize({ width: 375, height: 812 });
	await page.goto("/runway");

	// Click into detail
	await page.locator(".rt2-card").first().click();
	await page.waitForTimeout(300);

	// Document width should not exceed viewport
	const docWidth = await page.evaluate(
		() => document.documentElement.scrollWidth,
	);
	expect(docWidth).toBeLessThanOrEqual(375);
});

test("runway page — mobile: hero has no horizontal padding gap", async ({
	page,
}) => {
	await page.setViewportSize({ width: 375, height: 812 });
	await page.goto("/runway");

	// Hero section should be full width
	const heroWidth = await page
		.locator(".runway-page-hero")
		.evaluate((el) => el.getBoundingClientRect().width);
	expect(heroWidth).toBe(375);
});

test("runway page — mobile: no left/right padding on any section", async ({
	page,
}) => {
	await page.setViewportSize({ width: 375, height: 812 });
	await page.goto("/runway");

	// Hero section
	const heroPadding = await page
		.locator(".runway-page-hero")
		.evaluate((el) => ({
			left: parseFloat(
				window.getComputedStyle(el).getPropertyValue("padding-left"),
			),
			right: parseFloat(
				window.getComputedStyle(el).getPropertyValue("padding-right"),
			),
		}));
	expect(heroPadding.left).toBe(0);
	expect(heroPadding.right).toBe(0);

	// Hero inner .wrap should be full width
	const wrapWidth = await page
		.locator(".runway-page-hero .wrap")
		.evaluate((el) => el.getBoundingClientRect().width);
	expect(wrapWidth).toBe(375);

	// Card grid
	const gridPadding = await page.locator(".rt2-card-grid").evaluate((el) => ({
		left: parseFloat(
			window.getComputedStyle(el).getPropertyValue("padding-left"),
		),
		right: parseFloat(
			window.getComputedStyle(el).getPropertyValue("padding-right"),
		),
	}));
	expect(gridPadding.left).toBe(0);
	expect(gridPadding.right).toBe(0);

	// Click into detail view
	await page.locator(".rt2-card").first().click();
	await page.waitForTimeout(300);

	// Detail view
	const detailPadding = await page.locator(".rt2-detail").evaluate((el) => ({
		left: parseFloat(
			window.getComputedStyle(el).getPropertyValue("padding-left"),
		),
		right: parseFloat(
			window.getComputedStyle(el).getPropertyValue("padding-right"),
		),
	}));
	expect(detailPadding.left).toBe(0);
	expect(detailPadding.right).toBe(0);
});

test("runway page — tablet: two column card grid", async ({ page }) => {
	await page.setViewportSize({ width: 768, height: 900 });
	await page.goto("/runway");

	// In two columns, the first card should be roughly half the container width
	const gridWidth = await page
		.locator(".rt2-card-grid")
		.evaluate((el) => el.getBoundingClientRect().width);
	const firstCardWidth = await page
		.locator(".rt2-card")
		.first()
		.evaluate((el) => el.getBoundingClientRect().width);

	// Account for gap: 2 cols = (container - gap) / 2
	const expectedPerCol = (gridWidth - 16) / 2; // 1rem gap = 16px
	expect(firstCardWidth).toBeCloseTo(expectedPerCol, -1);
});

/* ─── Full page scroll — no errors ───────────────────────────── */

test("runway page — scroll through card grid without error", async ({
	page,
}) => {
	test.setTimeout(30000);
	await page.goto("/runway");

	const errors: string[] = [];
	page.on("pageerror", (err) => errors.push(err.message));

	// Scroll down
	await page.evaluate(() => window.scrollTo({ top: 400, behavior: "smooth" }));
	await page.waitForTimeout(400);
	// Scroll back
	await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
	await page.waitForTimeout(400);

	expect(errors).toHaveLength(0);
});
