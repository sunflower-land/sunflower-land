import Decimal from "decimal.js-light";
import { INITIAL_STOCK, INVENTORY_LIMIT, TEST_FARM } from "./constants";

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

    expect(INITIAL_STOCK(state)["Sunflower Seed"]).toEqual(new Decimal(400));
    expect(INITIAL_STOCK(state)["Potato Seed"]).toEqual(new Decimal(200));
    expect(INITIAL_STOCK(state)["Pumpkin Seed"]).toEqual(new Decimal(150));
    expect(INITIAL_STOCK(state)["Carrot Seed"]).toEqual(new Decimal(100));
    expect(INITIAL_STOCK(state)["Cabbage Seed"]).toEqual(new Decimal(90));
    expect(INITIAL_STOCK(state)["Soybean Seed"]).toEqual(new Decimal(90));
    expect(INITIAL_STOCK(state)["Beetroot Seed"]).toEqual(new Decimal(80));
    expect(INITIAL_STOCK(state)["Cauliflower Seed"]).toEqual(new Decimal(80));
    expect(INITIAL_STOCK(state)["Parsnip Seed"]).toEqual(new Decimal(60));
    expect(INITIAL_STOCK(state)["Eggplant Seed"]).toEqual(new Decimal(50));
    expect(INITIAL_STOCK(state)["Corn Seed"]).toEqual(new Decimal(50));
    expect(INITIAL_STOCK(state)["Radish Seed"]).toEqual(new Decimal(40));
    expect(INITIAL_STOCK(state)["Wheat Seed"]).toEqual(new Decimal(40));
    expect(INITIAL_STOCK(state)["Kale Seed"]).toEqual(new Decimal(30));

    expect(INITIAL_STOCK(state)["Blueberry Seed"]).toEqual(new Decimal(10));
    expect(INITIAL_STOCK(state)["Orange Seed"]).toEqual(new Decimal(10));
    expect(INITIAL_STOCK(state)["Apple Seed"]).toEqual(new Decimal(10));
    expect(INITIAL_STOCK(state)["Banana Plant"]).toEqual(new Decimal(10));

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

    expect(INITIAL_STOCK(state)["Sunflower Seed"]).toEqual(new Decimal(480));
    expect(INITIAL_STOCK(state)["Potato Seed"]).toEqual(new Decimal(240));
    expect(INITIAL_STOCK(state)["Pumpkin Seed"]).toEqual(new Decimal(180));
    expect(INITIAL_STOCK(state)["Carrot Seed"]).toEqual(new Decimal(120));
    expect(INITIAL_STOCK(state)["Cabbage Seed"]).toEqual(new Decimal(108));
    expect(INITIAL_STOCK(state)["Soybean Seed"]).toEqual(new Decimal(108));
    expect(INITIAL_STOCK(state)["Beetroot Seed"]).toEqual(new Decimal(96));
    expect(INITIAL_STOCK(state)["Cauliflower Seed"]).toEqual(new Decimal(96));
    expect(INITIAL_STOCK(state)["Parsnip Seed"]).toEqual(new Decimal(72));
    expect(INITIAL_STOCK(state)["Eggplant Seed"]).toEqual(new Decimal(60));
    expect(INITIAL_STOCK(state)["Corn Seed"]).toEqual(new Decimal(60));
    expect(INITIAL_STOCK(state)["Radish Seed"]).toEqual(new Decimal(48));
    expect(INITIAL_STOCK(state)["Wheat Seed"]).toEqual(new Decimal(48));
    expect(INITIAL_STOCK(state)["Kale Seed"]).toEqual(new Decimal(36));

    expect(INITIAL_STOCK(state)["Blueberry Seed"]).toEqual(new Decimal(12));
    expect(INITIAL_STOCK(state)["Orange Seed"]).toEqual(new Decimal(12));
    expect(INITIAL_STOCK(state)["Apple Seed"]).toEqual(new Decimal(12));
    expect(INITIAL_STOCK(state)["Banana Plant"]).toEqual(new Decimal(12));

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

    expect(INVENTORY_LIMIT(state)["Sunflower Seed"]).toEqual(new Decimal(1000));
    expect(INVENTORY_LIMIT(state)["Potato Seed"]).toEqual(new Decimal(500));
    expect(INVENTORY_LIMIT(state)["Pumpkin Seed"]).toEqual(new Decimal(400));
    expect(INVENTORY_LIMIT(state)["Carrot Seed"]).toEqual(new Decimal(250));
    expect(INVENTORY_LIMIT(state)["Cabbage Seed"]).toEqual(new Decimal(240));
    expect(INVENTORY_LIMIT(state)["Soybean Seed"]).toEqual(new Decimal(240));
    expect(INVENTORY_LIMIT(state)["Beetroot Seed"]).toEqual(new Decimal(220));
    expect(INVENTORY_LIMIT(state)["Cauliflower Seed"]).toEqual(
      new Decimal(200),
    );
    expect(INVENTORY_LIMIT(state)["Parsnip Seed"]).toEqual(new Decimal(150));
    expect(INVENTORY_LIMIT(state)["Eggplant Seed"]).toEqual(new Decimal(120));
    expect(INVENTORY_LIMIT(state)["Corn Seed"]).toEqual(new Decimal(120));
    expect(INVENTORY_LIMIT(state)["Radish Seed"]).toEqual(new Decimal(100));
    expect(INVENTORY_LIMIT(state)["Wheat Seed"]).toEqual(new Decimal(100));
    expect(INVENTORY_LIMIT(state)["Kale Seed"]).toEqual(new Decimal(80));

    expect(INVENTORY_LIMIT(state)["Blueberry Seed"]).toEqual(new Decimal(40));
    expect(INVENTORY_LIMIT(state)["Orange Seed"]).toEqual(new Decimal(33));
    expect(INVENTORY_LIMIT(state)["Apple Seed"]).toEqual(new Decimal(25));
    expect(INVENTORY_LIMIT(state)["Banana Plant"]).toEqual(new Decimal(25));

    expect(INVENTORY_LIMIT(state)["Grape Seed"]).toEqual(new Decimal(50));
    expect(INVENTORY_LIMIT(state)["Olive Seed"]).toEqual(new Decimal(50));
    expect(INVENTORY_LIMIT(state)["Rice Seed"]).toEqual(new Decimal(50));

    expect(INVENTORY_LIMIT(state)["Sunpetal Seed"]).toEqual(new Decimal(40));
    expect(INVENTORY_LIMIT(state)["Bloom Seed"]).toEqual(new Decimal(20));
    expect(INVENTORY_LIMIT(state)["Lily Seed"]).toEqual(new Decimal(10));
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

    expect(INVENTORY_LIMIT(state)["Sunflower Seed"]).toEqual(new Decimal(1200));
    expect(INVENTORY_LIMIT(state)["Potato Seed"]).toEqual(new Decimal(600));
    expect(INVENTORY_LIMIT(state)["Pumpkin Seed"]).toEqual(new Decimal(480));
    expect(INVENTORY_LIMIT(state)["Carrot Seed"]).toEqual(new Decimal(300));
    expect(INVENTORY_LIMIT(state)["Cabbage Seed"]).toEqual(new Decimal(288));
    expect(INVENTORY_LIMIT(state)["Soybean Seed"]).toEqual(new Decimal(288));
    expect(INVENTORY_LIMIT(state)["Beetroot Seed"]).toEqual(new Decimal(264));
    expect(INVENTORY_LIMIT(state)["Cauliflower Seed"]).toEqual(
      new Decimal(240),
    );
    expect(INVENTORY_LIMIT(state)["Parsnip Seed"]).toEqual(new Decimal(180));
    expect(INVENTORY_LIMIT(state)["Eggplant Seed"]).toEqual(new Decimal(144));
    expect(INVENTORY_LIMIT(state)["Corn Seed"]).toEqual(new Decimal(144));
    expect(INVENTORY_LIMIT(state)["Radish Seed"]).toEqual(new Decimal(120));
    expect(INVENTORY_LIMIT(state)["Wheat Seed"]).toEqual(new Decimal(120));
    expect(INVENTORY_LIMIT(state)["Kale Seed"]).toEqual(new Decimal(96));

    expect(INVENTORY_LIMIT(state)["Blueberry Seed"]).toEqual(new Decimal(48));
    expect(INVENTORY_LIMIT(state)["Orange Seed"]).toEqual(new Decimal(40));
    expect(INVENTORY_LIMIT(state)["Apple Seed"]).toEqual(new Decimal(30));
    expect(INVENTORY_LIMIT(state)["Banana Plant"]).toEqual(new Decimal(30));

    expect(INVENTORY_LIMIT(state)["Grape Seed"]).toEqual(new Decimal(60));
    expect(INVENTORY_LIMIT(state)["Olive Seed"]).toEqual(new Decimal(60));
    expect(INVENTORY_LIMIT(state)["Rice Seed"]).toEqual(new Decimal(60));

    expect(INVENTORY_LIMIT(state)["Sunpetal Seed"]).toEqual(new Decimal(48));
    expect(INVENTORY_LIMIT(state)["Bloom Seed"]).toEqual(new Decimal(24));
    expect(INVENTORY_LIMIT(state)["Lily Seed"]).toEqual(new Decimal(12));
  });
});
