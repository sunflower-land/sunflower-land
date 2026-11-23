import Decimal from "decimal.js-light";
import { CONFIG } from "lib/config";
import { INITIAL_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import type { ScheduledWeatherOverlay } from "features/game/types/weather";
import { deliverOrder, generateDeliveryTickets } from "./deliver";
import { seedBought } from "./seedBought";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

// The overlays the server sends for these days. Both fall during the Insect
// Plague of 2026-11-23 → 2026-11-27, which no longer keeps them off the
// calendar.
const FULL_MOON: ScheduledWeatherOverlay = {
  name: "fullMoon",
  startAt: Date.UTC(2026, 10, 23),
  endAt: Date.UTC(2026, 10, 24),
};
const DOUBLE_DELIVERY: ScheduledWeatherOverlay = {
  name: "doubleDelivery",
  startAt: Date.UTC(2026, 10, 25),
  endAt: Date.UTC(2026, 10, 26),
};
const MID_FULL_MOON = FULL_MOON.startAt + 12 * HOUR;
const MID_DOUBLE_DELIVERY = DOUBLE_DELIVERY.startAt + 12 * HOUR;

const farm: GameState = {
  ...INITIAL_FARM,
  weather: { forecast: [], overlays: [FULL_MOON, DOUBLE_DELIVERY] },
};

const delivery = (createdAt: number) => {
  const state = deliverOrder({
    state: {
      ...farm,
      coins: 0,
      inventory: { Orange: new Decimal(5) },
      delivery: {
        ...farm.delivery,
        orders: [
          {
            id: "123",
            createdAt: createdAt - HOUR,
            readyAt: createdAt - HOUR,
            from: "tango",
            items: { Orange: 5 },
            reward: { coins: 320 },
          },
        ],
      },
    },
    action: { id: "123", type: "order.delivered" },
    createdAt,
  });

  return state.coins;
};

const moonSeed = (createdAt: number) =>
  seedBought({
    state: {
      ...farm,
      bumpkin: { ...farm.bumpkin, experience: 10_000_000 },
      coins: 1_000_000,
      inventory: { "Fruit Patch": new Decimal(1) },
      stock: { "Duskberry Seed": new Decimal(1) },
    },
    action: { type: "seed.bought", item: "Duskberry Seed", amount: 1 },
    createdAt,
  });

describe("Double Delivery (weather overlay)", () => {
  it("doubles delivery rewards on its day", () => {
    expect(delivery(MID_DOUBLE_DELIVERY)).toBe(640);
  });

  it("leaves rewards alone the next day", () => {
    expect(delivery(MID_DOUBLE_DELIVERY + DAY)).toBe(320);
  });

  it("doubles delivery tickets on its day", () => {
    const tickets = (now: number) =>
      generateDeliveryTickets({ game: farm, npc: "tywin", now }).amount;

    // Tywin pays 10 tickets.
    expect(tickets(MID_DOUBLE_DELIVERY)).toBe(20);
    expect(tickets(MID_DOUBLE_DELIVERY + DAY)).toBe(10);
  });

  describe("without the Weather flag", () => {
    const network = CONFIG.NETWORK;
    beforeAll(() => {
      CONFIG.NETWORK = "mainnet";
    });
    afterAll(() => {
      CONFIG.NETWORK = network;
    });

    it("ignores the overlays", () => {
      expect(delivery(MID_DOUBLE_DELIVERY)).toBe(320);
    });
  });
});

describe("Full Moon (weather overlay)", () => {
  it("sells Full Moon seeds on its day", () => {
    expect(moonSeed(MID_FULL_MOON).inventory["Duskberry Seed"]).toEqual(
      new Decimal(1),
    );
  });

  it("stops selling them the next day", () => {
    expect(() => moonSeed(MID_FULL_MOON + DAY)).toThrow("Not a full moon");
  });

  describe("without the Weather flag", () => {
    const network = CONFIG.NETWORK;
    beforeAll(() => {
      CONFIG.NETWORK = "mainnet";
    });
    afterAll(() => {
      CONFIG.NETWORK = network;
    });

    it("ignores the overlays", () => {
      expect(() => moonSeed(MID_FULL_MOON)).toThrow("Not a full moon");
    });
  });
});
