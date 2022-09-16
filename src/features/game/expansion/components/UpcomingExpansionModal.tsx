import React from "react";

import skeleton from "assets/npcs/skeleton_walk.gif";

import stopwatch from "assets/icons/stopwatch.png";
import hammer from "assets/icons/hammer.png";
import close from "assets/icons/close.png";

import { GameState } from "features/game/types/game";
import { Button } from "components/ui/Button";
import { Ingredients } from "./Ingredients";
import { secondsToLongString } from "lib/utils/time";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";

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
  //We cannot expand if there is no next expansion
  if (gameState.expansionRequirements === undefined) {
    return (
      <div>
        <div className="absolute w-1/3 left-2 -top-28 -z-10">
          {gameState.bumpkin && (
            <DynamicNFT bumpkinParts={gameState.bumpkin.equipped} />
          )}
        </div>
        <div className="flex items-start">
          <span>More expansions will be available soon...</span>
          <img
            src={close}
            className="h-6 ml-2 cursor-pointer"
            onClick={onClose}
          />
        </div>
        <div className="flex justify-center w-1/2 my-3">
          <img
            src={skeleton}
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

  const canExpand = hasResources && hasBalance;

  return (
    <div>
      <div className="absolute w-1/3 left-2 -top-28 -z-10">
        {gameState.bumpkin && (
          <DynamicNFT bumpkinParts={gameState.bumpkin.equipped} />
        )}
      </div>
      <div className="flex items-start">
        <span>Want to expand your land and discover new resources?</span>
        <img
          src={close}
          className="h-6 ml-2 cursor-pointer"
          onClick={onClose}
        />
      </div>
      <div className="my-2 flex justify-between items-end">
        <Ingredients
          resources={gameState.expansionRequirements.resources}
          sfl={gameState.expansionRequirements.sfl}
          gameState={gameState}
        />
        <div className="flex flex-col items-end">
          <div className="flex items-center mb-1">
            <img src={hammer} className="w-4 mr-2" />
            <img src={stopwatch} className="w-4 mr-2" />
            <span className="text-sm">
              {secondsToLongString(
                gameState.expansionRequirements.seconds.toNumber()
              )}
            </span>
          </div>
          <Button className="w-40" onClick={onExpand} disabled={!canExpand}>
            Expand
          </Button>
        </div>
      </div>
    </div>
  );
};
