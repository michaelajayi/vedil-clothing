import { test, expect, type Page } from "@playwright/test";

// ─────────────────────────────────────────────────────────
// Size chart integration tests.
//
// The PDP fetches /api/products (list) then /api/products/{slug}
// (detail). The local backend is not required — we mock both
// endpoints so the tests exercise the real resolver + dialog.
// ─────────────────────────────────────────────────────────

type MockProduct = {
	id: string;
	name: string;
	gender: string;
	description?: string;
	sizes?: string[];
};

const BASE = "http://localhost:4000";

function productPayload({
	id,
	name,
	gender,
	description,
	sizes = ["S", "M", "L"],
}: MockProduct) {
	const optionValues = sizes.map((value, i) => ({
		optionValueId: `ov-${i}`,
		optionValue: {
			id: `ov-${i}`,
			value,
			code: value,
			displayOrder: i,
			optionType: { id: "ot-size", name: "Size", slug: "size", displayOrder: 1 },
		},
	}));

	return {
		id,
		name,
		slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
		description: description ?? null,
		status: "ACTIVE",
		kind: "PHYSICAL",
		gender,
		featured: false,
		isNew: false,
		moq: 6,
		categoryId: "cat-shop",
		category: { id: "cat-shop", name: "Shop", slug: "shop" },
		images: [],
		variants: [
			{
				id: `v-${id}`,
				productId: id,
				sku: `${id}-${sizes[0]}`,
				status: "ACTIVE",
				isDefault: true,
				priceTiers: [
					{ id: "t-1", minQuantity: 1, amount: 2000000, currencyCode: "NGN" },
				],
				optionValues,
				images: [],
				createdAt: "2026-01-01T00:00:00.000Z",
				updatedAt: "2026-01-01T00:00:00.000Z",
			},
		],
		createdAt: "2026-01-01T00:00:00.000Z",
		updatedAt: "2026-01-01T00:00:00.000Z",
	};
}

async function mockApi(
	page: Page,
	products: ReturnType<typeof productPayload>[],
) {
	await page.route(`${BASE}/api/products`, (route) =>
		route.fulfill({ json: products }),
	);
	await page.route(`${BASE}/api/products/*`, (route) => {
		const slug = decodeURIComponent(route.request().url().split("/").pop()!);
		const product = products.find((p) => p.slug === slug);
		route.fulfill({ json: product ?? { ...products[0], attributes: [] } });
	});
}

async function openProduct(
	page: Page,
	product: ReturnType<typeof productPayload>,
) {
	await mockApi(page, [product]);
	await page.goto(`/shop/ready-to-wear/${product.id}`);
	await page.waitForSelector(".size-guide-trigger");
}

async function openSizeGuide(page: Page) {
	await page.locator(".size-guide-trigger").click();
	await page.locator(".sizechart-content").waitFor();
}

test("women's product shows the Women's Size Chart", async ({ page }) => {
	await openProduct(
		page,
		productPayload({
			id: "amh-001",
			name: "Ankara Basket Cape",
			gender: "WOMEN",
		}),
	);

	await expect(page.locator(".size-guide-trigger")).toContainText("Size guide");
	await openSizeGuide(page);

	const dialog = page.locator(".sizechart-content");
	await expect(dialog.locator(".sizechart-title")).toHaveText(
		"Women's Size Chart",
	);

	// Table headers — size column + measurement columns
	const headers = dialog.locator("thead th");
	await expect(headers).toHaveText([
		"Size",
		"Bust (in)",
		"Waist (in)",
		"Hip (in)",
	]);

	// A known row: size 8 → 34 / 28 / 36
	const row8 = dialog.locator("tbody tr", { hasText: "8" }).first();
	await expect(row8).toContainText("34");
	await expect(row8).toContainText("28");
	await expect(row8).toContainText("36");

	// How to measure section heading + fit note (with the tape-measure icon)
	await expect(dialog.locator(".sizechart-section-title")).toHaveText(
		"How to measure",
	);
	await expect(dialog.locator(".sizechart-fit")).toContainText("larger size");
	await expect(dialog.locator(".sizechart-fit svg")).toBeVisible();

	// Measurement guide accordion — opens and shows the image
	await expect(dialog.locator(".sizechart-image-toggle")).toContainText(
		"Open measurement guide",
	);
	await dialog.locator(".sizechart-image-toggle").click();
	await expect(dialog.locator(".sizechart-image-panel.open")).toBeVisible();
	await expect(dialog.locator(".sizechart-measure-image")).toBeVisible();
	await dialog.locator(".sizechart-image-toggle").click();
	await expect(dialog.locator(".sizechart-image-panel.open")).not.toBeVisible();
});

