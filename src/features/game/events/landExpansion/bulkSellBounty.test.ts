import Decimal from "decimal.js-light";

import type { GameState } from "features/game/types/game";
import { bulkSellBounty } from "./bulkSellBounty";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";

const makeGameState = (): GameState =>
  ({
    ...TEST_FARM,
    bumpkin: INITIAL_BUMPKIN,
    inventory: {
      "Red Pansy": new Decimal(1),
      "Blue Pansy": new Decimal(1),
      "Yellow Pansy": new Decimal(1),
    },
    bounties: {
      requests: [
        { id: "1", name: "Red Pansy", coins: 100 },
        { id: "2", name: "Blue Pansy", coins: 50 },
        { id: "3", name: "Yellow Pansy", coins: 25 },
      ],
      completed: [],
    },
    coins: 0,
    farmActivity: {},
  }) as GameState;

describe("bulkSellBounty", () => {
  it("sells multiple bounties in one action", () => {
    const result = bulkSellBounty({
      state: makeGameState(),
      action: {
        type: "bounty.bulkSold",
        requestIds: ["1", "2", "3"],
      },
    });

    expect(result.coins).toEqual(175);
    expect(result.bounties.completed).toHaveLength(3);
    expect(result.inventory["Red Pansy"]?.toNumber()).toEqual(0);
    expect(result.inventory["Blue Pansy"]?.toNumber()).toEqual(0);
    expect(result.inventory["Yellow Pansy"]?.toNumber()).toEqual(0);
  });

  it("skips bounties the player cannot fulfill instead of throwing", () => {
    const result = bulkSellBounty({
      state: {
        ...makeGameState(),
        inventory: {
          "Red Pansy": new Decimal(1),
        },
      },
      action: {
        type: "bounty.bulkSold",
        requestIds: ["1", "2", "3"],
      },
    });

    expect(result.coins).toEqual(100);
    expect(result.bounties.completed).toHaveLength(1);
    expect(result.bounties.completed[0].id).toEqual("1");
  });

  it("skips already-completed bounties", () => {
    const state = makeGameState();
    const result = bulkSellBounty({
      state: {
        ...state,
        bounties: {
          ...state.bounties,
          completed: [{ id: "1", soldAt: 1 }],
        },
      },
      action: {
        type: "bounty.bulkSold",
        requestIds: ["1", "2"],
      },
    });

    expect(result.bounties.completed).toHaveLength(2);
    expect(result.coins).toEqual(50);
  });

  it("throws on an unknown requestId so client/server divergence surfaces", () => {
    expect(() =>
      bulkSellBounty({
        state: makeGameState(),
        action: {
          type: "bounty.bulkSold",
          requestIds: ["1", "nope"],
        },
      }),
    ).toThrow("Bounty does not exist");
  });

  it("does not partially sell earlier bounties when a later ID is unknown", () => {
    const initial = makeGameState();

    expect(() =>
      bulkSellBounty({
        state: initial,
        action: {
          type: "bounty.bulkSold",
          requestIds: ["1", "nope"],
        },
      }),
    ).toThrow("Bounty does not exist");

    expect(initial.bounties.completed).toHaveLength(0);
    expect(initial.coins).toEqual(0);
    expect(initial.inventory["Red Pansy"]?.toNumber()).toEqual(1);
  });

  it("throws on duplicate IDs so client/server divergence surfaces", () => {
    expect(() =>
      bulkSellBounty({
        state: makeGameState(),
        action: {
          type: "bounty.bulkSold",
          requestIds: ["1", "1"],
        },
      }),
    ).toThrow("Duplicate bounty IDs");
  });

  it("throws on an empty list (mirrors the autosave schema)", () => {
    expect(() =>
      bulkSellBounty({
        state: makeGameState(),
        action: {
          type: "bounty.bulkSold",
          requestIds: [],
        },
      }),
    ).toThrow("No bounties selected");
  });
});
