import {
  getAllByRole,
  getByText,
  render,
  screen,
} from "@testing-library/react";
import { initApplication } from "../utils/initApplication";

describe("Ссылки внутри шапки", () => {
  it("Название магазина в шапке - ссылка на главную страницу", () => {
    render(initApplication());

    const nav = screen.getByRole("navigation");
    const mainLink = getByText(nav, "Kogtetochka store");

    expect(mainLink).toHaveAttribute("href", "/");
  });

  it("В шапке отображаются ссылки на страницы магазина, а также ссылка на корзину", () => {
    render(initApplication());

    const nav = screen.getByRole("navigation");
    const links = getAllByRole(nav, "link");
    const linksHref = links.map((link) => link.getAttribute("href"));

    expect(linksHref).toEqual([
      "/",
      "/catalog",
      "/delivery",
      "/contacts",
      "/cart",
    ]);
  });
});
