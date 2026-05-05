import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { speedUpUpgrade } from "./speedUpUpgrade";

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
};

describe("speedUpUpgrade", () => {
  it("throws if the building is not upgrading", () => {
    expect(() =>
      speedUpUpgrade({
        action: { type: "upgrade.spedUp", name: "Hen House" },
        state: GAME_STATE,
      }),
    ).toThrow("Building is not upgrading");
  });

  it("throws if the building has already finished upgrading", () => {
    expect(() =>
      speedUpUpgrade({
        action: { type: "upgrade.spedUp", name: "Hen House" },
        state: {
          ...GAME_STATE,
          henHouse: {
            ...GAME_STATE.henHouse,
            upgradeReadyAt: Date.now() - 1000,
          },
        },
      }),
    ).toThrow("Building is already upgraded");
  });

  it("throws if the player has insufficient gems", () => {
    expect(() =>
      speedUpUpgrade({
        action: { type: "upgrade.spedUp", name: "Hen House" },
        state: {
          ...GAME_STATE,
          inventory: { Gem: new Decimal(0) },
          henHouse: {
            ...GAME_STATE.henHouse,
            upgradeReadyAt: Date.now() + 1000,
          },
        },
      }),
    ).toThrow("Insufficient Gems");
  });

  it("charges gems and finishes the upgrade", () => {
    const now = Date.now();
    const state = speedUpUpgrade({
      action: { type: "upgrade.spedUp", name: "Hen House" },
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: { Gem: new Decimal(100) },
        henHouse: {
          ...GAME_STATE.henHouse,
          upgradeReadyAt: now + 1000,
        },
      },
    });

    expect(state.inventory.Gem).toEqual(new Decimal(99));
    expect(state.henHouse.upgradeReadyAt).toBe(now);
  });

  describe("Dino Egg Trophy coin payment", () => {
    it("throws when paymentMethod is 'coins' without a placed Dino Egg Trophy", () => {
      expect(() =>
        speedUpUpgrade({
          action: {
            type: "upgrade.spedUp",
            name: "Hen House",
            paymentMethod: "coins",
          },
          state: {
            ...GAME_STATE,
            coins: 100_000,
            henHouse: {
              ...GAME_STATE.henHouse,
              upgradeReadyAt: Date.now() + 1000,
            },
          },
        }),
      ).toThrow("Dino Egg Trophy required");
    });

    it("charges coins at 50 per gem and finishes the upgrade when trophy is placed", () => {
      const now = Date.now();
      const state = speedUpUpgrade({
        action: {
          type: "upgrade.spedUp",
          name: "Hen House",
          paymentMethod: "coins",
        },
        createdAt: now,
        state: {
          ...GAME_STATE,
          coins: 1000,
          inventory: { Gem: new Decimal(0) },
          collectibles: {
            "Dino Egg Trophy": [
              {
                id: "trophy-1",
                createdAt: 0,
                coordinates: { x: 0, y: 0 },
                readyAt: 0,
              },
            ],
          },
          henHouse: {
            ...GAME_STATE.henHouse,
            upgradeReadyAt: now + 1000,
          },
        },
      });

      // 1s remaining ⇒ 1 gem ⇒ 50 coins.
      expect(state.coins).toBe(950);
      expect(state.inventory.Gem).toEqual(new Decimal(0));
      expect(state.henHouse.upgradeReadyAt).toBe(now);
    });
  });
});
