import { expect, test } from "@playwright/test";

for (const colorScheme of ["light", "dark"] as const) {
  test(`prints in the light palette on white from the ${colorScheme} theme`, async ({ page }) => {
    await page.emulateMedia({ media: "print", colorScheme });
    await page.goto("/");
    await expect(page.locator("body")).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await expect(page.getByRole("article")).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await expect(page.getByRole("article")).toHaveCSS("color", "rgb(11, 12, 13)");
    await expect(page.getByRole("link", { name: "GitHub" })).toHaveCSS("color", "rgb(174, 90, 17)");
  });

  test(`card fits on one A4 page from the ${colorScheme} theme`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const pdf = await page.pdf({ preferCSSPageSize: true });
    expect(pdf.toString("latin1").match(/\/Type\s*\/Page\b(?!s)/g)).toHaveLength(1);
  });
}

test("print hides the blog placeholder and the map caret", async ({ page }) => {
  await page.emulateMedia({ media: "print" });
  await page.goto("/");
  await expect(page.getByText("Blog, soon")).toBeHidden();
  const caret = await page
    .getByRole("button", { name: /Hrázka/ })
    .evaluate((element) => getComputedStyle(element, "::after").content);
  expect(caret).toBe("none");
});

test("print keeps two columns on A4 width", async ({ page }) => {
  await page.emulateMedia({ media: "print" });
  await page.setViewportSize({ width: 703, height: 1000 });
  await page.goto("/");
  const name = (await page.getByRole("heading", { level: 1 }).boundingBox())!;
  const consulting = (await page.getByRole("heading", { name: "Consulting" }).boundingBox())!;
  expect(consulting.x).toBeGreaterThan(name.x + 300);
});
