import { test_url } from "../utils/constants";

// Ловит bug_id=4. Для того, чтобы данные тесты
describe("Бургер", () => {
  it('Навигационное меню на ширине меньше 576px должно скрываться за "гамбургер"', async ({
    browser,
  }) => {
    await browser.url(test_url);
    await browser.setWindowSize(575, 900);
    const menu = await browser.$(".Application-Menu");
    const burger = await browser.$("aria/Toggle navigation");

    await expect(menu).not.toBeDisplayed();
    await expect(burger).toBeDisplayed();
  });

  it('При выборе элемента из меню "Гамбургера", меню должно закрываться', async ({
    browser,
  }) => {
    await browser.url(test_url);
    await browser.setWindowSize(575, 900);
    const menu = await browser.$(".Application-Menu");
    const burger = await browser.$("aria/Toggle navigation");
    const firstLink = await menu.$(".nav-link");

    await burger.click();
    await firstLink.click();

    await expect(menu).not.toBeDisplayed();
  });
});
