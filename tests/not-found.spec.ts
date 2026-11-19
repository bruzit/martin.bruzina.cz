import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("a missing page answers 404 with the signpost", async ({ page }) => {
  const response = await page.goto("/nonsense");
  expect(response!.status()).toBe(404);
  await expect(page.getByText("HTTP 404")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("No page at /nonsense");
  await expect(page.getByText("The link is old or mistyped. Nobody was paged; pick a direction instead.")).toBeVisible();
  await expect(page).toHaveTitle("Page not found · Martin Bružina");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
  await expect(page.locator("footer")).toContainText("IČO 75597381");
});

test("signpost boards point home, to an inquiry, LinkedIn and GitHub", async ({ page }) => {
  await page.goto("/nonsense");
  const boards = page.getByRole("navigation", { name: "Where to go" }).getByRole("link");
  await expect(boards).toHaveText(["Home", "Send an inquiry", "LinkedIn", "GitHub"]);
  await expect(boards.nth(0)).toHaveAttribute("href", "/");
  await expect(boards.nth(1)).toHaveAttribute("href", /^mailto:martin@bruzina\.cz\?subject=Consulting%20inquiry/);
  await expect(boards.nth(2)).toHaveAttribute("href", "https://www.linkedin.com/in/martin-bruzina/");
  await expect(boards.nth(3)).toHaveAttribute("href", "https://github.com/bruzina");
  for (const board of await boards.all()) {
    expect((await board.boundingBox())!.height).toBeGreaterThanOrEqual(24);
  }
});

test("the home board leads back to the card", async ({ page }) => {
  await page.goto("/nonsense");
  await page.getByRole("link", { name: "Home" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Martin Bružina");
});

test("nested missing paths show their path", async ({ page }) => {
  expect((await page.goto("/talks/2027?x=1"))!.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("No page at /talks/2027");
});

for (const colorScheme of ["light", "dark"] as const) {
  test(`404 page has no accessibility violations in ${colorScheme} theme`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto("/nonsense");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`)).toEqual([]);
  });
}

test("the card page answers 200", async ({ page }) => {
  expect((await page.goto("/"))!.status()).toBe(200);
});
