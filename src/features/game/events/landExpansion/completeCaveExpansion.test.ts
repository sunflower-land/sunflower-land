import { TEST_FARM } from "features/game/lib/constants";
import type { CaveBatch, GameState } from "features/game/types/game";
import { CONFIG } from "lib/config";
import {
  COMPLETE_CAVE_EXPANSION_ERRORS,
  completeCaveExpansion,
} from "./completeCaveExpansion";

const NOW = 1_700_000_000_000;
const READY_AT = NOW + 1000;

const BATCH: CaveBatch = {
  recipe: "Mushroom",
  startedAt: 0,
  readyAt: 1,
  seed: "00112233445566778899aabbccddeeff",
  dug: { "0,0": { dugAt: 2 } },
};

const buildingState = (): GameState => ({
  ...TEST_FARM,
  cave: {
    builtAt: 1,
    tier: 2,
    machines: { "1": { batch: BATCH }, "2": {} },
    construction: { tier: 3, startedAt: NOW, readyAt: READY_AT },
  },
});

const complete = (state: GameState, createdAt = READY_AT) =>
  completeCaveExpansion({
    state,
    action: { type: "cave.expansionCompleted" },
    createdAt,
  });

describe("completeCaveExpansion (cave.expansionCompleted)", () => {
  it("raises the Cave to the built tier", () => {
    expect(complete(buildingState()).cave?.tier).toBe(3);
  });

  it("adds the new tier's Myco-Composter", () => {
    expect(complete(buildingState()).cave?.machines["3"]).toEqual({});
  });

  it("clears the construction", () => {
    expect(complete(buildingState()).cave?.construction).toBeUndefined();
  });

  it("leaves the existing machines and their batches alone", () => {
    const next = complete(buildingState());
    expect(next.cave?.machines["1"]).toEqual({ batch: BATCH });
    expect(next.cave?.machines["2"]).toEqual({});
  });

  it("rejects before the construction is ready", () => {
    expect(() => complete(buildingState(), READY_AT - 1)).toThrow(
      COMPLETE_CAVE_EXPANSION_ERRORS.NOT_READY,
    );
  });

  it("rejects without a construction", () => {
    const state = buildingState();
    expect(() =>
      complete({ ...state, cave: { ...state.cave!, construction: undefined } }),
    ).toThrow(COMPLETE_CAVE_EXPANSION_ERRORS.NO_CONSTRUCTION);
  });

  it("rejects when the Cave has not been built", () => {
    expect(() => complete({ ...buildingState(), cave: undefined })).toThrow(
      COMPLETE_CAVE_EXPANSION_ERRORS.NO_CONSTRUCTION,
    );
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
      expect(() => complete(buildingState())).toThrow(
        COMPLETE_CAVE_EXPANSION_ERRORS.NO_FEATURE_ACCESS,
      );
    });
  });
});
