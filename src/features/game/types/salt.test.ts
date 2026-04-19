import type { GameState } from "features/game/types/game";
import { INITIAL_FARM } from "features/game/lib/constants";
import {
  MAX_STORED_SALT_CHARGES_PER_NODE,
  SALT_CHARGE_GENERATION_TIME,
  getSaltChargeGenerationTime,
  materializeSaltRegen,
  populateSaltFarm,
  rechargeAllSaltNodes,
  syncSaltNode,
  type Salt,
  type SaltNode,
} from "./salt";

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

  it("uses saltSculptureLevelForMaxCharges for cap while charge interval follows current sculpture level", () => {
    const game = {
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
      sculptures: { "Salt Sculpture": { level: 2 } },
    } as unknown as GameState;

    const intervalMs = getSaltChargeGenerationTime({ gameState: game });
    const now = t0 + intervalMs * 5;

    const base = JSON.parse(JSON.stringify(game)) as unknown as GameState;
    populateSaltFarm({ game: base, now });

    const withOverride = JSON.parse(
      JSON.stringify(game),
    ) as unknown as GameState;
    populateSaltFarm({
      game: withOverride,
      now,
      saltSculptureLevelForMaxCharges: 3,
    });

    expect(base.saltFarm.nodes["0"].salt.storedCharges).toBe(3);
    expect(withOverride.saltFarm.nodes["0"].salt.storedCharges).toBe(4);
  });
});

describe("rechargeAllSaltNodes", () => {
  const t0 = 1_000_000_000_000;

  it("fills to the base max and resets the charge timer", () => {
    const game: GameState = {
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
    };
    const interval = getSaltChargeGenerationTime({ gameState: game });
    rechargeAllSaltNodes(game, t0);
    expect(game.saltFarm.nodes["0"].salt.storedCharges).toBe(
      MAX_STORED_SALT_CHARGES_PER_NODE,
    );
    expect(game.saltFarm.nodes["0"].salt.nextChargeAt).toBe(t0 + interval);
  });

  it("does not push stored charges above the Salt Sculpture cap", () => {
    const game: GameState = {
      ...INITIAL_FARM,
      saltFarm: {
        level: 1,
        nodes: {
          "0": {
            createdAt: t0,
            coordinates: { x: 0, y: 0 },
            salt: {
              storedCharges: MAX_STORED_SALT_CHARGES_PER_NODE,
              nextChargeAt: t0 + SALT_CHARGE_GENERATION_TIME,
            },
          },
        },
      },
    };
    const interval = getSaltChargeGenerationTime({ gameState: game });
    rechargeAllSaltNodes(game, t0);
    expect(game.saltFarm.nodes["0"].salt.storedCharges).toBe(
      MAX_STORED_SALT_CHARGES_PER_NODE,
    );
    expect(game.saltFarm.nodes["0"].salt.nextChargeAt).toBe(t0 + interval);
  });

  it("respects a higher stored cap when Salt Sculpture is upgraded", () => {
    const game: GameState = {
      ...INITIAL_FARM,
      sculptures: { "Salt Sculpture": { level: 3 } },
      saltFarm: {
        level: 2,
        nodes: {
          "0": {
            createdAt: t0,
            coordinates: { x: 0, y: 0 },
            salt: {
              storedCharges: 1,
              nextChargeAt: t0 + SALT_CHARGE_GENERATION_TIME * 10,
            },
          },
        },
      },
    };
    const interval = getSaltChargeGenerationTime({ gameState: game });
    rechargeAllSaltNodes(game, t0);
    expect(game.saltFarm.nodes["0"].salt.storedCharges).toBe(4);
    expect(game.saltFarm.nodes["0"].salt.nextChargeAt).toBe(t0 + interval);
  });

  it("materializes passive regen before applying the skill grant", () => {
    const game: GameState = {
      ...INITIAL_FARM,
      sculptures: { "Salt Sculpture": { level: 3 } },
      saltFarm: {
        level: 2,
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
    };
    const interval = getSaltChargeGenerationTime({ gameState: game });
    const skillAt = t0 + interval;
    rechargeAllSaltNodes(game, skillAt);
    expect(game.saltFarm.nodes["0"].salt.storedCharges).toBe(4);
    expect(game.saltFarm.nodes["0"].salt.nextChargeAt).toBe(skillAt + interval);
  });

  it("updates every salt node on the farm", () => {
    const game: GameState = {
      ...INITIAL_FARM,
      saltFarm: {
        level: 2,
        nodes: {
          "0": {
            createdAt: t0,
            coordinates: { x: 0, y: 0 },
            salt: {
              storedCharges: 0,
              nextChargeAt: t0 + SALT_CHARGE_GENERATION_TIME,
            },
          },
          "1": {
            createdAt: t0,
            coordinates: { x: 0, y: 1 },
            salt: {
              storedCharges: 1,
              nextChargeAt: t0 + SALT_CHARGE_GENERATION_TIME * 2,
            },
          },
        },
      },
    };
    const interval = getSaltChargeGenerationTime({ gameState: game });
    rechargeAllSaltNodes(game, t0);
    expect(game.saltFarm.nodes["0"].salt.storedCharges).toBe(
      MAX_STORED_SALT_CHARGES_PER_NODE,
    );
    expect(game.saltFarm.nodes["1"].salt.storedCharges).toBe(
      MAX_STORED_SALT_CHARGES_PER_NODE,
    );
    expect(game.saltFarm.nodes["0"].salt.nextChargeAt).toBe(t0 + interval);
    expect(game.saltFarm.nodes["1"].salt.nextChargeAt).toBe(t0 + interval);
  });
});
