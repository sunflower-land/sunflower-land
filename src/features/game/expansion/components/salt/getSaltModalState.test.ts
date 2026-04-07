import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import {
  MAX_STORED_SALT_CHARGES_PER_NODE,
  SALT_CHARGE_GENERATION_TIME,
  SaltNode,
} from "features/game/types/salt";
import { getSaltModalState } from "./getSaltModalState";

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

describe("getSaltModalState", () => {
  it("allows instant harvest when one charge and one rake are available", () => {
    const state = getSaltModalState({
      saltNode: makeNode({ storedCharges: 1 }),
      gameState: baseGameState,
      now,
      saltRakes: new Decimal(1),
    });

    expect(state.canStart).toBe(true);
    expect(state.canClaim).toBe(false);
    expect(state.primaryAction).toBe("start");
    expect(state.queueGridSlots).toEqual([]);
  });

  it("blocks harvest when out of rakes", () => {
    const state = getSaltModalState({
      saltNode: makeNode({ storedCharges: 2 }),
      gameState: baseGameState,
      now,
      saltRakes: new Decimal(0),
    });

    expect(state.canStart).toBe(false);
    expect(state.blockedReason).toBe(
      "saltHarvest.blockedReason.notEnoughSaltRakes",
    );
    expect(state.primaryAction).toBe("blocked");
  });

  it("shows maxed state when stored charges are full", () => {
    const state = getSaltModalState({
      saltNode: makeNode({
        storedCharges: MAX_STORED_SALT_CHARGES_PER_NODE,
        nextChargeAt: now + SALT_CHARGE_GENERATION_TIME,
      }),
      gameState: baseGameState,
      now,
      saltRakes: new Decimal(2),
    });

    expect(state.regenerationState).toBe("maxed");
    expect(state.nextChargeInSeconds).toBeUndefined();
  });
});
