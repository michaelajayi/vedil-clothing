import { test, expect } from "@playwright/test";

test("contact page loads company profile data from backend", async ({
	page,
}) => {
	await page.route("**/api/company-profile", async (route) => {
		await route.fulfill({
			contentType: "application/json",
			body: JSON.stringify({
				id: "profile-1",
				phone: "+2348138683171",
				whatsapp: "+2348138683171",
				email: "hello@vedilclothing.com",
				addressLine: "95 Ago Palace Way",
				city: "Lagos",
				state: "Lagos",
				country: "Nigeria",
				instagramUrl: "",
				facebookUrl: "",
				tiktokUrl: "",
			}),
		});
	});

	await page.goto("/contact");
	await expect(page.locator(".contact-info-list")).toContainText(
		"+2348138683171",
	);
	await expect(page.locator(".contact-info-list")).toContainText(
		"hello@vedilclothing.com",
	);
	expect(
		await page
			.locator(".contact-info-list .contact-info-item")
			.first()
			.evaluate((element) => getComputedStyle(element).opacity),
	).toBe("1");
});

test("footer loads company profile data from backend", async ({ page }) => {
	const errors: string[] = [];
	page.on("pageerror", (err) => errors.push(err.message));

	await page.route("**/api/company-profile", async (route) => {
		await route.fulfill({
			contentType: "application/json",
			body: JSON.stringify({
				id: "profile-1",
				phone: "+2348138683171",
				whatsapp: "+2348138683171",
				email: "hello@vedilclothing.com",
				addressLine: "95 Ago Palace Way",
				city: "Lagos",
				state: "Lagos",
				country: "Nigeria",
				instagramUrl: "",
				facebookUrl: "",
				tiktokUrl: "",
			}),
		});
	});

	await page.goto("/", { waitUntil: "networkidle" });
	await page.waitForTimeout(3000);

	const text = await page.locator(".foot-contact").textContent();

	console.log("=== Footer contact text ===");
	console.log(text);

	// Should contain actual data, not "Contact details loading"
	expect(text).not.toContain("Contact details loading");

	// Should render all 4 items as links
	await expect(
		page.locator(".foot-contact a[href*='maps.google.com']"),
	).toBeVisible();
	await expect(
		page.locator(".foot-contact a[href*='tel:+2348138683171']"),
	).toBeVisible();
	await expect(
		page.locator(".foot-contact a[href*='mailto:hello@vedilclothing.com']"),
	).toBeVisible();
	await expect(
		page.locator(".foot-contact a[href*='wa.me/2348138683171']"),
	).toBeVisible();

	if (errors.length > 0) {
		console.log("=== Page errors ===");
		errors.forEach((e) => console.log(e));
	}
});
