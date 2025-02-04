import { INITIAL_FARM } from "features/game/lib/constants";
import { npcRestock } from "./npcRestock";
import Decimal from "decimal.js-light";
import { PlacedItem } from "features/game/types/game";

describe("npcRestock", () => {
  it("throws an error if player doesn't have enough gems for restock", () => {
    expect(() => {
      npcRestock({
        state: {
          ...INITIAL_FARM,
          inventory: {
            ...INITIAL_FARM.inventory,
            Gem: new Decimal(0),
          },
        },
        action: {
          type: "npc.restocked",
          npc: "betty",
        },
      });
    }).toThrow("You do not have enough Gems");
  });

  it("restocks only the market", () => {
    const state = npcRestock({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Gem: new Decimal(30),
        },
        stock: {
          ...INITIAL_FARM.stock,
          "Sunflower Seed": new Decimal(0),
          Axe: new Decimal(100),
        },
      },
      action: {
        type: "npc.restocked",
        npc: "betty",
      },
    });

    expect(state.stock["Sunflower Seed"]).toEqual(new Decimal(800));
    expect(state.stock.Axe).toEqual(new Decimal(100));
  });
  it("restocks only the workbench", () => {
    const state = npcRestock({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Gem: new Decimal(30),
        },
        stock: {
          ...INITIAL_FARM.stock,
          "Sunflower Seed": new Decimal(200),
          Axe: new Decimal(0),
        },
      },
      action: {
        type: "npc.restocked",
        npc: "blacksmith",
      },
    });

    expect(state.stock["Sunflower Seed"]).toEqual(new Decimal(200));
    expect(state.stock.Axe).toEqual(new Decimal(200));
  });
  it("restocks only the treasure shop tools", () => {
    const state = npcRestock({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Gem: new Decimal(30),
        },
        stock: {
          ...INITIAL_FARM.stock,
          "Sunflower Seed": new Decimal(200),
          Axe: new Decimal(100),
          "Sand Shovel": new Decimal(0),
        },
      },
      action: {
        type: "npc.restocked",
        npc: "jafar",
      },
    });

    expect(state.stock["Sunflower Seed"]).toEqual(new Decimal(200));
    expect(state.stock.Axe).toEqual(new Decimal(100));
    expect(state.stock["Sand Shovel"]).toEqual(new Decimal(50));
  });

  it("restocks the market with warehouse placed and ready", () => {
    const warehouse: PlacedItem = {
      id: "123",
      coordinates: { x: 1, y: 1 },
      createdAt: 0,
      readyAt: 0,
    };
    const state = npcRestock({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Gem: new Decimal(30),
        },
        stock: {
          ...INITIAL_FARM.stock,
          "Sunflower Seed": new Decimal(0),
          Axe: new Decimal(100),
          "Sand Shovel": new Decimal(25),
        },
        buildings: {
          ...INITIAL_FARM.buildings,
          Warehouse: [warehouse],
        },
      },
      action: {
        type: "npc.restocked",
        npc: "betty",
      },
    });
    expect(state.stock["Sunflower Seed"]).toEqual(new Decimal(960));
    expect(state.stock.Axe).toEqual(new Decimal(100));
    expect(state.stock["Sand Shovel"]).toEqual(new Decimal(25));
  });

  it("restocks the workbench with toolshed placed and ready", () => {
    const toolshed: PlacedItem = {
      id: "123",
      coordinates: { x: 1, y: 1 },
      createdAt: 0,
      readyAt: 0,
    };
    const state = npcRestock({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Gem: new Decimal(30),
        },
        stock: {
          ...INITIAL_FARM.stock,
          "Sunflower Seed": new Decimal(480),
          Axe: new Decimal(0),
          "Sand Shovel": new Decimal(25),
        },
        buildings: {
          ...INITIAL_FARM.buildings,
          Toolshed: [toolshed],
        },
      },
      action: {
        type: "npc.restocked",
        npc: "blacksmith",
      },
    });
    expect(state.stock["Sunflower Seed"]).toEqual(new Decimal(480));
    expect(state.stock.Axe).toEqual(new Decimal(300));
    expect(state.stock["Sand Shovel"]).toEqual(new Decimal(25));
  });

  it("does not increase the stock of treasure shop with toolshed placed and ready", () => {
    const toolshed: PlacedItem = {
      id: "123",
      coordinates: { x: 1, y: 1 },
      createdAt: 0,
      readyAt: 0,
    };
    const state = npcRestock({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Gem: new Decimal(30),
        },
        stock: {
          ...INITIAL_FARM.stock,
          "Sunflower Seed": new Decimal(480),
          Axe: new Decimal(0),
          "Sand Shovel": new Decimal(25),
        },
        buildings: {
          ...INITIAL_FARM.buildings,
          Toolshed: [toolshed],
        },
      },
      action: {
        type: "npc.restocked",
        npc: "jafar",
      },
    });
    expect(state.stock["Sunflower Seed"]).toEqual(new Decimal(480));
    expect(state.stock.Axe).toEqual(new Decimal(0));
    expect(state.stock["Sand Shovel"]).toEqual(new Decimal(50));
  });
});
