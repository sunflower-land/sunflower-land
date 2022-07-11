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

  const response = await loadSession({ farmId, sessionId, token });

  const game = response?.game as GameState;

  // Whatever is lower, on chain or offchain
  const availableState = getLowestGameState({
    first: onChainState.game,
    second: game,
  });

  return { inventory: availableState.inventory, sessionId };
};
