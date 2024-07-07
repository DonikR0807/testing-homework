import { getByRole, getByText, render, screen } from "@testing-library/react";
import { generateProducts, getShortInfo } from "../utils/generateProducts";
import { removeDuplicates } from "../utils/removeDuplicates";
import { Provider } from "react-redux";
import { Application } from "../../src/client/Application";
import { MemoryRouter } from "react-router-dom";
import { CartApi, ExampleApi } from "../../src/client/api";
import { initStore } from "../../src/client/store";
import React from "react";
import userEvent from "@testing-library/user-event";

const basename = "/hw/store";

describe("Каталог", () => {
  it("В каталоге должны отображаться товары, которые приходят с сервера", async () => {
    const mockData = generateProducts(5).map((product) =>
      getShortInfo(product)
    );
    const api = new ExampleApi(basename);
    // @ts-ignore
    api.getProducts = async () => ({
      data: mockData,
    });
    const cart = new CartApi();
    const store = initStore(api, cart);
    render(
      <MemoryRouter initialEntries={["/catalog"]}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    let products = await screen.findAllByTestId(/\d/);
    products = removeDuplicates(products);

    const productsInfo = products.map((product, i) => {
      const nameElement = getByRole(product, "heading");
      const priceElement = getByRole(product, "paragraph");

      return {
        name: nameElement.textContent,
        price: priceElement.textContent,
      };
    });

    expect(productsInfo.length).toBe(mockData.length);
    expect(productsInfo).toEqual(
      mockData.map((product) => ({
        name: product.name,
        price: "$" + product.price,
      }))
    );
  });

  it(`На странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка добавить в корзину`, async () => {
    const [mockData] = generateProducts(1);
    const api = new ExampleApi(basename);
    // @ts-ignore
    api.getProductById = async (id: number) => ({
      data: mockData,
    });
    const cart = new CartApi();
    const store = initStore(api, cart);
    render(
      <MemoryRouter initialEntries={["/catalog/" + mockData.id]}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    const [name, description, price, material, btn] = await Promise.all([
      screen.findByText(mockData.name),
      screen.findByText(mockData.description),
      screen.findByText(mockData.price, {
        exact: false,
      }),
      screen.findByText(mockData.material),
      screen.findByText("Add to Cart"),
    ]);

    expect(name.textContent).toBe(mockData.name);
    expect(description.textContent).toBe(mockData.description);
    expect(price.textContent).toMatch(String(mockData.price));
    expect(material.textContent).toBe(mockData.material);
    expect(btn).toBeInTheDocument();
  });

  it("Если товар уже добавлен в корзину, на странице товара должно отображаться сообщение об этом", async () => {
    const [mockData] = generateProducts(1);
    const api = new ExampleApi(basename);
    // @ts-ignore
    api.getProductById = async (id: number) => ({
      data: mockData,
    });
    const cart = new CartApi();
    cart.getState = () => ({
      [mockData.id]: {
        name: mockData.name,
        price: mockData.price,
        count: 1,
      },
    });
    const store = initStore(api, cart);
    render(
      <MemoryRouter initialEntries={["/catalog/" + mockData.id]}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    const cartBadge = await screen.findByText("Item in cart");

    expect(cartBadge).toBeInTheDocument();
  });

  it("Если товар уже добавлен в корзину, в каталоге должно отображаться сообщение об этом", async () => {
    const [mockData] = generateProducts(1);
    const api = new ExampleApi(basename);

    // @ts-ignore
    api.getProducts = async () => ({
      data: [mockData],
    });
    const cart = new CartApi();
    cart.getState = () => ({
      [mockData.id]: {
        name: mockData.name,
        price: mockData.price,
        count: 1,
      },
    });
    const store = initStore(api, cart);
    render(
      <MemoryRouter initialEntries={["/catalog"]}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    let products = await screen.findAllByTestId(mockData.id);
    products = removeDuplicates(products);

    const cartBadge = getByText(products[0], "Item in cart");

    expect(cartBadge).toBeInTheDocument();
  });

  it("Eсли товар уже добавлен в корзину, повторное нажатие кнопки добавить в корзину должно увеличивать его количество", async () => {
    const [mockData] = generateProducts(1);
    const mockCount = 5;
    const api = new ExampleApi(basename);
    // @ts-ignore
    api.getProductById = async (id: number) => ({
      data: mockData,
    });
    const cart = new CartApi();
    cart.getState = () => ({
      [mockData.id]: {
        name: mockData.name,
        price: mockData.price,
        count: mockCount,
      },
    });
    const store = initStore(api, cart);
    render(
      <MemoryRouter initialEntries={["/catalog/" + mockData.id]}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    const addToCartBtn = await screen.findByRole("button", {
      name: "Add to Cart",
    });

    await userEvent.click(addToCartBtn);

    const { count } = store.getState().cart[mockData.id];

    expect(count).toBe(mockCount + 1);
  });
});
