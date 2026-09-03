import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import {
  claimFloatingIslandPrize,
  getFloatingIslandClaimsToday,
  getFloatingIslandDailyLoveCharmLimit,
  getFloatingIslandLoveCharmsClaimedToday,
  getFloatingIslandLoveCharmsRemainingToday,
} from "./claimFloatingIslandPrize";

const ONE_DAY = 24 * 60 * 60 * 1000;

describe("claimFloatingIslandPrize", () => {
  // Midday UTC so "today" is unambiguous across the whole test
  const now = new Date("2026-09-03T12:00:00Z").getTime();

  const vipFarm: GameState = {
    ...INITIAL_FARM,
    vip: { bundles: [], expiresAt: now + 30 * ONE_DAY },
  };

  const claim = (
    state: GameState,
    amount: number,
    createdAt = now,
  ): GameState =>
    claimFloatingIslandPrize({
      state,
      action: { type: "floatingIslandPrize.claimed", amount },
      createdAt,
    });

  it("rewards the Love Charms and records the claim", () => {
    const state = claim(vipFarm, 20);

    expect(state.inventory["Love Charm"]).toEqual(new Decimal(20));
    expect(state.floatingIsland.prizeClaims).toEqual([
      { claimedAt: now, amount: 20 },
    ]);
  });

  it("rejects a second claim for the same game and round", () => {
    const state = claimFloatingIslandPrize({
      state: vipFarm,
      action: {
        type: "floatingIslandPrize.claimed",
        amount: 5,
        game: "love_dilemma",
        roundId: 100,
      },
      createdAt: now,
    });

    expect(() =>
      claimFloatingIslandPrize({
        state,
        action: {
          type: "floatingIslandPrize.claimed",
          amount: 5,
          game: "love_dilemma",
          roundId: 100,
        },
        createdAt: now + 1000,
      }),
    ).toThrow("Prize already claimed for this round");
  });

  it("allows the same round id across different games and new rounds", () => {
    let state = claimFloatingIslandPrize({
      state: vipFarm,
      action: {
        type: "floatingIslandPrize.claimed",
        amount: 5,
        game: "love_dilemma",
        roundId: 100,
      },
      createdAt: now,
    });
    state = claimFloatingIslandPrize({
      state,
      action: {
        type: "floatingIslandPrize.claimed",
        amount: 5,
        game: "petal_puzzle",
        roundId: 100,
      },
      createdAt: now,
    });
    state = claimFloatingIslandPrize({
      state,
      action: {
        type: "floatingIslandPrize.claimed",
        amount: 5,
        game: "love_dilemma",
        roundId: 101,
      },
      createdAt: now,
    });

    expect(state.floatingIsland.prizeClaims).toEqual([
      { claimedAt: now, amount: 5, game: "love_dilemma", roundId: 100 },
      { claimedAt: now, amount: 5, game: "petal_puzzle", roundId: 100 },
      { claimedAt: now, amount: 5, game: "love_dilemma", roundId: 101 },
    ]);
  });

  it("rejects a fractional round id", () => {
    expect(() =>
      claimFloatingIslandPrize({
        state: vipFarm,
        action: {
          type: "floatingIslandPrize.claimed",
          amount: 5,
          game: "love_dilemma",
          roundId: 1.5,
        },
        createdAt: now,
      }),
    ).toThrow("Invalid round");
  });

  it("records which puzzle paid out when given", () => {
    const state = claimFloatingIslandPrize({
      state: vipFarm,
      action: {
        type: "floatingIslandPrize.claimed",
        amount: 5,
        game: "petal_puzzle",
      },
      createdAt: now,
    });

    expect(state.floatingIsland.prizeClaims).toEqual([
      { claimedAt: now, amount: 5, game: "petal_puzzle" },
    ]);
  });

  it("adds to an existing Love Charm balance", () => {
    const state = claim(
      { ...vipFarm, inventory: { "Love Charm": new Decimal(7) } },
      3,
    );

    expect(state.inventory["Love Charm"]).toEqual(new Decimal(10));
  });

  it("allows a claim of 0 Love Charms", () => {
    const state = claim(vipFarm, 0);

    expect(state.inventory["Love Charm"]).toEqual(new Decimal(0));
    expect(state.floatingIsland.prizeClaims).toHaveLength(1);
  });

  it("rejects a negative amount", () => {
    expect(() => claim(vipFarm, -1)).toThrow("Invalid prize amount");
  });

  it("rejects a fractional amount", () => {
    expect(() => claim(vipFarm, 1.5)).toThrow("Invalid prize amount");
  });

  it("rejects a single claim above 100", () => {
    expect(() => claim(vipFarm, 101)).toThrow("Prize amount exceeds maximum");
  });

  it("lets a VIP claim multiple times up to 100 in a day", () => {
    let state = claim(vipFarm, 40);
    state = claim(state, 30);
    state = claim(state, 30);

    expect(state.inventory["Love Charm"]).toEqual(new Decimal(100));
    expect(state.floatingIsland.prizeClaims).toHaveLength(3);
  });

  it("throws once a VIP would exceed 100 Love Charms in a day", () => {
    let state = claim(vipFarm, 60);
    state = claim(state, 40);

    expect(() => claim(state, 1)).toThrow("Daily Love Charm limit reached");
  });

  it("caps non-VIP players at 5 Love Charms in a day", () => {
    let state = claim(INITIAL_FARM, 3);
    state = claim(state, 2);

    expect(state.inventory["Love Charm"]).toEqual(new Decimal(5));
    expect(() => claim(state, 1)).toThrow("Daily Love Charm limit reached");
  });

  it("rejects a single non-VIP claim above 5", () => {
    expect(() => claim(INITIAL_FARM, 6)).toThrow(
      "Daily Love Charm limit reached",
    );
  });

  it("counts a trial VIP as VIP", () => {
    const state = claim(
      {
        ...INITIAL_FARM,
        vip: { bundles: [], expiresAt: 0, trialStartedAt: now },
      },
      50,
    );

    expect(state.inventory["Love Charm"]).toEqual(new Decimal(50));
  });

  it("throws after 10 claims in a day even if under the Love Charm cap", () => {
    let state = vipFarm;
    for (let i = 0; i < 10; i++) {
      state = claim(state, 1);
    }

    expect(state.floatingIsland.prizeClaims).toHaveLength(10);
    expect(() => claim(state, 1)).toThrow("Daily claim limit reached");
  });

  it("resets the limits on a new UTC day and drops old claims", () => {
    let state = claim(vipFarm, 100);
    expect(() => claim(state, 1)).toThrow("Daily Love Charm limit reached");

    const tomorrow = now + ONE_DAY;
    state = claim(state, 100, tomorrow);

    expect(state.inventory["Love Charm"]).toEqual(new Decimal(200));
    expect(state.floatingIsland.prizeClaims).toEqual([
      { claimedAt: tomorrow, amount: 100 },
    ]);
  });

  it("treats claims just before UTC midnight as the previous day", () => {
    const lateLastNight = new Date("2026-09-02T23:59:59Z").getTime();
    let state = claim(vipFarm, 100, lateLastNight);

    state = claim(state, 100, now);

    expect(state.inventory["Love Charm"]).toEqual(new Decimal(200));
  });

  describe("helpers", () => {
    it("reports today's claims and total", () => {
      let state = claim(vipFarm, 10, now - ONE_DAY);
      state = claim(state, 15);
      state = claim(state, 25);

      expect(getFloatingIslandClaimsToday({ state, createdAt: now })).toEqual([
        { claimedAt: now, amount: 15 },
        { claimedAt: now, amount: 25 },
      ]);
      expect(
        getFloatingIslandLoveCharmsClaimedToday({ state, createdAt: now }),
      ).toBe(40);
    });

    it("reports the Love Charms still claimable today", () => {
      expect(
        getFloatingIslandLoveCharmsRemainingToday({
          state: INITIAL_FARM,
          createdAt: now,
        }),
      ).toBe(5);

      const state = claim(INITIAL_FARM, 3);
      expect(
        getFloatingIslandLoveCharmsRemainingToday({ state, createdAt: now }),
      ).toBe(2);
    });

    it("returns the VIP and non-VIP daily limits", () => {
      expect(
        getFloatingIslandDailyLoveCharmLimit({
          state: vipFarm,
          createdAt: now,
        }),
      ).toBe(100);
      expect(
        getFloatingIslandDailyLoveCharmLimit({
          state: INITIAL_FARM,
          createdAt: now,
        }),
      ).toBe(5);
    });
  });
});
