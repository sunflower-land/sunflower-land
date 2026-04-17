import type { GameState } from "features/game/types/game";
import {
  MAX_STORED_SALT_CHARGES_PER_NODE,
  SALT_CHARGE_GENERATION_TIME,
  getSaltChargeGenerationTime,
  materializeSaltRegen,
  populateSaltFarm,
  syncSaltNode,
  type Salt,
  type SaltNode,
} from "./salt";
import { INITIAL_FARM } from "../lib/constants";

describe("salt nextChargeAt regen", () => {
  const t0 = 1_000_000_000_000;

  function nodeFrom(salt: Salt): SaltNode {
    return {
      createdAt: t0,
      coordinates: { x: 0, y: 0 },
      salt,
    };
  }

  it("advances multiple charges when far offline", () => {
    const salt: Salt = {
      storedCharges: 0,
      nextChargeAt: t0 + SALT_CHARGE_GENERATION_TIME,
    };
    const later = t0 + SALT_CHARGE_GENERATION_TIME * 3 + 1;
    const out = materializeSaltRegen(salt, later);
    expect(out.storedCharges).toBe(3);
    expect(out.nextChargeAt).toBe(t0 + SALT_CHARGE_GENERATION_TIME * 4);
  });

  it("schedules next boundary when hitting stored cap", () => {
    const salt: Salt = {
      storedCharges: MAX_STORED_SALT_CHARGES_PER_NODE - 1,
      nextChargeAt: t0,
    };
    const out = materializeSaltRegen(salt, t0 + 1);
    expect(out.storedCharges).toBe(MAX_STORED_SALT_CHARGES_PER_NODE);
    expect(out.nextChargeAt).toBe(t0 + SALT_CHARGE_GENERATION_TIME);
  });

  it("clamps stored charges when persisted value is above max", () => {
    const salt: Salt = {
      storedCharges: MAX_STORED_SALT_CHARGES_PER_NODE + 10,
      nextChargeAt: t0 + SALT_CHARGE_GENERATION_TIME,
    };
    const out = materializeSaltRegen(salt, t0);
    expect(out.storedCharges).toBe(MAX_STORED_SALT_CHARGES_PER_NODE);
  });

  it("does not shorten an in-flight wait when a shorter boost interval is used only for later segments", () => {
    const half = SALT_CHARGE_GENERATION_TIME / 2;
    const salt: Salt = {
      storedCharges: 0,
      nextChargeAt: t0 + SALT_CHARGE_GENERATION_TIME,
    };
    const synced = syncSaltNode(nodeFrom(salt), t0 + 1_000, {
      chargeIntervalMs: half,
    });
    expect(synced.salt.nextChargeAt).toBe(t0 + SALT_CHARGE_GENERATION_TIME);
    const afterGrant = syncSaltNode(
      synced,
      t0 + SALT_CHARGE_GENERATION_TIME + 1,
      {
        chargeIntervalMs: half,
      },
    );
    expect(afterGrant.salt.storedCharges).toBe(1);
    expect(afterGrant.salt.nextChargeAt).toBe(
      t0 + SALT_CHARGE_GENERATION_TIME + half,
    );
  });
});

