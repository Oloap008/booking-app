import { test, expect } from "@playwright/test";
import path from "path";

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

test("should allow user to add a hotel", async ({ page }) => {
  await page.goto(`${UI_URL}add-hotel`);

  await page.locator("[name=name]").fill("Test Hotel");
  await page.locator("[name=city]").fill("Test City");
  await page.locator("[name=country]").fill("Test Country");
  await page
    .locator("[name=description]")
    .fill("This is a description for the Test Hotel");
  await page.locator("[name=pricePerNight]").fill("100");
  await page.selectOption("select[name=starRating]", "3");

  await page.getByText("Budget").click();

  await page.getByLabel("Free Wifi").check();
  await page.getByLabel("Spa").check();
  await page.getByLabel("Parking").check();

  await page.locator("[name=adultCount]").fill("2");
  await page.locator("[name=childCount]").fill("1");

  await page.setInputFiles("[name=imageFiles]", [
    path.join(__dirname, "files", "1.jpg"),
    path.join(__dirname, "files", "2.jpg"),
  ]);

  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByText("Hotel saved")).toBeVisible();
});

test("should display hotels", async ({ page }) => {
  await page.getByRole("link", { name: "My Hotels" }).click();

  await expect(page.getByRole("heading", { name: "My Hotels" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Test Hotel" }).first()
  ).toBeVisible();

  await expect(
    page.getByText("This is a description for the Test Hotel").first()
  ).toBeVisible();
  await expect(page.getByText("Test City, Test Country").first()).toBeVisible();
  await expect(page.getByText("Budget").first()).toBeVisible();
  await expect(page.getByText("$100.00 per night").first()).toBeVisible();
  await expect(page.getByText("2 adults, 1 children").first()).toBeVisible();
  await expect(page.getByText("3 star rating").first()).toBeVisible();

  await expect(
    page.getByRole("link", { name: "View Details" }).first()
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Add Hotel" })).toBeVisible();
});

test("should be allowed to edit hotel", async ({ page }) => {
  await page.getByRole("link", { name: "My Hotels" }).click();

  await page.getByRole("link", { name: "View Details" }).first().click();

  await page.waitForSelector("[name='name']", { state: "attached" });
  await expect(page.locator("[name='name']")).toHaveValue("Test Hotel");
  await page.locator("[name='name']").fill("Test Hotel UPDATED");
  await page.getByRole("button", { name: "Update" }).click();
  await expect(page.getByText("Hotel successfully updated")).toBeVisible();

  await page.getByRole("link", { name: "View Details" }).first().click();
  await page.waitForSelector("[name='name']", { state: "attached" });
  await expect(page.locator("[name='name']")).toHaveValue("Test Hotel UPDATED");

  await page.locator("[name='name']").fill("Test Hotel");
  await page.getByRole("button", { name: "Update" }).click();

  await expect(page.getByText("Hotel successfully updated")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Test Hotel" }).first()
  ).toBeVisible();
});
