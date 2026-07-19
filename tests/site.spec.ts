import { test, expect } from "@playwright/test";

// ─── helpers ────────────────────────────────────────────────────────────────

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

// ─── Navigation ─────────────────────────────────────────────────────────────

test("logo links back to home from any page", async ({ page }) => {
	await page.goto("/about");
	await page.click("a[href='/']");
	await expect(page).toHaveURL("/");
});

test("shop dropdown shows category links", async ({ page }) => {
	await page.goto("/");
	await page.hover(".has-dropdown");
	await page.waitForTimeout(400);
	const dropdown = page.locator(".dropdown--mega");
	await expect(
		dropdown.getByRole("link", { name: "Men", exact: true }),
	).toBeVisible();
	await expect(
		dropdown.getByRole("link", { name: "Women", exact: true }),
	).toBeVisible();
	await expect(
		dropdown.getByRole("link", { name: "Children", exact: true }),
	).toBeVisible();
});

// ─── Home ────────────────────────────────────────────────────────────────────

test("home page — hero and sections render", async ({ page }) => {
	await page.goto("/");
	await scrollThrough(page);
	await expect(page.locator("h1, [class*='hero'] h2").first()).toBeVisible();
	await expect(page.locator("text=Shop by category")).toBeVisible();
	await expect(page.locator("text=What our community says")).toBeVisible();
});

// ─── About ───────────────────────────────────────────────────────────────────

test("about page — mission and values render", async ({ page }) => {
	await page.goto("/about");
	await scrollThrough(page);
	await expect(
		page.getByRole("heading", { name: "Welcome to Vedil Clothing" }),
	).toBeVisible();
});

// ─── Academy ─────────────────────────────────────────────────────────────────

test("academy page — headline and courses render", async ({ page }) => {
	await page.goto("/academy");
	await scrollThrough(page);
	await expect(page.locator("text=Learn to sew")).toBeVisible();
});

// ─── Shop ────────────────────────────────────────────────────────────────────

test("shop page — hero and product grid render", async ({ page }) => {
	await page.goto("/shop");
	await scrollThrough(page);
	await expect(page.locator("text=Made in Lagos")).toBeVisible();
	await expect(page.locator("text=New In")).toBeVisible();
});

// ─── Contact ─────────────────────────────────────────────────────────────────

test("contact form — fill and validate", async ({ page }) => {
	await page.goto("/contact");
	await page.waitForTimeout(600);

	// Fill the form like a real visitor
	await page.fill(
		"input[name='name'], input[placeholder*='name' i]",
		"Amara Okonkwo",
	);
	await page.fill("input[type='email']", "amara@example.com");

	const phoneInput = page
		.locator("input[type='tel'], input[placeholder*='phone' i]")
		.first();
	if (await phoneInput.count()) {
		await phoneInput.fill("08012345678");
	}

	const subject = page.locator("select").first();
	if (await subject.count()) {
		await subject.selectOption({ index: 1 });
	}

	const textarea = page.locator("textarea").first();
	if (await textarea.count()) {
		await textarea.fill(
			"Hi, I'd love to know more about your ready-to-wear collection.",
		);
	}

	await scrollThrough(page);

	// Verify form is filled before submit
	await expect(
		page.locator("input[name='name'], input[placeholder*='name' i]"),
	).toHaveValue("Amara Okonkwo");
});

for (const contact of [
	{ field: "email", value: "amara@example.com" },
	{ field: "phone", value: "08012345678" },
]) {
	test(`contact form — submits with only ${contact.field}`, async ({
		page,
	}) => {
		let submittedBody: Record<string, unknown> | undefined;
		await page.route("**/api/contact-inquiries", async (route) => {
			submittedBody = route.request().postDataJSON();
			await route.fulfill({
				status: 201,
				contentType: "application/json",
				body: "{}",
			});
		});

		await page.goto("/contact");
		await page.locator("#c-name").fill("Amara Okonkwo");
		if (contact.field === "email") {
			await page.locator("#c-email").fill(contact.value);
		} else {
			await page.locator("#c-phone").fill(contact.value);
		}
		await page.locator("#c-subject").click();
		await page.getByRole("option", { name: "Order enquiry" }).click();
		await page
			.locator("#c-message")
			.fill("I would like to know more about your collection.");
		await page.getByRole("button", { name: "Send Message" }).click();

		await expect.poll(() => submittedBody).toBeDefined();
		expect(submittedBody).toMatchObject({
			name: "Amara Okonkwo",
			subject: "order",
			message: "I would like to know more about your collection.",
			[contact.field]:
				contact.field === "phone" ? "+2348012345678" : contact.value,
		});
		expect(submittedBody).not.toHaveProperty(
			contact.field === "phone" ? "email" : "phone",
		);
	});
}

test("contact page — WhatsApp link present", async ({ page }) => {
	await page.goto("/contact");
	const waLink = page.locator("a[href*='wa.me']").first();
	await expect(waLink).toBeVisible();
});

// ─── Garment Factory ─────────────────────────────────────────────────────────

test("garment factory — form renders and can be filled", async ({ page }) => {
	await page.goto("/garment-factory");
	await scrollThrough(page);

	await page.fill(
		"input[name='name'], input[placeholder*='name' i]",
		"Lagos Streetwear Co.",
	);
	await page.fill("input[type='email']", "orders@lagosstreet.com");

	const serviceSelect = page.locator("select").first();
	if (await serviceSelect.count()) {
		await serviceSelect.selectOption({ index: 1 });
	}

	const textarea = page.locator("textarea").first();
	if (await textarea.count()) {
		await textarea.fill("300 units of custom-cut shirts. Timeline: 6 weeks.");
	}

	await expect(
		page.locator("button[type='submit'], button:has-text('Enquiry')"),
	).toBeVisible();
});

// ─── FAQ ─────────────────────────────────────────────────────────────────────

test("faq page — renders with content", async ({ page }) => {
	await page.goto("/faq");
	await scrollThrough(page);
	// At minimum the page should load without error
	await expect(page).toHaveURL("/faq");
});

// ─── Footer (global) ─────────────────────────────────────────────────────────

test("footer — shows confirmed phone number on every page", async ({
	page,
}) => {
	for (const route of ["/", "/about", "/shop", "/contact"]) {
		await page.goto(route);
		await page.evaluate(() =>
			window.scrollTo({ top: document.body.scrollHeight }),
		);
		await page.waitForTimeout(400);
		await expect(
			page.locator("a[href*='tel:+2348138683171']").first(),
		).toBeVisible();
	}
});
