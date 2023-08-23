import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { Box } from "components/ui/Box";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";

import { Button } from "components/ui/Button";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";

//import lock from "assets/skills/lock.png";

import Decimal from "decimal.js-light";
import { SUNNYSIDE } from "assets/sunnyside";
//import { Label } from "components/ui/Label";
import { ITEM_ICONS } from "../inventory/Chest";
import {
  HELIOS_BLACKSMITH_ITEMS,
  HeliosBlacksmithItem,
} from "features/game/types/collectibles";

interface Props {
  onClose: () => void;
}

export const Equipment: React.FC<Props> = ({ onClose }) => {
  const [selectedName, setSelectedName] =
    useState<HeliosBlacksmithItem>("Immortal Pear");
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const inventory = state.inventory;

  const selectedItem = HELIOS_BLACKSMITH_ITEMS(state)[selectedName];
  const isAlreadyCrafted = inventory[selectedName]?.greaterThanOrEqualTo(1);

  //const landCount = state.inventory["Basic Land"] ?? new Decimal(0);

  const lessIngredients = () =>
    getKeys(selectedItem.ingredients).some((name) =>
      selectedItem.ingredients[name]?.greaterThan(inventory[name] || 0)
    );

  const craft = () => {
    gameService.send("LANDSCAPE", {
      placeable: selectedName,
      action: "collectible.crafted",
      requirements: {
        sfl: new Decimal(0),
        ingredients: selectedItem.ingredients,
      },
    });

    onClose();
  };

  // const landLocked = (level: number) => {
  //   return (
  //     <div className="flex flex-col w-full justify-center">
  //       <div className="flex items-center justify-center border-t border-white w-full pt-2">
  //         <img src={lock} className="h-4 mr-1" />
  //         <p className="text-xxs mb-1">Unlock more land</p>
  //       </div>
  //       <div className="flex items-center justify-center ">
  //         <img src={ITEM_DETAILS["Basic Land"].image} className="h-4 mr-1" />
  //         <Label type="danger">{`${landCount.toNumber()}/${level}`}</Label>
  //       </div>
  //     </div>
  //   );
  // };

  const action = () => {
    // const level = BUILDINGS()[selectedName][0].unlocksAtLevel;
    // const isLocked = landCount.lt(level);

    // console.log({ isLocked });
    // // Hasn't unlocked the first
    // if (isLocked) {
    //   return landLocked(landCount.toNumber());
    // }

    // const nextBuildingIndex = BUILDINGS()[selectedName].findIndex((blueprint) =>
    //   landCount.lt(blueprint.unlocksAtLevel)
    // );
    // console.log({ nextLockedLevel: nextBuildingIndex });

    // // Built one, but needs to level up to build more
    // if (inventory[selectedName]?.lte(nextBuildingIndex)) {
    //   return landLocked(
    //     BUILDINGS()[selectedName][nextBuildingIndex].unlocksAtLevel
    //   );
    // }

    if (isAlreadyCrafted) {
      return <p className="text-xxs text-center mb-1">Already crafted!</p>;
    }

    return (
      <Button disabled={lessIngredients()} onClick={craft}>
        Build
      </Button>
    );
  };

  return (
    <SplitScreenView
      panel={
        <CraftingRequirements
          gameState={state}
          details={{
            item: selectedName,
          }}
          boost={selectedItem.boost}
          requirements={{
            resources: selectedItem.ingredients,
            sfl: selectedItem.sfl,
          }}
          actionView={action()}
          hideDescription
        />
      }
      content={
        <>
          {getKeys(HELIOS_BLACKSMITH_ITEMS).map(
            (name: HeliosBlacksmithItem) => {
              // const isLocked = landCount.lt(
              //   HELIOS_BLACKSMITH_ITEMS[name].unlocksAtLevel
              // );

              const isLocked = false;
              let secondaryIcon = undefined;
              // if (isLocked) {
              //   secondaryIcon = lock;
              // }

              if (inventory[name]?.greaterThanOrEqualTo(1)) {
                secondaryIcon = SUNNYSIDE.icons.confirm;
              }

              return (
                <Box
                  isSelected={selectedName === name}
                  key={name}
                  onClick={() => setSelectedName(name)}
                  image={ITEM_ICONS[name] ?? ITEM_DETAILS[name].image}
                  secondaryImage={secondaryIcon}
                  showOverlay={isLocked}
                />
              );
            }
          )}
        </>
      }
    />
  );
};
