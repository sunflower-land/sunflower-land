import { Chain, GameState } from "features/game/types/game";
import { produce } from "immer";

export type AcknowledgeOnChainAirdropAction = {
  type: "onChainAirdrop.acknowledged";
  chain: Chain;
};

type Options = {
  state: Readonly<GameState>;
  action: AcknowledgeOnChainAirdropAction;
  createdAt?: number;
};

export function acknowledgeOnChainAirdrop({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const nft = stateCopy.nfts?.[action.chain];

    if (!nft) {
      throw new Error("NFT not found");
    }

    nft.acknowledgedAt = createdAt;

    return stateCopy;
  });
}
