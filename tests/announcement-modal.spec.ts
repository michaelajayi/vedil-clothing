import { test, expect, type Page } from "@playwright/test";

// ─── Mock fixtures ───────────────────────────────────────────
// The modal reads GET /api/popups/active — intercept it so tests are
// deterministic and independent of whatever the admin has live.

const POPUP_API_GLOB = "**/api/popups/active";
const DISMISSED_STORAGE_KEY = "announcement-dismissed";

const TINY_PNG_BASE64 =
	"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

interface PopupFixture {
	id: string;
	title: string;
	body: string;
	imageUrl: string | null;
	imageAlt: string | null;
	ctaText: string | null;
	ctaLnk: string | null;
	activeFrom: string;
	activeUntil: string;
	updatedAt: string;
}

function makePopup(overrides: Partial<PopupFixture> = {}): PopupFixture {
	return {
		id: "f06512a6-1111-2222-3333-444455556666",
		title: "No Available Designs on the Website",
		body:
			"THERE ARE CURRENTLY NO AVAILABLE DESIGNS ON OUR WEBSITE.\n\n" +
			"From 10th August, our website will once again be filled with available designs.",
		imageUrl: null,
		imageAlt: null,
		ctaText: "Got It",
		ctaLnk: null,
		activeFrom: "2026-08-15T10:59:00.000Z",
		activeUntil: "2030-08-30T23:59:00.000Z",
		updatedAt: "2026-08-15T11:49:34.583Z",
		...overrides,
	};
}

async function mockActivePopup(
	page: Page,
	popup: PopupFixture | null,
): Promise<void> {
	await page.route(POPUP_API_GLOB, (route) =>
		route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({ popup }),
		}),
	);
}

/** Force image loads to fail so onError paths are deterministic. */
async function mockImagesToFail(page: Page): Promise<void> {
	await page.route("**/res.cloudinary.com/**", (route) => route.abort());
}

async function openModal(page: Page): Promise<void> {
	const modal = page.locator(".announcement-content");
	await expect(modal).toBeVisible({ timeout: 10000 });
}

async function dismissViaCloseButton(page: Page): Promise<void> {
	await page.locator(".announcement-close-button").click();
	await expect(page.locator(".announcement-content")).not.toBeVisible();
}

