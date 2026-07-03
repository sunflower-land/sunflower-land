import Decimal from "decimal.js-light";
import {
  BASE_OIL_DROP_AMOUNT,
  OIL_BONUS_DROP_AMOUNT,
  OIL_RESERVE_RECOVERY_TIME,
  drillOilReserve,
  getDrilledAt,
  canDrillOilReserve,
  getOilReserveReadyAt,
} from "./drillOilReserve";
import { TEST_FARM } from "features/game/lib/constants";
import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";
import { CONFIG } from "lib/config";
import type { GameState } from "features/game/types/game";

describe("drillOilReserve", () => {
  it("throws an error if the oil reserve does not exist", () => {
    expect(() =>
      drillOilReserve({
        action: {
          id: "2",
          type: "oilReserve.drilled",
        },
        state: {
          ...TEST_FARM,
          oilReserves: {
            "1": {
              x: 1,
              y: 1,
              createdAt: 0,
              drilled: 0,
              oil: {
                drilledAt: 0,
              },
            },
          },
        },
      }),
    ).toThrow("Oil reserve #2 not found");
  });

  it("throws an error if the oil reserve is not placed", () => {
    expect(() =>
      drillOilReserve({
        action: {
          id: "1",
          type: "oilReserve.drilled",
        },
        state: {
          ...TEST_FARM,
          oilReserves: {
            "1": {
              createdAt: 0,
              drilled: 0,
              oil: {
                drilledAt: 0,
              },
            },
          },
        },
      }),
    ).toThrow("Oil reserve is not placed");
  });

  it("throws an error if the player does not have any drills", () => {
    expect(() =>
      drillOilReserve({
        action: {
          id: "1",
          type: "oilReserve.drilled",
        },
        state: {
          ...TEST_FARM,
          oilReserves: {
            "1": {
              x: 1,
              y: 1,
              createdAt: 0,
              drilled: 0,
              oil: {
                drilledAt: 0,
              },
            },
          },
        },
      }),
    ).toThrow("No oil drills available");
  });

  it("throws and error if the oil reserve is still recovering", () => {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    expect(() =>
      drillOilReserve({
        action: {
          id: "1",
          type: "oilReserve.drilled",
        },
        state: {
          ...TEST_FARM,
          inventory: {
            "Oil Drill": new Decimal(1),
          },
          oilReserves: {
            "1": {
              x: 1,
              y: 1,
              createdAt: now,
              drilled: 0,
              oil: {
                drilledAt: now - oneHour,
              },
            },
          },
        },
        createdAt: now,
      }),
    ).toThrow("Oil reserve is still recovering");
  });

  it("drills the oil reserve", () => {
    const now = Date.now();

    const game = drillOilReserve({
      action: {
        id: "1",
        type: "oilReserve.drilled",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Oil Drill": new Decimal(2),
        },
        oilReserves: {
          "1": {
            x: 1,
            y: 1,
            createdAt: now,
            drilled: 0,
            oil: {
              drilledAt: 0,
            },
          },
        },
      },
      createdAt: now,
    });

    const reserve = game.oilReserves["1"];

    expect(reserve.oil.drilledAt).toBe(now);
    expect(reserve.drilled).toBe(1);
    expect(game.inventory["Oil Drill"]?.toNumber()).toBe(1);
    expect(game.inventory.Oil?.toNumber()).toEqual(BASE_OIL_DROP_AMOUNT);
  });

  it("drills the oil reserve without oil drill with infernal drill equipped", () => {
    const now = Date.now();

    const game = drillOilReserve({
      action: {
        id: "1",
        type: "oilReserve.drilled",
      },
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...TEST_BUMPKIN,
          equipped: {
            ...TEST_BUMPKIN.equipped,
            secondaryTool: "Infernal Drill",
          },
        },
        inventory: {
          "Oil Drill": new Decimal(2),
        },
        oilReserves: {
          "1": {
            x: 1,
            y: 1,
            createdAt: now,
            drilled: 0,
            oil: {
              drilledAt: 0,
            },
          },
        },
      },
      createdAt: now,
    });

    const reserve = game.oilReserves["1"];

    expect(reserve.oil.drilledAt).toBe(now);
    expect(reserve.drilled).toBe(1);
    expect(game.inventory["Oil Drill"]?.toNumber()).toBe(2);
    expect(game.inventory.Oil?.toNumber()).toEqual(BASE_OIL_DROP_AMOUNT);
  });

  it("sets a +20 bonus on every third drill", () => {
    const now = Date.now();

    const game = drillOilReserve({
      action: {
        id: "1",
        type: "oilReserve.drilled",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Oil Drill": new Decimal(2),
        },
        oilReserves: {
          "1": {
            x: 1,
            y: 1,
            createdAt: now,
            drilled: 1,
            oil: {
              drilledAt: 0,
            },
          },
        },
      },
      createdAt: now,
    });

    const reserve = game.oilReserves["1"];

    expect(reserve.oil.drilledAt).toBe(now);
    expect(reserve.drilled).toBe(2);
    expect(game.inventory["Oil Drill"]?.toNumber()).toBe(1);
    expect(game.inventory.Oil?.toNumber()).toEqual(BASE_OIL_DROP_AMOUNT);
  });

  it("gives a +20 bonus on every third drill", () => {
    const now = Date.now();

    // Drill the reserve twice
    const firstState = drillOilReserve({
      action: {
        id: "1",
        type: "oilReserve.drilled",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Oil Drill": new Decimal(3),
        },
        oilReserves: {
          "1": {
            x: 1,
            y: 1,
            createdAt: now,
            drilled: 1,
            oil: {
              drilledAt: 0,
            },
          },
        },
      },
      createdAt: now,
    });

    // move time forward 21 hrs
    const futureTime = now + 21 * 60 * 60 * 1000;

    const game = drillOilReserve({
      action: {
        id: "1",
        type: "oilReserve.drilled",
      },
      createdAt: futureTime,
      state: {
        ...firstState,
      },
    });

    const reserve = game.oilReserves["1"];
    const baseAmountPlusBonus = BASE_OIL_DROP_AMOUNT + OIL_BONUS_DROP_AMOUNT;
    const expectedOil = firstState.inventory.Oil?.add(baseAmountPlusBonus);

    expect(reserve.oil.drilledAt).toBe(futureTime);
    expect(reserve.drilled).toBe(3);
    expect(game.inventory["Oil Drill"]?.toNumber()).toBe(1);
    expect(game.inventory.Oil).toStrictEqual(expectedOil);
  });

  it("gives a +0.05 Bonus with Battle Fish", () => {
    const boost = 0.05;
    const now = Date.now();

    const game = drillOilReserve({
      action: {
        id: "1",
        type: "oilReserve.drilled",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Oil Drill": new Decimal(2),
          "Battle Fish": new Decimal(1),
        },
        collectibles: {
          "Battle Fish": [
            {
              id: "123",
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
        oilReserves: {
          "1": {
            x: 1,
            y: 1,
            createdAt: now,
            drilled: 0,
            oil: {
              drilledAt: 0,
            },
          },
        },
      },
      createdAt: now,
    });

    expect(game.inventory.Oil).toEqual(
      new Decimal(BASE_OIL_DROP_AMOUNT + boost),
    );
  });

  it("gives a +5 boost with Oil Gallon equipped", () => {
    const now = Date.now();

    const game = drillOilReserve({
      action: {
        id: "1",
        type: "oilReserve.drilled",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Oil Drill": new Decimal(2),
        },
        oilReserves: {
          "1": {
            x: 1,
            y: 1,
            createdAt: now,
            drilled: 0,
            oil: {
              drilledAt: 0,
            },
          },
        },
        bumpkin: {
          ...TEST_BUMPKIN,
          equipped: {
            ...TEST_BUMPKIN.equipped,
            secondaryTool: "Oil Gallon",
          },
        },
      },
    });

    expect(game.inventory.Oil).toEqual(new Decimal(BASE_OIL_DROP_AMOUNT + 5));
  });

  it("gives a +0.1 Bonus with Knight Chicken", () => {
    const boost = 0.1;
    const now = Date.now();

    const game = drillOilReserve({
      action: {
        id: "1",
        type: "oilReserve.drilled",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Oil Drill": new Decimal(2),
          "Knight Chicken": new Decimal(1),
        },
        collectibles: {
          "Knight Chicken": [
            {
              id: "123",
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
        oilReserves: {
          "1": {
            x: 1,
            y: 1,
            createdAt: now,
            drilled: 0,
            oil: {
              drilledAt: 0,
            },
          },
        },
      },
      createdAt: now,
    });

    expect(game.inventory.Oil).toEqual(
      new Decimal(BASE_OIL_DROP_AMOUNT + boost),
    );
  });

  it("gives a +2 boost with Oil Can equipped", () => {
    const now = Date.now();

    const game = drillOilReserve({
      action: {
        id: "1",
        type: "oilReserve.drilled",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Oil Drill": new Decimal(2),
        },
        oilReserves: {
          "1": {
            x: 1,
            y: 1,
            createdAt: now,
            drilled: 0,
            oil: {
              drilledAt: 0,
            },
          },
        },
        bumpkin: {
          ...TEST_BUMPKIN,
          equipped: {
            ...TEST_BUMPKIN.equipped,
            tool: "Oil Can",
          },
        },
      },
    });

    expect(game.inventory.Oil).toEqual(new Decimal(BASE_OIL_DROP_AMOUNT + 2));
  });

  it("gives a +10 Bonus with Oil Overalls", () => {
    const boost = 10;
    const now = Date.now();

    const game = drillOilReserve({
      action: {
        id: "1",
        type: "oilReserve.drilled",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Oil Drill": new Decimal(2),
        },
        bumpkin: {
          ...TEST_BUMPKIN,
          equipped: {
            ...TEST_BUMPKIN.equipped,
            pants: "Oil Overalls",
          },
        },
        oilReserves: {
          "1": {
            x: 1,
            y: 1,
            createdAt: now,
            drilled: 0,
            oil: {
              drilledAt: 0,
            },
          },
        },
      },
      createdAt: now,
    });

    expect(game.inventory.Oil).toEqual(
      new Decimal(BASE_OIL_DROP_AMOUNT + boost),
    );
  });
  it("gives a +1 Bonus with Oil Extraction", () => {
    const boost = 1;
    const now = Date.now();

    const game = drillOilReserve({
      action: {
        id: "1",
        type: "oilReserve.drilled",
      },
      state: {
        ...TEST_FARM,
        bumpkin: { ...TEST_FARM.bumpkin, skills: { "Oil Extraction": 1 } },
        inventory: { "Oil Drill": new Decimal(1) },
        oilReserves: {
          "1": {
            x: 1,
            y: 1,
            createdAt: now,
            drilled: 0,
            oil: {
              drilledAt: 0,
            },
          },
        },
      },
    });

    expect(game.inventory.Oil).toEqual(
      new Decimal(BASE_OIL_DROP_AMOUNT + boost),
    );
  });

  it("gives a +12.15 Bonus with Battle Fish, Knight Chicken, Oil Overalls and Oil Can", () => {
    const boost = 12.15;
    const now = Date.now();

    const game = drillOilReserve({
      action: {
        id: "1",
        type: "oilReserve.drilled",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Oil Drill": new Decimal(2),
          "Battle Fish": new Decimal(1),
          "Knight Chicken": new Decimal(1),
        },
        bumpkin: {
          ...TEST_BUMPKIN,
          equipped: {
            ...TEST_BUMPKIN.equipped,
            pants: "Oil Overalls",
            tool: "Oil Can",
          },
        },
        collectibles: {
          "Battle Fish": [
            {
              id: "123",
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              readyAt: 0,
            },
          ],
          "Knight Chicken": [
            {
              id: "123",
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
        oilReserves: {
          "1": {
            x: 1,
            y: 1,
            createdAt: now,
            drilled: 0,
            oil: {
              drilledAt: 0,
            },
          },
        },
      },
      createdAt: now,
    });

    expect(game.inventory.Oil).toEqual(
      new Decimal(BASE_OIL_DROP_AMOUNT + boost),
    );
  });

  // Legacy (flag-off) back-date model: getDrilledAt returns a past timestamp. Under
  // SPEED_BOOSTS these permanent boosts are baked into baseDurationMs instead (see
  // the windowed describe below), so pin these to mainnet.
  describe("getDrilledAt (legacy back-date, mainnet)", () => {
    const originalNetwork = CONFIG.NETWORK;
    beforeAll(() => {
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "mainnet";
    });
    afterAll(() => {
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = originalNetwork;
    });

    it("replenishes oil twice as fast with Dev Wrench", () => {
      const now = Date.now();

      const { time } = getDrilledAt({
        game: {
          ...TEST_FARM,
          bumpkin: {
            ...TEST_BUMPKIN,
            equipped: {
              ...TEST_BUMPKIN.equipped,
              tool: "Dev Wrench",
            },
          },
        },
        createdAt: now,
      });

      expect(time).toEqual(now - OIL_RESERVE_RECOVERY_TIME * 0.5 * 1000);
    });

    it("replenishes oil in 20% less time with Oil Be Back", () => {
      const now = Date.now();

      const { time } = getDrilledAt({
        game: {
          ...TEST_FARM,
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: { "Oil Be Back": 1 },
          },
        },
        createdAt: now,
      });

      expect(time).toEqual(now - OIL_RESERVE_RECOVERY_TIME * 0.2 * 1000);
    });
  });

  // FE + BE jest run amoy, so SPEED_BOOSTS is ON by default here.
  describe("SPEED_BOOSTS (windowed)", () => {
    const HOUR = 60 * 60 * 1000;
    const BASE_MS = OIL_RESERVE_RECOVERY_TIME * 1000;

    it("stores the real drill time + a permanent-only baseDurationMs", () => {
      const now = Date.now();
      const game = drillOilReserve({
        action: { id: "1", type: "oilReserve.drilled" },
        state: {
          ...TEST_FARM,
          inventory: { "Oil Drill": new Decimal(2) },
          oilReserves: {
            "1": {
              x: 1,
              y: 1,
              createdAt: 0,
              drilled: 0,
              oil: { drilledAt: 0 },
            },
          },
        },
        createdAt: now,
      });
      const reserve = game.oilReserves["1"];
      expect(reserve.oil.drilledAt).toBe(now);
      expect(reserve.oil.baseDurationMs).toBe(BASE_MS);
    });

    it("bakes permanent boosts (Dev Wrench x0.5) into baseDurationMs, not a back-date", () => {
      const now = Date.now();
      const game = drillOilReserve({
        action: { id: "1", type: "oilReserve.drilled" },
        state: {
          ...TEST_FARM,
          inventory: { "Oil Drill": new Decimal(2) },
          bumpkin: {
            ...TEST_BUMPKIN,
            equipped: { ...TEST_BUMPKIN.equipped, tool: "Dev Wrench" },
          },
          oilReserves: {
            "1": {
              x: 1,
              y: 1,
              createdAt: 0,
              drilled: 0,
              oil: { drilledAt: 0 },
            },
          },
        },
        createdAt: now,
      });
      const reserve = game.oilReserves["1"];
      expect(reserve.oil.drilledAt).toBe(now);
      expect(reserve.oil.baseDurationMs).toBe(BASE_MS * 0.5);
    });

    it("excludes the Stag Shrine time half from baseDurationMs and boostsUsed", () => {
      const now = Date.now();
      const game: GameState = {
        ...TEST_FARM,
        collectibles: {
          "Stag Shrine": [
            {
              id: "1",
              coordinates: { x: 3, y: 3 },
              createdAt: now,
              readyAt: now,
            },
          ],
        },
      };
      const { time, baseDurationMs, boostsUsed } = getDrilledAt({
        game,
        createdAt: now,
      });
      expect(time).toBe(now);
      // Stag Shrine's time half is a window, NOT baked into baseDurationMs.
      expect(baseDurationMs).toBe(BASE_MS);
      expect(boostsUsed.map((b) => b.name)).not.toContain("Stag Shrine");
    });

    it("keeps the +15 Stag Shrine yield on the 3rd drill (yield half stays baked)", () => {
      const now = Date.now();
      const game = drillOilReserve({
        action: { id: "1", type: "oilReserve.drilled" },
        state: {
          ...TEST_FARM,
          inventory: { "Oil Drill": new Decimal(2) },
          collectibles: {
            "Stag Shrine": [
              {
                id: "1",
                coordinates: { x: 3, y: 3 },
                createdAt: now,
                readyAt: now,
              },
            ],
          },
          oilReserves: {
            "1": {
              x: 1,
              y: 1,
              createdAt: 0,
              drilled: 2,
              oil: { drilledAt: 0 },
            },
          },
        },
        createdAt: now,
      });
      expect(game.inventory.Oil?.toNumber()).toBe(
        BASE_OIL_DROP_AMOUNT + OIL_BONUS_DROP_AMOUNT + 15,
      );
    });

    it("readies a reserve 1.35x sooner under an active Stag Shrine", () => {
      const now = Date.now();
      const game: GameState = {
        ...TEST_FARM,
        collectibles: {
          "Stag Shrine": [
            {
              id: "1",
              coordinates: { x: 3, y: 3 },
              createdAt: now,
              readyAt: now,
            },
          ],
        },
        oilReserves: {
          "1": {
            x: 1,
            y: 1,
            createdAt: now,
            drilled: 1,
            oil: { drilledAt: now, baseDurationMs: BASE_MS },
          },
        },
      };
      const reserve = game.oilReserves["1"];
      const readyAt = getOilReserveReadyAt(reserve, game);
      // The whole recovery falls inside the 7-day Stag window → base / 1.35.
      expect(readyAt - now).toBeCloseTo(BASE_MS / 1.35, 0);
      expect(canDrillOilReserve(reserve, game, readyAt + 1)).toBe(true);
      expect(canDrillOilReserve(reserve, game, readyAt - 1)).toBe(false);
    });

    it("credits an expired/partial Stag Shrine window to an in-progress reserve", () => {
      const T0 = Date.now();
      const base = 20 * HOUR;
      const game: GameState = {
        ...TEST_FARM,
        collectibles: {
          "Stag Shrine": [
            {
              id: "1",
              coordinates: { x: 3, y: 3 },
              createdAt: T0,
              removedAt: T0 + 10 * HOUR, // active only the first 10h
              readyAt: T0,
            },
          ],
        },
        oilReserves: {
          "1": {
            x: 1,
            y: 1,
            createdAt: T0,
            drilled: 1,
            oil: { drilledAt: T0, baseDurationMs: base },
          },
        },
      };
      // 10h @1.35 = 13.5h of work, leaving 6.5h @1x → readyAt = T0 + 16.5h.
      expect(getOilReserveReadyAt(game.oilReserves["1"], game)).toBe(
        T0 + 16.5 * HOUR,
      );
    });

    it("is not drillable exactly at readyAt (strict >)", () => {
      const now = Date.now();
      const game: GameState = {
        ...TEST_FARM,
        oilReserves: {
          "1": {
            x: 1,
            y: 1,
            createdAt: now,
            drilled: 1,
            oil: { drilledAt: now, baseDurationMs: BASE_MS },
          },
        },
      };
      const reserve = game.oilReserves["1"];
      const readyAt = getOilReserveReadyAt(reserve, game); // no window → now + base
      expect(readyAt).toBe(now + BASE_MS);
      expect(canDrillOilReserve(reserve, game, readyAt)).toBe(false);
      expect(canDrillOilReserve(reserve, game, readyAt + 1)).toBe(true);
    });
  });

  // getOilReserveReadyAt keys off the baseDurationMs marker, NOT the flag, so a
  // reserve drilled while the flag was on keeps windowed timing on rollback.
  describe("getOilReserveReadyAt keeps windowed timing on mainnet", () => {
    const originalNetwork = CONFIG.NETWORK;
    beforeAll(() => {
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "mainnet";
    });
    afterAll(() => {
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = originalNetwork;
    });

    it("uses computeReadyAt for a baseDurationMs reserve even flag-off", () => {
      const now = Date.now();
      const base = OIL_RESERVE_RECOVERY_TIME * 1000;
      const game: GameState = {
        ...TEST_FARM,
        collectibles: {
          "Stag Shrine": [
            {
              id: "1",
              coordinates: { x: 3, y: 3 },
              createdAt: now,
              readyAt: now,
            },
          ],
        },
        oilReserves: {
          "1": {
            x: 1,
            y: 1,
            createdAt: now,
            drilled: 1,
            oil: { drilledAt: now, baseDurationMs: base },
          },
        },
      };
      expect(
        getOilReserveReadyAt(game.oilReserves["1"], game) - now,
      ).toBeCloseTo(base / 1.35, 0);
    });
  });

  // Regression: a fresh drill rebuilds the timer, so a flag-off re-drill CLEARS any
  // prior windowed marker and reverts the reserve to legacy — mirrors stone/tree
  // re-mine/re-chop, and prevents a stale marker (e.g. Grease Lightning's 0) from
  // mis-timing the next recovery.
  describe("flag-off re-drill reverts a windowed reserve to legacy", () => {
    const originalNetwork = CONFIG.NETWORK;
    beforeAll(() => {
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "mainnet";
    });
    afterAll(() => {
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = originalNetwork;
    });

    const BASE_MS = OIL_RESERVE_RECOVERY_TIME * 1000;

    it("clears a Grease-Lightning'd (baseDurationMs 0) marker instead of leaving it stale", () => {
      const now = Date.now();
      const game = drillOilReserve({
        action: { id: "1", type: "oilReserve.drilled" },
        state: {
          ...TEST_FARM,
          inventory: { "Oil Drill": new Decimal(2) },
          oilReserves: {
            "1": {
              x: 1,
              y: 1,
              createdAt: 0,
              drilled: 1,
              oil: { drilledAt: 1, baseDurationMs: 0 },
            },
          },
        },
        createdAt: now,
      });
      const reserve = game.oilReserves["1"];
      // Marker cleared → legacy. No boosts → drilledAt == now (buffMs 0).
      expect(reserve.oil.baseDurationMs).toBeUndefined();
      expect(reserve.oil.drilledAt).toBe(now);
      // No longer instantly ready.
      expect(canDrillOilReserve(reserve, game, now)).toBe(false);
      expect(getOilReserveReadyAt(reserve, game)).toBe(now + BASE_MS);
    });

    it("clears a stale marker and back-dates with permanent boosts (Dev Wrench x0.5)", () => {
      const now = Date.now();
      const game = drillOilReserve({
        action: { id: "1", type: "oilReserve.drilled" },
        state: {
          ...TEST_FARM,
          inventory: { "Oil Drill": new Decimal(2) },
          bumpkin: {
            ...TEST_BUMPKIN,
            equipped: { ...TEST_BUMPKIN.equipped, tool: "Dev Wrench" },
          },
          oilReserves: {
            "1": {
              x: 1,
              y: 1,
              createdAt: 0,
              drilled: 1,
              // A stale marker from a prior windowed cycle.
              oil: { drilledAt: 1, baseDurationMs: 999 },
            },
          },
        },
        createdAt: now,
      });
      const reserve = game.oilReserves["1"];
      // Marker cleared; legacy back-date folds in the permanent Dev Wrench (x0.5).
      expect(reserve.oil.baseDurationMs).toBeUndefined();
      expect(reserve.oil.drilledAt).toBe(now - BASE_MS * 0.5);
    });
  });
});
