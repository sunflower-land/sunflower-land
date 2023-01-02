import React, { useContext, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { getTimeLeft } from "lib/utils/time";
import { PlantedFruit } from "features/game/types/game";
import { ProgressBar } from "components/ui/ProgressBar";
import { Popover } from "./Popover";
import { FRUIT } from "features/game/types/fruits";
import { FRUIT_LIFECYCLE } from "./fruits";
import { setImageWidth } from "lib/images";
import { useIsMobile } from "lib/utils/hooks/useIsMobile";

interface Props {
  plantedFruit: PlantedFruit;
  onClick: () => void;
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

export const ReplenishingTree: React.FC<Props> = ({
  plantedFruit,
  onClick,
}) => {
  const { showTimers } = useContext(Context);
  const [isMobile] = useIsMobile();
  const [showFruitDetails, setFruitDetails] = useState(true);
  const { harvestedAt, name } = plantedFruit;
  const lifecycle = FRUIT_LIFECYCLE[name];

  const { harvestSeconds, isBush } = FRUIT()[name];

  const replenishingTimeLeft = getTimeLeft(harvestedAt, harvestSeconds);
  const replenishPercentage =
    100 - (replenishingTimeLeft / harvestSeconds) * 100;

  return (
    <div
      onMouseEnter={() => setFruitDetails(!isMobile)}
      onMouseLeave={() => setFruitDetails(false)}
      className="flex justify-center"
    >
      <img
        className="relative"
        style={{
          bottom: `${isBush ? "-11px" : "25px"}`,
          zIndex: "1",
        }}
        src={lifecycle.harvested}
        onLoad={(e) => setImageWidth(e.currentTarget)}
        onClick={onClick}
      />
      {showTimers && (
        <div
          className="absolute"
          style={{
            top: `${PIXEL_SCALE * 24.2}px`,
            width: `${PIXEL_SCALE * 15}px`,
          }}
        >
          <ProgressBar
            percentage={replenishPercentage}
            seconds={replenishingTimeLeft}
            type="progress"
            formatLength="short"
          />
        </div>
      )}

      <Popover
        showFruitDetails={showFruitDetails}
        lifecycle={lifecycle}
        plantedFruitName={name}
        timeLeft={replenishingTimeLeft}
      />
    </div>
  );
};
