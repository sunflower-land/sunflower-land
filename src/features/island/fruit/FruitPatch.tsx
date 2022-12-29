import React, { useContext, useRef, useState } from "react";
import classNames from "classnames";

import selectBox from "assets/ui/select/select_box.png";
import fruitPatch from "assets/fruit/fruit_patch.png";

import { PIXEL_SCALE, POPOVER_TIME_MS } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { plantAudio } from "lib/utils/sfx";
import { useIsMobile } from "lib/utils/hooks/useIsMobile";
import { PlantedFruit } from "features/game/types/game";
import { Fruit, FRUIT, FruitName } from "features/game/types/fruits";
import { Soil } from "./Soil";

export const isReadyToHarvest = (
  createdAt: number,
  plantedFruit: PlantedFruit,
  fruitDetails: Fruit
) => {
  return (
    createdAt - plantedFruit.plantedAt >= fruitDetails.harvestSeconds * 1000
  );
};

import appleTree from "assets/fruit/apple/apple_tree.png";
import blueberryBush from "assets/fruit/blueberry/blueberry_bush.png";
import orangeTree from "assets/fruit/orange/orange_tree.png";

const fruits: Record<FruitName, React.FC> = {
  Apple: () => (
    <img
      src={appleTree}
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 26}px`,
        bottom: `${PIXEL_SCALE * 4}px`,
        left: `${PIXEL_SCALE * 3}px`,
      }}
    />
  ),
  Blueberry: () => (
    <img
      src={blueberryBush}
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 25}px`,
        bottom: `${PIXEL_SCALE * 8}px`,
        left: `${PIXEL_SCALE * 3}px`,
      }}
    />
  ),
  Orange: () => (
    <img
      src={orangeTree}
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 26}px`,
        bottom: `${PIXEL_SCALE * 8}px`,
        left: `${PIXEL_SCALE * 3}px`,
      }}
    />
  ),
};

interface Props {
  fruitPatchIndex: number;
  expansionIndex: number;
}
export const FruitPatch: React.FC<Props> = ({
  fruitPatchIndex,
  expansionIndex,
}) => {
  const { gameService, selectedItem, showTimers } = useContext(Context);
  const [game] = useActor(gameService);
  const { setToast } = useContext(ToastContext);
  const clickedAt = useRef<number>(0);
  const [showPopover, setShowPopover] = useState(false);
  const [showSelectBox, setShowSelectBox] = useState(false);
  const [showCropDetails, setShowCropDetails] = useState(false);
  const [isMobile] = useIsMobile();
  const expansion = game.context.state.expansions[expansionIndex];
  const patch = expansion.fruitPatches?.[fruitPatchIndex];

  const fruit = patch && patch.fruit;

  const playing = game.matches("playing") || game.matches("autosaving");

  const displayPopover = async () => {
    setShowPopover(true);
    await new Promise((resolve) => setTimeout(resolve, POPOVER_TIME_MS));
    setShowPopover(false);
  };

  const handleMouseHover = () => {
    setShowSelectBox(!isMobile);

    if (!fruit) {
      return;
    }

    const now = Date.now();
    const isReady = isReadyToHarvest(now, fruit, FRUIT()[fruit.name]);
    const isJustPlanted = now - fruit.plantedAt < 1000;

    // show details if field is NOT ready and NOT just planted
    if (!isReady && !isJustPlanted) {
      // set state to show details
      setShowCropDetails(true);
    }
  };

  const handleMouseLeave = () => {
    // set state to hide details
    setShowCropDetails(false);
    setShowSelectBox(false);
  };

  const onClick = () => {
    // small buffer to prevent accidental double clicks
    const now = Date.now();
    if (now - clickedAt.current < 100) {
      return;
    }

    clickedAt.current = now;

    // plant
    if (!fruit) {
      try {
        gameService.send("fruit.planted", {
          index: fruitPatchIndex,
          expansionIndex,
          seed: selectedItem,
        });

        plantAudio.play();

        setToast({
          icon: ITEM_DETAILS[selectedItem as FruitName].image,
          content: `-1`,
        });
      } catch (e: any) {
        // TODO - catch more elaborate errors
        displayPopover();
      }
      return;
    }

    // harvest crop
    // try {
    //   harvestCrop(crop);
    // } catch (e: any) {
    //   // TODO - catch more elaborate errors
    //   displayPopover();
    // }
  };

  return (
    <div
      onMouseEnter={handleMouseHover}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full relative flex justify-center items-center"
    >
      <div className="absolute pointer-events-none w-full h-full flex justify-center">
        <img src={fruitPatch} className="h-full absolute" />
        <Soil
          showTimers={showTimers}
          plantedFruit={fruit}
          showFruitDetails={showCropDetails}
        />
      </div>

      {/* Popover */}
      <div
        className={classNames(
          "transition-opacity absolute top-6 w-full z-40 pointer-events-none flex justify-center",
          {
            "opacity-100": showPopover,
            "opacity-0": !showPopover,
          }
        )}
      >
        <img
          src={fruitPatch}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 30}px`,
            left: `${PIXEL_SCALE * 1}px`,
            top: `${PIXEL_SCALE * 1}px`,
          }}
        />
        {fruit && fruits[fruit.name]({})}
      </div>

      {/* Select box */}
      {playing && (
        <img
          src={selectBox}
          className={classNames("relative z-40 cursor-pointer", {
            "opacity-100": showSelectBox,
            "opacity-0": !showSelectBox,
          })}
          style={{
            width: `${PIXEL_SCALE * 16}px`,
          }}
          onClick={() => onClick()}
        />
      )}
    </div>
  );
};
