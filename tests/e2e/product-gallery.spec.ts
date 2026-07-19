import { test, expect, type Page } from "@playwright/test";

const PRODUCT_URL = "/shop/ready-to-wear/f8f56ea8-a7d1-4bd8-af26-ebe8a5ce42fd";

// ── Mock product with 3 images ───────────────────────────────

// Use relative URLs so next/image doesn't reject unconfigured hosts.
// The images won't actually load (404), but that's fine — we're testing
// the gallery structure (arrows, thumbnails, active state), not image loading.
const MOCK_IMAGES = [
	{
		id: "img-1",
		displayOrder: 1,
		isPrimary: true,
		file: {
			id: "file-1",
			url: "/mock-img/front.jpg",
			altText: "Front view",
			width: 1200,
			height: 1500,
			mimeType: "image/jpeg",
			sizeInBytes: 50000,
		},
	},
	{
		id: "img-2",
		displayOrder: 2,
		isPrimary: false,
		file: {
			id: "file-2",
			url: "/mock-img/side.jpg",
			altText: "Side view",
			width: 1200,
			height: 1500,
			mimeType: "image/jpeg",
			sizeInBytes: 48000,
		},
	},
	{
		id: "img-3",
		displayOrder: 3,
		isPrimary: false,
		file: {
			id: "file-3",
			url: "/mock-img/back.jpg",
			altText: "Back view",
			width: 1200,
			height: 1500,
			mimeType: "image/jpeg",
			sizeInBytes: 51000,
		},
	},
];

const BASE_PRODUCT = {
	id: "f8f56ea8-a7d1-4bd8-af26-ebe8a5ce42fd",
	name: "Vedil Signature Tee",
	slug: "vedil-signature-tee",
	description: "Premium cotton tee.",
	status: "ACTIVE",
	kind: "PHYSICAL",
	gender: "UNISEX",
	featured: true,
	isNew: true,
	moq: 40,
	categoryId: "1de7e3d3-9b39-4e97-bd80-0f5714c787d5",
	category: {
		id: "1de7e3d3-9b39-4e97-bd80-0f5714c787d5",
		name: "Shop",
		slug: "shop",
	},
	createdAt: "2026-07-08T09:20:58.776Z",
	updatedAt: "2026-07-19T09:27:18.609Z",
	variants: [
		{
			id: "d6b1fef3-f38b-4525-83b8-0fbedcfd2232",
			productId: "f8f56ea8-a7d1-4bd8-af26-ebe8a5ce42fd",
			sku: "TEE-RED-XL",
			status: "ACTIVE",
			isDefault: true,
			createdAt: "2026-07-08T09:22:14.289Z",
			updatedAt: "2026-07-08T09:22:14.289Z",
			priceTiers: [
				{
					id: "pt-1",
					variantId: "d6b1fef3-f38b-4525-83b8-0fbedcfd2232",
					minQuantity: 1,
					amount: 7000000,
					currencyCode: "NGN",
				},
			],
			optionValues: [],
			images: [],
		},
	],
};

async function setupGalleryMocks(page: Page) {
	// Single route handler for ALL /api/products* requests.
	// The app calls:
	//   GET /api/products                    → list
	//   GET /api/products?category=...       → list (filtered)
	//   GET /api/products/<slug>             → detail
	await page.route(/\/api\/products(?:\/.*)?$/, async (route) => {
		if (route.request().method() !== "GET") {
			await route.fallback();
			return;
		}

		let url;
		try {
			url = new URL(route.request().url());
		} catch {
			await route.fallback();
			return;
		}
		const pathParts = url.pathname.split("/").filter(Boolean);

		// /api/products/<slug> → detail request
		if (pathParts.length >= 3 && pathParts[2]) {
			const slug = pathParts[2];
			if (slug === "vedil-signature-tee") {
				await route.fulfill({
					status: 200,
					contentType: "application/json",
					body: JSON.stringify({
						...BASE_PRODUCT,
						images: MOCK_IMAGES,
						attributes: [],
					}),
				});
				return;
			}
			// Unknown slug → fall through to real API
			await route.fallback();
			return;
		}

		// /api/products or /api/products?category=... → list
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify([{ ...BASE_PRODUCT, images: MOCK_IMAGES }]),
		});
	});
}

