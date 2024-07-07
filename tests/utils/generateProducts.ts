import { Product, ProductShortInfo } from "../../src/common/types";
import { Faker, en } from "@faker-js/faker";

export const faker = new Faker({
  locale: [en],
});

const commerce = faker.commerce;
const cats = faker.animal;
export const generateProducts = (amount: number) => {
  const products: Product[] = [];

  for (let id = 0; id < amount; id++) {
    products.push({
      id,
      name: `${commerce.productAdjective()} kogtetochka`,
      description: `Really ${commerce.productAdjective()} kogtetochka for ${cats.cat()}`,
      price: Number(commerce.price()),
      color: faker.color.human(),
      material: commerce.productMaterial(),
    });
  }

  return products;
};

export function getShortInfo({ id, name, price }: Product): ProductShortInfo {
  return { id, name, price };
}