describe("populateSaltFarm", () => {
  const t0 = 1_000_000_000_000;

  function makeGame(overrides: Partial<GameState> = {}): GameState {
    return {
      ...INITIAL_FARM,
      saltFarm: {
        level: 1,
        nodes: {
          "0": {
            createdAt: t0,
            coordinates: { x: 0, y: 0 },
            salt: {
              storedCharges: 0,
              nextChargeAt: t0 + SALT_CHARGE_GENERATION_TIME,
            },
          },
        },
      },
      ...overrides,
    };
  }

  it("returns early when charge generation time has not changed", () => {
    const gameBefore = makeGame();
    const game: GameState = { ...gameBefore };
    const now = t0 + SALT_CHARGE_GENERATION_TIME * 2;

    populateSaltFarm({ gameBefore, gameAfter: game, now });

    expect(game.saltFarm.nodes["0"].salt.storedCharges).toBe(0);
    expect(game.saltFarm.nodes["0"].salt.nextChargeAt).toBe(
      t0 + SALT_CHARGE_GENERATION_TIME,
    );
  });

  it("returns early when charge generation time has not changed with active boost", () => {
    const gameBefore = makeGame({
      bumpkin: { ...INITIAL_FARM.bumpkin, skills: { "Salty Seas": 1 } },
    });
    const game: GameState = { ...gameBefore };
    const now = t0 + SALT_CHARGE_GENERATION_TIME * 2;

    populateSaltFarm({ gameBefore, gameAfter: game, now });

    expect(game.saltFarm.nodes["0"].salt.storedCharges).toBe(0);
    expect(game.saltFarm.nodes["0"].salt.nextChargeAt).toBe(
      t0 + SALT_CHARGE_GENERATION_TIME,
    );
  });

  it("crystallizes at old rate when boost is added", () => {
    const gameBefore = makeGame();
    const game: GameState = { ...gameBefore };
    game.bumpkin = { ...game.bumpkin, skills: { "Salty Seas": 1 } };

    const boostedInterval = SALT_CHARGE_GENERATION_TIME * 0.9;
    const now = t0 + SALT_CHARGE_GENERATION_TIME + boostedInterval + 1;

    populateSaltFarm({ gameBefore, gameAfter: game, now });

    // Should crystallize 1 charge at the OLD (unboosted) rate, not the new boosted rate.
    // nextChargeAt starts at t0 + SALT_CHARGE_GENERATION_TIME (one old interval).
    // At now, one old interval has elapsed -> storedCharges = 1.
    // If the new boosted rate were applied retroactively, a second charge
    // would have been granted since boostedInterval < SALT_CHARGE_GENERATION_TIME.
    expect(game.saltFarm.nodes["0"].salt.storedCharges).toBe(1);
    expect(game.saltFarm.nodes["0"].salt.nextChargeAt).toBe(
      t0 + SALT_CHARGE_GENERATION_TIME * 2,
    );
  });

  it("crystallizes at old rate when sculpture upgrades", () => {
    const gameBefore = makeGame();
    const game: GameState = { ...gameBefore };
    game.sculptures = { ...game.sculptures, "Salt Sculpture": { level: 1 } };

    const boostedInterval = SALT_CHARGE_GENERATION_TIME * 0.95;
    const now = t0 + SALT_CHARGE_GENERATION_TIME + boostedInterval + 1;

    populateSaltFarm({ gameBefore, gameAfter: game, now });

    expect(game.saltFarm.nodes["0"].salt.storedCharges).toBe(1);
    expect(game.saltFarm.nodes["0"].salt.nextChargeAt).toBe(
      t0 + SALT_CHARGE_GENERATION_TIME * 2,
    );
  });

  it("uses saltSculptureLevelForMaxCharges for cap while charge interval follows current sculpture level", () => {
    const gameBefore = makeGame({
      saltFarm: {
        level: 4,
        nodes: {
          "0": {
            createdAt: t0,
            coordinates: { x: 0, y: 0 },
            salt: {
              storedCharges: 0,
              nextChargeAt: t0,
            },
          },
        },
      },
    });

    const game: GameState = { ...gameBefore };
    game.sculptures = { ...game.sculptures, "Salt Sculpture": { level: 3 } };

    const { chargeGenerationTimeMs: intervalMs } = getSaltChargeGenerationTime({
      gameState: gameBefore,
    });
    const now = t0 + intervalMs * 5;

    populateSaltFarm({
      gameBefore,
      gameAfter: game,
      now,
      saltSculptureLevelForMaxCharges: 3,
    });

    expect(game.saltFarm.nodes["0"].salt.storedCharges).toBe(4);
  });
});
