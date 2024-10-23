import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import { sellBounty, SellBountyAction } from "./sellBounty";
import { INITIAL_FARM } from "features/game/lib/constants";

describe("sellBounty", () => {
  const GAME_STATE: GameState = {
    ...INITIAL_FARM,
    inventory: {
      "Blue Balloon Flower": new Decimal(1),
    },
    bounties: {
      requests: [
        {
          id: "1",
          name: "Blue Balloon Flower",
          coins: 100,
          items: {
            "Sunflower Seed": 10,
          },
        },
      ],
      completed: [],
    },
    coins: 0,
    farmActivity: {},
  } as GameState;

  it("ensures player has item", () => {
    const action: SellBountyAction = {
      type: "bounty.sold",
      requestId: "1",
    };

    expect(() =>
      sellBounty({
        state: {
          ...GAME_STATE,
          inventory: {},
        },
        action,
      }),
    ).toThrow("Item does not exist in inventory");
  });

  it("ensures bounty exists", () => {
    const action: SellBountyAction = {
      type: "bounty.sold",
      requestId: "999",
    };

    expect(() => sellBounty({ state: GAME_STATE, action })).toThrow(
      "Bounty does not exist",
    );
  });

  it("ensures not already completed", () => {
    const action: SellBountyAction = {
      type: "bounty.sold",
      requestId: "1",
    };

    const state = {
      ...GAME_STATE,
      bounties: {
        ...GAME_STATE.bounties,
        completed: [{ id: "1", soldAt: 123456789 }],
      },
    };

    expect(() => sellBounty({ state, action })).toThrow(
      "Bounty already completed",
    );
  });

  it("rewards coins", () => {
    const action: SellBountyAction = {
      type: "bounty.sold",
      requestId: "1",
    };

    const result = sellBounty({ state: GAME_STATE, action });

    expect(result.coins).toBe(100);
  });

  it("rewards items", () => {
    const action: SellBountyAction = {
      type: "bounty.sold",
      requestId: "1",
    };

    const result = sellBounty({ state: GAME_STATE, action });

    expect(result.inventory["Sunflower Seed"]).toEqual(new Decimal(10));
  });

  it("subtracts the item", () => {
    const action: SellBountyAction = {
      type: "bounty.sold",
      requestId: "1",
    };

    const result = sellBounty({ state: GAME_STATE, action });

    expect(result.inventory["Blue Balloon Flower"]).toEqual(new Decimal(0));
  });

  it("marks as completed", () => {
    const action: SellBountyAction = {
      type: "bounty.sold",
      requestId: "1",
    };

    const result = sellBounty({ state: GAME_STATE, action });

    expect(result.bounties.completed).toHaveLength(1);
    expect(result.bounties.completed[0].id).toBe("1");
    expect(result.bounties.completed[0].soldAt).toBeDefined();
  });
});
