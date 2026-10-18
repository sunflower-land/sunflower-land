import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import { CONFIG } from "lib/config";
import { airdropFlower } from "./airdropFlower";

const NOW = Date.now();

const GAME_STATE: GameState = {
  ...TEST_FARM,
  balance: new Decimal(0),
  bumpkin: INITIAL_BUMPKIN,
  // Active in-game VIP so the VIP gate passes.
  vip: {
    bundles: [],
    expiresAt: NOW + 30 * 24 * 60 * 60 * 1000,
  },
};

// The tooling only runs on the production network.
const ORIGINAL_NETWORK = CONFIG.NETWORK;
beforeAll(() => {
  (CONFIG as { NETWORK: string }).NETWORK = "mainnet";
});
afterAll(() => {
  (CONFIG as { NETWORK: string }).NETWORK = ORIGINAL_NETWORK;
});

describe("airdropFlower", () => {
  it("optimistically credits FLOWER on the client", () => {
    const state = airdropFlower({
      state: GAME_STATE,
      action: { type: "flower.airdropped", flower: 5000 },
      farmId: 1,
      createdAt: NOW,
    });

    expect(state.balance).toStrictEqual(new Decimal(5000));
  });

  it("rejects a non-positive amount", () => {
    expect(() =>
      airdropFlower({
        state: GAME_STATE,
        action: { type: "flower.airdropped", flower: -1 },
        farmId: 1,
        createdAt: NOW,
      }),
    ).toThrow("Invalid amount");
  });

  it("only runs on the production network", () => {
    (CONFIG as { NETWORK: string }).NETWORK = "amoy";

    expect(() =>
      airdropFlower({
        state: GAME_STATE,
        action: { type: "flower.airdropped", flower: 5000 },
        farmId: 1,
        createdAt: NOW,
      }),
    ).toThrow("only available on production");

    (CONFIG as { NETWORK: string }).NETWORK = "mainnet";
  });
});
