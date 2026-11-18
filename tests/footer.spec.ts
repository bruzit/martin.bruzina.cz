import { expect, type Page, test } from "@playwright/test";

const footer = (page: Page) => page.getByRole("contentinfo");
const address = "Hr%C3%A1zka%20619%2F34%2C%20621%2000%20Brno";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("legal paragraph is one paragraph in text flow", async ({ page }) => {
  const legal = footer(page).locator("p").first();
  await expect(legal).toHaveText(
    "Ing. Martin Bružina, Hrázka 619/34, 621 00 Brno, IČO 75597381, entered in the Trade Licensing Register kept by Magistrát města Brna.",
  );
  await expect(legal.locator("br")).toHaveCount(0);
});

test("copyright names the holder", async ({ page }) => {
  await expect(footer(page).locator("p").last()).toHaveText("© 2026 Martin Bružina");
});

test("links point to their targets", async ({ page }) => {
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

test("copied text keeps the on-screen separation", async ({ page }) => {
  const copied = await footer(page).evaluate((element) => {
    const selection = window.getSelection()!;
    selection.selectAllChildren(element);
    return selection.toString();
  });
  for (const [before, after] of [
    ["Brna.", "Google"],
    ["Maps", "Mapy.com"],
    ["Mapy.com", "Apple"],
    ["Maps", "©"],
  ]) {
    expect(copied).not.toContain(before + after);
  }
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