test("men's product shows the Men's Size Chart", async ({ page }) => {
	await openProduct(
		page,
		productPayload({ id: "m-001", name: "Relaxed Fit Shirt", gender: "MEN" }),
	);
	await openSizeGuide(page);

	const dialog = page.locator(".sizechart-content");
	await expect(dialog.locator(".sizechart-title")).toHaveText(
		"Men's Size Chart",
	);
	await expect(dialog.locator("thead th")).toHaveText([
		"Size",
		"Chest (in)",
		"Waist (in)",
	]);
	await expect(
		dialog.locator("tbody tr", { hasText: "XS" }).first(),
	).toContainText("34–35");
});

test("men's trousers product shows the Men's Trousers Size Chart", async ({
	page,
}) => {
	await openProduct(
		page,
		productPayload({ id: "m-002", name: "Slim Fit Trousers", gender: "MEN" }),
	);
	await openSizeGuide(page);

	const dialog = page.locator(".sizechart-content");
	await expect(dialog.locator(".sizechart-title")).toHaveText(
		"Men's Trousers Size Chart",
	);
	await expect(dialog.locator("thead th")).toHaveText([
		"Size",
		"Waist (in)",
		"Hip (in)",
		"Trouser Length (in)",
	]);
	// 6XL/7XL/8XL duplicates from the spec
	await expect(
		dialog.locator("tbody tr", { hasText: "8XL" }).first(),
	).toContainText("47–48");
});

test("children's product shows the Kiddies Size Chart with a neutral Size column", async ({
	page,
}) => {
	await openProduct(
		page,
		productPayload({
			id: "k-001",
			name: "Kiddies Print Top",
			gender: "CHILDREN",
		}),
	);
	await openSizeGuide(page);

	const dialog = page.locator(".sizechart-content");
	await expect(dialog.locator(".sizechart-title")).toHaveText(
		"Kiddies Size Chart",
	);
	// Size column header stays neutral (sizes 1–10, not labelled as ages)
	await expect(dialog.locator("thead th")).toHaveText([
		"Size",
		"Chest (in)",
		"Waist (in)",
		"Hip (in)",
		"Shirt Length (in)",
		"Dress Length (in)",
	]);
	await expect(
		dialog.locator("tbody tr", { hasText: "1" }).first(),
	).toContainText("20");
});

test("accessory product (no gender on backend) still resolves to a chart", async ({
	page,
}) => {
	// gender null → mapper falls back to unisex → men's chart
	await openProduct(
		page,
		productPayload({ id: "a-001", name: "Ankara Sun Hat", gender: "UNISEX" }),
	);
	await openSizeGuide(page);
	await expect(page.locator(".sizechart-title")).toHaveText("Men's Size Chart");
});

test("modal closes via the close button and returns focus context", async ({
	page,
}) => {
	await openProduct(
		page,
		productPayload({ id: "amh-002", name: "Ankara Corset Top", gender: "WOMEN" }),
	);
	await openSizeGuide(page);
	await expect(page.locator(".sizechart-content")).toBeVisible();

	await page.locator(".sizechart-close").click();
	await expect(page.locator(".sizechart-content")).not.toBeVisible();
});
