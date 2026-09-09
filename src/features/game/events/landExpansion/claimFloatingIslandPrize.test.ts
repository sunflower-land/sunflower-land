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

  /**
   * Lover's Push pays the petal puzzle's old prize - a Bronze Love Box -
   * rather than Love Charms. Mirrors the API's copy of this event, which is
   * the one that actually mints it.
   */
  describe("a puzzle that pays an item", () => {
    const claimPush = (
      state: GameState,
      amount = 0,
      createdAt = now,
    ): GameState =>
      claimFloatingIslandPrize({
        state,
        action: {
          type: "floatingIslandPrize.claimed",
          amount,
          game: "love_push",
          roundId: 1_757_000_000,
        },
        createdAt,
      });

    it("pays the item and no Love Charms", () => {
      const state = claimPush(vipFarm);

      expect(state.inventory["Bronze Love Box"]).toEqual(new Decimal(1));
      expect(state.inventory["Love Charm"]).toBeUndefined();
      expect(state.floatingIsland.prizeClaims).toEqual([
        {
          claimedAt: now,
          amount: 0,
          game: "love_push",
          roundId: 1_757_000_000,
        },
      ]);
    });

    it("ignores a Love Charm amount an older client sends", () => {
      const state = claimPush(INITIAL_FARM, 20);

      expect(state.inventory["Bronze Love Box"]).toEqual(new Decimal(1));
      expect(state.inventory["Love Charm"]).toBeUndefined();
      expect(state.floatingIsland.prizeClaims?.[0].amount).toBe(0);
    });

    it("is not refused by a Love Charm cap the player has already hit", () => {
      const spent: GameState = {
        ...INITIAL_FARM,
        floatingIsland: {
          ...INITIAL_FARM.floatingIsland,
          prizeClaims: [
            { claimedAt: now - 1000, amount: 5, game: "love_dilemma" },
          ],
        },
      };

      // The amount has to be one the cap would refuse (5 spent + 20 > 5), or
      // the claim would go through whether the item path skips the cap or not
      expect(claimPush(spent, 20).inventory["Bronze Love Box"]).toEqual(
        new Decimal(1),
      );
      expect(() =>
        claimFloatingIslandPrize({
          state: spent,
          action: {
            type: "floatingIslandPrize.claimed",
            amount: 20,
            game: "love_dilemma",
            roundId: 2,
          },
          createdAt: now,
        }),
      ).toThrow("Daily Love Charm limit reached");
    });

    it("leaves the day's Love Charm budget for the other puzzles", () => {
      expect(
        getFloatingIslandLoveCharmsRemainingToday({
          state: claimPush(INITIAL_FARM, 20),
          createdAt: now,
        }),
      ).toBe(5);
    });
  });

  /**
   * The Love Boulder's prize (a box or coins) is rolled on the API, so this
   * copy only records the claim; the server pays and the next sync brings it.
   */
  describe("a puzzle the server pays", () => {
    const claimBoulder = (
      state: GameState,
      amount = 0,
      createdAt = now,
    ): GameState =>
      claimFloatingIslandPrize({
        state,
        action: {
          type: "floatingIslandPrize.claimed",
          amount,
          game: "love_boulder",
          roundId: 1_757_000_000,
        },
        createdAt,
      });

    it("records the claim as worth 0 and pays nothing locally", () => {
      const state = claimBoulder(vipFarm);

      expect(state.inventory).toEqual(vipFarm.inventory);
      expect(state.coins).toBe(vipFarm.coins);
      expect(state.floatingIsland.prizeClaims).toEqual([
        {
          claimedAt: now,
          amount: 0,
          game: "love_boulder",
          roundId: 1_757_000_000,
        },
      ]);
    });

    it("ignores a Love Charm amount an older client sends", () => {
      const state = claimBoulder(INITIAL_FARM, 5);

      expect(state.inventory["Love Charm"]).toBeUndefined();
      expect(state.floatingIsland.prizeClaims?.[0].amount).toBe(0);
    });

    it("is not refused by a Love Charm cap the player has already hit", () => {
      const spent: GameState = {
        ...INITIAL_FARM,
        floatingIsland: {
          ...INITIAL_FARM.floatingIsland,
          prizeClaims: [
            { claimedAt: now - 1000, amount: 5, game: "love_dilemma" },
          ],
        },
      };

      expect(claimBoulder(spent, 20).floatingIsland.prizeClaims).toHaveLength(
        2,
      );
    });

    it("leaves the day's Love Charm budget for the other puzzles", () => {
      expect(
        getFloatingIslandLoveCharmsRemainingToday({
          state: claimBoulder(INITIAL_FARM, 20),
          createdAt: now,
        }),
      ).toBe(5);
    });

    it("treats the lake's Marvel the same way - same roll, same rules", () => {
      const state = claimFloatingIslandPrize({
        state: INITIAL_FARM,
        action: {
          type: "floatingIslandPrize.claimed",
          // An older client might still send a Love Charm amount
          amount: 20,
          game: "love_kraken",
          roundId: 1_757_000_001,
        },
        createdAt: now,
      });

      expect(state.inventory["Love Charm"]).toBeUndefined();
      expect(state.coins).toBe(INITIAL_FARM.coins);
      expect(state.floatingIsland.prizeClaims).toEqual([
        {
          claimedAt: now,
          amount: 0,
          game: "love_kraken",
          roundId: 1_757_000_001,
        },
      ]);
      expect(
        getFloatingIslandLoveCharmsRemainingToday({ state, createdAt: now }),
      ).toBe(5);
    });

    it("lets the Marvel and the boulder both pay on the same day", () => {
      const state = claimFloatingIslandPrize({
        state: claimBoulder(INITIAL_FARM),
        action: {
          type: "floatingIslandPrize.claimed",
          amount: 0,
          game: "love_kraken",
          roundId: 1_757_000_001,
        },
        createdAt: now,
      });

      expect(state.floatingIsland.prizeClaims).toHaveLength(2);
    });
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
