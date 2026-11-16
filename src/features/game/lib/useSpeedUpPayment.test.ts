import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { getSpeedUpPaymentOptions } from "features/game/lib/useSpeedUpPayment";
import {
  COINS_PER_GEM,
  DAILY_COIN_SPEEDUP_LIMIT,
} from "features/game/lib/getInstantGems";
import type { GameState } from "features/game/types/game";

const now = new Date("2024-06-15T12:00:00Z").getTime();
const today = "2024-06-15";

const GEM_COST = 10;
const COIN_COST = GEM_COST * COINS_PER_GEM;

function game(overrides: Partial<GameState> = {}): GameState {
  return {
    ...INITIAL_FARM,
    coins: 100_000,
    gems: {},
    inventory: {},
    ...overrides,
  };
}

function gameWithTrophy(overrides: Partial<GameState> = {}): GameState {
  return game({
    collectibles: {
      "Dino Egg Trophy": [
        {
          id: "1",
          createdAt: 0,
          coordinates: { x: 0, y: 0 },
          readyAt: 0,
        },
      ],
    },
    ...overrides,
  });
}

function options(state: GameState) {
  return getSpeedUpPaymentOptions({ game: state, gemCost: GEM_COST, now });
}

describe("getSpeedUpPaymentOptions", () => {
  it("prices coins at the gem cost times the exchange rate", () => {
    expect(options(gameWithTrophy()).coinCost).toBe(COIN_COST);
  });

  it("only offers coins when the Dino Egg Trophy is placed", () => {
    expect(options(game()).canPayWithCoins).toBe(false);
    expect(options(gameWithTrophy()).canPayWithCoins).toBe(true);
  });

  describe("defaultPaymentMethod", () => {
    it("defaults to gems when the player can afford them", () => {
      const state = gameWithTrophy({
        inventory: { Gem: new Decimal(GEM_COST) },
      });

      expect(options(state).defaultPaymentMethod).toBe("gems");
    });

    it("defaults to coins when the player has no gems but holds the trophy", () => {
      const state = gameWithTrophy();

      expect(options(state).hasEnoughGems).toBe(false);
      expect(options(state).coinsAvailable).toBe(true);
      expect(options(state).defaultPaymentMethod).toBe("coins");
    });

    it("defaults to coins when the player has some, but not enough, gems", () => {
      const state = gameWithTrophy({
        inventory: { Gem: new Decimal(GEM_COST - 1) },
      });

      expect(options(state).defaultPaymentMethod).toBe("coins");
    });

    it("defaults to gems when the player has no gems and no trophy", () => {
      expect(options(game()).defaultPaymentMethod).toBe("gems");
    });

    it("defaults to gems when the player has no gems and cannot afford the coins", () => {
      const state = gameWithTrophy({ coins: COIN_COST - 1 });

      expect(options(state).hasEnoughCoins).toBe(false);
      expect(options(state).defaultPaymentMethod).toBe("gems");
    });

    it("defaults to gems when the coin payment would exceed the daily limit", () => {
      const state = gameWithTrophy({
        gems: {
          history: {
            [today]: {
              spent: 0,
              coinsSpent: DAILY_COIN_SPEEDUP_LIMIT - COIN_COST + 1,
            },
          },
        },
      });

      expect(options(state).wouldExceedDailyCoinLimit).toBe(true);
      expect(options(state).coinsAvailable).toBe(false);
      expect(options(state).defaultPaymentMethod).toBe("gems");
    });
  });

  describe("canAffordAnyMethod", () => {
    // Gates the button that opens a confirmation modal containing the payment
    // selector: it has to allow either method through, or a player with no
    // gems can never reach the coin option.
    it("is true when only gems are affordable", () => {
      const state = game({ inventory: { Gem: new Decimal(GEM_COST) } });

      expect(options(state).coinsAvailable).toBe(false);
      expect(options(state).canAffordAnyMethod).toBe(true);
    });

    it("is true when only coins are affordable", () => {
      const state = gameWithTrophy();

      expect(options(state).hasEnoughGems).toBe(false);
      expect(options(state).canAffordAnyMethod).toBe(true);
    });

    it("is false when neither method can pay", () => {
      const state = gameWithTrophy({ coins: COIN_COST - 1 });

      expect(options(state).canAffordAnyMethod).toBe(false);
    });
  });

  describe("wouldExceedDailyCoinLimit", () => {
    it("is false when the payment lands exactly on the cap", () => {
      const state = gameWithTrophy({
        gems: {
          history: {
            [today]: {
              spent: 0,
              coinsSpent: DAILY_COIN_SPEEDUP_LIMIT - COIN_COST,
            },
          },
        },
      });

      expect(options(state).wouldExceedDailyCoinLimit).toBe(false);
      expect(options(state).coinsAvailable).toBe(true);
    });

    it("ignores coins spent on other days", () => {
      const state = gameWithTrophy({
        gems: {
          history: {
            "2024-06-14": { spent: 0, coinsSpent: DAILY_COIN_SPEEDUP_LIMIT },
          },
        },
      });

      expect(options(state).coinsSpentToday).toBe(0);
      expect(options(state).wouldExceedDailyCoinLimit).toBe(false);
    });
  });
});
