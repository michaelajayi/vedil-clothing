import { test, expect } from "@playwright/test";

test.describe("Image computed styles check", () => {
	test("all placed images have correct CSS properties", async ({ page }) => {
		const checks = [
			{ locator: ".hero-slider-bg", label: "Hero slider" },
			{ locator: ".academy-top .ph", label: "Homepage academy image" },
			{ locator: "#factory .factory .ph", label: "Homepage factory image" },
		];

		await page.goto("/", { waitUntil: "networkidle" });
		await page.waitForTimeout(2000);

		for (const c of checks) {
			const el = page.locator(c.locator);
			const styles = await el.evaluate((el) => {
				const s = getComputedStyle(el);
				return {
					bgImage: s.backgroundImage,
					bgSize: s.backgroundSize,
					bgPos: s.backgroundPosition,
				};
			});
			console.log(`\n[${c.label}] (${c.locator})`);
			console.log(`  backgroundImage: ${styles.bgImage.slice(0, 100)}`);
			console.log(`  backgroundSize:  ${styles.bgSize}`);
			console.log(`  backgroundPos:   ${styles.bgPos}`);

			expect(styles.bgImage).toContain("cloudinary.com");
			expect(styles.bgSize).toBe("cover");
			expect(styles.bgPos).toBe("center");
		}
	});

	test("about page images have correct CSS", async ({ page }) => {
		const checks = [
			{ locator: ".about-photo-main", label: "About main photo" },
			{ locator: ".about-photo-float", label: "About supporting" },
			{ locator: ".made-measure .ph", label: "Made to Measure" },
		];

		await page.goto("/about", { waitUntil: "networkidle" });
		await page.waitForTimeout(2000);

		for (const c of checks) {
			const el = page.locator(c.locator);
			const styles = await el.evaluate((el) => {
				const s = getComputedStyle(el);
				return {
					bgImage: s.backgroundImage,
					bgSize: s.backgroundSize,
					bgPos: s.backgroundPosition,
				};
			});
			console.log(`\n[${c.label}] (${c.locator})`);
			console.log(`  backgroundImage: ${styles.bgImage.slice(0, 100)}`);
			console.log(`  backgroundSize:  ${styles.bgSize}`);
			console.log(`  backgroundPos:   ${styles.bgPos}`);

			expect(styles.bgImage).toContain("cloudinary.com");
			expect(styles.bgSize).toBe("cover");
			expect(styles.bgPos).toBe("center");
		}
	});

	test("garment factory images have correct CSS", async ({ page }) => {
		await page.goto("/garment-factory", { waitUntil: "networkidle" });
		await page.waitForTimeout(2000);

		const serviceSplits = page.locator(".service-split");
		const count = await serviceSplits.count();

		for (let i = 0; i < count; i++) {
			// The .ph inside each service-split could be first or second child
			const ph = serviceSplits.nth(i).locator(".ph");
			const exists = await ph.count();
			if (exists === 0) continue;

			const styles = await ph.evaluate((el) => {
				const s = getComputedStyle(el);
				return {
					bgImage: s.backgroundImage,
					bgSize: s.backgroundSize,
					bgPos: s.backgroundPosition,
				};
			});

			console.log(`\n[Garment Factory section ${i}]`);
			console.log(`  backgroundImage: ${styles.bgImage.slice(0, 100)}`);
			console.log(`  backgroundSize:  ${styles.bgSize}`);
			console.log(`  backgroundPos:   ${styles.bgPos}`);

			expect(styles.bgImage).toContain("cloudinary.com");
			expect(styles.bgSize).toBe("cover");
			expect(styles.bgPos).toBe("center");
		}
	});

	test("fun-to-sew page image has correct CSS", async ({ page }) => {
		await page.goto("/fun-to-sew", { waitUntil: "networkidle" });
		await page.waitForTimeout(2000);

		const el = page.locator(".academy-top .ph");
		const styles = await el.evaluate((el) => {
			const s = getComputedStyle(el);
			return {
				bgImage: s.backgroundImage,
				bgSize: s.backgroundSize,
				bgPos: s.backgroundPosition,
				width: el.offsetWidth,
				height: el.offsetHeight,
			};
		});

		console.log(`\n[Fun-to-sew image]`);
		console.log(`  backgroundImage: ${styles.bgImage.slice(0, 100)}`);
		console.log(`  backgroundSize:  ${styles.bgSize}`);
		console.log(`  backgroundPos:   ${styles.bgPos}`);
		console.log(`  element size:    ${styles.width}x${styles.height}`);

		expect(styles.bgImage).toContain("cloudinary.com");
		expect(styles.bgSize).toBe("cover");
		expect(styles.bgPos).toBe("center");
		// Should have meaningful dimensions
		expect(styles.width).toBeGreaterThan(100);
		expect(styles.height).toBeGreaterThan(100);
	});
});