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

    const { chargeGenerationTimeMs: intervalMs } = getSaltChargeGenerationTime({
      gameState: game,
    });
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
