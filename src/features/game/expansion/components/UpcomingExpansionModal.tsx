import React from "react";

import skeleton from "assets/npcs/skeleton_walk.gif";

import stopwatch from "assets/icons/stopwatch.png";
import hammer from "assets/icons/hammer.png";
import close from "assets/icons/close.png";
import heart from "assets/icons/level_up.png";
import lock from "assets/skills/lock.png";

import { GameState } from "features/game/types/game";
import { Button } from "components/ui/Button";
import { Ingredients } from "./Ingredients";
import { secondsToLongString } from "lib/utils/time";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";
import { getBumpkinLevel } from "features/game/lib/level";

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
        <div className="absolute w-48 -left-4 -top-32 -z-10">
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

  const canExpand =
    hasResources &&
    hasBalance &&
    getBumpkinLevel(bumpkin?.experience || 0) >=
      gameState.expansionRequirements.bumpkinLevel;

  return (
    <div>
      <div className="absolute w-48 -left-4 -top-32 -z-10">
        {gameState.bumpkin && (
          <DynamicNFT bumpkinParts={gameState.bumpkin.equipped} />
        )}
      </div>
      <div className="flex items-start">
        <div>
          <p>Want to expand your land and discover new resources?</p>

          <p className="text-xs mt-2 underline">
            Each piece of land is a unique NFT on the blockchain.
          </p>
        </div>
        <img
          src={close}
          className="h-6 ml-2 cursor-pointer"
          onClick={onClose}
        />
      </div>
      <div className="my-2 mt-4 flex justify-between items-end">
        <div>
          <Ingredients
            resources={gameState.expansionRequirements.resources}
            sfl={gameState.expansionRequirements.sfl}
            gameState={gameState}
          />
          {getBumpkinLevel(bumpkin?.experience || 0) <
            gameState.expansionRequirements.bumpkinLevel && (
            <div className="flex items-center mt-2">
              <img src={heart} className="h-6 ml-0.5 mr-1" />
              <span
                className="bg-error border text-xs p-1 rounded-md"
                style={{ lineHeight: "10px" }}
              >
                Lvl {gameState.expansionRequirements.bumpkinLevel}
              </span>
              <img src={lock} className="h-6  ml-2" />
            </div>
          )}
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center mb-1">
            <img src={hammer} className="w-4 mr-2" />
            <img src={stopwatch} className="w-4 mr-2" />
            <span className="text-sm">
              {secondsToLongString(gameState.expansionRequirements.seconds)}
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
