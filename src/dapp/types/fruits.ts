import sunflower from "../images/sunflower/fruit.png";
import pumpkin from "../images/pumpkin/fruit.png";
import beetroot from "../images/beetroot/fruit.png";
import cauliflower from "../images/cauliflower/fruit.png";
import potato from "../images/potato/fruit.png";
import radish from "../images/radish/fruit.png";
import parsnip from "../images/parsnip/fruit.png";

export enum Fruit {
  None = "0",
  Sunflower = "1",
  Potato = "2",
  Pumpkin = "3",
  Beetroot = "4",
  Cauliflower = "5",
  Parsnip = "6",
  Radish = "7",
}

export interface FruitItem {
  fruit: Fruit;
  name: string;
  image: string;
  buyPrice: number;
  sellPrice: number;
  landRequired: number;
  harvestMinutes: number;
}

export const FRUITS: FruitItem[] = [
  {
    fruit: Fruit.Sunflower,
    name: "Sunflower",
    image: sunflower,
    buyPrice: 0.01,
    sellPrice: 0.02,
    landRequired: 5,
    harvestMinutes: 1,
  },
  {
    fruit: Fruit.Potato,
    name: "Potato",
    image: potato,
    buyPrice: 0.1,
    sellPrice: 0.16,
    landRequired: 5,
    harvestMinutes: 5,
  },
  {
    fruit: Fruit.Pumpkin,
    name: "Pumpkin",
    image: pumpkin,
    buyPrice: 0.4,
    sellPrice: 0.8,
    landRequired: 8,
    harvestMinutes: 60,
  },
  {
    fruit: Fruit.Beetroot,
    name: "Beetroot",
    image: beetroot,
    buyPrice: 1,
    sellPrice: 1.8,
    landRequired: 8,
    harvestMinutes: 4 * 60,
  },
  {
    fruit: Fruit.Cauliflower,
    name: "Cauliflower",
    image: cauliflower,
    buyPrice: 4,
    sellPrice: 8,
    landRequired: 11,
    harvestMinutes: 8 * 60,
  },
  {
    fruit: Fruit.Parsnip,
    name: "Parsnip",
    image: parsnip,
    buyPrice: 10,
    sellPrice: 16,
    landRequired: 14,
    harvestMinutes: 24 * 60,
  },
  {
    fruit: Fruit.Radish,
    name: "Radish",
    image: radish,
    buyPrice: 50,
    sellPrice: 80,
    landRequired: 17,
    harvestMinutes: 3 * 24 * 60,
  },
];

export function getFruit(fruit: Fruit) {
  return FRUITS.find((item) => item.fruit === fruit);
}

// Apply the market rate against to get the current buy and sell prices
export function getMarketFruits(marketRate: number) {
  return FRUITS.map((fruit) => ({
    ...fruit,
    buyPrice: fruit.buyPrice / marketRate,
    sellPrice: fruit.sellPrice / marketRate,
  }));
}
