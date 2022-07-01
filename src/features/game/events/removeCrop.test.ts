import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "../lib/constants";
import { GameState } from "../types/game";
import { removeCrop } from "./removeCrop";

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  fields: {},
  balance: new Decimal(0),
  inventory: {},
  trees: {},
};

describe("removeCrop", () => {
  it("does not remove on non-existent field", () => {
    expect(() =>
      removeCrop({
        state: GAME_STATE,
        action: {
          type: "item.removed",
          index: -1,
        },
      })
    ).toThrow("Field does not exist");
  });

  // TODO - see similar tests from harvest.test.ts and plant.test.ts

  // TODO - It should not remove crops if shovel is stolen

  // TODO - The rusty shovel should not be withdrawable
});
