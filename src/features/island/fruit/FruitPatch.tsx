import React, { useContext, useState } from "react";
import classNames from "classnames";

import fruitPatch from "assets/fruit/fruit_patch.png";

import { PIXEL_SCALE, POPOVER_TIME_MS } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { plantAudio, harvestAudio, treeFallAudio } from "lib/utils/sfx";
import { FruitName } from "features/game/types/fruits";
import { FruitTree } from "./FruitTree";
import Decimal from "decimal.js-light";
import { getRequiredAxeAmount } from "features/game/events/landExpansion/fruitTreeRemoved";
import { SUNNYSIDE } from "assets/sunnyside";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";

const selectInventory = (state: MachineState) => state.context.state.inventory;
const selectCollectibles = (state: MachineState) =>
  state.context.state.collectibles;
const isPlaying = (state: MachineState) =>
  state.matches("playing") || state.matches("autosaving");

interface Props {
  id: string;
}

export const FruitPatch: React.FC<Props> = ({ id }) => {
  const { gameService, selectedItem } = useContext(Context);
  const { setToast } = useContext(ToastContext);
  const [infoToShow, setInfoToShow] = useState<"error" | "info">("error");
  const [showInfo, setShowInfo] = useState(false);
  const [playAnimation, setPlayAnimation] = useState(false);

  const inventory = useSelector(gameService, selectInventory);
  const collectibles = useSelector(gameService, selectCollectibles);
  const playing = useSelector(gameService, isPlaying);
  const fruit = useSelector(
    gameService,
    (state) => state.context.state.fruitPatches[id]?.fruit
  );

  const displayInformation = async () => {
    // First click show error
    // Second click show panel with information
    setShowInfo(true);
    await new Promise((resolve) => setTimeout(resolve, POPOVER_TIME_MS));
    setShowInfo(false);

    infoToShow === "error" ? setInfoToShow("info") : setInfoToShow("error");
  };

  const harvestFruit = () => {
    if (!fruit) return;
    try {
      const newState = gameService.send("fruit.harvested", {
        index: id,
      });

      if (!newState.matches("hoarding")) {
        harvestAudio.play();
        setPlayAnimation(true);
        setToast({
          icon: ITEM_DETAILS[fruit.name].image,
          content: `+${fruit.amount || 1}`,
        });
      }
    } catch (e: any) {
      displayInformation();
    }
  };

  const removeTree = () => {
    try {
      const axesNeeded = getRequiredAxeAmount(
        fruit?.name as FruitName,
        inventory,
        collectibles
      );
      const axeAmount = inventory.Axe ?? new Decimal(0);

      // Has enough axes to chop the tree
      const hasAxes =
        (selectedItem === "Axe" || axesNeeded.eq(0)) &&
        axeAmount.gte(axesNeeded);

      if (!hasAxes) {
        return displayInformation();
      }

      const newState = gameService.send("fruitTree.removed", {
        index: id,
        selectedItem: selectedItem,
      });

      if (!newState.matches("hoarding")) {
        treeFallAudio.play();
        setPlayAnimation(true);

        setToast({
          icon: ITEM_DETAILS.Axe.image,
          content: `-1`,
        });
        setToast({
          icon: ITEM_DETAILS.Wood.image,
          content: `+1`,
        });
      }
    } catch (e: any) {
      displayInformation();
    }
  };

  const plantTree = () => {
    try {
      gameService.send("fruit.planted", {
        index: id,
        seed: selectedItem,
      });

      plantAudio.play();

      setToast({
        icon: ITEM_DETAILS[selectedItem as FruitName].image,
        content: `-1`,
      });
    } catch (e: any) {
      // TODO - catch more elaborate errors
      displayInformation();
    }
  };

  const showError = showInfo && infoToShow === "error";

  return (
    <div className="w-full h-full relative flex justify-center items-center">
      <div className="absolute w-full h-full flex justify-center">
        <img
          src={fruitPatch}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 30}px`,
            top: `${PIXEL_SCALE * 2}px`,
          }}
        />
        <FruitTree
          plantedFruit={fruit}
          plantTree={plantTree}
          harvestFruit={harvestFruit}
          removeTree={removeTree}
          onError={displayInformation}
          playing={playing}
          playAnimation={playAnimation}
          showOnClickInfo={showInfo && infoToShow === "info"}
        />
      </div>

      {/* Error Icon */}
      <div
        className={classNames(
          "transition-opacity absolute top-10 w-full z-40 pointer-events-none flex justify-center",
          {
            "opacity-100": showError,
            "opacity-0": !showError,
          }
        )}
      >
        <img className="w-5" src={SUNNYSIDE.icons.cancel} />
      </div>
    </div>
  );
};
