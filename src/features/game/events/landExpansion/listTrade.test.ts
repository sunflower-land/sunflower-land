import Decimal from "decimal.js-light";
import { listTrade } from "./listTrade";
import { TEST_FARM } from "features/game/lib/constants";
import { getKeys } from "features/game/types/craftables";

describe("listTrade", () => {
  it("ensures trade is within limits", () => {
    expect(() =>
      listTrade({
        action: {
          items: {
            Sunflower: 10,
            Gold: 200,
          },
          sfl: 1,
          type: "trade.listed",
        },
        state: TEST_FARM,
      })
    ).toThrow(`Max trade limit for Gold reached`);
  });
  it("ensures trade does not already exist", () => {
    expect(() =>
      listTrade({
        action: {
          items: {
            Sunflower: 10,
            Gold: 20,
          },
          sfl: 1,
          type: "trade.listed",
        },
        state: {
          ...TEST_FARM,
          trades: {
            listings: {
              "1": {
                createdAt: 0,
                items: { Gold: 5 },
                sfl: 1,
              },
            },
          },
        },
      })
    ).toThrow(`Trade already exists`);
  });

  it("ensures player has ingredients", () => {
    expect(() =>
      listTrade({
        action: {
          items: {
            Gold: 20,
          },
          sfl: 1,
          type: "trade.listed",
        },
        state: {
          ...TEST_FARM,
        },
      })
    ).toThrow(`Insufficient ingredient: Gold`);
  });
  it("subtracts ingredients", () => {
    const now = Date.now();
    const state = listTrade({
      action: {
        items: {
          Gold: 20,
          Sunflower: 5,
        },
        sfl: 1,
        type: "trade.listed",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          Gold: new Decimal(50),
          Sunflower: new Decimal(100),
        },
      },
      createdAt: now,
    });

    expect(state.inventory.Gold).toEqual(new Decimal(30));
    expect(state.inventory.Sunflower).toEqual(new Decimal(95));
  });
  it("lists trade", () => {
    const now = Date.now();
    const state = listTrade({
      action: {
        items: {
          Gold: 20,
          Sunflower: 5,
        },
        sfl: 1,
        type: "trade.listed",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          Gold: new Decimal(50),
          Sunflower: new Decimal(100),
        },
      },
      createdAt: now,
    });

    const ids = getKeys(state.trades.listings ?? {});
    expect(ids.length).toEqual(1);
    expect(state.trades.listings?.[ids[0]]).toEqual({
      createdAt: now,
      sfl: 1,
      items: {
        Gold: 20,
        Sunflower: 5,
      },
    });
  });
});
