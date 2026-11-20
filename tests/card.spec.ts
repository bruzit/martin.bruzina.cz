import { expect, type Page, test } from "@playwright/test";

const card = (page: Page) => page.getByRole("article");

test.beforeEach(async ({ context, page }) => {
  await context.route(/^https:\/\/(?!localhost)/, (route) => route.abort());
  await page.goto("/");
});

test("shows name, headline, bio, consulting and location", async ({ page }) => {
  await expect(card(page).getByRole("heading", { level: 1 })).toHaveText("Martin Bružina");
  await expect(card(page)).toContainText("Platform engineer, DevOps, and SRE");
  await expect(card(page)).toContainText("I'm Martin, a platform engineer and SRE from Brno.");
  await expect(card(page).getByRole("heading", { name: "Consulting" })).toBeVisible();
  await expect(card(page)).toContainText("Part-time · remote or on-site in Brno · Czech, English");
  await expect(card(page)).toContainText("Consulting only; not looking for a permanent role.");
  await expect(card(page).getByText("Blog, soon")).toBeVisible();
  await expect(card(page)).toContainText("Brno, Czechia");
});

test("links point to their targets", async ({ page }) => {
  const links = {
    "martin@bruzina.cz": "mailto:martin@bruzina.cz",
    "+420 775 714 324": "tel:+420775714324",
    LinkedIn: "https://www.linkedin.com/in/martin-bruzina",
    GitHub: "https://github.com/bruzina",
  };
  for (const [name, href] of Object.entries(links)) {
    await expect(card(page).getByRole("link", { name, exact: true })).toHaveAttribute("href", href);
  }
});

test("inquiry opens a pre-filled e-mail", async ({ page }) => {
  const href = await card(page).getByRole("link", { name: "Send an inquiry" }).getAttribute("href");
  const url = new URL(href!);
  expect(url.protocol + url.pathname).toBe("mailto:martin@bruzina.cz");
  expect(url.searchParams.get("subject")).toBe("Consulting inquiry");
  expect(url.searchParams.get("body")).toBe("Team size:\nStack:\nWhat slows you down:\n");
});

for (const modifier of [undefined, "ControlOrMeta"] as const) {
  test(`${modifier ? "Ctrl/Cmd" : "middle"}-click opens a new tab`, async ({ context, page }) => {
    const link = card(page).getByRole("link", { name: "GitHub" });
    const [tab] = await Promise.all([
      context.waitForEvent("page"),
      modifier ? link.click({ modifiers: [modifier] }) : link.click({ button: "middle" }),
    ]);
    expect(tab).not.toBe(page);
    await expect(page).toHaveURL("/");
  });
}

test("copied text keeps the on-screen separation", async ({ page }) => {
  const copied = await card(page).evaluate((element) => {
    const selection = window.getSelection()!;
    selection.selectAllChildren(element);
    return selection.toString();
  });
  for (const [before, after] of [
    ["Bružina", "Platform"],
    ["GitHub", "I'm"],
    ["didn't.", "Blog"],
    ["soon", "LinkedIn"],
    ["LinkedIn", "GitHub"],
    ["GitHub", "Consulting"],
    ["Consulting", "Want"],
    ["down.", "Part-time"],
    ["English", "Send"],
    ["inquiry", "Consulting only"],
    ["role.", "Contact"],
    ["Contact", "martin@"],
    ["bruzina.cz", "+420"],
    ["324", "Brno"],
    ["Czechia", "Ing."],
  ]) {
    expect(copied).not.toContain(before + after);
  }
});
