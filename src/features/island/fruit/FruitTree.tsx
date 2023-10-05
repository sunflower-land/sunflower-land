import React, { useState } from "react";

import { getTimeLeft } from "lib/utils/time";
import { setImageWidth } from "lib/images";
import { FruitFertiliser, PlantedFruit } from "features/game/types/game";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { FRUIT, FruitName, FRUIT_SEEDS } from "features/game/types/fruits";
import { FRUIT_LIFECYCLE } from "./fruits";
import { Soil } from "./Soil";

import { Seedling } from "./Seedling";
import { ReplenishingTree } from "./ReplenishingTree";

import apple from "/src/assets/resources/apple.png";
import orange from "/src/assets/resources/orange.png";
import blueberry from "/src/assets/resources/blueberry.png";
import { DeadTree } from "./DeadTree";
import { PIXEL_SCALE } from "features/game/lib/constants";

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
  fertilise: () => void;
  playAnimation: boolean;
  /**
   * Handles showing "hover" information on mobile or "error" on click action information
   */
  showOnClickInfo: boolean;
  fertiliser?: FruitFertiliser;
}

export const FruitTree: React.FC<Props> = ({
  plantedFruit,
  plantTree,
  harvestFruit,
  removeTree,
  onError,
  fertilise,
  playing,
  playAnimation,
  showOnClickInfo,
  fertiliser,
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
    return (
      <Soil
        showOnClickInfo={showOnClickInfo}
        playing={playing}
        onClick={plantTree}
        playAnimation={playAnimation}
      />
    );
  }

  const { name, amount, harvestsLeft, harvestedAt, plantedAt } = plantedFruit;
  const { seed, isBush } = FRUIT()[name];
  const { plantSeconds } = FRUIT_SEEDS()[seed];
  const lifecycle = FRUIT_LIFECYCLE[name];

  // Dead tree
  if (!harvestsLeft) {
    return (
      <DeadTree
        fruitImage={getFruitImage(name)}
        fruit={name}
        showOnClickInfo={showOnClickInfo}
        {...{ amount, playAnimation, removeTree, lifecycle }}
      />
    );
  }

  // Replenishing tree
  if (harvestedAt) {
    const replenishingTimeLeft = getTimeLeft(harvestedAt, plantSeconds);

    if (replenishingTimeLeft > 0) {
      return (
        <>
          <ReplenishingTree
            onClick={fertilise}
            plantedFruit={plantedFruit}
            playAnimation={playAnimation}
            showOnClickInfo={showOnClickInfo}
          />
        </>
      );
    }
  }

  // Seedling
  const growingTimeLeft = getTimeLeft(plantedAt, plantSeconds);

  if (growingTimeLeft > 0) {
    return (
      <>
        <Seedling
          onClick={fertilise}
          playing={playing}
          plantedFruit={plantedFruit}
          showOnClickInfo={showOnClickInfo}
        />
      </>
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
    <>
      <div
        className="absolute h-full w-full hover:img-highlight cursor-pointer"
        onClick={harvestFruit}
      >
        <img
          className="absolute pointer-events-none"
          style={{
            bottom: `${PIXEL_SCALE * 5}px`,
            left: `${PIXEL_SCALE * (isBush ? 4 : 3)}px`,
          }}
          src={lifecycle.ready}
          onLoad={(e) => setImageWidth(e.currentTarget)}
        />
      </div>
    </>
  );
};
