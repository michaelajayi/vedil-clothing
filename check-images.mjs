// Quick DOM check for image placement
import { chromium } from "@playwright/test";

async function checkImages() {
	const browser = await chromium.launch();
	const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

	const results = [];

	async function check(locator, label) {
		const el = page.locator(locator);
		const visible = await el.isVisible().catch(() => false);
		const box = await el.boundingBox().catch(() => null);
		const bgImage = await el.evaluate((el) =>
			getComputedStyle(el).backgroundImage,
		).catch(() => "-");
		const bgSize = await el.evaluate((el) =>
			getComputedStyle(el).backgroundSize,
		).catch(() => "-");
		const bgPos = await el.evaluate((el) =>
			getComputedStyle(el).backgroundPosition,
		).catch(() => "-");
		results.push({ locator: `${label}`, bgImage, bgSize, bgPos, visible, rect: box });
	}

	// Homepage
	await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
	await page.waitForTimeout(2000);

	await check(".hero-slider-bg", "Hero slider background");
	await check(".academy-top .ph", "Homepage academy image");
	await check(".factory .ph", "Homepage factory image");

	// About page
	await page.goto("http://localhost:3000/about", { waitUntil: "networkidle" });
	await page.waitForTimeout(2000);

	await check(".about-photo-main", "About main photo");
	await check(".about-photo-float", "About supporting photo");
	await check(".made-measure .ph", "Made to Measure CTA image");

	// Garment Factory
	await page.goto("http://localhost:3000/garment-factory", {
		waitUntil: "networkidle",
	});
	await page.waitForTimeout(2000);

	await check(".service-split:nth-child(1) .ph", "Bulk production image");
	await check(".service-split.flip .ph", "Custom orders image");
	await check(".service-split:nth-child(5) .ph", "Wholesale image");

	// Fun to sew
	await page.goto("http://localhost:3000/fun-to-sew", {
		waitUntil: "networkidle",
	});
	await page.waitForTimeout(2000);
	await check(".academy-top .ph", "Fun-to-sew image");

	console.table(results.map((r) => ({
		"Location": r.locator,
		"Visible": r.visible ? "YES" : "NO",
		"Size": r.rect ? `${r.rect.width}x${r.rect.height}` : "-",
		"bgSize": r.bgSize,
		"bgPos": r.bgPos,
		"bgImage": r.bgImage.length > 80 ? r.bgImage.slice(0, 80) + "..." : r.bgImage,
	})));

	await browser.close();
}

checkImages().catch(console.error);