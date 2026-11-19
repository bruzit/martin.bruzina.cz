import { expect, type Page, test } from "@playwright/test";

const footer = (page: Page) => page.locator("footer");
const toggle = (page: Page) => footer(page).getByRole("button", { name: "Hrázka 619/34, 621 00 Brno" });
const bubble = (page: Page) => footer(page).getByRole("list", { name: "Address on a map" });
const address = "Hr%C3%A1zka%20619%2F34%2C%20621%2000%20Brno";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("legal paragraph is one paragraph in text flow", async ({ page }) => {
  const legal = footer(page).locator("p").first();
  await expect(legal).toHaveText(
    "Ing. Martin Bružina · Hrázka 619/34, 621 00 Brno · IČO 75597381 · entered in the Trade Licensing Register, Magistrát města Brna",
  );
  await expect(legal.locator("br")).toHaveCount(0);
});

test("copyright names the holder", async ({ page }) => {
  await expect(footer(page).locator("p").last()).toHaveText("© 2026 Martin Bružina");
});

test("links point to their targets", async ({ page }) => {
  await toggle(page).click();
  const links = {
    "Ing. Martin Bružina": "https://martin.bruzina.cz/",
    "Martin Bružina": "https://martin.bruzina.cz/",
    "75597381": "https://rzp.gov.cz/portal/en/vyhledani?q=75597381",
    "Google Maps": `https://www.google.com/maps/search/?api=1&query=${address}`,
    "Mapy.com": `https://mapy.com/fnc/v1/search?query=${address}`,
    "Apple Maps": `https://maps.apple.com/search?query=${address}`,
  };
  for (const [name, href] of Object.entries(links)) {
    await expect(footer(page).getByRole("link", { name, exact: true })).toHaveAttribute("href", href);
  }
});

for (const width of [320, 1280]) {
  test(`map bubble opens upward inside the card without resizing the page at ${width} px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const size = () => page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.scrollHeight]);
    const before = await size();
    await expect(toggle(page)).toHaveAttribute("aria-expanded", "false");
    await expect(bubble(page)).toHaveCount(0);
    await toggle(page).click();
    await expect(toggle(page)).toHaveAttribute("aria-expanded", "true");
    await expect(bubble(page).getByRole("link")).toHaveCount(3);
    const box = (await bubble(page).boundingBox())!;
    const card = (await page.getByRole("article").boundingBox())!;
    const button = (await toggle(page).boundingBox())!;
    expect(box.y + box.height).toBeLessThanOrEqual(button.y);
    expect(box.x).toBeGreaterThanOrEqual(card.x);
    expect(box.x + box.width).toBeLessThanOrEqual(card.x + card.width);
    expect(box.y).toBeGreaterThanOrEqual(card.y);
    expect(await size()).toEqual(before);
    await expect(page.locator("[aria-modal='true']")).toHaveCount(0);
  });
}

test("map bubble closes on Escape and returns focus", async ({ page }) => {
  await toggle(page).click();
  await expect(bubble(page)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(bubble(page)).toHaveCount(0);
  await expect(toggle(page)).toBeFocused();
});

test("map bubble closes on an outside click and leaves the page usable", async ({ page }) => {
  await toggle(page).click();
  await expect(bubble(page)).toBeVisible();
  await page.getByRole("heading", { level: 1 }).click();
  await expect(bubble(page)).toHaveCount(0);
  await expect(toggle(page)).toHaveAttribute("aria-expanded", "false");
});

test("copied text keeps the on-screen separation", async ({ page }) => {
  const copied = await footer(page).evaluate((element) => {
    const selection = window.getSelection()!;
    selection.selectAllChildren(element);
    return selection.toString();
  });
  for (const [before, after] of [
    ["Bružina", "·"],
    ["Brno", "·"],
    ["Brna", "©"],
  ]) {
    expect(copied).not.toContain(before + after);
  }
});

test("copied map links keep the on-screen separation", async ({ page }) => {
  await toggle(page).click();
  const copied = await bubble(page).evaluate((element) => {
    const selection = window.getSelection()!;
    selection.selectAllChildren(element);
    return selection.toString();
  });
  expect(copied).not.toContain("MapsMapy.com");
  expect(copied).not.toContain("Mapy.comApple");
});

test("works in two tabs at once", async ({ context, page }) => {
  const second = await context.newPage();
  await second.goto("/");
  await page.reload();
  for (const tab of [page, second]) {
    await expect(tab.getByRole("heading", { level: 1 })).toHaveText("Martin Bružina");
    await expect(footer(tab)).toContainText("IČO 75597381");
  }
});
