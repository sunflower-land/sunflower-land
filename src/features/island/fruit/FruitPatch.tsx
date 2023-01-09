import React, { useContext, useState } from "react";
import classNames from "classnames";

import cancel from "assets/icons/cancel.png";
import fruitPatch from "assets/fruit/fruit_patch.png";

import { POPOVER_TIME_MS } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { plantAudio, harvestAudio } from "lib/utils/sfx";
import { FruitName } from "features/game/types/fruits";
import { FruitTree } from "./FruitTree";
import { FRUIT_LIFECYCLE } from "./fruits";
import { hasFeatureAccess } from "lib/flags";
import { setImageWidth } from "lib/images";

interface Props {
  fruitPatchIndex: number;
  expansionIndex: number;
}

export const FruitPatch: React.FC<Props> = ({
  fruitPatchIndex,
  expansionIndex,
}) => {
  const { gameService, selectedItem } = useContext(Context);
  const [game] = useActor(gameService);
  const { setToast } = useContext(ToastContext);
  const [infoToShow, setInfoToShow] = useState<"error" | "info">("error");
  const [showInfo, setShowInfo] = useState(false);
  const [playAnimation, setPlayAnimation] = useState(false);
  const expansion = game.context.state.expansions[expansionIndex];
  const patch = expansion.fruitPatches?.[fruitPatchIndex];

  const fruit = patch && patch.fruit;

  const playing = game.matches("playing") || game.matches("autosaving");

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
        index: fruitPatchIndex,
        expansionIndex,
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
      const { inventory } = game.context.state;

      if (selectedItem !== "Axe" || inventory.Axe?.lt(1)) {
        return displayInformation();
      }

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
      displayInformation();
    }
  };

  const plantTree = () => {
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
      displayInformation();
    }
  };

  const showError = showInfo && infoToShow === "error";

  return (
    <div className="w-full h-full relative flex justify-center items-center">
      <div className="absolute w-full h-full flex justify-center">
        <img src={fruitPatch} className="h-full absolute" />
        {hasFeatureAccess(game.context.state.inventory, "FRUIT") ? (
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
        ) : (
          <img
            className="relative"
            style={{
              bottom: "25px",
              zIndex: "1",
            }}
            src={FRUIT_LIFECYCLE.Apple.ready}
            onLoad={(e) => setImageWidth(e.currentTarget)}
          />
        )}
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
        <img className="w-5" src={cancel} />
      </div>
    </div>
  );
};
