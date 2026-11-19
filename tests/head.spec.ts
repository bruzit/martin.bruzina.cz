import { readFileSync } from "node:fs";
import { expect, type Page, test } from "@playwright/test";
import { parse } from "yaml";

const card = parse(readFileSync("content/card.yaml", "utf8"));
const contact = (kind: string) => card.contact.items.find((item: { kind: string }) => item.kind === kind).href;
const meta = (page: Page, key: string) => page.locator(`meta[name="${key}"], meta[property="${key}"]`);

test("card page has its head tags", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Martin Bružina");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://martin.bruzina.cz/");
  const expected = {
    description: "Martin Bružina, platform engineer, DevOps, and SRE from Brno. GitOps, IaC, and automation consulting for teams.",
    "og:type": "profile",
    "og:title": "Martin Bružina",
    "og:description": "Platform engineer, DevOps, and SRE · GitOps, IaC, automation",
    "og:url": "https://martin.bruzina.cz/",
    "og:image": "https://martin.bruzina.cz/photo.jpg",
    "profile:first_name": "Martin",
    "profile:last_name": "Bružina",
  };
  for (const [key, content] of Object.entries(expected)) {
    await expect(meta(page, key)).toHaveAttribute("content", content);
  }
});

test("card page describes the person in JSON-LD", async ({ page }) => {
  await page.goto("/");
  const person = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
  expect(person).toMatchObject({
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Martin Bružina",
    jobTitle: "Platform Engineer, DevOps, and SRE",
    url: "https://martin.bruzina.cz/",
    image: "https://martin.bruzina.cz/photo.jpg",
    email: contact("email"),
    telephone: contact("phone").replace("tel:", ""),
    address: {
      "@type": "PostalAddress",
      streetAddress: "Hrázka 619/34",
      postalCode: "621 00",
      addressLocality: "Brno",
      addressCountry: "CZ",
    },
    sameAs: ["https://www.linkedin.com/in/martin-bruzina/", "https://github.com/bruzina"],
  });
});

test("robots.txt allows crawling and points to the sitemap", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.status()).toBe(200);
  expect(await response.text()).toBe("User-agent: *\nAllow: /\nSitemap: https://martin.bruzina.cz/sitemap.xml\n");
});

test("sitemap lists the canonical URL", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  expect(await response.text()).toContain("<loc>https://martin.bruzina.cz/</loc>");
});

test("_headers sets security headers and hashes every inline script", async ({ request }) => {
  const response = await request.get("/");
  const csp = response.headers()["content-security-policy"]!;
  expect(csp).toContain("default-src 'none'");
  expect(csp).toMatch(/script-src 'self'( 'sha256-[\w+/=]+')+;/);
  expect(csp).not.toMatch(/script-src[^;]*'unsafe-inline'/);
  expect(response.headers()["strict-transport-security"]).toBe("max-age=63072000; includeSubDomains");
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
});

for (const [path, expectedErrors] of [
  ["/", []],
  ["/nonsense", ["404 (Not Found)", "[NUXT_E1005]"]],
] as const) {
  test(`${path} runs under the CSP without violations or unexpected console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(() => {
      (window as unknown as { violations: string[] }).violations = [];
      document.addEventListener("securitypolicyviolation", (event) =>
        (window as unknown as { violations: string[] }).violations.push(`${event.violatedDirective} ${event.blockedURI}`),
      );
    });
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.getByRole("button", { name: /Hrázka/ }).click();
    await expect(page.getByRole("list", { name: "Address on a map" })).toBeVisible();
    expect(await page.evaluate(() => (window as unknown as { violations: string[] }).violations)).toEqual([]);
    expect(errors.filter((text) => !expectedErrors.some((expected) => text.includes(expected)))).toEqual([]);
  });
}

test("404 page is not indexed and has no canonical", async ({ page }) => {
  await page.goto("/nonsense");
  await expect(meta(page, "robots")).toHaveAttribute("content", "noindex");
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});

for (const path of ["/", "/nonsense"]) {
  test(`${path} links the favicon and touch icon`, async ({ page, request }) => {
    await page.goto(path);
    for (const [rel, href, type] of [
      ["icon", "/favicon.ico", "image/x-icon"],
      ["apple-touch-icon", "/apple-touch-icon.png", "image/png"],
    ]) {
      await expect(page.locator(`link[rel="${rel}"]`)).toHaveAttribute("href", href!);
      const response = await request.get(href!);
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toBe(type);
    }
  });
}