test.describe("Product gallery — arrow buttons & thumbnails", () => {
	test.beforeEach(async ({ page }) => {
		await setupGalleryMocks(page);
		await page.goto(PRODUCT_URL);
		// Wait for the product data to load (skeleton disappears, product name visible)
		await page.waitForSelector(`h1:has-text("Vedil Signature Tee")`, {
			timeout: 15000,
		});
		await page.waitForLoadState("networkidle");
	});

	test("gallery viewport, arrows, and thumbnails are present", async ({
		page,
	}) => {
		// Viewport
		const viewport = page.locator(".pdp-gallery-viewport");
		await expect(viewport).toBeVisible();

		// Slides
		const slides = page.locator(".pdp-gallery-slide");
		await expect(slides).toHaveCount(3);

		// Arrow buttons
		const prevBtn = page.locator(".pdp-gallery-arrow--prev");
		const nextBtn = page.locator(".pdp-gallery-arrow--next");
		await expect(prevBtn).toBeVisible();
		await expect(nextBtn).toBeVisible();
		await expect(prevBtn).toHaveAttribute("aria-label", "Previous image");
		await expect(nextBtn).toHaveAttribute("aria-label", "Next image");

		// Thumbnail strip
		const thumbs = page.locator(".pdp-gallery-thumbs");
		await expect(thumbs).toBeVisible();
		const thumbButtons = thumbs.locator("button");
		await expect(thumbButtons).toHaveCount(3);
	});

	test("next arrow advances to the next slide", async ({ page }) => {
		const nextBtn = page.locator(".pdp-gallery-arrow--next");

		// Click next — Embla should scroll to the second slide
		await nextBtn.click();
		await page.waitForTimeout(400); // wait for Embla transition

		// The second thumbnail should now be active
		const thumbButtons = page.locator(".pdp-gallery-thumb");
		await expect(thumbButtons.nth(1)).toHaveClass(/is-active/);
		await expect(thumbButtons.nth(0)).not.toHaveClass(/is-active/);
	});

	test("previous arrow scrolls back", async ({ page }) => {
		const prevBtn = page.locator(".pdp-gallery-arrow--prev");
		const nextBtn = page.locator(".pdp-gallery-arrow--next");

		// Go to slide 2 first
		await nextBtn.click();
		await page.waitForTimeout(400);

		// Then go back to slide 1
		await prevBtn.click();
		await page.waitForTimeout(400);

		// Slide 1 should be active again
		const thumbButtons = page.locator(".pdp-gallery-thumb");
		await expect(thumbButtons.nth(0)).toHaveClass(/is-active/);
	});

	test("clicking a thumbnail navigates to that slide", async ({ page }) => {
		const thumbButtons = page.locator(".pdp-gallery-thumb");

		// Click the third thumbnail
		await thumbButtons.nth(2).click();
		await page.waitForTimeout(400);

		await expect(thumbButtons.nth(2)).toHaveClass(/is-active/);
		await expect(thumbButtons.nth(0)).not.toHaveClass(/is-active/);
	});

	test("active thumbnail is bright, inactive are muted", async ({ page }) => {
		const thumbButtons = page.locator(".pdp-gallery-thumb");

		// First thumbnail should be active initially
		await expect(thumbButtons.nth(0)).toHaveClass(/is-active/);

		// Check opacity: active should be 1, inactive should be lower
		const activeOpacity = await thumbButtons
			.nth(0)
			.evaluate((el) => window.getComputedStyle(el).opacity);
		expect(activeOpacity).toBe("1");

		const inactiveOpacity = await thumbButtons
			.nth(1)
			.evaluate((el) => window.getComputedStyle(el).opacity);
		expect(Number(inactiveOpacity)).toBeLessThan(1);
	});

	test("looping works: next from last slide goes to first", async ({
		page,
	}) => {
		const nextBtn = page.locator(".pdp-gallery-arrow--next");
		const thumbButtons = page.locator(".pdp-gallery-thumb");

		// Go to last slide (index 2) — click next twice from index 0
		await nextBtn.click();
		await page.waitForTimeout(400);
		await nextBtn.click();
		await page.waitForTimeout(400);

		// Now on last slide (index 2)
		await expect(thumbButtons.nth(2)).toHaveClass(/is-active/);

		// One more next should loop back to first
		await nextBtn.click();
		await page.waitForTimeout(400);

		await expect(thumbButtons.nth(0)).toHaveClass(/is-active/);
	});
});
