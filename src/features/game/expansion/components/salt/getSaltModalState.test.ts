import Decimal from "decimal.js-light";
import {
  MAX_STORED_SALT_CHARGES_PER_NODE,
  SALT_CHARGE_GENERATION_TIME,
  SALT_HARVEST_DURATION,
  SaltNode,
} from "features/game/types/salt";
import { getSaltModalState } from "./getSaltModalState";

const now = new Date("2026-03-17T00:00:00.000Z").getTime();

function makeNode(overrides?: Partial<SaltNode["salt"]>): SaltNode {
  return {
    createdAt: now - 1000,
    coordinates: { x: 0, y: 0 },
    salt: {
      lastUpdatedAt: now,
      storedCharges: 1,
      ...overrides,
    },
  };
}

describe("getSaltModalState", () => {
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
      }),
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
      now,
      saltRakes: new Decimal(5),
      isVip: true,
    });

    expect(state.regenerationState).toBe("paused");
    expect(state.pauseRemainingSeconds).toBeGreaterThan(0);
  });

  it("shows a charging timer when below max and not paused", () => {
    const state = getSaltModalState({
      saltNode: makeNode({
        storedCharges: 1,
        lastUpdatedAt: now - 2 * 60 * 60 * 1000,
      }),
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
      now,
      saltRakes: new Decimal(2),
      isVip: false,
    });

    expect(state.canStart).toBe(false);
    expect(state.primaryAction).toBe("blocked");
    expect(state.blockedReason).toContain("Non-VIP");
  });

  it("applies VIP 4-slot cap when calculating max rakes", () => {
    const state = getSaltModalState({
      saltNode: makeNode({
        storedCharges: 3,
        harvesting: {
          slots: [
            { startedAt: now, readyAt: now + 1 },
            { startedAt: now, readyAt: now + 2 },
            { startedAt: now, readyAt: now + 3 },
          ],
        },
      }),
      now,
      saltRakes: new Decimal(9),
      isVip: true,
    });

    expect(state.maxRakes).toBe(1);
    expect(state.canStart).toBe(true);
  });
});
