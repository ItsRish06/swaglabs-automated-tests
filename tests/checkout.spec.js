import { test, expect } from "@playwright/test";
import { LoginPage } from "../page-objects/login-page";
import { HomePage } from "../page-objects/home-page";
import { CheckoutPage } from "../page-objects/checkout-page";

test.describe("Checkout feature tests", { tag: "@checkout" }, () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("standard_user", "secret_sauce");
  });

  test("Checkout", async ({ page }) => {
    let inventoryPage = new HomePage(page);
    await inventoryPage.addToCart(0);
    await inventoryPage.addToCart(1);
    await page.locator(".shopping_cart_link").click();
    await page.getByText("Checkout").click();

    let checkoutPage = new CheckoutPage(page);

    checkoutPage.fillCheckoutForm("firstname", "lastname", "12345");
    await page.waitForTimeout(1000);
    await page.locator("//input[@id='continue']").click();

    let checkoutItems = await checkoutPage.getCheckoutItems();
    expect(checkoutItems).toMatchObject(inventoryPage.cartItems);
    
    let paymentLabel = await checkoutPage.getPaymentLabel();
    expect(paymentLabel).toBe("Payment Information:");

    let paymentValue = await checkoutPage.getPaymentValue();
    expect(paymentValue).toBe("SauceCard #31337");

    let shippingLabel = await checkoutPage.getShippingLabel();
    expect(shippingLabel).toBe("Shipping Information:");

    let shippingValue = await checkoutPage.getShippingValue();
    expect(shippingValue).toBe("Free Pony Express Delivery!");

    let totalLabel = await checkoutPage.getTotalLabel();
    expect(totalLabel).toBe("Price Total");

    let subtotal = await checkoutPage.getSubtotal();
    let subtotalValue = 0;
    checkoutItems.forEach((item) => {
      subtotalValue += parseFloat(item.price.substring(1));
    });
    expect(subtotal).toBe(`Item total: $` + subtotalValue);

    let tax = await checkoutPage.getTax();
    expect(tax).toBe("Tax: $" + (subtotalValue * 0.08).toFixed(2));

    await page.getByText("Finish").click();

    let thankYouText = await checkoutPage.getThankyouHeaderText();
    let thankYouSubText = await checkoutPage.getThankyouSubText();

    expect(thankYouText).toBe("Thank you for your order!");
    expect(thankYouSubText).toBe(
      "Your order has been dispatched, and will arrive just as fast as the pony can get there!"
    );
  });

  test("check out page form validation", async ({ page }) => {
    let inventoryPage = new HomePage(page);
    await inventoryPage.addToCart(0);
    await page.locator(".shopping_cart_link").click();
    await page.getByText("Checkout").click();

    let checkoutPage = new CheckoutPage(page);

    await page.locator("//input[@id='continue']").click();

    let errorMsg = await checkoutPage.getFormError();
    expect(errorMsg).toBe("Error: First Name is required");
    await page.locator("//button[@class='error-button']").click();

    await checkoutPage.fillCheckoutForm("firstName", "lastName", "");
    await page.locator("//input[@id='continue']").click();
    errorMsg = await checkoutPage.getFormError();
    expect(errorMsg).toBe("Error: Postal Code is required");
    await page.locator("//button[@class='error-button']").click();

    await checkoutPage.fillCheckoutForm("firstName", "", "1245");
    await page.locator("//input[@id='continue']").click();
    errorMsg = await checkoutPage.getFormError();
    expect(errorMsg).toBe("Error: Last Name is required");
    await page.locator("//button[@class='error-button']").click();

    await checkoutPage.fillCheckoutForm("", "lastName", "1245");
    await page.locator("//input[@id='continue']").click();
    errorMsg = await checkoutPage.getFormError();
    expect(errorMsg).toBe("Error: First Name is required");
    await page.locator("//button[@class='error-button']").click();

    await checkoutPage.fillCheckoutForm("firstName", "lastName", "1245");
    await page.locator("//input[@id='continue']").click();

    let pageTitle = await page
      .locator("//span[@class='title']")
      .textContent();
    expect(pageTitle).toBe("Checkout: Overview");
  });

  test("Checkout without adding items to cart",async ({page})=>{
    await page.locator(".shopping_cart_link").click();
    await page.getByText("Checkout").click();
    await page.waitForTimeout(1000);
    expect(page.url()).toBe("https://www.saucedemo.com/cart.html");
  })
});
