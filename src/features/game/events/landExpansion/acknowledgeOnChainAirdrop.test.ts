import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { acknowledgeOnChainAirdrop } from "./acknowledgeOnChainAirdrop";

describe("acknowledgeOnChainAirdrop", () => {
  it("throws an error if nft is found", () => {
    expect(() =>
      acknowledgeOnChainAirdrop({
        state: TEST_FARM,
        action: { type: "onChainAirdrop.acknowledged", chain: "ronin" },
      }),
    ).toThrow();
  });

  it("should set the nft as acknowledged", () => {
    const state: GameState = {
      ...TEST_FARM,
      nfts: {
        ronin: {
          tokenId: 1,
          name: "Ronin NFT",
          expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30,
        },
      },
    };

    const acknowledgedAt = Date.now();

    const newGame = acknowledgeOnChainAirdrop({
      state,
      action: {
        type: "onChainAirdrop.acknowledged",
        chain: "ronin",
      },
      createdAt: acknowledgedAt,
    });

    expect(newGame.nfts?.ronin?.acknowledgedAt).toBe(acknowledgedAt);
  });
});
