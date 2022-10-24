import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { migrate } from "./migrate";

const GAME_STATE: GameState = INITIAL_FARM;

describe("Migrate", () => {
  it("requires player to have at least 10.000 XP", () => {
    expect(() =>
      migrate({
        state: {
          ...GAME_STATE,
          skills: { farming: new Decimal(1), gathering: new Decimal(1) },
          inventory: { Warrior: new Decimal(0) },
        },
        action: { type: "game.migrated" },
      })
    ).toThrow("You don't meet the requirements for migrating");
  });

  it("requires player to have the Warrior Badge", () => {
    expect(() =>
      migrate({
        state: {
          ...GAME_STATE,
          inventory: { Warrior: new Decimal(0) },
        },
        action: { type: "game.migrated" },
      })
    ).toThrow("You don't meet the requirements for migrating");
  });
});
