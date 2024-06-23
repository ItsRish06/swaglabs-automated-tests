import { error } from "console";
import { execPath } from "process";

export class CheckoutPage {
  constructor(page) {
    this.page = page;
  }

  async getCheckoutItems() {
    try {
      let cartItems = this.page.locator("//div[@class='cart_item']");
      let promises = [];
      let cartItemCount = await cartItems.count();

      for (let i = 0; i < cartItemCount; i++) {
        let item = cartItems.nth(i);
        let promise = (async () => {
          let cartItem = {
            name: await item
              .locator("xpath=.//div[@class='inventory_item_name']")
              .textContent(),
            desc: await item
              .locator("xpath=.//div[@class='inventory_item_desc']")
              .textContent(),
            price: await item
              .locator("xpath=.//div[@class='inventory_item_price']")
              .textContent(),
          };
          return cartItem;
        })();
        promises.push(promise);
      }
      let checkoutItemsObjs = Promise.all(promises);
      
      return checkoutItemsObjs;
    } catch (error) {
      throw new error("Failed to get checkout items", error);
    }
  }

  async fillCheckoutForm(firstName, lastName, zipCode) {
    try {
      await this.page.getByPlaceholder("First Name").fill(firstName);
      await this.page.getByPlaceholder("Last Name").fill(lastName);
      await this.page.getByPlaceholder("Zip/Postal Code").fill(zipCode);
    } catch (error) {
      throw new error("Failed to fill checkout form", error);
    }
  }

  async getFormError() {
    try {
      let errorMsg = await this.page
        .locator("//h3[@data-test='error']")
        .textContent();

      return errorMsg;
    } catch (error) {
      throw new error("Failed to get the form error message", error);
    }
  }

  async getThankyouHeaderText() {
    try {
      let msg = await this.page
        .locator("//h2[@class='complete-header']")
        .textContent();

      return msg;
    } catch (error) {
      throw new error("Failed to get thank you page header text", error);
    }
  }

  async getThankyouSubText() {
    try {
      let msg = await this.page
        .locator("//div[@class='complete-text']")
        .textContent();

      return msg;
    } catch (error) {
      throw new error("Failed to get the thank you page subheader", error);
    }
  }

  async getPaymentLabel() {
    try {
      let paymentLabel = await this.page
        .locator("//div[@data-test='payment-info-label']")
        .textContent();

      return paymentLabel;
    } catch (error) {
      throw new error("Failed to get checkout page payment label", error);
    }
  }

  async getPaymentValue() {
    try {
      let paymentValue = await this.page
        .locator("//div[@data-test='payment-info-value']")
        .textContent();

      return paymentValue;
    } catch (error) {
      throw new error("Failed to get checkout page payment value", error);
    }
  }

  async getShippingLabel() {
    try {
      let shippingLabel = await this.page
        .locator("//div[@data-test='shipping-info-label']")
        .textContent();

      return shippingLabel;
    } catch (error) {
      throw new error("Failed to get checkout page shipping label");
    }
  }

  async getShippingValue() {
    try {
      let shippingValue = await this.page
        .locator("//div[@data-test='shipping-info-value']")
        .textContent();

      return shippingValue;
    } catch (error) {
      throw new error("Failed to get checkout page shipping vale", error);
    }
  }

  async getTotalLabel() {
    try {
      let totalLabel = await this.page
        .locator("//div[@data-test='total-info-label']")
        .textContent();

      return totalLabel;
    } catch (error) {
      throw new error("Failed to get checkout page total label", error);
    }
  }

  async getSubtotal() {
    try {
      let subtotal = await this.page
        .locator("//div[@data-test='subtotal-label']")
        .textContent();

      return subtotal;
    } catch (error) {
      throw new error("Failed to get checkout page subtotal", error);
    }
  }

  async getTax() {
    try {
      let tax = await this.page
        .locator("//div[@data-test='tax-label']")
        .textContent();

      return tax;
    } catch (error) {
      throw new error("Failed to get tax amount", error);
    }
  }
}
