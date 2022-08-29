import { loadSession } from "features/game/actions/loadSession";
import { getOnChainState } from "features/game/actions/onchain";
import { getLowestGameState } from "features/game/lib/transforms";
import { GameState } from "features/game/types/game";
import { metamask } from "lib/blockchain/metamask";

export const loadUpdatedSession = async (
  farmId: number,
  farmAddress: string,
  token: string
) => {
  const onChainState = await getOnChainState({ farmAddress, id: farmId });

  const sessionId = await metamask.getSessionManager().getSessionId(farmId);

  const response = await loadSession({
    farmId,
    sessionId,
    token,
    bumpkinId: Number(onChainState.bumpkin?.tokenId),
  });

  const game = response?.game as GameState;

  // Whatever is lower, on chain or offchain
  const { inventory, balance } = getLowestGameState({
    first: onChainState.game,
    second: game,
  });

  return { inventory, balance, sessionId };
};
