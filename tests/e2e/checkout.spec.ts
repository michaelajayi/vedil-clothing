import { test, expect } from "@playwright/test";

test.describe("checkout flow", () => {
	test("checkout redirects to Paystack", async ({ page }) => {
		// ── Navigate first (establishes a document with localStorage) ──
		await page.goto("/shop");
		await page.waitForLoadState("networkidle");

		// ── Set up cart session + items ─────────────────────
		const sessionId = crypto.randomUUID();
		await page.evaluate((sid) => {
			localStorage.setItem("vedil_cart_session", sid);
		}, sessionId);

		// Add to backend cart via API
		const addRes = await page.request.post(
			`http://localhost:4000/api/cart/${sessionId}/items`,
			{
				data: {
					variantId: "d6b1fef3-f38b-4525-83b8-0fbedcfd2232",
					quantity: 1,
				},
				headers: { "Content-Type": "application/json" },
			},
		);
		expect(addRes.ok()).toBeTruthy();

		// Seed localStorage with enriched cart item
		await page.evaluate(() => {
			const item = {
				id: "d6b1fef3-f38b-4525-83b8-0fbedcfd2232",
				backendCartItemId: "__pending__",
				name: "Vedil Signature Tee",
				retailPrice: 70000,
				wholesalePrice: 0,
				moq: 1,
				quantity: 1,
			};
			localStorage.setItem("vedil_cart", JSON.stringify([item]));
		});

		// ── Navigate to checkout page ─────────────────────────
		await page.goto("/checkout");
		await page.waitForLoadState("networkidle");
		await page.waitForTimeout(2000); // let cart context hydrate

		// Verify the checkout form is showing
		const heading = page.locator("h1");
		await expect(heading).toContainText("Checkout");

		// ── Fill form ─────────────────────────────────────────
		await page.fill("#firstName", "Test");
		await page.fill("#lastName", "User");
		await page.fill("#email", "test@example.com");

		const phoneInput = page.locator(".phone-input__number");
		await phoneInput.fill("813 868 3171");

		// ── Submit and expect Paystack redirect ──────────────
		const submitBtn = page.locator('button[type="submit"]');
		await expect(submitBtn).toBeEnabled({ timeout: 10000 });

		const paystackPromise = page.waitForURL(/checkout\.paystack\.com\//, {
			timeout: 20000,
		});
		await submitBtn.click();
		await paystackPromise;

		expect(page.url()).toContain("paystack.com");
	});

	test("empty cart shows empty state", async ({ page }) => {
		await page.goto("/checkout");
		await page.waitForLoadState("networkidle");
		await page.waitForTimeout(2000);

		await expect(page.locator("h1")).toContainText("Nothing to checkout");
		await expect(page.getByRole("link", { name: "Browse Shop" })).toBeVisible();
	});
});
