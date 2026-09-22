import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import { CONFIG } from "lib/config";
import {
  BUILD_CAVE_ERRORS,
  CAVE_BUILD_REQUIREMENTS,
  buildCave,
} from "./buildCave";

const richSpringState = (): GameState => ({
  ...TEST_FARM,
  cave: undefined,
  island: { ...TEST_FARM.island, type: "spring" },
  coins: 1_000_000,
  inventory: {
    ...TEST_FARM.inventory,
    Wood: new Decimal(100_000),
    Stone: new Decimal(50_000),
  },
});

const build = (state: GameState, createdAt = Date.now()) =>
  buildCave({ state, action: { type: "cave.built" }, createdAt });

describe("buildCave (cave.built)", () => {
  it("builds the Cave on Spring island", () => {
    const now = 1_700_000_000_000;
    const next = build(richSpringState(), now);
    expect(next.cave).toEqual({
      builtAt: now,
      tier: 1,
      machines: { "1": {} },
    });
  });

  it("builds on an island past Spring", () => {
    const next = build({
      ...richSpringState(),
      island: { ...richSpringState().island, type: "volcano" },
    });
    expect(next.cave?.tier).toBe(1);
  });

  it("deducts the coin and inventory cost", () => {
    const before = richSpringState();
    const next = build(before);
    expect(next.coins).toBe(before.coins - CAVE_BUILD_REQUIREMENTS.coins);
    expect(next.inventory.Wood?.toNumber()).toBe(
      before.inventory
        .Wood!.minus(CAVE_BUILD_REQUIREMENTS.inventory.Wood!)
        .toNumber(),
    );
    expect(next.inventory.Stone?.toNumber()).toBe(
      before.inventory
        .Stone!.minus(CAVE_BUILD_REQUIREMENTS.inventory.Stone!)
        .toNumber(),
    );
  });

  it("rejects a build before Spring island", () => {
    expect(() =>
      build({ ...richSpringState(), island: { type: "basic" } }),
    ).toThrow(BUILD_CAVE_ERRORS.NOT_ON_SPRING);
  });

  it("rejects a second build", () => {
    const once = build(richSpringState());
    expect(() => build(once)).toThrow(BUILD_CAVE_ERRORS.ALREADY_BUILT);
  });

  it("rejects when the player lacks coins", () => {
    expect(() => build({ ...richSpringState(), coins: 0 })).toThrow(
      BUILD_CAVE_ERRORS.INSUFFICIENT_COINS,
    );
  });

  it("rejects when the player lacks inventory", () => {
    expect(() =>
      build({
        ...richSpringState(),
        inventory: { ...richSpringState().inventory, Wood: new Decimal(0) },
      }),
    ).toThrow(BUILD_CAVE_ERRORS.INSUFFICIENT_INVENTORY);
  });

  it("does not deduct cost when the build is rejected", () => {
    const before = { ...richSpringState(), coins: 0 };
    expect(() => build(before)).toThrow();
    expect(before.coins).toBe(0);
    expect(before.cave).toBeUndefined();
  });

  describe("off testnet", () => {
    // jest runs on amoy, so the flag-off path is only reachable by pretending
    // to be mainnet.
    let previousNetwork: (typeof CONFIG)["NETWORK"];

    beforeEach(() => {
      previousNetwork = CONFIG.NETWORK;
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "mainnet";
    });

    afterEach(() => {
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = previousNetwork;
    });

    it("throws without the CAVE feature flag", () => {
      expect(() => build(richSpringState())).toThrow(
        BUILD_CAVE_ERRORS.NO_FEATURE_ACCESS,
      );
    });

    it("is not unlocked by holding a Beta Pass", () => {
      expect(() =>
        build({
          ...richSpringState(),
          inventory: {
            ...richSpringState().inventory,
            "Beta Pass": new Decimal(1),
          },
        }),
      ).toThrow(BUILD_CAVE_ERRORS.NO_FEATURE_ACCESS);
    });
  });
});
