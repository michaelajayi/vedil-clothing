import { test, expect } from "@playwright/test";

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

async function scrollThrough(page: import("@playwright/test").Page) {
	await page.evaluate(() =>
		window.scrollTo({
			top: document.body.scrollHeight / 2,
			behavior: "smooth",
		}),
	);
	await page.waitForTimeout(800);
	await page.evaluate(() =>
		window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }),
	);
	await page.waitForTimeout(800);
	await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
	await page.waitForTimeout(500);
}

/* ─── Page hero ──────────────────────────────────────────────────────────── */

test("runway page — hero renders with title", async ({ page }) => {
	await page.goto("/runway");
	await expect(page.locator("h1")).toContainText("Our");
	await expect(page.locator("h1 em")).toContainText("Collections");
	await expect(page.locator(".eyebrow")).toContainText("Runway");
	await expect(page).toHaveTitle(/Runway/);
});

/* ─── Event sections ─────────────────────────────────────────────────────── */

test("runway page — event sections render in correct order", async ({
	page,
}) => {
	await page.goto("/runway");

	// Newest first: 2026, 2019, 2018
	const eventYears = page.locator(".runway-event-year");
	await expect(eventYears.nth(0)).toContainText("2026");
	await expect(eventYears.nth(1)).toContainText("2019");
	await expect(eventYears.nth(2)).toContainText("2018");
});

test("runway page — first event shows collection tabs", async ({ page }) => {
	await page.goto("/runway");

	// Imperial Softness should be the first collection tab
	const tabs = page.locator(".runway-collection-tab");
	await expect(tabs.first()).toContainText("Imperial Softness");
	await expect(tabs.nth(1)).toContainText("Collection Two");
	await expect(tabs.nth(2)).toContainText("Collection Three");
});

test("runway page — switching collection tab updates the hero", async ({
	page,
}) => {
	await page.goto("/runway");

	// Default shows Imperial Softness
	await expect(page.locator(".runway-collection-name").first()).toContainText(
		"Imperial Softness",
	);

	// Click Collection Two tab
	await page.locator(".runway-collection-tab").nth(1).click();
	await expect(page.locator(".runway-collection-name").first()).toContainText(
		"Collection Two",
	);
});

/* ─── Gallery ─────────────────────────────────────────────────────────────── */

test("runway page — gallery renders media items", async ({ page }) => {
	await page.goto("/runway");

	// Imperial Softness has 2 media items (1 image, 1 video)
	const items = page.locator(".runway-masonry-item");
	await expect(items).toHaveCount(2);

	// First item should be an image
	await expect(items.first().locator("img")).toBeVisible();
});

test("runway page — video play icon overlay is present", async ({ page }) => {
	await page.goto("/runway");

	const playBtn = page.locator(".runway-play-btn").first();
	await expect(playBtn).toBeVisible();
});

/* ─── Lightbox ────────────────────────────────────────────────────────────── */

test("runway page — clicking media opens lightbox", async ({ page }) => {
	await page.goto("/runway");

	// Click the first media item
	await page.locator(".runway-masonry-item").first().click();
	await expect(page.locator(".runway-lightbox.open")).toBeVisible();
});

test("runway page — lightbox navigation works", async ({ page }) => {
	await page.goto("/runway");

	// Click first item
	await page.locator(".runway-masonry-item").first().click();
	await page.waitForTimeout(500);

	// Click next button
	await page.locator(".runway-lightbox-nav--next").click();
	await page.waitForTimeout(300);

	// Click previous button
	await page.locator(".runway-lightbox-nav--prev").click();
	await page.waitForTimeout(300);

	// Close with Escape
	await page.keyboard.press("Escape");
	await expect(page.locator(".runway-lightbox.open")).not.toBeVisible();
});

/* ─── Sticky event nav (scroll spy) ──────────────────────────────────────── */

test("runway page — sticky event nav shows and highlights first event", async ({
	page,
}) => {
	await page.goto("/runway");

	const nav = page.locator(".runway-event-nav");
	await expect(nav).toBeVisible();

	// First button should be active (2026)
	await expect(page.locator(".runway-event-nav-btn").first()).toHaveClass(
		/active/,
	);
});

test("runway page — scrolling highlights correct event in nav", async ({
	page,
}) => {
	await page.goto("/runway");

	// Scroll to 2019 section
	await page.locator("#epic-2019").scrollIntoViewIfNeeded();
	await page.waitForTimeout(600);

	// The 2019 nav button should be active
	await expect(
		page.locator('.runway-event-nav-btn[aria-current="true"]'),
	).toContainText("2019");
});

/* ─── Empty collection states ──────────────────────────────────────────────── */

test("runway page — empty collections show placeholder", async ({ page }) => {
	await page.goto("/runway");

	// Switch to Collection Two (no media) — within the 2026 event section
	await page.locator("#epic-2026 .runway-collection-tab").nth(1).click();
	await page.waitForTimeout(300);

	await expect(
		page.locator("#epic-2026 .runway-empty-collection"),
	).toBeVisible();
	await expect(
		page.locator("#epic-2026 .runway-empty-collection"),
	).toContainText("Media coming soon");
});

/* ─── Video aspect ratio (landscape video in portrait metadata) ──────────── */

test("runway page — video has correct aspect ratio and object-fit", async ({
	page,
}) => {
	await page.goto("/runway");

	// The Imperial Softness video has aspectRatio: "16/9"
	const video = page.locator(".runway-masonry-item video").first();
	await expect(video).toBeVisible();

	// Check the inline style
	const aspectRatio = await video.getAttribute("style");
	expect(aspectRatio).toContain("16/9");

	// Check that object-fit is contain (not cover) — shows full frame
	const objectFit = await video.evaluate((el) =>
		window.getComputedStyle(el).getPropertyValue("object-fit"),
	);
	expect(objectFit).toBe("contain");
});

/* ─── Header navigation ──────────────────────────────────────────────────── */

test("runway page — header has Runway link", async ({ page }) => {
	await page.goto("/runway");

	// Desktop nav
	const desktopNav = page.locator("nav a[href='/runway']").first();
	await expect(desktopNav).toBeVisible();
	await expect(desktopNav).toContainText("Runway");
});

/* ─── Responsive: mobile hides sidebar ──────────────────────────────────── */

test("runway page — sidebar hidden on mobile", async ({ page }) => {
	await page.setViewportSize({ width: 768, height: 900 });
	await page.goto("/runway");

	const nav = page.locator(".runway-event-nav");
	await expect(nav).not.toBeVisible();
});

/* ─── Full page scroll test ────────────────────────────────────────────────── */

test("runway page — scroll through all events without error", async ({
	page,
}) => {
	await page.goto("/runway");
	await scrollThrough(page);

	// Should still be on the runway page
	await expect(page).toHaveURL("/runway");
	// No console errors
	const errors: string[] = [];
	page.on("pageerror", (err) => errors.push(err.message));
	await page.waitForTimeout(500);
	expect(errors).toHaveLength(0);
});
