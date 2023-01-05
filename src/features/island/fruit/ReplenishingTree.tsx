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
import { ResourceDropAnimator } from "components/animation/ResourceDropAnimator";
import { getFruitImage } from "./FruitTree";

interface Props {
  plantedFruit: PlantedFruit;
  onClick: () => void;
  playAnimation: boolean;
}

export const ReplenishingTree: React.FC<Props> = ({
  plantedFruit,
  onClick,
  playAnimation,
}) => {
  const { showTimers } = useContext(Context);
  const [isMobile] = useIsMobile();
  const [showFruitDetails, setFruitDetails] = useState(false);
  const { harvestedAt, name, amount } = plantedFruit;
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
      <ResourceDropAnimator
        mainImageProps={{
          src: lifecycle.harvested,
          className: "relative hover:img-highlight",
          style: {
            bottom: `${isBush ? "-11px" : "25px"}`,
            zIndex: "1",
          },
          onLoad: (e) => setImageWidth(e.currentTarget),
          onClick: onClick,
        }}
        dropImageProps={{
          src: getFruitImage(name),
        }}
        dropCount={amount}
        playDropAnimation={playAnimation}
        playShakeAnimation={playAnimation}
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
