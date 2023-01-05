import React, { useState } from "react";

import { getTimeLeft } from "lib/utils/time";
import { setImageWidth } from "lib/images";
import { PlantedFruit } from "features/game/types/game";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { FRUIT, FruitName } from "features/game/types/fruits";
import { FRUIT_LIFECYCLE } from "./fruits";
import { Soil } from "./Soil";

import { Seedling } from "./Seedling";
import { ReplenishingTree } from "./ReplenishingTree";

import apple from "/src/assets/resources/apple.png";
import orange from "/src/assets/resources/orange.png";
import blueberry from "/src/assets/resources/blueberry.png";
import { ResourceDropAnimator } from "components/animation/ResourceDropAnimator";

export const getFruitImage = (fruitName: FruitName): string => {
  switch (fruitName) {
    case "Apple":
      return apple;
    case "Orange":
      return orange;
    case "Blueberry":
      return blueberry;
  }
};

interface Props {
  plantedFruit?: PlantedFruit;
  playing: boolean;
  plantTree: () => void;
  harvestFruit: () => void;
  removeTree: () => void;
  onError: () => void;
  playAnimation: boolean;
}

export const FruitTree: React.FC<Props> = ({
  plantedFruit,
  plantTree,
  harvestFruit,
  removeTree,
  onError,
  playing,
  playAnimation,
}) => {
  useUiRefresher({ active: !!plantedFruit });
  //UI Refresher reloads this component after a regular time intervals.
  //which results to pre loading of the image again and again.
  const [alreadyPreloaded, setAlreadyPreloaded] = useState(false);

  const preloadImage = (url: string) => {
    const img = new Image();
    img.src = url;
    setAlreadyPreloaded(true);
  };

  if (!plantedFruit) {
    return <Soil playing={playing} onClick={plantTree} />;
  }

  const { name, amount, harvestsLeft, harvestedAt, plantedAt } = plantedFruit;
  const { harvestSeconds, isBush } = FRUIT()[name];
  const lifecycle = FRUIT_LIFECYCLE[name];

  // Dead tree
  if (!harvestsLeft) {
    return (
      <ResourceDropAnimator
        mainImageProps={{
          src: lifecycle.dead,
          className: "relative cursor-pointer hover:img-highlight",
          style: {
            bottom: "-9px",
            zIndex: "1",
          },
          onLoad: (e) => setImageWidth(e.currentTarget),
          onClick: removeTree,
        }}
        dropImageProps={{
          src: getFruitImage(name),
        }}
        dropCount={amount}
        playDropAnimation={playAnimation}
        playShakeAnimation={false}
      />
    );
  }

  // Replenishing tree
  if (harvestedAt) {
    const replenishingTimeLeft = getTimeLeft(harvestedAt, harvestSeconds);

    if (replenishingTimeLeft > 0) {
      return (
        <ReplenishingTree
          onClick={onError}
          plantedFruit={plantedFruit}
          playAnimation={playAnimation}
        />
      );
    }
  }

  // Seedling
  const growingTimeLeft = getTimeLeft(plantedAt, harvestSeconds);

  if (growingTimeLeft > 0) {
    return (
      <Seedling
        onClick={onError}
        playing={playing}
        plantedFruit={plantedFruit}
      />
    );
  }

  //Pre loading the harvested tree image so that we get a smooth transition
  // when the user clicks on the ready tree and it transitions to the harvest state.
  if (!alreadyPreloaded) {
    preloadImage(lifecycle.harvested);
    preloadImage(getFruitImage(name));
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
