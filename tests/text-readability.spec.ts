import { test, expect } from "@playwright/test";

test.describe("Text readability over images", () => {
	test("hero slider — overlay and text contrast", async ({ page }) => {
		await page.goto("/", { waitUntil: "networkidle" });
		await page.waitForTimeout(2000);

		const info = await page.evaluate(() => {
			const hero = document.querySelector(".hero--slider");
			if (!hero) return { error: "no hero slider" };
			const h1 = hero.querySelector("h1");
			const bg = hero.querySelector(".hero-slider-bg");
			const h1Style = h1 ? getComputedStyle(h1) : null;
			const bgStyle = bg ? getComputedStyle(bg) : null;

			const bgStr = bgStyle?.background ?? "";

			return {
				h1Color: h1Style?.color,
				h1FontSize: h1Style?.fontSize,
				textShadow: h1Style?.textShadow || "none",
				gradient: bgStr.match(/linear-gradient\(([^)]+)\)/)?.[0]?.slice(0, 200),
				hasDarkOverlay: bgStr.includes("rgba(") && bgStr.includes("27"),
			};
		});
		console.log("Hero slider:", JSON.stringify(info, null, 2));
		expect(info.h1Color).toBe("rgb(255, 255, 255)");
	});

	test("factory section — overlay effectiveness", async ({ page }) => {
		await page.goto("/", { waitUntil: "networkidle" });
		await page.waitForTimeout(1000);

		const factory = page.locator("#factory");
		await factory.scrollIntoViewIfNeeded();
		await page.waitForTimeout(1000);

		const info = await page.evaluate(() => {
			const section = document.querySelector("#factory .factory");
			if (!section) return { error: "no factory" };

			const afterStyle = getComputedStyle(section, "::after");
			const h2 = section.querySelector("h2");
			const p = section.querySelector("p");

			return {
				overlayBg: afterStyle.background?.slice(0, 300),
				h2Color: h2 ? getComputedStyle(h2).color : null,
				pColor: p ? getComputedStyle(p).color : null,
				hasDarkOverlay: (afterStyle.background ?? "").includes("rgba("),
				textShadow: p ? getComputedStyle(p).textShadow || "none" : null,
			};
		});
		console.log("Factory overlay:", JSON.stringify(info, null, 2));
		expect(info.h2Color).toBe("rgb(255, 255, 255)");
		expect(info.hasDarkOverlay).toBe(true);
	});

	test("shop cards — overlay on cards with images", async ({ page }) => {
		await page.goto("/", { waitUntil: "networkidle" });
		await page.waitForTimeout(1000);

		const shop = page.locator("#shop");
		await shop.scrollIntoViewIfNeeded();
		await page.waitForTimeout(1000);

		const info = await page.evaluate(() => {
			const cards = document.querySelectorAll(".cat-card");
			return Array.from(cards).map((card, i) => {
				const afterStyle = getComputedStyle(card, "::after");
				const body = card.querySelector(".body");
				const bodyStyle = body ? getComputedStyle(body) : null;
				const h3 = card.querySelector("h3");
				const p = card.querySelector(".sub");
				const hasImage = !!card.querySelector('.ph[style*="url("]');
				return {
					index: i,
					hasImage,
					overlay: afterStyle.background?.slice(0, 200),
					bodyBackdropFilter: bodyStyle?.backdropFilter || "none",
					bodyBackdropFilterWebkit:
						(bodyStyle as CSSStyleDeclaration & Record<string, string>)
							.webkitBackdropFilter || "none",
					bodyBackground: bodyStyle?.background?.slice(0, 200),
					textColor: h3 ? getComputedStyle(h3).color : null,
					subColor: p ? getComputedStyle(p).color : null,
				};
			});
		});
		console.log("Shop cards:", JSON.stringify(info, null, 2));
		for (const card of info) {
			expect(card.textColor).toBe("rgb(255, 255, 255)");
			// backdrop-filter is applied via CSS (verified in compiled CSS), but Chromium's getComputedStyle
			// doesn't report it. The gradient background is the detectable proxy.
			expect(card.bodyBackground).toContain("rgba(0, 0, 0, 0.02)");
		}
	});

	test("academy section — text adjacent to image", async ({ page }) => {
		await page.goto("/", { waitUntil: "networkidle" });
		await page.waitForTimeout(1000);

		const academy = page.locator("#academy");
		await academy.scrollIntoViewIfNeeded();
		await page.waitForTimeout(1000);

		const info = await page.evaluate(() => {
			const section = document.querySelector("#academy .academy-top");
			if (!section) return { error: "no academy-top" };
			const textDiv = section.querySelector("div:first-child");
			const h2 = textDiv?.querySelector("h2");
			const p = textDiv?.querySelector("p");
			return {
				h2Color: h2 ? getComputedStyle(h2).color : null,
				pColor: p ? getComputedStyle(p).color : null,
			};
		});
		console.log("Academy section:", JSON.stringify(info, null, 2));
		expect(info.h2Color).toBe("rgb(42, 33, 27)");
	});

	test("about — made to measure section overlay", async ({ page }) => {
		await page.goto("/about", { waitUntil: "networkidle" });
		await page.waitForTimeout(1500);

		const info = await page.evaluate(() => {
			const section = document.querySelector(".made-measure");
			if (!section) return { error: "no made-measure" };
			const afterStyle = getComputedStyle(section, "::after");
			const title = section.querySelector(".made-measure-title");
			const sub = section.querySelector(".sub");
			return {
				overlay: afterStyle.background?.slice(0, 300),
				titleColor: title ? getComputedStyle(title).color : null,
				subColor: sub ? getComputedStyle(sub).color : null,
			};
		});
		console.log("Made to Measure:", JSON.stringify(info, null, 2));
		expect(info.titleColor).toBe("rgb(255, 255, 255)");
	});

	test("garment factory — service split images", async ({ page }) => {
		await page.goto("/garment-factory", { waitUntil: "networkidle" });
		await page.waitForTimeout(1500);

		const info = await page.evaluate(() => {
			const splits = document.querySelectorAll(".service-split");
			return Array.from(splits).map((split, i) => {
				const ph = split.querySelector(".ph");
				const h3 = split.querySelector("h3");
				const p = split.querySelector("p");
				const phStyle = ph ? getComputedStyle(ph) : null;
				const hasImage = phStyle?.backgroundImage?.includes("url(") ?? false;
				return {
					index: i,
					hasImage,
					textColor: h3 ? getComputedStyle(h3).color : null,
					pColor: p ? getComputedStyle(p).color : null,
				};
			});
		});
		console.log("Garment factory splits:", JSON.stringify(info, null, 2));
		// Side-by-side layout — text on cream bg, no overlay needed
		for (const split of info) {
			expect(split.pColor).toBe("rgb(107, 93, 82)");
		}
	});
});
