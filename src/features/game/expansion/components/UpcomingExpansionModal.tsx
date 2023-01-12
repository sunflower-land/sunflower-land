import React from "react";
import skeleton from "assets/npcs/skeleton_walk.gif";
import { GameState } from "features/game/types/game";
import { Button } from "components/ui/Button";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getBumpkinLevel } from "features/game/lib/level";
import { RequirementLabel } from "components/ui/RequirementLabel";
import Decimal from "decimal.js-light";

interface Props {
  gameState: GameState;
  onExpand: () => void;
}

export const UpcomingExpansionModal: React.FC<Props> = ({
  gameState,
  onExpand,
}) => {
  const { bumpkin } = gameState;
  // cannot expand if there is no next expansion
  if (gameState.expansionRequirements === undefined) {
    return (
      <div className="flex justify-center w-1/2 mb-2">
        <img
          src={skeleton}
          className="running"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
          }}
        />
      </div>
    );
  }

  const hasResources = gameState.expansionRequirements.resources.every(
    ({ item, amount }) => gameState.inventory[item]?.gte(amount)
  );
  const hasBalance = gameState.balance.gte(gameState.expansionRequirements.sfl);

  const canExpand =
    hasResources &&
    hasBalance &&
    getBumpkinLevel(bumpkin?.experience || 0) >=
      gameState.expansionRequirements.bumpkinLevel;

  const sflRequirement = gameState.expansionRequirements.sfl;

  return (
    <div className="p-1">
      <div className="flex items-start">
        <p className="text-xs">
          Each piece of land is a unique NFT on the blockchain.
        </p>
      </div>
      <div className="mt-4 flex justify-between items-end">
        <div className="flex flex-col space-y-2 items-start">
          {gameState.expansionRequirements.resources?.map(
            (ingredient, index) => (
              <RequirementLabel
                key={index}
                type="item"
                item={ingredient.item}
                balance={gameState.inventory[ingredient.item] ?? new Decimal(0)}
                requirement={ingredient.amount}
              />
            )
          )}
          {sflRequirement && sflRequirement.greaterThan(0) && (
            <RequirementLabel
              type="sfl"
              balance={gameState.balance}
              requirement={sflRequirement}
            />
          )}
          <RequirementLabel
            type="level"
            currentLevel={getBumpkinLevel(bumpkin?.experience || 0)}
            requirement={gameState.expansionRequirements.bumpkinLevel}
          />
        </div>

        <div className="flex flex-col space-y-2 items-end">
          <RequirementLabel
            type="time"
            waitSeconds={gameState.expansionRequirements.seconds}
          />
          <Button className="w-40" onClick={onExpand} disabled={!canExpand}>
            Expand
          </Button>
        </div>
      </div>
    </div>
  );
};
