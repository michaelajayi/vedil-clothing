import { test, expect } from "@playwright/test";

test.describe("Cart page responsiveness", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
		await page.evaluate(() => {
			const items = [
				{
					id: "variant-1",
					name: "Premium Cotton Tee",
					retailPrice: 45000,
					wholesalePrice: 35000,
					moq: 5,
					quantity: 2,
					size: "L",
					category: "clothing",
					kind: "PHYSICAL",
				},
				{
					id: "variant-2",
					name: "Vedil Signature Hoodie",
					retailPrice: 85000,
					wholesalePrice: 68000,
					moq: 3,
					quantity: 1,
					size: "M",
					category: "clothing",
					kind: "PHYSICAL",
				},
				{
					id: "variant-3",
					name: "Linen Relaxed Pants",
					retailPrice: 55000,
					wholesalePrice: null,
					moq: 0,
					quantity: 3,
					size: "XL",
					category: "clothing",
					kind: "PHYSICAL",
				},
			];
			localStorage.setItem("vedil_cart", JSON.stringify(items));
		});
	});

	test("should have no horizontal scroll on mobile viewport", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 375, height: 812 });
		await page.goto("/cart");
		await page.waitForLoadState("networkidle");
		await expect(page.locator(".cart-table")).toBeVisible();

		await page.screenshot({
			path: "tests/screenshots/cart-mobile.png",
			fullPage: true,
		});

		const hasHorizontalScroll = await page.evaluate(() => {
			return (
				document.documentElement.scrollWidth >
				document.documentElement.clientWidth
			);
		});
		expect(hasHorizontalScroll).toBe(false);
	});

	test("should render cart items as cards on mobile", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 812 });
		await page.goto("/cart");
		await page.waitForLoadState("networkidle");
		await expect(page.locator(".cart-table")).toBeVisible();

		// Thead should be hidden on mobile
		const theadInvisible = await page.evaluate(() => {
			const thead = document.querySelector(".cart-table thead");
			return thead ? window.getComputedStyle(thead).display === "none" : false;
		});
		expect(theadInvisible).toBe(true);

		// Rows should be visible
		const rows = page.locator(".cart-table tbody tr");
		await expect(rows).toHaveCount(3);
	});

	test("should render correctly on tablet viewport", async ({ page }) => {
		await page.setViewportSize({ width: 768, height: 1024 });
		await page.goto("/cart");
		await page.waitForLoadState("networkidle");
		await expect(page.locator(".cart-table")).toBeVisible();

		// On tablet, thead should be visible (above 760px breakpoint)
		const theadVisible = await page.evaluate(() => {
			const thead = document.querySelector(".cart-table thead");
			return thead ? window.getComputedStyle(thead).display !== "none" : false;
		});
		expect(theadVisible).toBe(true);

		const hasHorizontalScroll = await page.evaluate(() => {
			return (
				document.documentElement.scrollWidth >
				document.documentElement.clientWidth
			);
		});
		expect(hasHorizontalScroll).toBe(false);
	});

	test("qty toggle should have adequate tap targets on mobile", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 375, height: 812 });
		await page.goto("/cart");
		await page.waitForLoadState("networkidle");
		await expect(page.locator(".cart-table")).toBeVisible();

		// Every qty button should be at least 32x32px (Apple HIG minimum)
		const tapTargets = await page.evaluate(() => {
			const btns = document.querySelectorAll(".qty-btn");
			return Array.from(btns).map((b) => {
				const r = b.getBoundingClientRect();
				return { w: r.width, h: r.height };
			});
		});
		for (const t of tapTargets) {
			expect(t.w).toBeGreaterThanOrEqual(32);
			expect(t.h).toBeGreaterThanOrEqual(32);
		}
	});

	test("qty toggle should be usable at smallest supported viewport (360px)", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 360, height: 740 });
		await page.goto("/cart");
		await page.waitForLoadState("networkidle");
		await expect(page.locator(".cart-table")).toBeVisible();

		// No horizontal scroll
		const hasScroll = await page.evaluate(() => {
			return (
				document.documentElement.scrollWidth >
				document.documentElement.clientWidth
			);
		});
		expect(hasScroll).toBe(false);

		// Qty buttons should be visible and not clipped
		const allVisible = await page.evaluate(() => {
			const btns = document.querySelectorAll(".qty-btn");
			return Array.from(btns).every((b) => {
				const r = b.getBoundingClientRect();
				return r.width > 0 && r.height > 0 && r.left >= 0;
			});
		});
		expect(allVisible).toBe(true);

		// Click increase then decrease, verify quantity updates
		const firstInc = page.locator(".qty-btn").nth(1); // first "+" button
		const firstDec = page.locator(".qty-btn").nth(0); // first "-" button
		const qtyNum = page.locator(".qty-num").first();

		await expect(qtyNum).toHaveText("2");
		await firstInc.click();
		await expect(qtyNum).toHaveText("3");
		await firstDec.click();
		await expect(qtyNum).toHaveText("2");
	});

	test("remove button should be visible and clickable on mobile", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 375, height: 812 });
		await page.goto("/cart");
		await page.waitForLoadState("networkidle");
		await expect(page.locator(".cart-table")).toBeVisible();

		// Remove buttons should be visible on mobile
		const removeBtns = page.locator(".remove-btn");
		await expect(removeBtns.first()).toBeVisible();

		// Clicking remove should remove the item
		await removeBtns.first().click();
		await expect(page.locator(".cart-table tbody tr")).toHaveCount(2);
	});
});
