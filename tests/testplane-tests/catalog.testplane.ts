import { test_url } from "../utils/constants";

// Ловят bug_id 6,7,9
describe("Каталог", () => {
  it("Eсли товар уже добавлен в корзину, повторное нажатие кнопки добавить в корзину должно увеличивать его количество", async ({
    browser,
  }) => {
    await browser.clearSession();
    await browser.url(test_url + `/catalog`);
    
    const productCard = await browser.$("[data-testid]");
    const id = await productCard.getAttribute('data-testid');
    await browser.url(test_url + `/catalog/${id}`);

    const addToCartBtn = await browser.$(".ProductDetails-AddToCart");
    await addToCartBtn.click();

    await browser.url(test_url + `/cart`)

    const count = await browser.$(".Cart-Count");
    
    await expect(count).toHaveText("1");
  });

  it("Cодержимое корзины должно сохраняться между перезагрузками страницы", async ({
    browser,
  }) => {
    await browser.clearSession();
    await browser.url(test_url + `/catalog`);
    
    const productCard = await browser.$("[data-testid]");
    const id = await productCard.getAttribute('data-testid');
    await browser.url(test_url + `/catalog/${id}`);

    const addToCartBtn = await browser.$(".ProductDetails-AddToCart");
    await addToCartBtn.click();

    await browser.url(test_url + `/cart`)

    const count = await browser.$(".Cart-Count");

    await browser.url(test_url + `/cart`);
    const refreshedCount = await browser.$(".Cart-Count");
    
    await expect(count).toHaveText("1");
    await expect(refreshedCount).toHaveText("1");
  })

  it("Кнопка добавления в корзину корректно рендерится", async ({browser}) => {
    await browser.clearSession();
    await browser.url(test_url + `/catalog`);
    
    const productCard = await browser.$("[data-testid]");
    const id = await productCard.getAttribute('data-testid');
    await browser.url(test_url + `/catalog/${id}`);

    const addToCartBtn = await browser.$(".ProductDetails-AddToCart");
    await addToCartBtn.waitForDisplayed();
    await addToCartBtn.assertView("addToCart")
  })
});
