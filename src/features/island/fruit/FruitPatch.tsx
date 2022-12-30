import React, { useContext, useRef, useState } from "react";
import classNames from "classnames";

import cancel from "assets/icons/cancel.png";
import fruitPatch from "assets/fruit/fruit_patch.png";

import { POPOVER_TIME_MS } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { plantAudio, harvestAudio } from "lib/utils/sfx";
import { useIsMobile } from "lib/utils/hooks/useIsMobile";
import { PlantedFruit } from "features/game/types/game";
import { Fruit, FRUIT, FruitName } from "features/game/types/fruits";
import { FruitTree } from "./FruitTree";

export const isReadyToHarvest = (
  createdAt: number,
  actionTime: number,
  fruitDetails: Fruit
) => {
  return createdAt - actionTime >= fruitDetails.harvestSeconds * 1000;
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
  const [showFruitDetails, setShowFruitDetails] = useState(false);
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
    if (!fruit) {
      return;
    }

    const now = Date.now();
    const actionTime = fruit.harvestedAt || fruit.plantedAt;
    const isReady = isReadyToHarvest(now, actionTime, FRUIT()[fruit.name]);
    const isJustPlanted = now - fruit.plantedAt < 1000;

    // show details if field is NOT ready and NOT just planted
    if (!isReady && !isJustPlanted) {
      // set state to show details
      setShowFruitDetails(true);
    }
  };

  const handleMouseLeave = () => {
    // set state to hide details
    setShowFruitDetails(false);
  };

  const harvestFruit = (fruit: PlantedFruit) => {
    try {
      const newState = gameService.send("fruit.harvested", {
        index: fruitPatchIndex,
        expansionIndex,
      });

      if (!newState.matches("hoarding")) {
        harvestAudio.play();

        setToast({
          icon: ITEM_DETAILS[fruit.name].image,
          content: `+${fruit.amount || 1}`,
        });
      }
    } catch (e: any) {
      // TODO - catch more elaborate errors
      displayPopover();
    }
  };

  const removeTree = () => {
    try {
      const newState = gameService.send("fruitTree.removed", {
        index: fruitPatchIndex,
        expansionIndex,
      });

      if (!newState.matches("hoarding")) {
        harvestAudio.play();

        setToast({
          icon: ITEM_DETAILS.Wood.image,
          content: `+1`,
        });
      }
    } catch (e: any) {
      // TODO - catch more elaborate errors
      displayPopover();
    }
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

    //harvest crop
    try {
      if (fruit.harvestsLeft) {
        harvestFruit(fruit);
      } else {
        removeTree();
      }
    } catch (e: any) {
      // TODO - catch more elaborate errors
      displayPopover();
    }
  };

  return (
    <div
      onMouseEnter={handleMouseHover}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full relative flex justify-center items-center"
    >
      {/* Displays the image */}
      <div className="absolute w-full h-full flex justify-center">
        <img src={fruitPatch} className="h-full absolute" />
        <FruitTree
          showTimers={showTimers}
          plantedFruit={fruit}
          showFruitDetails={showFruitDetails}
          onClick={onClick}
          playing={playing}
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
        <img className="w-5" src={cancel} />
      </div>
    </div>
  );
};
