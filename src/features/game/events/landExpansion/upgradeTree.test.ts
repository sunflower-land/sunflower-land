import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import type { GameState, Inventory } from "features/game/types/game";
import { ADVANCED_RESOURCES } from "features/game/types/resources";
import Decimal from "decimal.js-light";
import { upgradeTree } from "./upgradeTree";

describe("upgradeTree", () => {
  it("creates the upgraded tree already on the speed-rate model", () => {
    const ancient = ADVANCED_RESOURCES["Ancient Tree"];
    const ingredients = ancient.ingredients(INITIAL_BUMPKIN.skills);

    const state = upgradeTree({
      state: {
        ...TEST_FARM,
        bumpkin: INITIAL_BUMPKIN,
        coins: ancient.price,
        inventory: {
          Tree: new Decimal(4),
          ...(ingredients as Inventory),
        },
        trees: Object.fromEntries(
          [0, 1, 2, 3].map((i) => [
            `${i}`,
            {
              createdAt: 0,
              x: i * 2 + 1,
              y: 1,
              wood: { choppedAt: 0 },
              name: "Tree",
              tier: 1,
              multiplier: 1,
            },
          ]),
        ),
      } as GameState,
      action: { type: "tree.upgraded", upgradeTo: "Ancient Tree", id: "a" },
    });

    // Ancient Tree recovers on the base tree time: 2h.
    expect(state.trees.a.wood).toEqual({
      choppedAt: 0,
      baseDurationMs: 2 * 60 * 60 * 1000,
    });
  });
});
