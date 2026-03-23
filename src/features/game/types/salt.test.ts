import type { GameState } from "./game";

jest.mock("lib/flags", () => ({
  hasFeatureAccess: jest.fn(),
}));

jest.mock("../lib/wearables", () => ({
  isWearableActive: jest.fn().mockReturnValue(false),
}));

import {
  MAX_STORED_SALT_CHARGES_PER_NODE,
  SALT_CHARGE_GENERATION_TIME,
  findHarvestSlotAfterChargeTimestamp,
  getSaltChargeGenerationTime,
  materializeSaltRegen,
  syncSaltNode,
  type Salt,
  type SaltHarvestSlot,
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

describe("findHarvestSlotAfterChargeTimestamp", () => {
  const slots: SaltHarvestSlot[] = [
    { startedAt: 100, readyAt: 200 },
    { startedAt: 150, readyAt: 250 },
    { startedAt: 300, readyAt: 400 },
  ];

  it("returns first slot with startedAt strictly after reference", () => {
    expect(findHarvestSlotAfterChargeTimestamp(slots, 100)?.startedAt).toBe(
      150,
    );
    expect(findHarvestSlotAfterChargeTimestamp(slots, 149)?.startedAt).toBe(
      150,
    );
    expect(findHarvestSlotAfterChargeTimestamp(slots, 150)?.startedAt).toBe(
      300,
    );
    expect(findHarvestSlotAfterChargeTimestamp(slots, 500)).toBeUndefined();
  });
});
