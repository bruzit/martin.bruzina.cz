import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

const card = (page: Page) => page.getByRole("article");

for (const colorScheme of ["light", "dark"] as const) {
  test(`no accessibility violations in ${colorScheme} theme`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(colorScheme === "dark" ? /dark/ : /^(?!.*dark)/);
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`)).toEqual([]);
  });
}

test("reflows at 320 px without horizontal scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

test("stacks columns on a phone, side by side on a wide screen", async ({ page }) => {
  const consulting = () => card(page).getByRole("heading", { name: "Consulting" });
  const name = () => card(page).getByRole("heading", { level: 1 });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  expect((await consulting().boundingBox())!.y).toBeGreaterThan((await name().boundingBox())!.y + 100);
  await page.setViewportSize({ width: 1280, height: 800 });
  expect((await consulting().boundingBox())!.x).toBeGreaterThan((await name().boundingBox())!.x + 300);
});

test("keyboard focus shows a visible ring on every link and button", async ({ page }) => {
  await page.goto("/");
  const count = (await page.getByRole("link").count()) + (await page.getByRole("button").count());
  for (let i = 0; i < count; i++) {
    await page.keyboard.press("Tab");
    const outline = await page.evaluate(() => {
      const style = getComputedStyle(document.activeElement!);
      return { tag: document.activeElement!.tagName, style: style.outlineStyle, width: style.outlineWidth };
    });
    expect(["A", "BUTTON"]).toContain(outline.tag);
    expect({ style: outline.style, width: outline.width }).toEqual({ style: "solid", width: "3px" });
  }
});

test("list links and the inquiry button are at least 24 px high", async ({ page }) => {
  await page.goto("/");
  for (const link of await page.locator("li > a, article a:has-text('Send an inquiry')").all()) {
    expect((await link.boundingBox())!.height, await link.textContent() ?? "").toBeGreaterThanOrEqual(24);
  }
});

test("inquiry button uses dark text on the brand fill", async ({ page }) => {
  await page.goto("/");
  const button = card(page).getByRole("link", { name: "Send an inquiry" });
  await expect(button).toHaveCSS("background-color", "rgb(234, 129, 39)");
  await expect(button).toHaveCSS("color", "rgb(11, 12, 13)");
});

test("uses Libre Franklin", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check('16px "Libre Franklin"'))).toBe(true);
});

test("shows the photo from the site itself", async ({ page }) => {
  await page.goto("/");
  const photo = card(page).getByRole("img", { name: "Portrait of Martin Bružina" });
  await expect(photo).toHaveAttribute("src", "/photo.jpg");
  expect(await photo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth)).toBe(192);
});
