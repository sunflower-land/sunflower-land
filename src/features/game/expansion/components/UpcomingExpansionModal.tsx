import React from "react";
import { GameState } from "features/game/types/game";
import { Button } from "components/ui/Button";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { craftingRequirementsMet } from "features/game/lib/craftingRequirement";
import { ExpansionRequirements } from "components/ui/layouts/ExpansionRequirements";

interface Props {
  gameState: GameState;
  onClose: () => void;
  onExpand: () => void;
  onConnectWallet: () => void;
  hasWallet?: boolean;
}

export const UpcomingExpansionModal: React.FC<Props> = ({
  gameState,
  onClose,
  onExpand,
  onConnectWallet,
  hasWallet = true,
}) => {
  // cannot expand if there is no next expansion
  if (gameState.expansionRequirements === undefined) {
    return (
      <div>
        <div className="flex items-start">
          <span className="m-2">More expansions will be available soon...</span>
        </div>
        <div className="flex justify-center w-1/2 mb-2">
          <img
            src={SUNNYSIDE.npcs.moonseeker_walk}
            className="running"
            style={{
              width: `${PIXEL_SCALE * 15}px`,
            }}
          />
        </div>
        <Button onClick={onClose}>Back</Button>
      </div>
    );
  }

  const resourcesRequirement = gameState.expansionRequirements.resources;
  const sflRequirement = gameState.expansionRequirements.sfl;
  const levelRequirement = gameState.expansionRequirements.bumpkinLevel;

  const canExpand = craftingRequirementsMet(gameState, {
    resources: resourcesRequirement,
    sfl: sflRequirement,
    level: levelRequirement,
  });

  return (
    <>
      <ExpansionRequirements
        gameState={gameState}
        details={{
          description: "Each piece of land is a unique NFT on the blockchain.",
        }}
        requirements={{
          resources: resourcesRequirement,
          sfl: sflRequirement,
          level: levelRequirement,
          timeSeconds: gameState.expansionRequirements.seconds,
        }}
        actionView={
          <>
            {!hasWallet ? (
              <>
                <p className="text-xs mt-2 text-center mb-2">
                  Connect a Web3 wallet to mint an{" "}
                  <span className="underline">NFT</span> piece of land on the
                  blockchain.
                </p>
                <Button onClick={onConnectWallet}>Connect Wallet</Button>
              </>
            ) : (
              <Button onClick={onExpand} disabled={!canExpand}>
                Expand
              </Button>
            )}
          </>
        }
      />
    </>
  );
};
