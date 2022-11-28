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
import { secondsToString } from "lib/utils/time";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getBumpkinLevel } from "features/game/lib/level";
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
  const { bumpkin } = gameState;
  //We cannot expand if there is no next expansion
  if (gameState.expansionRequirements === undefined) {
    return (
      <div>
        <img
          src={close}
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
    <div className="p-1">
      <img
        src={close}
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
              <Label type="danger">
                Lvl {gameState.expansionRequirements.bumpkinLevel}
              </Label>

              <img src={lock} className="h-6 ml-2" />
            </div>
          )}
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center mb-1">
            <img src={hammer} className="w-4 mr-2" />
            <img src={stopwatch} className="w-4 mr-2" />
            <span className="text-sm">
              {secondsToString(gameState.expansionRequirements.seconds, {
                length: "medium",
                removeTrailingZeros: true,
              })}
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
