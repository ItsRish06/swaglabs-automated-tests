import { test, expect } from "@playwright/test";
import { LoginPage } from "../page-objects/login-page";
import { CartPage } from "../page-objects/cart-page";
import { HomePage } from "../page-objects/home-page";

test.describe("Cart feature tests", { tag: "@cart" }, () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("standard_user", "secret_sauce");
  });

  test("Add item to cart", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.addToCart(0);
    await homePage.addToCart(1);

    await page.locator(".shopping_cart_link").click();
    await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");

    let cartPage = new CartPage(page);
    let cartItems = await cartPage.getCartItems();

    expect(cartItems).toMatchObject(homePage.cartItems);
  });
});
