import { expect, test } from "@playwright/test";

const UI_URL = "http://localhost:5173/";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByRole("link", { name: "Sign in" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("test@email.com");
  await page.locator("[name=password]").fill("pass1234");

  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.getByText("Sign in successful")).toBeVisible();
});

test("Should show hotel search results", async ({ page }) => {
  await page.getByPlaceholder("Where are you going?").fill("Dublin");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByText("Hotel Found in Dublin")).toBeVisible();

  await expect(
    page.getByRole("link", { name: "Dublin Getaways" })
  ).toBeVisible();
});

test("Should show hotel detail", async ({ page }) => {
  await page.getByPlaceholder("Where are you going?").fill("Dublin");
  await page.getByRole("button", { name: "Search" }).click();

  await page.getByText("Dublin Getaways").click();

  await expect(page).toHaveURL(/detail/);

  await expect(page.getByRole("button", { name: "Book now" })).toBeVisible();
});
