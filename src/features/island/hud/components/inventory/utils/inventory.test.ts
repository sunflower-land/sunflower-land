import Decimal from "decimal.js-light";
import { getBasketItems } from "./inventory";

describe("getBasketItems", () => {
  it("creates an empty basket", () => {
    const basket = getBasketItems({});

    expect(basket).toEqual({});
  });

  it("includes the correct amount for items in the basket", () => {
    const basket = getBasketItems({
      "Sunflower Seed": new Decimal(34.52),
    });

    expect(basket).toEqual({ "Sunflower Seed": new Decimal(34.52) });
  });

  it("includes seeds in the basket", () => {
    const basket = getBasketItems({
      "Potato Seed": new Decimal(0.2),
      "Radish Seed": new Decimal(5),
      "Fire Pit": new Decimal(1),
    });

    expect(basket).toEqual({
      "Potato Seed": new Decimal(0.2),
      "Radish Seed": new Decimal(5),
    });
  });

  it("includes tools in the basket", () => {
    const basket = getBasketItems({
      Axe: new Decimal(10),
      "Fire Pit": new Decimal(1),
    });

    expect(basket).toEqual({ Axe: new Decimal(10) });
  });

  it("includes food in the basket", () => {
    const basket = getBasketItems({
      "Sunflower Cake": new Decimal(2),
      "Pumpkin Soup": new Decimal(1),
      "Fire Pit": new Decimal(1),
    });

    expect(basket).toEqual({
      "Sunflower Cake": new Decimal(2),
      "Pumpkin Soup": new Decimal(1),
    });
  });

  it("includes crops in the basket", () => {
    const basket = getBasketItems({
      Sunflower: new Decimal(34.52),
      "Fire Pit": new Decimal(1),
    });

    expect(basket).toEqual({ Sunflower: new Decimal(34.52) });
  });

  it("includes resources (wood, stone, gold) in the basket", () => {
    const basket = getBasketItems({
      Wood: new Decimal(300),
      Egg: new Decimal(10),
      "Fire Pit": new Decimal(1),
    });

    expect(basket).toEqual({ Wood: new Decimal(300), Egg: new Decimal(10) });
  });

  it("includes quest items in the basket", () => {
    const basket = getBasketItems({
      "Ancient Goblin Sword": new Decimal(1),
      "Fire Pit": new Decimal(1),
    });

    expect(basket).toEqual({ "Ancient Goblin Sword": new Decimal(1) });
  });

  it("includes a variety of basket items and excludes all collectibles", () => {
    const basket = getBasketItems({
      "Potato Seed": new Decimal(5),
      Potato: new Decimal("3"),
      "Parsnip Seed": new Decimal(20),
      "Roasted Cauliflower": new Decimal(1),
      Stone: new Decimal(5),
      Gold: new Decimal(5),
      Wood: new Decimal(5),
      "Ancient Goblin Sword": new Decimal(1),
      Pickaxe: new Decimal(1),
      "Fire Pit": new Decimal(1),
      "Foreman Beaver": new Decimal(1),
    });

    expect(basket).toEqual({
      "Potato Seed": new Decimal(5),
      Potato: new Decimal("3"),
      "Parsnip Seed": new Decimal(20),
      "Roasted Cauliflower": new Decimal(1),
      Stone: new Decimal(5),
      Gold: new Decimal(5),
      Wood: new Decimal(5),
      "Ancient Goblin Sword": new Decimal(1),
      Pickaxe: new Decimal(1),
    });
  });

  it("excludes buildings from the basket", () => {
    const basket = getBasketItems({
      "Fire Pit": new Decimal(1),
    });

    expect(basket).toEqual({});
  });
  it("excludes rare items from the basket", () => {
    const basket = getBasketItems({ Scarecrow: new Decimal(3) });

    expect(basket).toEqual({});
  });
  it("excludes item dusts from the basket", () => {
    const basket = getBasketItems({ Wheat: new Decimal(0.00009) });

    expect(basket).toEqual({});
  });
});
