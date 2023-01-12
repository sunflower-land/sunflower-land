import React, { useContext, useState } from "react";
import classNames from "classnames";

import selectBox from "assets/ui/select/select_box.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { getTimeLeft } from "lib/utils/time";
import { PlantedFruit } from "features/game/types/game";
import { FRUIT, FRUIT_SEEDS } from "features/game/types/fruits";
import { FRUIT_LIFECYCLE } from "./fruits";
import { ProgressBar } from "components/ui/ProgressBar";
import { TimerPopover } from "../common/TimerPopover";

interface Props {
  playing: boolean;
  plantedFruit: PlantedFruit;
  onClick: () => void;
  /**
   * Handles showing "hover" information on mobile or "error" on click action information
   */
  showOnClickInfo: boolean;
}

export const getFruitImage = (imageSource: any): JSX.Element => {
  return (
    <img
      className="relative"
      style={{
        bottom: "9px",
        zIndex: "1",
        width: `${PIXEL_SCALE * 16}px`,
        height: `${PIXEL_SCALE * 26}px`,
      }}
      src={imageSource}
    />
  );
};

export const Seedling: React.FC<Props> = ({
  playing,
  plantedFruit,
  onClick,
  showOnClickInfo,
}) => {
  const { showTimers } = useContext(Context);
  const [showHoverState, setShowHoverState] = useState(false);
  const { plantedAt, name } = plantedFruit;
  const { seed } = FRUIT()[name];
  const { plantSeconds } = FRUIT_SEEDS()[seed];
  const lifecycle = FRUIT_LIFECYCLE[name];

  const growingTimeLeft = getTimeLeft(plantedAt, plantSeconds);

  const growPercentage = 100 - (growingTimeLeft / plantSeconds) * 100;
  const isAlmostReady = growPercentage >= 50;
  const isHalfway = growPercentage >= 25 && !isAlmostReady;

  return (
    <div
      onMouseEnter={() => setShowHoverState(true)}
      onMouseLeave={() => setShowHoverState(false)}
      className="flex justify-center"
      onClick={onClick}
    >
      {getFruitImage(
        isAlmostReady
          ? lifecycle.almost
          : isHalfway
          ? lifecycle.halfway
          : lifecycle.seedling
      )}

      {showTimers && (
        <div
          className="absolute"
          style={{
            top: `${PIXEL_SCALE * 24.2}px`,
            width: `${PIXEL_SCALE * 15}px`,
          }}
        >
          <ProgressBar
            percentage={growPercentage}
            seconds={growingTimeLeft}
            type={"progress"}
            formatLength="short"
          />
        </div>
      )}

      <TimerPopover
        showPopover={showHoverState || showOnClickInfo}
        image={lifecycle.ready}
        name={`${plantedFruit.name} Tree Growing`}
        timeLeft={growingTimeLeft}
        position={{ top: 8, left: 25 }}
      />

      {/* Select box */}
      {playing && (
        <img
          src={selectBox}
          className={classNames("absolute z-40 cursor-pointer", {
            "opacity-100": showHoverState,
            "opacity-0": !showHoverState,
          })}
          style={{
            top: "21px",
            width: `${PIXEL_SCALE * 16}px`,
          }}
        />
      )}
    </div>
  );
};
