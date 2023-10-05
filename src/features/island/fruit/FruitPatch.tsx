import React, { useContext, useState } from "react";
import classNames from "classnames";

import fruitPatch from "assets/fruit/fruit_patch.png";

import { PIXEL_SCALE, POPOVER_TIME_MS } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { plantAudio, harvestAudio, treeFallAudio } from "lib/utils/sfx";
import { FruitName } from "features/game/types/fruits";
import { FruitTree } from "./FruitTree";
import Decimal from "decimal.js-light";
import { getRequiredAxeAmount } from "features/game/events/landExpansion/fruitTreeRemoved";
import { SUNNYSIDE } from "assets/sunnyside";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import {
  Collectibles,
  InventoryItemName,
  PlantedFruit,
} from "features/game/types/game";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { ITEM_DETAILS } from "features/game/types/images";

const HasAxes = (
  inventory: Partial<Record<InventoryItemName, Decimal>>,
  collectibles: Collectibles,
  fruit?: PlantedFruit
) => {
  const axesNeeded = getRequiredAxeAmount(
    fruit?.name as FruitName,
    inventory,
    collectibles
  );

  // has enough axes to chop the tree

  if (axesNeeded.lte(0)) return true;

  return (inventory.Axe ?? new Decimal(0)).gte(axesNeeded);
};

const isPlaying = (state: MachineState) =>
  state.matches("playingGuestGame") ||
  state.matches("playingFullGame") ||
  state.matches("autosaving");
const selectInventory = (state: MachineState) => state.context.state.inventory;
const selectCollectibles = (state: MachineState) =>
  state.context.state.collectibles;

const compareFruit = (prev?: PlantedFruit, next?: PlantedFruit) => {
  return JSON.stringify(prev) === JSON.stringify(next);
};
const compareCollectibles = (prev: Collectibles, next: Collectibles) =>
  isCollectibleBuilt("Foreman Beaver", prev) ===
  isCollectibleBuilt("Foreman Beaver", next);

interface Props {
  id: string;
}

export const FruitPatch: React.FC<Props> = ({ id }) => {
  const { gameService, selectedItem, shortcutItem } = useContext(Context);
  const [infoToShow, setInfoToShow] = useState<"error" | "info">("error");
  const [showInfo, setShowInfo] = useState(false);
  const [playAnimation, setPlayAnimation] = useState(false);

  const fruit = useSelector(
    gameService,
    (state) => state.context.state.fruitPatches[id]?.fruit,
    compareFruit
  );
  const collectibles = useSelector(
    gameService,
    selectCollectibles,
    compareCollectibles
  );
  const inventory = useSelector(
    gameService,
    selectInventory,
    (prev, next) =>
      HasAxes(prev, collectibles, fruit) === HasAxes(next, collectibles, fruit)
  );
  const playing = useSelector(gameService, isPlaying);

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
      }
    } catch (e: any) {
      displayInformation();
    }
  };

  const removeTree = () => {
    try {
      const hasAxes = HasAxes(inventory, collectibles, fruit);

      if (!hasAxes) {
        return displayInformation();
      }

      if (
        !isCollectibleBuilt("Foreman Beaver", collectibles) ||
        fruit?.name === "Blueberry"
      )
        shortcutItem("Axe");

      const newState = gameService.send("fruitTree.removed", {
        index: id,
        selectedItem: "Axe",
      });

      if (!newState.matches("hoarding")) {
        treeFallAudio.play();
        setPlayAnimation(true);
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
    } catch (e: any) {
      // TODO - catch more elaborate errors
      displayInformation();
    }
  };

  const fertilise = () => {
    try {
      gameService.send("fruit.fertilised", {
        patchID: id,
        fertiliser: selectedItem,
      });
    } catch (e: any) {
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
          fertilise={fertilise}
          playing={playing}
          playAnimation={playAnimation}
          showOnClickInfo={showInfo && infoToShow === "info"}
          fertiliser={fruit?.fertiliser}
        />
      </div>

      {!!fruit?.fertiliser && (
        <div
          className="absolute z-10 pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * -4}px`,
            left: `${PIXEL_SCALE * 22}px`,
            width: `${PIXEL_SCALE * 10}px`,
          }}
        >
          <img
            key={fruit.fertiliser.name}
            src={ITEM_DETAILS[fruit.fertiliser.name].image}
            style={{
              width: `${PIXEL_SCALE * 10}px`,
              marginBottom: `${PIXEL_SCALE * 1}px`,
            }}
          />
        </div>
      )}
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
