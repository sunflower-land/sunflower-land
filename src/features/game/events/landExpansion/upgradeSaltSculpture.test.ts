import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { upgradeSaltSculpture } from "./upgradeSaltSculpture";
import { GameState } from "features/game/types/game";

const createdAt = 1_700_000_000_000;

function stateWith(overrides: Partial<GameState> = {}): GameState {
  return {
    ...TEST_FARM,
    sculptures: { "Salt Sculpture": { level: 1 } },
    inventory: {},
    ...overrides,
  };
}

describe("upgradeSaltSculpture", () => {
  it("throws when upgrading without a crafted Salt Sculpture", () => {
    expect(() =>
      upgradeSaltSculpture({
        state: stateWith({
          sculptures: undefined,
          coins: 99999,
          inventory: { "Refined Salt": new Decimal(99999) },
        }),
        action: { type: "saltSculpture.upgraded" },
        createdAt,
      }),
    ).toThrow("Salt Sculpture not crafted");
  });

  it("upgrades from level 1 to 2, deducts correct ingredients", () => {
    const state = upgradeSaltSculpture({
      state: stateWith({
        inventory: {
          "Refined Salt": new Decimal(20),
          Earthworm: new Decimal(20),
        },
      }),
      action: { type: "saltSculpture.upgraded" },
      createdAt,
    });

    expect(state.sculptures?.["Salt Sculpture"]?.level).toBe(2);
    expect(state.inventory["Refined Salt"]?.toNumber()).toBe(10);
    expect(state.inventory.Earthworm?.toNumber()).toBe(10);
  });

  it("upgrades from level 5 to 6, deducts coins and ingredients", () => {
    const state = upgradeSaltSculpture({
      state: stateWith({
        sculptures: { "Salt Sculpture": { level: 5 } },
        coins: 3000,
        inventory: {
          "Refined Salt": new Decimal(300),
          "Red Wiggler": new Decimal(20),
        },
      }),
      action: { type: "saltSculpture.upgraded" },
      createdAt,
    });

    expect(state.sculptures?.["Salt Sculpture"]?.level).toBe(6);
    expect(state.coins).toBe(1000);
    expect(state.inventory["Refined Salt"]?.toNumber()).toBe(100);
    expect(state.inventory["Red Wiggler"]?.toNumber()).toBe(10);
  });

  it("throws when already at max level", () => {
    expect(() =>
      upgradeSaltSculpture({
        state: stateWith({
          sculptures: { "Salt Sculpture": { level: 6 } },
          coins: 99999,
          inventory: { "Refined Salt": new Decimal(99999) },
        }),
        action: { type: "saltSculpture.upgraded" },
        createdAt,
      }),
    ).toThrow("Salt Sculpture is already max level");
  });

  it("throws when insufficient ingredients for level 2", () => {
    expect(() =>
      upgradeSaltSculpture({
        state: stateWith({
          inventory: { "Refined Salt": new Decimal(1) },
        }),
        action: { type: "saltSculpture.upgraded" },
        createdAt,
      }),
    ).toThrow("Insufficient Refined Salt");
  });

  it("sets upgradedAt timestamp", () => {
    const state = upgradeSaltSculpture({
      state: stateWith({
        inventory: {
          "Refined Salt": new Decimal(20),
          Earthworm: new Decimal(20),
        },
      }),
      action: { type: "saltSculpture.upgraded" },
      createdAt,
    });

    expect(state.sculptures?.["Salt Sculpture"]?.upgradedAt).toBe(createdAt);
  });
});
