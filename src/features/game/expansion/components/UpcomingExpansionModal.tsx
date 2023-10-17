import React from "react";
import { Bumpkin, GameState } from "features/game/types/game";
import { Button } from "components/ui/Button";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { craftingRequirementsMet } from "features/game/lib/craftingRequirement";
import { ExpansionRequirements } from "components/ui/layouts/ExpansionRequirements";

interface Props {
  gameState: GameState;
  onClose: () => void;
  onExpand: () => void;
}

export const UpcomingExpansionModal: React.FC<Props> = ({
  gameState,
  onClose,
  onExpand,
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

  const canExpand = craftingRequirementsMet(
    gameState,
    gameState.expansionRequirements
  );

  return (
    <ExpansionRequirements
      inventory={gameState.inventory}
      bumpkin={gameState.bumpkin as Bumpkin}
      details={{
        description:
          "Each piece of land comes with unique resources to help build your farming empire!",
      }}
      requirements={gameState.expansionRequirements}
      actionView={
        <Button onClick={onExpand} disabled={!canExpand}>
          Expand
        </Button>
      }
    />
  );
};
