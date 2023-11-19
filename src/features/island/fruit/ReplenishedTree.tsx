import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { FRUIT, FruitName } from "features/game/types/fruits";
import { FRUIT_LIFECYCLE } from "./fruits";

import { InnerPanel } from "components/ui/Panel";

import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { getBumpkinLevel } from "features/game/lib/level";

const _bumpkinLevel = (state: MachineState) =>
  getBumpkinLevel(state.context.state.bumpkin?.experience ?? 0);

interface Props {
  bumpkinLevelRequired: number;
  fruitName: FruitName;
}

export const ReplenishedTree: React.FC<Props> = ({
  bumpkinLevelRequired,
  fruitName,
}) => {
  const [showBumpkinLevel, setShowBumpkinLevel] = useState(false);

  const lifecycle = FRUIT_LIFECYCLE[fruitName];

  const { isBush } = FRUIT()[fruitName];
  const isBanana = fruitName === "Banana";

  const bottom = isBanana ? 8 : 5;
  const left = isBanana ? 1.2 : isBush ? 4 : 3;
  const width = isBanana ? 31 : isBush ? 24 : 26;

  const { gameService } = useContext(Context);
  const bumpkinLevel = useSelector(gameService, _bumpkinLevel);
  const bumpkinTooLow = bumpkinLevel < bumpkinLevelRequired;

  const handleHover = () => {
    if (bumpkinTooLow) {
      setShowBumpkinLevel(true);
    }
  };

  const handleMouseLeave = () => {
    setShowBumpkinLevel(false);
  };

  return (
    <div
      className="absolute w-full h-full cursor-pointer hover:img-highlight"
      onMouseEnter={handleHover}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={lifecycle.ready}
        className={
          bumpkinTooLow
            ? "absolute pointer-events-none opacity-50"
            : "absolute pointer-events-none"
        }
        style={{
          bottom: `${PIXEL_SCALE * bottom}px`,
          left: `${PIXEL_SCALE * left}px`,
          width: `${PIXEL_SCALE * width}px`,
        }}
      />

      {/* Bumpkin level warning */}
      {showBumpkinLevel && (
        <div
          className="flex justify-center absolute w-full pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * -14}px`,
          }}
        >
          <InnerPanel className="absolute whitespace-nowrap w-fit z-50">
            <div className="text-xxs mx-1 p-1">
              <span>Bumpkin level {bumpkinLevelRequired} required.</span>
            </div>
          </InnerPanel>
        </div>
      )}
    </div>
  );
};
