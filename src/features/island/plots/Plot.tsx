import React, { useContext, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Reward, PlantedCrop, PlacedItem } from "features/game/types/game";
import { CROPS } from "features/game/types/crops";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { harvestAudio, plantAudio } from "lib/utils/sfx";
import {
  getCompletedWellCount,
  isPlotFertile,
} from "features/game/events/landExpansion/plant";
import Spritesheet from "components/animation/SpriteAnimator";
import { HARVEST_PROC_ANIMATION } from "features/island/plots/lib/plant";
import { isReadyToHarvest } from "features/game/events/landExpansion/harvest";
import { NonFertilePlot } from "./components/NonFertilePlot";
import { FertilePlot } from "./components/FertilePlot";
import { ChestReward } from "../common/chest-reward/ChestReward";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { BuildingName } from "features/game/types/buildings";
import { ZoomContext } from "components/ZoomProvider";
import { CROP_COMPOST } from "features/game/types/composters";

const selectCrops = (state: MachineState) => state.context.state.crops;
const selectBuildings = (state: MachineState) => state.context.state.buildings;

const compareBuildings = (
  prev: Partial<Record<BuildingName, PlacedItem[]>>,
  next: Partial<Record<BuildingName, PlacedItem[]>>
) => {
  return getCompletedWellCount(prev) === getCompletedWellCount(next);
};

interface Props {
  id: string;
}
export const Plot: React.FC<Props> = ({ id }) => {
  const { scale } = useContext(ZoomContext);
  const { gameService, selectedItem, showTimers } = useContext(Context);
  const [procAnimation, setProcAnimation] = useState<JSX.Element>();
  const [touchCount, setTouchCount] = useState(0);
  const [reward, setReward] = useState<Reward>();
  const clickedAt = useRef<number>(0);

  const crops = useSelector(gameService, selectCrops, (prev, next) => {
    return JSON.stringify(prev[id]) === JSON.stringify(next[id]);
  });
  const buildings = useSelector(gameService, selectBuildings, compareBuildings);

  const crop = crops?.[id]?.crop;
  const fertiliser = crops?.[id]?.fertiliser;

  const isFertile = isPlotFertile({
    plotIndex: id,
    crops: crops,
    buildings: buildings,
  });

  if (!isFertile) return <NonFertilePlot />;

  const harvestCrop = (crop: PlantedCrop) => {
    const newState = gameService.send("crop.harvested", {
      index: id,
    });
    if (newState.matches("hoarding")) return;

    harvestAudio.play();

    // firework animation
    if (crop.amount && crop.amount >= 10) {
      setProcAnimation(
        <Spritesheet
          className="absolute pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * -23}px`,
            left: `${PIXEL_SCALE * -10}px`,
            width: `${PIXEL_SCALE * HARVEST_PROC_ANIMATION.size}px`,
            imageRendering: "pixelated",
          }}
          image={HARVEST_PROC_ANIMATION.sprites[crop.name]}
          widthFrame={HARVEST_PROC_ANIMATION.size}
          heightFrame={HARVEST_PROC_ANIMATION.size}
          zoomScale={scale}
          fps={HARVEST_PROC_ANIMATION.fps}
          steps={HARVEST_PROC_ANIMATION.steps}
          onPause={() => setProcAnimation(<></>)}
        />
      );
    }
  };

  const onClick = () => {
    // small buffer to prevent accidental double clicks
    const now = Date.now();
    if (now - clickedAt.current < 100) {
      return;
    }

    clickedAt.current = now;

    // already looking at a reward
    if (reward) {
      return;
    }

    // increase touch count if there is a reward
    const readyToHarvest =
      !!crop && isReadyToHarvest(now, crop, CROPS()[crop.name]);
    if (crop?.reward && readyToHarvest) {
      if (touchCount < 1) {
        // Add to touch count for reward pickup
        setTouchCount((count) => count + 1);
        return;
      }

      // They have touched enough!
      setReward(crop.reward);

      return;
    }

    // apply fertilisers
    if (!crop && selectedItem && selectedItem in CROP_COMPOST) {
      gameService.send("crop.fertilised", {
        plotID: id,
        fertiliser: selectedItem,
      });

      return;
    }

    // plant
    if (!crop) {
      gameService.send("seed.planted", {
        index: id,
        item: selectedItem,
        cropId: uuidv4().slice(0, 8),
      });

      plantAudio.play();

      return;
    }

    // harvest crop when ready
    if (readyToHarvest) {
      harvestCrop(crop);
    }

    setTouchCount(0);
  };

  const onCollectReward = (success: boolean) => {
    setReward(undefined);
    setTouchCount(0);

    if (success && crop) {
      harvestCrop(crop);
    }
  };

  console.log({ fertiliser });

  return (
    <>
      <div onClick={onClick} className="w-full h-full relative">
        <FertilePlot
          cropName={crop?.name}
          plantedAt={crop?.plantedAt}
          fertiliser={fertiliser}
          procAnimation={procAnimation}
          touchCount={touchCount}
          showTimers={showTimers}
        />
      </div>
      <ChestReward
        reward={reward}
        onCollected={onCollectReward}
        onOpen={() =>
          gameService.send("cropReward.collected", {
            plotIndex: id,
          })
        }
      />
    </>
  );
};
