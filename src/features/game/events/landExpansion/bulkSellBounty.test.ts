import Decimal from "decimal.js-light";

import { GameState } from "features/game/types/game";
import { bulkSellBounty } from "./bulkSellBounty";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";

describe("bulkSellBounty", () => {
  const GAME_STATE: GameState = {
    ...TEST_FARM,
    bumpkin: INITIAL_BUMPKIN,
    inventory: {
      "Red Pansy": new Decimal(1),
      "Blue Pansy": new Decimal(1),
      "Yellow Pansy": new Decimal(1),
    },
    bounties: {
      requests: [
        {
          id: "1",
          name: "Red Pansy",
          coins: 100,
        },
        {
          id: "2",
          name: "Blue Pansy",
          coins: 50,
        },
        {
          id: "3",
          name: "Yellow Pansy",
          coins: 25,
        },
      ],
      completed: [],
    },
    coins: 0,
    farmActivity: {},
  } as GameState;

  it("sells multiple bounties in one action", () => {
    const result = bulkSellBounty({
      state: GAME_STATE,
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
        ...GAME_STATE,
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
    const result = bulkSellBounty({
      state: {
        ...GAME_STATE,
        bounties: {
          ...GAME_STATE.bounties,
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

  it("handles an empty list", () => {
    const result = bulkSellBounty({
      state: GAME_STATE,
      action: {
        type: "bounty.bulkSold",
        requestIds: [],
      },
    });

    expect(result.coins).toEqual(0);
    expect(result.bounties.completed).toHaveLength(0);
  });
});
