import { loadSession } from "features/game/actions/loadSession";
import { getOnChainState } from "features/game/actions/onchain";
import { getLowestGameState } from "features/game/lib/transforms";
import { GameState } from "features/game/types/game";
import { wallet } from "lib/blockchain/wallet";

export const loadUpdatedSession = async (
  farmId: number,
  farmAddress: string,
  token: string
) => {
  const onChainState = await getOnChainState({ farmAddress, id: farmId });

  const sessionId = await wallet.getSessionManager().getSessionId(farmId);

  const response = await loadSession({
    farmId,
    sessionId,
    token,
    bumpkinTokenUri: onChainState.bumpkin?.tokenURI,
  });

  const game = response?.game as GameState;

  // Whatever is lower, on chain or offchain
  const { inventory, balance } = getLowestGameState({
    first: onChainState.game,
    second: game,
  });

  return { inventory, balance, sessionId };
};
