import React, { useContext, useState } from "react";
import classNames from "classnames";

import selectBox from "assets/ui/select/select_box.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { getTimeLeft } from "lib/utils/time";
import { PlantedFruit } from "features/game/types/game";
import { FRUIT } from "features/game/types/fruits";
import { FRUIT_LIFECYCLE } from "./fruits";
import { ProgressBar } from "components/ui/ProgressBar";
import { Popover } from "./Popover";

interface Props {
  playing: boolean;
  onClick: () => void;
  plantedFruit: PlantedFruit;
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
  onClick,
  plantedFruit,
}) => {
  const { showTimers } = useContext(Context);
  const [showHoverState, setShowHoverState] = useState(false);
  const { plantedAt, name } = plantedFruit;
  const { harvestSeconds } = FRUIT()[name];
  const lifecycle = FRUIT_LIFECYCLE[name];

  const growingTimeLeft = getTimeLeft(plantedAt, harvestSeconds);

  const growPercentage = 100 - (growingTimeLeft / harvestSeconds) * 100;
  const isAlmostReady = growPercentage >= 50;
  const isHalfway = growPercentage >= 25 && !isAlmostReady;

  return (
    <div
      onMouseEnter={() => setShowHoverState(true)}
      onMouseLeave={() => setShowHoverState(false)}
      className="flex justify-center"
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

      <Popover
        showFruitDetails={showHoverState}
        lifecycle={lifecycle}
        plantedFruitName={plantedFruit.name}
        timeLeft={growingTimeLeft}
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
          onClick={() => onClick()}
        />
      )}
    </div>
  );
};
