import React from "react";
import {
  BrowserRouter,
  MemoryRouter,
  MemoryRouterProps,
} from "react-router-dom";
import { ExampleApi, CartApi } from "../../src/client/api";
import { initStore } from "../../src/client/store";
import { Provider } from "react-redux";
import { Application } from "../../src/client/Application";

export function initApplication(memoryRouterProps?: MemoryRouterProps) {
  const basename = "/hw/store";

  const api = new ExampleApi(basename);
  const cart = new CartApi();
  const store = initStore(api, cart);

  const application = (
    <MemoryRouter {...memoryRouterProps}>
      <Provider store={store}>
        <Application />
      </Provider>
    </MemoryRouter>
  );
  return application;
}
