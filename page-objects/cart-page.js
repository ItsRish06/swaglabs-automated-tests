export class CartPage {
  constructor(page) {
    this.page = page;
  }

  async getCartItems() {
    let cartItemElements = this.page.locator("//div[@class='cart_item']");

    const cartItemCount = await cartItemElements.count();
    let promises = [];

    for (let i = 0; i < cartItemCount; i++) {
      let item = cartItemElements.nth(i);

      const promise = (async () => {
        const cartItem = {
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

    let cartItemObjs = Promise.all(promises);
    return cartItemObjs;
  }

  async removeFromCart(itemNumber) {
    let cartItemElements = this.page.locator("//div[@class='cart_item']");
    await cartItemElements.nth(itemNumber).getByText("Remove").click();
  }
}
