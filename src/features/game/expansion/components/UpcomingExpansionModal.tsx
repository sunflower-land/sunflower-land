import React from "react";
import { GameState } from "features/game/types/game";
import { Button } from "components/ui/Button";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getBumpkinLevel } from "features/game/lib/level";
import { SUNNYSIDE } from "assets/sunnyside";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import Decimal from "decimal.js-light";

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
  const { bumpkin } = gameState;
  //We cannot expand if there is no next expansion
  if (gameState.expansionRequirements === undefined) {
    return (
      <div>
        <img
          src={SUNNYSIDE.icons.close}
          className="absolute cursor-pointer z-20"
          onClick={onClose}
          style={{
            top: `${PIXEL_SCALE * 6}px`,
            right: `${PIXEL_SCALE * 6}px`,
            width: `${PIXEL_SCALE * 11}px`,
          }}
        />
        <div className="flex items-start">
          <span className="mr-8 text-base">
            More expansions will be available soon...
          </span>
        </div>
        <div className="flex justify-center w-1/2 my-3">
          <img
            src={SUNNYSIDE.npcs.moonseeker_walk}
            className="running"
            style={{
              height: `${PIXEL_SCALE * 17}px`,
            }}
          />
        </div>
        <Button onClick={onClose}>Back</Button>
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
      <img
        src={SUNNYSIDE.icons.close}
        className="absolute cursor-pointer z-20"
        onClick={onClose}
        style={{
          top: `${PIXEL_SCALE * 6}px`,
          right: `${PIXEL_SCALE * 6}px`,
          width: `${PIXEL_SCALE * 11}px`,
        }}
      />
      <div className="flex items-start">
        <div>
          <p className="mr-8 text-base mb-2">
            Want to expand your land and discover new resources?
          </p>

          <p className="text-xs mt-2">
            Each piece of land is a unique NFT on the blockchain.
          </p>
        </div>
      </div>
      <div className="my-2 mt-4 flex justify-between items-end">
        <div className="flex flex-col space-y-2 items-start">
          {gameState.expansionRequirements.resources?.map(
            (ingredient, index) => {
              return (
                <RequirementLabel
                  key={index}
                  type="item"
                  item={ingredient.item}
                  balance={
                    gameState.inventory[ingredient.item] ?? new Decimal(0)
                  }
                  requirement={ingredient.amount}
                />
              );
            }
          )}

          {sflRequirement && sflRequirement.gt(0) && (
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

        <div className="flex flex-col items-end">
          <div className="flex items-center mb-1">
            <RequirementLabel
              type="time"
              waitSeconds={gameState.expansionRequirements.seconds}
            />
          </div>
          <Button className="w-40" onClick={onExpand} disabled={!canExpand}>
            Expand
          </Button>
        </div>
      </div>
    </div>
  );
};
