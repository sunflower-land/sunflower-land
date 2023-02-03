import { loadSession } from "features/game/actions/loadSession";
import { getOnChainState } from "features/game/actions/onchain";
import { getAvailableGameState } from "features/game/lib/transforms";
import { GameState } from "features/game/types/game";
import { getSessionId } from "lib/blockchain/Sessions";
import { wallet } from "lib/blockchain/wallet";

export const loadUpdatedSession = async (
  farmId: number,
  farmAddress: string,
  token: string,
  transactionId: string
) => {
  const onChainState = await getOnChainState({ farmAddress, id: farmId });

  const sessionId = await getSessionId(
    wallet.web3Provider,
    wallet.myAccount,
    farmId
  );

  const response = await loadSession({
    farmId,
    sessionId,
    token,
    bumpkinTokenUri: onChainState.bumpkin?.tokenURI,
    transactionId,
  });

  const game = response?.game as GameState;
  const deviceTrackerId = response?.deviceTrackerId as string;

  // Whatever is lower, on chain or off-chain
  const { inventory, balance } = getAvailableGameState({
    onChain: onChainState.game,
    offChain: game,
  });

  return { inventory, balance, sessionId, deviceTrackerId };
};
