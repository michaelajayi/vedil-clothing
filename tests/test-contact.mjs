import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

page.on("console", (msg) => console.log("CONSOLE:", msg.type(), msg.text()));
page.on("pageerror", (err) => console.log("PAGE_ERROR:", err.message));
page.on("requestfailed", (req) => {
	if (
		req.url().includes("company-profile") ||
		req.url().includes("localhost:4000")
	) {
		console.log("REQUEST_FAILED:", req.url(), req.failure()?.errorText);
	}
});

await page.goto("http://localhost:3000/contact", {
	waitUntil: "domcontentloaded",
	timeout: 30000,
});

// Wait for React Query to fetch and render
await page.waitForTimeout(4000);

// Check what's inside contact-info-list
const result = await page.evaluate(() => {
	const list = document.querySelector(".contact-info-list");
	if (!list) return { error: "NO .contact-info-list FOUND" };

	return {
		html: list.innerHTML.substring(0, 3000),
		text: list.textContent,
	};
});

console.log("--- CONTACT INFO HTML ---");
console.log(result.html || result.error);

console.log("\n--- PLAIN TEXT ---");
console.log(result.text);

// Check network requests to the backend
const apiCalls = await page.evaluate(() => {
	return performance
		.getEntriesByType("resource")
		.filter(
			(e) =>
				e.name.includes("company-profile") || e.name.includes("localhost:4000"),
		)
		.map((e) => ({
			url: e.name,
			duration: e.duration,
			size: e.transferSize,
		}));
});
console.log("\n--- API CALLS ---");
console.log(JSON.stringify(apiCalls, null, 2));

await browser.close();
