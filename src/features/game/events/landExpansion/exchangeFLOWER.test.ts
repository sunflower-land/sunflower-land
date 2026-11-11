import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import {
  EXCHANGE_FLOWER_CLOSE_DATE,
  EXCHANGE_FLOWER_RATE_CHANGE_DATE,
  exchangeFlower,
} from "./exchangeFLOWER";

describe("exchangeFlower", () => {
  // Before the sunset rate change so the original 80:1 rate applies.
  const createdAt = EXCHANGE_FLOWER_RATE_CHANGE_DATE - 24 * 60 * 60 * 1000;
  it("should throw if no face verification", () => {
    expect(() =>
      exchangeFlower({
        state: {
          ...INITIAL_FARM,
          faceRecognition: {
            history: [],
          },
          vip: {
            expiresAt: createdAt + 1000,
            bundles: [],
          },
        },
        action: { type: "exchange.flower", amount: 80 },
        createdAt,
      }),
    ).toThrow("Face verification required");
  });

  it("should throw if insufficient love charms", () => {
    expect(() =>
      exchangeFlower({
        state: {
          ...INITIAL_FARM,
          inventory: { "Love Charm": new Decimal(0) },
          faceRecognition: {
            history: [
              {
                event: "succeeded",
                createdAt,
                confidence: 0.9,
              },
            ],
          },
          vip: {
            expiresAt: createdAt + 1000,
            bundles: [],
          },
        },
        action: { type: "exchange.flower", amount: 80 },
        createdAt,
      }),
    ).toThrow("Insufficient Love Charms");
  });

  it("should throw if daily limit is reached", () => {
    const today = new Date(createdAt).toISOString().split("T")[0];
    expect(() =>
      exchangeFlower({
        state: {
          ...INITIAL_FARM,
          inventory: { "Love Charm": new Decimal(500) },
          flower: {
            history: {
              [today]: { loveCharmsSpent: 9501 },
            },
          },
          faceRecognition: {
            history: [
              {
                event: "succeeded",
                createdAt,
                confidence: 0.9,
              },
            ],
          },
          vip: {
            expiresAt: createdAt + 1000,
            bundles: [],
          },
        },
        action: { type: "exchange.flower", amount: 500 },
        createdAt,
      }),
    ).toThrow("Daily limit reached");
  });

  it("should exchange FLOWER", () => {
    const state = exchangeFlower({
      state: {
        ...INITIAL_FARM,
        inventory: { "Love Charm": new Decimal(500) },
        faceRecognition: {
          history: [
            {
              event: "succeeded",
              createdAt,
              confidence: 0.9,
            },
          ],
        },
        vip: {
          expiresAt: createdAt + 1000,
          bundles: [],
        },
      },
      action: { type: "exchange.flower", amount: 500 },
      createdAt,
    });
    expect(state.balance).toEqual(new Decimal(6.25));
  });

  const verifiedVipFarm = (now: number): GameState => ({
    ...INITIAL_FARM,
    inventory: { "Love Charm": new Decimal(1500) },
    faceRecognition: {
      history: [{ event: "succeeded", createdAt: now, confidence: 0.9 }],
    },
    vip: { expiresAt: now + 1000, bundles: [] },
  });

  it("uses the 150:1 rate from the rate change date", () => {
    const now = EXCHANGE_FLOWER_RATE_CHANGE_DATE;
    const state = exchangeFlower({
      state: verifiedVipFarm(now),
      action: { type: "exchange.flower", amount: 1500 },
      createdAt: now,
    });
    expect(state.balance).toEqual(new Decimal(10));
  });

  it("throws once the exchange has closed", () => {
    const now = EXCHANGE_FLOWER_CLOSE_DATE;
    expect(() =>
      exchangeFlower({
        state: verifiedVipFarm(now),
        action: { type: "exchange.flower", amount: 150 },
        createdAt: now,
      }),
    ).toThrow("Exchange closed");
  });
});
