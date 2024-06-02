export class HomePage {
  constructor(page) {
    this.page = page;
    this.inventoryItems =  this.page.locator("//div[@class='inventory_item']");
    this.cartItems = [];
  }

  async addToCart(itemNumber) {
    const item = await this.inventoryItems.nth(itemNumber);
    await item.getByText("Add to cart").click();
    this.cartItems.push({
      name: await item
        .locator("xpath=.//div[@class='inventory_item_name ']")
        .textContent(),
      desc: await item
        .locator("xpath=.//div[@class='inventory_item_desc']")
        .textContent(),
      price: await item
        .locator("xpath=.//div[@class='inventory_item_price']")
        .textContent(),
    });
  }

  async removeFromCart(itemNumber){
    const item = await this.inventoryItems.nth(itemNumber);
    await item.getByText('Remove').click();
    this.cartItems.splice(itemNumber,1);
  }

}
