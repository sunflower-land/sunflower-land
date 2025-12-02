import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { getBasketItems, getChestItems } from "./inventory";

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

describe("getChestItems", () => {
  it("returns empty chest when there are no placeable items", () => {
    const chest = getChestItems({
      ...TEST_FARM,
      inventory: {},
      collectibles: {},
      buildings: {},
    });

    expect(chest).toEqual({});
  });

  it("subtracts placed collectible and building quantities from inventory", () => {
    const chest = getChestItems({
      ...TEST_FARM,
      inventory: {
        "Fire Pit": new Decimal(2),
        "Abandoned Bear": new Decimal(3),
      },
      collectibles: {
        "Abandoned Bear": [
          {
            id: "1",
            createdAt: Date.now(),
            readyAt: Date.now(),
            coordinates: { x: 1, y: 1 },
          },
        ],
      },
      buildings: {
        ...TEST_FARM.buildings,
        "Fire Pit": [
          {
            id: "3",
            createdAt: Date.now(),
            coordinates: { x: 3, y: 3 },
            readyAt: Date.now(),
          },
        ],
      },
    });

    expect(chest).toEqual({
      "Fire Pit": new Decimal(1),
      "Abandoned Bear": new Decimal(2),
    });
  });

  it("subtracts placed resource nodes and never goes below zero", () => {
    const baseState: GameState = {
      ...TEST_FARM,
      inventory: {
        Tree: new Decimal(3),
      },
      trees: {
        // Not placed tree
        "1": {
          wood: { choppedAt: 0 },
          name: "Tree",
        },
        // Placed trees
        "2": {
          wood: { choppedAt: 0 },
          name: "Tree",
          x: 1,
          y: 1,
        },
        "3": {
          wood: { choppedAt: 0 },
          name: "Tree",
          x: 2,
          y: 2,
        },
      },
    };

    const chestWithPositive = getChestItems(baseState);
    expect(chestWithPositive).toEqual({
      Tree: new Decimal(1),
    });

    const chestWithZero = getChestItems({
      ...baseState,
      inventory: {
        Tree: new Decimal(1),
      },
    });

    expect(chestWithZero).toEqual({
      Tree: new Decimal(0),
    });
  });
});
