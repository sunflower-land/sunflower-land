import type { GameState } from "./game";

jest.mock("lib/flags", () => ({
  hasFeatureAccess: jest.fn(),
}));

import {
  MAX_STORED_SALT_CHARGES_PER_NODE,
  SALT_CHARGE_GENERATION_TIME,
  getSaltChargeGenerationTime,
  materializeSaltRegen,
  syncSaltNode,
  type Salt,
  type SaltNode,
} from "./salt";
import { hasFeatureAccess } from "lib/flags";

const mockHasFeatureAccess = hasFeatureAccess as jest.MockedFunction<
  typeof hasFeatureAccess
>;

describe("salt nextChargeAt regen", () => {
  const t0 = 1_000_000_000_000;

  beforeEach(() => {
    mockHasFeatureAccess.mockImplementation((game, featureName) =>
      jest
        .requireActual<typeof import("lib/flags")>("lib/flags")
        .hasFeatureAccess(game, featureName),
    );
  });

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
    expect(out.nextChargeAt).toBeUndefined();
  });

  it("clears nextChargeAt at max charges", () => {
    const salt: Salt = {
      storedCharges: MAX_STORED_SALT_CHARGES_PER_NODE - 1,
      nextChargeAt: t0,
    };
    const out = materializeSaltRegen(salt, t0 + 1);
    expect(out.storedCharges).toBe(MAX_STORED_SALT_CHARGES_PER_NODE);
    expect(out.nextChargeAt).toBeUndefined();
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

  it("keeps regen scheduling when stored is 3 but display is below max (unclaimed ready)", () => {
    const salt: Salt = {
      storedCharges: 3,
      nextChargeAt: t0 + SALT_CHARGE_GENERATION_TIME,
      harvesting: {
        slots: [
          { startedAt: t0 - 1000, readyAt: t0 - 1 },
          { startedAt: t0 - 1000, readyAt: t0 - 2 },
        ],
      },
    };
    const out = materializeSaltRegen(salt, t0);
    expect(out.nextChargeAt).toBeDefined();
    expect(out.storedCharges).toBeGreaterThanOrEqual(3);
  });

  describe("getSaltChargeGenerationTime", () => {
    it("returns base interval when SALT_FARM is disabled", () => {
      mockHasFeatureAccess.mockReturnValue(false);
      expect(getSaltChargeGenerationTime({ gameState: {} as GameState })).toBe(
        SALT_CHARGE_GENERATION_TIME,
      );
    });

    it("halves interval when SALT_FARM is enabled", () => {
      mockHasFeatureAccess.mockImplementation(
        (_game, name) => name === "SALT_FARM",
      );
      expect(getSaltChargeGenerationTime({ gameState: {} as GameState })).toBe(
        SALT_CHARGE_GENERATION_TIME / 2,
      );
    });
  });
});
