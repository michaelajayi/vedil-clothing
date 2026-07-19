import { test, expect } from "@playwright/test";

test.describe("Academy (It's Fun to Sew) page — layout", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/fun-to-sew");
		// Scroll to trigger reveal animations
		await page.evaluate(() =>
			window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }),
		);
		await page.waitForTimeout(1000);
		await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
		await page.waitForTimeout(500);
	});

	test("course items render image and body on the same grid row", async ({
		page,
	}) => {
		const items = page.locator(".course-item");
		await expect(items.first()).toBeVisible({ timeout: 10000 });

		for (let i = 0; i < (await items.count()); i++) {
			const item = items.nth(i);
			const img = item.locator(".course-item-img");
			const body = item.locator(".course-item-body");

			await expect(img).toBeVisible();
			await expect(body).toBeVisible();

			const imgBox = await img.boundingBox();
			const bodyBox = await body.boundingBox();
			expect(imgBox).not.toBeNull();
			expect(bodyBox).not.toBeNull();

			if (imgBox && bodyBox) {
				const verticalOverlap =
					imgBox.y < bodyBox.y + bodyBox.height &&
					bodyBox.y < imgBox.y + imgBox.height;
				expect(verticalOverlap).toBeTruthy();
			}
		}
	});

	test("format buttons have spacing between them", async ({ page }) => {
		const buttons = page.locator(".format-switcher-nav .format-tab");
		await expect(buttons.first()).toBeVisible({ timeout: 5000 });

		const count = await buttons.count();
		for (let i = 0; i < count - 1; i++) {
			const a = await buttons.nth(i).boundingBox();
			const b = await buttons.nth(i + 1).boundingBox();
			expect(a).not.toBeNull();
			expect(b).not.toBeNull();
			if (a && b) {
				const gap = b.x - (a.x + a.width);
				expect(gap).toBeGreaterThan(4);
			}
		}
	});

	test("format buttons have transparent background when inactive", async ({
		page,
	}) => {
		const buttons = page.locator(".format-switcher-nav .format-tab");
		await expect(buttons.first()).toBeVisible({ timeout: 5000 });

		for (let i = 0; i < (await buttons.count()); i++) {
			const btn = buttons.nth(i);
			const cls = await btn.getAttribute("class");
			const isActive = cls?.includes("format-tab--active") ?? false;
			const bg = await btn.evaluate(
				(el) => getComputedStyle(el).backgroundColor,
			);

			if (isActive) {
				expect(bg).not.toBe("rgba(0, 0, 0, 0)");
				expect(bg).not.toBe("transparent");
			} else {
				expect(bg === "rgba(0, 0, 0, 0)" || bg === "transparent").toBeTruthy();
			}
		}
	});

	test("skeleton-pulse CSS class is defined with animation", async ({
		page,
	}) => {
		const found = await page.evaluate(() => {
			for (const sheet of document.styleSheets) {
				try {
					for (const rule of sheet.cssRules) {
						if (
							rule instanceof CSSStyleRule &&
							rule.selectorText.includes("skeleton-pulse")
						) {
							return true;
						}
					}
				} catch {
					/* cross-origin */
				}
			}
			return false;
		});
		expect(found).toBe(true);
	});

	test("tab filtering preserves course data when switching tabs", async ({
		page,
	}) => {
		const items = page.locator(".course-item");
		await expect(items.first()).toBeVisible({ timeout: 10000 });

		const initialCount = await items.count();
		if (initialCount === 0) {
			test.skip();
			return;
		}

		// Click "In-person"
		await page.locator(".format-tab", { hasText: "In-person" }).click();
		await page.waitForTimeout(500);

		// Should show courses or empty state (not blank)
		const afterInPerson = await page.locator(".course-item").count();
		const hasEmpty = (await page.locator("text=No courses").count()) > 0;
		expect(afterInPerson > 0 || hasEmpty).toBeTruthy();

		// Hero should still be visible
		await expect(page.locator("text=Learn to sew")).toBeVisible();

		// Click back to "All"
		await page.locator(".format-tab", { hasText: /^All$/ }).click();
		await page.waitForTimeout(500);

		expect(await page.locator(".course-item").count()).toBe(initialCount);
	});
});
