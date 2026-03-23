import Decimal from "decimal.js-light";
import * as flags from "lib/flags";
import { INITIAL_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import {
  MAX_STORED_SALT_CHARGES_PER_NODE,
  SALT_CHARGE_GENERATION_TIME,
  SALT_HARVEST_DURATION,
  SaltNode,
} from "features/game/types/salt";
import {
  getSaltModalState,
  partitionSaltHarvestSlotsForQueueUi,
} from "./getSaltModalState";

const now = new Date("2026-03-17T00:00:00.000Z").getTime();

const baseGameState: GameState = INITIAL_FARM;

function makeNode(overrides?: Partial<SaltNode["salt"]>): SaltNode {
  return {
    createdAt: now - 1000,
    coordinates: { x: 0, y: 0 },
    salt: {
      nextChargeAt: now + SALT_CHARGE_GENERATION_TIME,
      storedCharges: 1,
      ...overrides,
    },
  };
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe("partitionSaltHarvestSlotsForQueueUi", () => {
  it("picks earliest-finishing in-progress slot as head and caps VIP tail at 2", () => {
    const s1 = { startedAt: now, readyAt: now + 5000 };
    const s2 = { startedAt: now, readyAt: now + 2000 };
    const s3 = { startedAt: now, readyAt: now + 8000 };
    const out = partitionSaltHarvestSlotsForQueueUi([s1, s2, s3], now, true);
    expect(out.inProgressSlot).toEqual(s2);
    expect(out.queueGridCapacity).toBe(2);
    expect(out.queueGridSlots).toEqual([s1, s3]);
  });

  it("uses a 3-slot grid when all ready (VIP)", () => {
    const past = now - 1000;
    const slots = [
      { startedAt: now - 5000, readyAt: past },
      { startedAt: now - 4000, readyAt: past + 1 },
    ];
    const out = partitionSaltHarvestSlotsForQueueUi(slots, now, true);
    expect(out.inProgressSlot).toBeUndefined();
    expect(out.queueGridCapacity).toBe(3);
    expect(out.queueGridSlots).toEqual(slots);
  });

  it("exposes non-VIP single ready slot as inProgressDisplaySlot only", () => {
    const past = now - 1000;
    const slot = { startedAt: now - 5000, readyAt: past };
    const out = partitionSaltHarvestSlotsForQueueUi([slot], now, false);
    expect(out.inProgressSlot).toBeUndefined();
    expect(out.inProgressDisplaySlot).toEqual(slot);
    expect(out.queueGridCapacity).toBe(0);
  });
});

describe("getSaltModalState", () => {
  beforeEach(() => {
    const realFlags =
      jest.requireActual<typeof import("lib/flags")>("lib/flags");
    jest.spyOn(flags, "hasFeatureAccess").mockImplementation((game, name) => {
      if (name === "SALT_FARM") return false;
      return realFlags.hasFeatureAccess(game, name);
    });
  });

  it("prioritizes claim when ready slots exist", () => {
    const state = getSaltModalState({
      saltNode: makeNode({
        storedCharges: 1,
        harvesting: {
          slots: [
            {
              startedAt: now - SALT_HARVEST_DURATION * 2,
              readyAt: now - 1,
            },
          ],
        },
      }),
      gameState: baseGameState,
      now,
      saltRakes: new Decimal(5),
      isVip: true,
    });

    expect(state.canClaim).toBe(true);
    expect(state.primaryAction).toBe("claim");
  });

  it("hides timer when charges are maxed", () => {
    const state = getSaltModalState({
      saltNode: makeNode({
        storedCharges: MAX_STORED_SALT_CHARGES_PER_NODE,
        nextChargeAt: undefined,
      }),
      gameState: baseGameState,
      now,
      saltRakes: new Decimal(1),
      isVip: false,
    });

    expect(state.regenerationState).toBe("maxed");
    expect(state.nextChargeInSeconds).toBeUndefined();
  });

  it("shows paused regeneration while pause is active", () => {
    const state = getSaltModalState({
      saltNode: makeNode({
        storedCharges: 2,
        harvesting: {
          slots: [
            {
              startedAt: now,
              readyAt: now + SALT_HARVEST_DURATION,
            },
          ],
          regenerationPausedUntil: now + 10 * 60 * 1000,
        },
      }),
      gameState: baseGameState,
      now,
      saltRakes: new Decimal(5),
      isVip: true,
    });

    expect(state.regenerationState).toBe("paused");
    expect(state.pauseRemainingSeconds).toBeGreaterThan(0);
  });

  it("starts charging countdown from pause end, not harvest start", () => {
    const oneHour = 60 * 60 * 1000;
    const tenSeconds = 10 * 1000;
    const state = getSaltModalState({
      saltNode: makeNode({
        storedCharges: 0,
        nextChargeAt: now + SALT_CHARGE_GENERATION_TIME,
        harvesting: {
          slots: [
            {
              startedAt: now,
              readyAt: now + oneHour,
            },
          ],
          regenerationPausedUntil: now + oneHour,
        },
      }),
      gameState: baseGameState,
      now: now + oneHour + tenSeconds,
      saltRakes: new Decimal(5),
      isVip: true,
    });

    expect(state.regenerationState).toBe("charging");
    expect(state.nextChargeInSeconds).toBeDefined();
    const chargeSeconds = Math.ceil(SALT_CHARGE_GENERATION_TIME / 1000);
    expect(state.nextChargeInSeconds!).toBeLessThanOrEqual(chargeSeconds);
    expect(state.nextChargeInSeconds!).toBeGreaterThanOrEqual(
      Math.max(1, chargeSeconds - 15),
    );
  });

  it("shows a charging timer when below max and not paused", () => {
    const state = getSaltModalState({
      saltNode: makeNode({
        storedCharges: 1,
        nextChargeAt: now + SALT_CHARGE_GENERATION_TIME / 2,
      }),
      gameState: baseGameState,
      now,
      saltRakes: new Decimal(5),
      isVip: true,
    });

    expect(state.regenerationState).toBe("charging");
    expect(state.nextChargeInSeconds).toBeLessThanOrEqual(
      SALT_CHARGE_GENERATION_TIME / 1000,
    );
  });

  it("blocks non-VIP from starting while an active slot exists", () => {
    const state = getSaltModalState({
      saltNode: makeNode({
        storedCharges: 2,
        harvesting: {
          slots: [
            {
              startedAt: now,
              readyAt: now + SALT_HARVEST_DURATION,
            },
          ],
        },
      }),
      gameState: baseGameState,
      now,
      saltRakes: new Decimal(2),
      isVip: false,
    });

    expect(state.canStart).toBe(false);
    expect(state.primaryAction).toBe("blocked");
    expect(state.blockedReason).toContain("Non-VIP");
  });

  it("applies VIP 4-slot cap when calculating max rakes", () => {
    const readyPast = now - SALT_HARVEST_DURATION;
    const state = getSaltModalState({
      saltNode: makeNode({
        storedCharges: 2,
        harvesting: {
          slots: [
            { startedAt: now, readyAt: now + 1 },
            { startedAt: now, readyAt: now + 2 },
            { startedAt: now - 1000, readyAt: readyPast },
          ],
        },
      }),
      gameState: baseGameState,
      now,
      saltRakes: new Decimal(9),
      isVip: true,
    });

    expect(state.maxRakes).toBe(1);
    expect(state.canStart).toBe(true);
  });

  it("reports displayCharges as pile plus active (ready slots do not reduce until claimed)", () => {
    const readyPast = now - SALT_HARVEST_DURATION;
    const readyFuture = now + SALT_HARVEST_DURATION;

    expect(
      getSaltModalState({
        saltNode: makeNode({ storedCharges: 3 }),
        gameState: baseGameState,
        now,
        saltRakes: new Decimal(5),
        isVip: true,
      }).displayCharges,
    ).toBe(3);

    expect(
      getSaltModalState({
        saltNode: makeNode({
          storedCharges: 3,
          harvesting: {
            slots: [
              { startedAt: now - 1000, readyAt: readyPast },
              { startedAt: now - 1000, readyAt: readyPast },
            ],
          },
        }),
        gameState: baseGameState,
        now,
        saltRakes: new Decimal(5),
        isVip: true,
      }).displayCharges,
    ).toBe(3);

    expect(
      getSaltModalState({
        saltNode: makeNode({
          storedCharges: 0,
          harvesting: {
            slots: [
              { startedAt: now, readyAt: readyFuture },
              { startedAt: now, readyAt: readyFuture },
            ],
          },
        }),
        gameState: baseGameState,
        now,
        saltRakes: new Decimal(5),
        isVip: true,
      }).displayCharges,
    ).toBe(2);

    expect(
      getSaltModalState({
        saltNode: makeNode({
          storedCharges: 0,
          harvesting: {
            slots: [
              {
                startedAt: now - SALT_HARVEST_DURATION * 2,
                readyAt: readyPast,
              },
              {
                startedAt: now - SALT_HARVEST_DURATION * 2,
                readyAt: readyPast,
              },
            ],
          },
        }),
        gameState: baseGameState,
        now,
        saltRakes: new Decimal(5),
        isVip: true,
      }).displayCharges,
    ).toBe(0);
  });

  it("when pile is empty but harvests are in progress, blockedReason explains charges in use", () => {
    const state = getSaltModalState({
      saltNode: makeNode({
        storedCharges: 0,
        harvesting: {
          slots: [
            {
              startedAt: now,
              readyAt: now + SALT_HARVEST_DURATION,
            },
          ],
        },
      }),
      gameState: baseGameState,
      now,
      saltRakes: new Decimal(2),
      isVip: true,
    });

    expect(state.displayCharges).toBe(1);
    expect(state.canStart).toBe(false);
    expect(state.blockedReason).toBe("Charges are in use by active harvests");
  });

  it("uses SALT_FARM halved interval for countdown when feature is on", () => {
    const realFlags =
      jest.requireActual<typeof import("lib/flags")>("lib/flags");
    jest.spyOn(flags, "hasFeatureAccess").mockImplementation((game, name) => {
      if (name === "SALT_FARM") return true;
      return realFlags.hasFeatureAccess(game, name);
    });

    const halfInterval = SALT_CHARGE_GENERATION_TIME / 2;
    const state = getSaltModalState({
      saltNode: makeNode({
        storedCharges: 1,
        nextChargeAt: now + halfInterval,
      }),
      gameState: baseGameState,
      now,
      saltRakes: new Decimal(1),
      isVip: false,
    });

    expect(state.nextChargeInSeconds).toBe(halfInterval / 1000);
  });
});
