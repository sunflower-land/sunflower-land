import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
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
});
