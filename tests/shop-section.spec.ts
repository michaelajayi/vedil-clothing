import { test, expect } from "@playwright/test";

test("home shop section — three collection cards link to valid routes", async ({ page }) => {
  await page.goto("/");
  const shop = page.locator("section#shop");

  const cards = [
    { name: "Browse Heritage", href: "/shop/africa-my-heritage" },
    { name: "Browse Ready to Wear", href: "/shop/ready-to-wear" },
    { name: "Browse Accessories", href: "/shop/accessories" },
  ];

  for (const { name, href } of cards) {
    await expect(shop.getByRole("link", { name })).toHaveAttribute("href", href);
  }
});

test("home shop section — every link resolves to HTTP 200", async ({ page }) => {
  await page.goto("/");
  const hrefs = await page
    .locator("section#shop a[href^='/shop']")
    .evaluateAll((els) => els.map((e) => e.getAttribute("href")));

  expect(hrefs.length).toBe(3);

  for (const href of hrefs) {
    const res = await page.goto(href!);
    expect(res?.status()).toBe(200);
  }
});

test("home shop section — no broken demographic or new-arrivals links remain", async ({ page }) => {
  await page.goto("/");
  const deadRoutes = ["/shop/men", "/shop/women", "/shop/children", "/shop/new-arrivals"];

  for (const route of deadRoutes) {
    await expect(page.locator(`section#shop a[href='${route}']`)).toHaveCount(0);
  }
});