test.describe("Announcement Modal", () => {
	test.beforeEach(async ({ page }) => {
		// Clear dismissal state ONCE per test. Init scripts run on every
		// navigation, so guard with a sessionStorage flag — otherwise the
		// cleanup would wipe dismissals on reloads mid-test.
		await page.addInitScript(() => {
			if (sessionStorage.getItem("__announcement_cleared") === "1") return;
			sessionStorage.setItem("__announcement_cleared", "1");
			localStorage.removeItem("announcement-dismissed");
			localStorage.removeItem("announcement-no-designs-aug-10-dismissed");
			localStorage.removeItem("announcement-dismissed-ids");
		});
	});

	test("renders content after the ~2s delay, without the legacy badge row", async ({
		page,
	}) => {
		await mockActivePopup(page, makePopup());
		await page.goto("/");

		const modal = page.locator(".announcement-content");

		// Not shown immediately — the delay has not elapsed yet.
		await expect(modal).not.toBeVisible({ timeout: 1500 });

		// Then it appears (fetch + delay).
		await openModal(page);

		await expect(modal.locator(".announcement-headline")).toHaveText(
			"No Available Designs on the Website",
		);

		const paragraphs = modal.locator(".announcement-body p");
		await expect(paragraphs).toHaveCount(2);
		await expect(paragraphs.first()).toContainText(
			"NO AVAILABLE DESIGNS ON OUR WEBSITE",
		);

		// Badge row is gone — the image/content is the first element.
		await expect(modal.locator(".announcement-new-tag")).toHaveCount(0);
		await expect(modal.locator(".announcement-date")).toHaveCount(0);

		await expect(modal.locator(".announcement-actions .btn")).toBeVisible();
	});

	test("close-button dismissal persists across reloads", async ({ page }) => {
		await mockActivePopup(page, makePopup());
		await page.goto("/");
		await openModal(page);

		await dismissViaCloseButton(page);

		await page.reload();
		await page.waitForTimeout(3200); // allow fetch + delay window
		await expect(page.locator(".announcement-content")).not.toBeVisible();
	});

	test("ESC dismissal persists across reloads", async ({ page }) => {
		await mockActivePopup(page, makePopup());
		await page.goto("/");
		await openModal(page);

		await page.keyboard.press("Escape");
		await expect(page.locator(".announcement-content")).not.toBeVisible();

		await page.reload();
		await page.waitForTimeout(3200);
		await expect(page.locator(".announcement-content")).not.toBeVisible();
	});

	test("overlay-click dismissal persists across reloads", async ({ page }) => {
		await mockActivePopup(page, makePopup());
		await page.goto("/");
		await openModal(page);

		// Click outside the dialog — on the overlay.
		await page.mouse.click(5, 5);
		await expect(page.locator(".announcement-content")).not.toBeVisible();

		await page.reload();
		await page.waitForTimeout(3200);
		await expect(page.locator(".announcement-content")).not.toBeVisible();
	});

	test("CTA button dismissal persists across reloads", async ({ page }) => {
		await mockActivePopup(page, makePopup());
		await page.goto("/");
		await openModal(page);

		await page.locator(".announcement-actions .btn").click();
		await expect(page.locator(".announcement-content")).not.toBeVisible();

		await page.reload();
		await page.waitForTimeout(3200);
		await expect(page.locator(".announcement-content")).not.toBeVisible();
	});

	test("admin content edit (updatedAt bump) re-shows a dismissed popup", async ({
		page,
	}) => {
		const v1 = makePopup();
		const v2 = makePopup({
			title: "We're back!",
			body: "New designs are live.",
			updatedAt: "2026-08-15T12:00:00.000Z",
		});

		await mockActivePopup(page, v1);
		await page.goto("/");
		await openModal(page);
		await dismissViaCloseButton(page);

		// Same version — still dismissed after reload.
		await page.reload();
		await page.waitForTimeout(3200);
		await expect(page.locator(".announcement-content")).not.toBeVisible();

		// Admin edits content → next load re-shows it with the new version.
		await page.unroute(POPUP_API_GLOB);
		await mockActivePopup(page, v2);
		await page.reload();
		await openModal(page);
		await expect(page.locator(".announcement-headline")).toHaveText(
			"We're back!",
		);
	});

	test("dismissal whose window has passed re-shows the popup", async ({
		page,
	}) => {
		const popup = makePopup();

		// Simulate a visitor whose stored dismissal expired (old window ended).
		await page.addInitScript(
			([key, id, updatedAt]) => {
				localStorage.setItem(
					key,
					JSON.stringify({
						[id]: {
							dismissedUntil: "2020-01-01T00:00:00.000Z", // long past
							versionAt: updatedAt,
						},
					}),
				);
			},
			[DISMISSED_STORAGE_KEY, popup.id, popup.updatedAt] as const,
		);

		await mockActivePopup(page, popup);
		await page.goto("/");
		await openModal(page);
	});

	test("external CTA renders a new-tab anchor and records dismissal", async ({
		page,
	}) => {
		await mockActivePopup(
			page,
			makePopup({ ctaText: "Shop now", ctaLnk: "https://example.com/shop" }),
		);
		await page.goto("/");
		await openModal(page);

		const cta = page.locator(".announcement-actions a.btn");
		await expect(cta).toHaveAttribute("href", "https://example.com/shop");
		await expect(cta).toHaveAttribute("target", "_blank");
		await expect(cta).toHaveAttribute("rel", "noopener noreferrer");

		await cta.click();
		await expect(page.locator(".announcement-content")).not.toBeVisible();

		// Dismissal recorded → gone on the next load too.
		await page.reload();
		await page.waitForTimeout(3200);
		await expect(page.locator(".announcement-content")).not.toBeVisible();
	});

	test("internal CTA navigates in the same tab without a target", async ({
		page,
	}) => {
		await mockActivePopup(page, makePopup({ ctaText: "Shop", ctaLnk: "/shop" }));
		await page.goto("/");
		await openModal(page);

		const cta = page.locator(".announcement-actions a.btn");
		await expect(cta).toHaveAttribute("href", "/shop");
		await expect(cta).not.toHaveAttribute("target", /.*/);
	});

	test("unsafe javascript: CTA falls back to a dismiss button", async ({
		page,
	}) => {
		await mockActivePopup(
			page,
			makePopup({ ctaText: "Click me", ctaLnk: "javascript:alert(1)" }),
		);
		await page.goto("/");
		await openModal(page);

		const actions = page.locator(".announcement-actions");
		// No anchor rendered — a plain button instead.
		await expect(actions.locator("a")).toHaveCount(0);
		const btn = actions.locator("button.btn");
		await expect(btn).toBeVisible();

		await btn.click();
		await expect(page.locator(".announcement-content")).not.toBeVisible();
	});

	test("no popup → nothing is rendered", async ({ page }) => {
		await mockActivePopup(page, null);
		await page.goto("/");
		await page.waitForTimeout(3500); // fetch + delay window would have passed
		await expect(page.locator(".announcement-content")).toHaveCount(0);
	});

	test("cross-tab dismissal closes the dialog in other tabs", async ({
		context,
	}) => {
		const page1 = await context.newPage();
		const page2 = await context.newPage();

		await mockActivePopup(page1, makePopup());
		await page1.goto("/");
		await openModal(page1);

		// page2 needs a real origin before touching localStorage.
		await page2.goto("/");
		await mockActivePopup(page2, makePopup());

		// Dismiss in a second tab (same origin → same localStorage).
		const popupId = "f06512a6-1111-2222-3333-444455556666";
		await page2.evaluate(
			([key, id]) => {
				localStorage.setItem(
					key,
					JSON.stringify({
						[id]: {
							dismissedUntil: "2030-08-30T23:59:00.000Z",
							versionAt: "2026-08-15T11:49:34.583Z",
						},
					}),
				);
			},
			[DISMISSED_STORAGE_KEY, popupId] as const,
		);

		// The storage event closes the popup in the first tab.
		await expect(page1.locator(".announcement-content")).not.toBeVisible();
	});

	test("image load failure hides the image container", async ({ page }) => {
		await mockActivePopup(
			page,
			makePopup({
				imageUrl: "https://res.cloudinary.com/vedil/popup.webp",
				imageAlt: "WE WILL BE BACK 10TH OF AUGUST",
			}),
		);
		await mockImagesToFail(page);
		await page.goto("/");
		await openModal(page);

		// Container hidden — no broken icon — rest of the popup remains.
		await expect(page.locator(".announcement-image-wrap")).toHaveCount(0);
		await expect(page.locator(".announcement-headline")).toBeVisible();
		await expect(page.locator(".announcement-actions .btn")).toBeVisible();
	});

	test("image renders with alt text and a 16:9 wrap", async ({ page }) => {
		await mockActivePopup(
			page,
			makePopup({
				imageUrl: "https://res.cloudinary.com/vedil/popup.webp",
				imageAlt: "WE WILL BE BACK 10TH OF AUGUST",
			}),
		);
		await page.route("**/res.cloudinary.com/**", (route) =>
			route.fulfill({
				status: 200,
				contentType: "image/png",
				body: Buffer.from(TINY_PNG_BASE64, "base64"),
			}),
		);
		await page.goto("/");
		await openModal(page);

		const wrap = page.locator(".announcement-image-wrap");
		await expect(wrap).toBeVisible();
		await expect(wrap.locator("img")).toHaveAttribute(
			"alt",
			"WE WILL BE BACK 10TH OF AUGUST",
		);
	});

	test("refocus refetch holds an open dialog when the popup is edited", async ({
		page,
	}) => {
		const v1 = makePopup();
		const v2 = makePopup({
			title: "We're back!",
			updatedAt: "2026-08-15T12:00:00.000Z",
		});

		await mockActivePopup(page, v1);
		await page.goto("/");
		await openModal(page);

		// Admin edits while the visitor is reading → same popup id comes back.
		await page.unroute(POPUP_API_GLOB);
		await mockActivePopup(page, v2);

		// Simulate the tab regaining focus.
		await page.evaluate(() => window.dispatchEvent(new Event("focus")));

		// Hold on edit: the open dialog keeps the old content.
		await expect(page.locator(".announcement-headline")).toHaveText(
			"No Available Designs on the Website",
		);

		// After dismissing the old version, the edited one shows next load.
		await dismissViaCloseButton(page);
		await page.reload();
		await openModal(page);
		await expect(page.locator(".announcement-headline")).toHaveText(
			"We're back!",
		);
	});

	test("refocus refetch closes a dialog whose popup went away", async ({
		page,
	}) => {
		await mockActivePopup(page, makePopup());
		await page.goto("/");
		await openModal(page);

		// Admin deactivates the popup while the visitor is away.
		await page.unroute(POPUP_API_GLOB);
		await mockActivePopup(page, null);

		await page.evaluate(() => window.dispatchEvent(new Event("focus")));

		// Close on gone.
		await expect(page.locator(".announcement-content")).not.toBeVisible();
	});

	test("reduced motion disables the entrance animation", async ({ page }) => {
		await page.emulateMedia({ reducedMotion: "reduce" });
		await mockActivePopup(page, makePopup());
		await page.goto("/");
		await openModal(page);

		const animationName = await page
			.locator(".announcement-content")
			.evaluate((el) => getComputedStyle(el).animationName);
		expect(animationName).toBe("none");
	});
});
