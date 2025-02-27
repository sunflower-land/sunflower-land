import Decimal from "decimal.js-light";
import { INITIAL_STOCK, INVENTORY_LIMIT, TEST_FARM } from "./constants";
import { getObjectEntries } from "../expansion/lib/utils";
import {
  isFullMoonBerry,
  isGreenhouseCropSeed,
  isGreenhouseFruitSeed,
} from "../events/landExpansion/seedBought";
import { PatchFruitSeedName } from "../types/fruits";
import {
  isAdvancedFruitSeed,
  isBasicFruitSeed,
} from "../events/landExpansion/fruitPlanted";

describe("INITIAL_STOCK", () => {
  it("does not increase stock of tools if Toolshed is placed but NOT ready", () => {
    const state = {
      ...TEST_FARM,
      buildings: {
        Toolshed: [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: Date.now() + 1000,
            id: "1",
          },
        ],
      },
    };
    expect(INITIAL_STOCK(state).Axe).toEqual(new Decimal(200));
    expect(INITIAL_STOCK(state).Pickaxe).toEqual(new Decimal(60));
    expect(INITIAL_STOCK(state)["Stone Pickaxe"]).toEqual(new Decimal(20));
    expect(INITIAL_STOCK(state)["Iron Pickaxe"]).toEqual(new Decimal(5));
    expect(INITIAL_STOCK(state)["Gold Pickaxe"]).toEqual(new Decimal(5));
    expect(INITIAL_STOCK(state)["Oil Drill"]).toEqual(new Decimal(5));
    expect(INITIAL_STOCK(state).Rod).toEqual(new Decimal(50));
  });

  it("increases stock of tools if Toolshed is placed and ready", () => {
    const state = {
      ...TEST_FARM,
      buildings: {
        Toolshed: [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: Date.now() - 1000,
            id: "1",
          },
        ],
      },
    };

    expect(INITIAL_STOCK(state).Axe).toEqual(new Decimal(300));
    expect(INITIAL_STOCK(state).Pickaxe).toEqual(new Decimal(90));
    expect(INITIAL_STOCK(state)["Stone Pickaxe"]).toEqual(new Decimal(30));
    expect(INITIAL_STOCK(state)["Iron Pickaxe"]).toEqual(new Decimal(8));
    expect(INITIAL_STOCK(state)["Gold Pickaxe"]).toEqual(new Decimal(8));
    expect(INITIAL_STOCK(state)["Oil Drill"]).toEqual(new Decimal(8));
    expect(INITIAL_STOCK(state).Rod).toEqual(new Decimal(75));
  });

  it("increases stock of tools if More Picks skills is active", () => {
    const state = {
      ...TEST_FARM,
      bumpkin: {
        ...TEST_FARM.bumpkin,
        skills: {
          "More Picks": 1,
        },
      },
    };

    expect(INITIAL_STOCK(state).Pickaxe).toEqual(new Decimal(130));
    expect(INITIAL_STOCK(state)["Stone Pickaxe"]).toEqual(new Decimal(40));
    expect(INITIAL_STOCK(state)["Iron Pickaxe"]).toEqual(new Decimal(12));
  });

  it("increases stock of tools if Toolshed is placed and ready and More Picks skill is active", () => {
    const state = {
      ...TEST_FARM,
      bumpkin: {
        ...TEST_FARM.bumpkin,
        skills: {
          "More Picks": 1,
        },
      },
      buildings: {
        Toolshed: [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: Date.now() - 1000,
            id: "1",
          },
        ],
      },
    };

    expect(INITIAL_STOCK(state).Axe).toEqual(new Decimal(300));
    expect(INITIAL_STOCK(state).Pickaxe).toEqual(new Decimal(160));
    expect(INITIAL_STOCK(state)["Stone Pickaxe"]).toEqual(new Decimal(50));
    expect(INITIAL_STOCK(state)["Iron Pickaxe"]).toEqual(new Decimal(15));
    expect(INITIAL_STOCK(state)["Gold Pickaxe"]).toEqual(new Decimal(10));
    expect(INITIAL_STOCK(state)["Oil Drill"]).toEqual(new Decimal(8));
    expect(INITIAL_STOCK(state).Rod).toEqual(new Decimal(75));
  });

  it("does not increase stock of seeds if Warehouse is placed but NOT ready", () => {
    const state = {
      ...TEST_FARM,
      buildings: {
        Warehouse: [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: Date.now() + 1000,
            id: "1",
          },
        ],
      },
    };

    expect(INITIAL_STOCK(state)["Sunflower Seed"]).toEqual(
      new Decimal(400 * 2),
    );
    expect(INITIAL_STOCK(state)["Potato Seed"]).toEqual(new Decimal(200 * 2));
    expect(INITIAL_STOCK(state)["Pumpkin Seed"]).toEqual(new Decimal(150 * 2));
    expect(INITIAL_STOCK(state)["Carrot Seed"]).toEqual(new Decimal(100 * 2));
    expect(INITIAL_STOCK(state)["Cabbage Seed"]).toEqual(new Decimal(90 * 2));
    expect(INITIAL_STOCK(state)["Soybean Seed"]).toEqual(new Decimal(90 * 2));
    expect(INITIAL_STOCK(state)["Beetroot Seed"]).toEqual(new Decimal(80 * 2));
    expect(INITIAL_STOCK(state)["Cauliflower Seed"]).toEqual(
      new Decimal(80 * 2),
    );
    expect(INITIAL_STOCK(state)["Parsnip Seed"]).toEqual(new Decimal(60 * 2));
    expect(INITIAL_STOCK(state)["Eggplant Seed"]).toEqual(new Decimal(50 * 2));
    expect(INITIAL_STOCK(state)["Corn Seed"]).toEqual(new Decimal(50 * 2));
    expect(INITIAL_STOCK(state)["Radish Seed"]).toEqual(new Decimal(40 * 2));
    expect(INITIAL_STOCK(state)["Wheat Seed"]).toEqual(new Decimal(40 * 2));
    expect(INITIAL_STOCK(state)["Kale Seed"]).toEqual(new Decimal(30 * 2));
    expect(INITIAL_STOCK(state)["Tomato Seed"]).toEqual(new Decimal(10 * 2));
    expect(INITIAL_STOCK(state)["Blueberry Seed"]).toEqual(new Decimal(10 * 2));
    expect(INITIAL_STOCK(state)["Orange Seed"]).toEqual(new Decimal(10 * 2));
    expect(INITIAL_STOCK(state)["Apple Seed"]).toEqual(new Decimal(10 * 2));
    expect(INITIAL_STOCK(state)["Banana Plant"]).toEqual(new Decimal(10 * 2));
    expect(INITIAL_STOCK(state)["Lemon Seed"]).toEqual(new Decimal(10 * 2));

    expect(INITIAL_STOCK(state)["Grape Seed"]).toEqual(new Decimal(10));
    expect(INITIAL_STOCK(state)["Olive Seed"]).toEqual(new Decimal(10));
    expect(INITIAL_STOCK(state)["Rice Seed"]).toEqual(new Decimal(10));

    expect(INITIAL_STOCK(state)["Sunpetal Seed"]).toEqual(new Decimal(16));
    expect(INITIAL_STOCK(state)["Bloom Seed"]).toEqual(new Decimal(8));
    expect(INITIAL_STOCK(state)["Lily Seed"]).toEqual(new Decimal(4));
  });

  it("increases stock of seeds if Warehouse is placed and ready", () => {
    const state = {
      ...TEST_FARM,
      buildings: {
        Warehouse: [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: Date.now() - 1000,
            id: "1",
          },
        ],
      },
    };

    expect(INITIAL_STOCK(state)["Sunflower Seed"]).toEqual(
      new Decimal(480 * 2),
    );
    expect(INITIAL_STOCK(state)["Potato Seed"]).toEqual(new Decimal(240 * 2));
    expect(INITIAL_STOCK(state)["Pumpkin Seed"]).toEqual(new Decimal(180 * 2));
    expect(INITIAL_STOCK(state)["Carrot Seed"]).toEqual(new Decimal(120 * 2));
    expect(INITIAL_STOCK(state)["Cabbage Seed"]).toEqual(new Decimal(108 * 2));
    expect(INITIAL_STOCK(state)["Soybean Seed"]).toEqual(new Decimal(108 * 2));
    expect(INITIAL_STOCK(state)["Beetroot Seed"]).toEqual(new Decimal(96 * 2));
    expect(INITIAL_STOCK(state)["Cauliflower Seed"]).toEqual(
      new Decimal(96 * 2),
    );
    expect(INITIAL_STOCK(state)["Parsnip Seed"]).toEqual(new Decimal(72 * 2));
    expect(INITIAL_STOCK(state)["Eggplant Seed"]).toEqual(new Decimal(60 * 2));
    expect(INITIAL_STOCK(state)["Corn Seed"]).toEqual(new Decimal(60 * 2));
    expect(INITIAL_STOCK(state)["Radish Seed"]).toEqual(new Decimal(48 * 2));
    expect(INITIAL_STOCK(state)["Wheat Seed"]).toEqual(new Decimal(48 * 2));
    expect(INITIAL_STOCK(state)["Kale Seed"]).toEqual(new Decimal(36 * 2));
    expect(INITIAL_STOCK(state)["Tomato Seed"]).toEqual(new Decimal(12 * 2));
    expect(INITIAL_STOCK(state)["Blueberry Seed"]).toEqual(new Decimal(12 * 2));
    expect(INITIAL_STOCK(state)["Orange Seed"]).toEqual(new Decimal(12 * 2));
    expect(INITIAL_STOCK(state)["Apple Seed"]).toEqual(new Decimal(12 * 2));
    expect(INITIAL_STOCK(state)["Banana Plant"]).toEqual(new Decimal(12 * 2));
    expect(INITIAL_STOCK(state)["Lemon Seed"]).toEqual(new Decimal(12 * 2));

    expect(INITIAL_STOCK(state)["Grape Seed"]).toEqual(new Decimal(12));
    expect(INITIAL_STOCK(state)["Olive Seed"]).toEqual(new Decimal(12));
    expect(INITIAL_STOCK(state)["Rice Seed"]).toEqual(new Decimal(12));

    expect(INITIAL_STOCK(state)["Sunpetal Seed"]).toEqual(new Decimal(20));
    expect(INITIAL_STOCK(state)["Bloom Seed"]).toEqual(new Decimal(10));
    expect(INITIAL_STOCK(state)["Lily Seed"]).toEqual(new Decimal(5));
  });
});

