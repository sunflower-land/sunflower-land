import React from "react";

import { getTimeLeft } from "lib/utils/time";
import { setImageWidth } from "lib/images";
import { PlantedFruit } from "features/game/types/game";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { FRUIT } from "features/game/types/fruits";
import { FRUIT_LIFECYCLE } from "./fruits";
import { Soil } from "./Soil";

import { Seedling } from "./Seedling";
import { ReplenishingTree } from "./ReplenishingTree";

interface Props {
  plantedFruit?: PlantedFruit;
  playing: boolean;
  plantTree: () => void;
  harvestFruit: () => void;
  removeTree: () => void;
  onError: () => void;
}

export const FruitTree: React.FC<Props> = ({
  plantedFruit,
  plantTree,
  harvestFruit,
  removeTree,
  onError,
  playing,
}) => {
  useUiRefresher({ active: !!plantedFruit });

  if (!plantedFruit) {
    return <Soil playing={playing} onClick={plantTree} />;
  }

  const { harvestSeconds, isBush } = FRUIT()[plantedFruit.name];
  const lifecycle = FRUIT_LIFECYCLE[plantedFruit.name];

  // Dead tree
  if (!plantedFruit.harvestsLeft) {
    return (
      <img
        className="relative cursor-pointer hover:img-highlight"
        style={{
          bottom: "-10px",
          zIndex: "1",
        }}
        src={lifecycle.dead}
        onLoad={(e) => setImageWidth(e.currentTarget)}
        onClick={removeTree}
      />
    );
  }

  // Replenishing tree
  if (plantedFruit.harvestedAt) {
    const replenishingTimeLeft = getTimeLeft(
      plantedFruit.harvestedAt,
      harvestSeconds
    );

    if (replenishingTimeLeft > 0) {
      return <ReplenishingTree onClick={onError} plantedFruit={plantedFruit} />;
    }
  }

  // Seedling
  const growingTimeLeft = getTimeLeft(plantedFruit.plantedAt, harvestSeconds);

  if (growingTimeLeft > 0) {
    return (
      <Seedling
        onClick={onError}
        playing={playing}
        plantedFruit={plantedFruit}
      />
    );
  }

  // Ready tree
  return (
    <div className="flex justify-center cursor-pointer h-full w-full hover:img-highlight">
      <img
        className="relative"
        style={{
          bottom: `${isBush ? "-11px" : "25px"}`,
          zIndex: "1",
        }}
        src={lifecycle.ready}
        onLoad={(e) => setImageWidth(e.currentTarget)}
        onClick={harvestFruit}
      />
    </div>
  );
};
