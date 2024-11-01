import {
  INITIAL_BUMPKIN,
  INITIAL_STOCK,
  TEST_FARM,
} from "features/game/lib/constants";
import { restock } from "./restock";
import {
  BB_TO_GEM_RATIO,
  GameState,
  PlacedItem,
} from "features/game/types/game";
import Decimal from "decimal.js-light";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  bumpkin: INITIAL_BUMPKIN,
  inventory: {
    Gem: new Decimal(1 * BB_TO_GEM_RATIO),
  },
};

describe("restock", () => {
  it("restocks", () => {
    const state = restock({
      state: GAME_STATE,
      action: { type: "shops.restocked" },
    });
    expect(state.stock).toEqual(INITIAL_STOCK(GAME_STATE));
  });

  it("restocks with a 50% tools stock if player has Toolshed building", () => {
    const toolshed: PlacedItem = {
      id: "123",
      coordinates: { x: 1, y: 1 },
      createdAt: 0,
      readyAt: 0,
    };

    const state = restock({
      state: {
        ...GAME_STATE,
        buildings: {
          Toolshed: [
            toolshed,
            {
              id: "2039",
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
      action: { type: "shops.restocked" },
    });

    expect(state.stock.Axe).toEqual(new Decimal(300));
    expect(state.stock.Pickaxe).toEqual(new Decimal(90));
    expect(state.stock["Stone Pickaxe"]).toEqual(new Decimal(30));
    expect(state.stock["Iron Pickaxe"]).toEqual(new Decimal(8));
    expect(state.stock["Gold Pickaxe"]).toEqual(new Decimal(8));
    expect(state.stock["Oil Drill"]).toEqual(new Decimal(8));
    expect(state.stock.Rod).toEqual(new Decimal(75));
  });

  it("restocks 20% more Axes if player has More Axes skill", () => {
    const state = restock({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...GAME_STATE.bumpkin,
          skills: {
            ...GAME_STATE.bumpkin.skills,
            "More Axes": 1,
          },
        },
      },
      action: { type: "shops.restocked" },
    });

    expect(state.stock.Axe).toEqual(new Decimal(240));
  });

  it("restocks 50% more tools and adds 20% more Axes if player has More Axes skill and Toolshed building", () => {
    const toolshed: PlacedItem = {
      id: "123",
      coordinates: { x: 1, y: 1 },
      createdAt: 0,
      readyAt: 0,
    };

    const state = restock({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...GAME_STATE.bumpkin,
          skills: {
            ...GAME_STATE.bumpkin.skills,
            "More Axes": 1,
          },
        },
        buildings: {
          Toolshed: [
            toolshed,
            {
              id: "2039",
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
      action: { type: "shops.restocked" },
    });

    expect(state.stock.Axe).toEqual(new Decimal(360));
    expect(state.stock.Pickaxe).toEqual(new Decimal(90));
    expect(state.stock["Stone Pickaxe"]).toEqual(new Decimal(30));
    expect(state.stock["Iron Pickaxe"]).toEqual(new Decimal(8));
    expect(state.stock["Gold Pickaxe"]).toEqual(new Decimal(8));
    expect(state.stock["Oil Drill"]).toEqual(new Decimal(8));
    expect(state.stock.Rod).toEqual(new Decimal(75));
  });
});