describe("INVENTORY_LIMIT", () => {
  it("does not increase inventory limit of seeds if Warehouse is placed but NOT ready", () => {
    const state = {
      ...TEST_FARM,
      buildings: {
        Warehouse: [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: Date.now() + 1000,
            id: "1",
          },
        ],
      },
    };

    getObjectEntries(INVENTORY_LIMIT(state)).forEach(([key, value]) => {
      if (isFullMoonBerry(key)) {
        expect(value).toEqual(new Decimal(10));
      } else if (isGreenhouseCropSeed(key) || isGreenhouseFruitSeed(key)) {
        expect(value).toEqual(
          new Decimal(
            Math.ceil(
              new Decimal(INITIAL_STOCK(state)[key]?.mul(5)).toNumber(),
            ),
          ),
        );
      } else if (isBasicFruitSeed(key as PatchFruitSeedName)) {
        expect(value).toEqual(
          new Decimal(
            Math.ceil(
              new Decimal(INITIAL_STOCK(state)[key]?.mul(2)).toNumber(),
            ),
          ),
        );
      } else if (isAdvancedFruitSeed(key as PatchFruitSeedName)) {
        expect(value).toEqual(
          new Decimal(
            Math.ceil(
              new Decimal(INITIAL_STOCK(state)[key]?.mul(1.5)).toNumber(),
            ),
          ),
        );
      } else {
        expect(value).toEqual(
          new Decimal(
            Math.ceil(
              new Decimal(INITIAL_STOCK(state)[key]?.mul(2.5)).toNumber(),
            ),
          ),
        );
      }
    });
  });

  it("increases inventory limit of seeds if Warehouse is placed and ready", () => {
    const state = {
      ...TEST_FARM,
      buildings: {
        Warehouse: [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: Date.now() - 1000,
            id: "1",
          },
        ],
      },
    };
    getObjectEntries(INVENTORY_LIMIT(state)).forEach(([key, value]) => {
      if (isFullMoonBerry(key)) {
        expect(value).toEqual(new Decimal(10));
      } else if (isGreenhouseCropSeed(key) || isGreenhouseFruitSeed(key)) {
        expect(value).toEqual(
          new Decimal(
            Math.ceil(
              new Decimal(INITIAL_STOCK(state)[key]?.mul(5)).toNumber(),
            ),
          ),
        );
      } else if (isBasicFruitSeed(key as PatchFruitSeedName)) {
        expect(value).toEqual(
          new Decimal(
            Math.ceil(
              new Decimal(INITIAL_STOCK(state)[key]?.mul(2)).toNumber(),
            ),
          ),
        );
      } else if (isAdvancedFruitSeed(key as PatchFruitSeedName)) {
        expect(value).toEqual(
          new Decimal(
            Math.ceil(
              new Decimal(INITIAL_STOCK(state)[key]?.mul(1.5)).toNumber(),
            ),
          ),
        );
      } else {
        expect(value).toEqual(
          new Decimal(
            Math.ceil(
              new Decimal(INITIAL_STOCK(state)[key]?.mul(2.5)).toNumber(),
            ),
          ),
        );
      }
    });
  });
});
