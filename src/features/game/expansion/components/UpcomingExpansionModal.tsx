import React from "react";
import { Bumpkin, GameState } from "features/game/types/game";
import { Button } from "components/ui/Button";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { craftingRequirementsMet } from "features/game/lib/craftingRequirement";
import { ExpansionRequirements } from "components/ui/layouts/ExpansionRequirements";
import { expansionRequirements } from "features/game/events/landExpansion/revealLand";
import { Label } from "components/ui/Label";

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
  const requirements = expansionRequirements({ game: gameState });

  if (
    Date.now() < new Date("2024-02-07T00:00:00.000Z").getTime() &&
    gameState.island.type === "spring" &&
    gameState.inventory["Basic Land"]?.gte(12)
  ) {
    return (
      <div className="p-2">
        <Label className="my-2" type="info" icon={SUNNYSIDE.icons.timer}>
          Coming soon
        </Label>
        <p className="text-sm">Great work Bumpkin!</p>
        <p className="text-xs my-2">
          More expansions will be available on the 7th February.
        </p>
      </div>
    );
  }

  // cannot expand if there is no next expansion
  if (requirements === undefined) {
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

  const canExpand = craftingRequirementsMet(gameState, requirements);

  return (
    <ExpansionRequirements
      inventory={gameState.inventory}
      bumpkin={gameState.bumpkin as Bumpkin}
      details={{
        description:
          "Each piece of land comes with unique resources to help build your farming empire!",
      }}
      requirements={requirements}
      actionView={
        <Button onClick={onExpand} disabled={!canExpand}>
          Expand
        </Button>
      }
    />
  );
};
