import React, { useState } from "react";
import { InfoPopover } from "../common/InfoPopover";
import { FRUIT_LIFECYCLE } from "./fruits";
import { FRUIT, FruitName } from "features/game/types/fruits";
import { PIXEL_SCALE } from "features/game/lib/constants";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  fruitName: FruitName;
  hasAxes: boolean;
}

export const DeadTree = ({ fruitName, hasAxes }: Props) => {
  const { isBush } = FRUIT()[fruitName];
  const [showNoToolWarning, setShowNoToolWarning] = useState<boolean>(false);

  const handleHover = () => {
    if (!hasAxes) {
      setShowNoToolWarning(true);
    }
  };

  const handleMouseLeave = () => {
    setShowNoToolWarning(false);
  };

  return (
    <>
      <div
        className={classNames("absolute w-full h-full", {
          "cursor-not-allowed": showNoToolWarning,
          "cursor-pointer hover:img-highlight": !showNoToolWarning,
        })}
        onMouseEnter={handleHover}
        onMouseLeave={handleMouseLeave}
      >
        {/* Dead tree/bush */}
        <img
          src={FRUIT_LIFECYCLE[fruitName].dead}
          className="absolute"
          style={{
            bottom: `${PIXEL_SCALE * (isBush ? 9 : 5)}px`,
            left: `${PIXEL_SCALE * (isBush ? 8 : 4)}px`,
            width: `${PIXEL_SCALE * (isBush ? 16 : 24)}px`,
          }}
        ></img>
      </div>

      {/* No tool warning */}
      <div
        className="flex justify-center absolute w-full pointer-events-none"
        style={{
          top: `${PIXEL_SCALE * -14}px`,
        }}
      >
        <InfoPopover showPopover={showNoToolWarning}>
          <div className="flex flex-1 items-center text-xxs justify-center px-2 py-1 whitespace-nowrap">
            <img src={SUNNYSIDE.tools.axe} className="w-4 mr-1" />
            <span>No Axe Selected!</span>
          </div>
        </InfoPopover>
      </div>
    </>
  );
};
