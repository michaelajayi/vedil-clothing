import { test } from "@playwright/test";
import path from "path";
import fs from "fs";

const OUT = "screenshots/hero-variations";
const BASE_URL = "http://localhost:3000";

/* ─── Each variation defines what to inject ────────────────── */
interface Variation {
	name: string;
	label: string;
	/** gradient overlay, e.g. "linear-gradient(180deg, rgba(42,33,27,.28), rgba(42,33,27,.50))" — empty string = none */
	gradient: string;
	/** backdrop-filter blur value, e.g. "blur(2px)" — empty string = none */
	blur: string;
	/** mask-image for the blur layer, e.g. "linear-gradient(to top, black 25%, transparent 65%)" — empty string = full */
	blurMask: string;
}

const variations: Variation[] = [
	{
		name: "A-nothing",
		label: "Nothing (raw image, no blur mask)",
		gradient: "",
		blur: "",
		blurMask: "",
	},
	{
		name: "B-gradient-28-50",
		label: "Gradient .28→.50 only",
		gradient: "linear-gradient(180deg, rgba(42,33,27,.28), rgba(42,33,27,.50))",
		blur: "",
		blurMask: "",
	},
	{
		name: "C-gradient-18-35",
		label: "Gradient .18→.35 only",
		gradient: "linear-gradient(180deg, rgba(42,33,27,.18), rgba(42,33,27,.35))",
		blur: "",
		blurMask: "",
	},
	{
		name: "D-gradient-12-25",
		label: "Gradient .12→.25 only",
		gradient: "linear-gradient(180deg, rgba(42,33,27,.12), rgba(42,33,27,.25))",
		blur: "",
		blurMask: "",
	},
	{
		name: "E-blur-full",
		label: "Blur 2px full, no gradient",
		gradient: "",
		blur: "blur(2px)",
		blurMask: "",
	},
	{
		name: "F-blur-bottom",
		label: "Blur 2px bottom mask, no gradient",
		gradient: "",
		blur: "blur(2px)",
		blurMask: "linear-gradient(to top, black 25%, transparent 65%)",
	},
	{
		name: "G-blur-bottom-gradient-10-28",
		label: "Blur bottom + gradient .10→.28",
		gradient: "linear-gradient(180deg, rgba(42,33,27,.10), rgba(42,33,27,.28))",
		blur: "blur(2px)",
		blurMask: "linear-gradient(to top, black 25%, transparent 65%)",
	},
	{
		name: "H-blur-bottom-gradient-15-35",
		label: "Blur bottom + gradient .15→.35",
		gradient: "linear-gradient(180deg, rgba(42,33,27,.15), rgba(42,33,27,.35))",
		blur: "blur(2px)",
		blurMask: "linear-gradient(to top, black 25%, transparent 65%)",
	},
	{
		name: "I-gradient-22-45",
		label: "Gradient .22→.45 only",
		gradient: "linear-gradient(180deg, rgba(42,33,27,.22), rgba(42,33,27,.45))",
		blur: "",
		blurMask: "",
	},
	{
		name: "J-blur-1-full",
		label: "Blur 1px full, no gradient",
		gradient: "",
		blur: "blur(1px)",
		blurMask: "",
	},
	{
		name: "K-blur-bottom-gradient-05-18",
		label: "Blur bottom + gradient .05→.18 (barely there)",
		gradient: "linear-gradient(180deg, rgba(42,33,27,.05), rgba(42,33,27,.18))",
		blur: "blur(2px)",
		blurMask: "linear-gradient(to top, black 25%, transparent 65%)",
	},
	{
		name: "L-text-shadow",
		label: "Text-shadow only, clean image",
		gradient: "",
		blur: "",
		blurMask: "",
		// special: also inject text-shadow on hero text
	},
];

/* ─── Helper: inject variation styles ──────────────────────── */
async function apply(page: import("@playwright/test").Page, v: Variation) {
	// Build CSS for ::after blur + mask + text-shadow
	const lines: string[] = [];

	if (v.blur) {
		lines.push(
			`backdrop-filter:${v.blur}!important;-webkit-backdrop-filter:${v.blur}!important;`,
		);
	} else {
		lines.push(
			`backdrop-filter:none!important;-webkit-backdrop-filter:none!important;`,
		);
	}

	if (v.blurMask) {
		lines.push(
			`-webkit-mask-image:${v.blurMask}!important;mask-image:${v.blurMask}!important;`,
		);
	} else if (v.blur) {
		lines.push(`-webkit-mask-image:none!important;mask-image:none!important;`);
	}

	const afterCss = lines.join("");

	const textShadowCss =
		v.name === "L-text-shadow"
			? `.hero h1,.hero p,.hero .eyebrow{text-shadow:0 2px 12px rgba(0,0,0,0.6),0 4px 24px rgba(0,0,0,0.3)!important}`
			: "";

	const fullCss = `.hero-slider-bg::after{${afterCss}}${textShadowCss}`;

	await page.evaluate(
		({ gradient, css }: { gradient: string; css: string }) => {
			// Clean previous injections
			document
				.querySelectorAll("[data-hero-test]")
				.forEach((el) => el.remove());

			// Gradient: override inline background on hero-slider-bg
			document.querySelectorAll(".hero-slider-bg").forEach((el) => {
				const bg = (el as HTMLElement).style.background;
				if (!bg) return;
				const urlMatch = bg.match(/(url\(.*?\))/);
				if (!urlMatch) return;
				const urlPart = urlMatch[0];
				(el as HTMLElement).style.background = gradient
					? `${gradient}, ${urlPart} center/cover`
					: `${urlPart} center/cover`;
			});

			// Inject style tag for ::after + text-shadow
			if (css) {
				const style = document.createElement("style");
				style.setAttribute("data-hero-test", "");
				style.textContent = css;
				document.head.appendChild(style);
			}
		},
		{ gradient: v.gradient, css: fullCss },
	);
}

/* ─── Tests ────────────────────────────────────────────────── */
test.describe("Hero background variations", () => {
	for (const v of variations) {
		test(`screenshot: ${v.name}`, async ({ page }) => {
			await page.setViewportSize({ width: 1440, height: 900 });
			await page.goto(BASE_URL, { waitUntil: "networkidle" });

			// Wait for hero to be visible
			await page.waitForSelector(".hero--slider", { timeout: 10000 });

			// Apply variation
			await apply(page, v);

			// Wait for CSS to settle
			await page.waitForTimeout(500);

			// Screenshot
			const dir = path.resolve(OUT);
			fs.mkdirSync(dir, { recursive: true });

			// Full hero section crop
			const hero = page.locator(".hero--slider");
			await hero.screenshot({ path: path.join(dir, `${v.name}.png`) });
		});
	}
});
