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

test("should be able to book hotel", async ({ page }) => {
  await page.getByPlaceholder("Where are you going?").fill("Dublin");

  const date = new Date();
  date.setDate(date.getDate() + 3);
  const formattedDate = date.toISOString().split("T")[0];
  await page.getByPlaceholder("Check-out Date").fill(formattedDate);

  await page.getByRole("button", { name: "Search" }).click();

  await page.getByText("Dublin Getaways").click();

  await page.getByRole("button", { name: "Book now" }).click();

  await expect(page.getByText("Total Cost: $900.00")).toBeVisible();

  const stripeFrame = page.frameLocator("iframe").first();

  await stripeFrame
    .locator("[placeholder='Card number']")
    .fill("4242 4242 4242 4242");
  await stripeFrame.locator("[placeholder='MM / YY']").fill("10/26");
  await stripeFrame.locator("[placeholder='CVC']").fill("2412");
  await stripeFrame.locator("[placeholder='ZIP']").fill("24121");

  await page.getByRole("button", { name: "Confirm Booking" }).click();

  await expect(page.getByText("Booking Saved!")).toBeVisible();
});
