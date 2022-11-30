import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { canMigrate, migrate } from "./migrate";

const GAME_STATE: GameState = { ...TEST_FARM, inventory: {} };

describe("Migrate", () => {
  it("requires player to have at least 10.000 XP", () => {
    const result = canMigrate({
      ...GAME_STATE,
      skills: { farming: new Decimal(1), gathering: new Decimal(1) },
      inventory: { Warrior: new Decimal(0) },
    });
    expect(result).toBeFalsy();
  });

  it("requires player to have the Warrior Badge", () => {
    const result = canMigrate({
      ...GAME_STATE,
      inventory: { Warrior: new Decimal(0) },
    });
    expect(result).toBeFalsy();
  });

  it("requires player to have the Moderator Badge", () => {
    const result = canMigrate({
      ...GAME_STATE,
      inventory: { "Discord Mod": new Decimal(0), Warrior: new Decimal(0) },
      skills: { farming: new Decimal(1), gathering: new Decimal(1) },
    });
    expect(result).toBeFalsy();
  });

  it("requires player to have the Coder Badge", () => {
    const result = canMigrate({
      ...GAME_STATE,
      inventory: {
        "Discord Mod": new Decimal(0),
        Warrior: new Decimal(0),
        Coder: new Decimal(0),
      },
      skills: { farming: new Decimal(1), gathering: new Decimal(1) },
    });
    expect(result).toBeFalsy();
  });

  it.skip("migrates a player that has enough XP", () => {
    const result = canMigrate({
      ...GAME_STATE,
      skills: { farming: new Decimal(22000), gathering: new Decimal(5000) },
    });

    expect(result).toBe(true);
  });

  it.skip("migrates a player that has Warrior Badge", () => {
    const result = canMigrate({
      ...GAME_STATE,
      inventory: { Warrior: new Decimal(1) },
    });

    expect(result).toBe(true);
  });

  it("migrates a player that has Moderator Badge", () => {
    const result = canMigrate({
      ...GAME_STATE,
      inventory: { "Discord Mod": new Decimal(1) },
    });

    expect(result).toBe(true);
  });

  it("migrates a player that has Coder Badge", () => {
    const result = canMigrate({
      ...GAME_STATE,
      inventory: { Coder: new Decimal(1) },
    });

    expect(result).toBe(true);
  });

  it("gives a player 2 Rusty Shovels as part of migration", () => {
    const result = migrate({
      state: {
        ...GAME_STATE,
        inventory: { Coder: new Decimal(1) },
      },
      action: {
        type: "game.migrated",
      },
    });

    expect(result.inventory["Rusty Shovel"]?.toNumber()).toBeGreaterThanOrEqual(
      2
    );
  });
});
