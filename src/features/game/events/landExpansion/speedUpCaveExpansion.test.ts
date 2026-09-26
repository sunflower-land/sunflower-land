import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import { CAVE_TIERS } from "features/game/types/caveTiers";
import { getInstantGems } from "features/game/lib/getInstantGems";
import { CONFIG } from "lib/config";
import {
  SPEED_UP_CAVE_EXPANSION_ERRORS,
  speedUpCaveExpansion,
} from "./speedUpCaveExpansion";

const NOW = 1_700_000_000_000;
const READY_AT = NOW + CAVE_TIERS[2].buildMs;

const buildingState = ({ gems = 1000 }: { gems?: number } = {}): GameState => ({
  ...TEST_FARM,
  inventory: { ...TEST_FARM.inventory, Gem: new Decimal(gems) },
  gems: { history: {} },
  cave: {
    builtAt: 1,
    tier: 1,
    machines: { "1": {} },
    construction: { tier: 2, startedAt: NOW, readyAt: READY_AT },
  },
});

const speedUp = (state: GameState, createdAt = NOW) =>
  speedUpCaveExpansion({
    state,
    action: { type: "cave.expansionSpedUp" },
    createdAt,
  });

describe("speedUpCaveExpansion (cave.expansionSpedUp)", () => {
  it("finishes the construction now", () => {
    const next = speedUp(buildingState());
    expect(next.cave?.construction?.readyAt).toBe(NOW);
    expect(next.cave?.construction?.tier).toBe(2);
  });

  it("spends the instant-finish Gems", () => {
    const state = buildingState();
    const gems = getInstantGems({ readyAt: READY_AT, now: NOW, game: state });
    const next = speedUp(state);
    expect(gems).toBeGreaterThan(0);
    expect(next.inventory.Gem?.toNumber()).toBe(1000 - gems);
  });

  it("does not complete the expansion", () => {
    const next = speedUp(buildingState());
    expect(next.cave?.tier).toBe(1);
    expect(next.cave?.machines).toEqual({ "1": {} });
  });

  it("rejects without enough Gems", () => {
    expect(() => speedUp(buildingState({ gems: 0 }))).toThrow(
      SPEED_UP_CAVE_EXPANSION_ERRORS.INSUFFICIENT_GEMS,
    );
  });

  it("rejects once the construction is already ready", () => {
    expect(() => speedUp(buildingState(), READY_AT)).toThrow(
      SPEED_UP_CAVE_EXPANSION_ERRORS.ALREADY_READY,
    );
  });

  it("rejects without a construction", () => {
    const state = buildingState();
    expect(() =>
      speedUp({ ...state, cave: { ...state.cave!, construction: undefined } }),
    ).toThrow(SPEED_UP_CAVE_EXPANSION_ERRORS.NO_CONSTRUCTION);
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
      expect(() => speedUp(buildingState())).toThrow(
        SPEED_UP_CAVE_EXPANSION_ERRORS.NO_FEATURE_ACCESS,
      );
    });
  });
});
