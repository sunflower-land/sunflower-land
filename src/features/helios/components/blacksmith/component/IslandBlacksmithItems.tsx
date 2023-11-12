import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { Box } from "components/ui/Box";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";

import powerup from "assets/icons/level_up.png";

import { Button } from "components/ui/Button";
import { HELIOS_BLACKSMITH_ITEMS } from "features/game/types/collectibles";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { gameAnalytics } from "lib/gameAnalytics";
import { getSeasonalTicket } from "features/game/types/seasons";
import Decimal from "decimal.js-light";
import { Label } from "components/ui/Label";
import { InventoryItemName } from "features/game/types/game";
import { BuildingName } from "features/game/types/buildings";
import { ITEM_ICONS } from "features/island/hud/components/inventory/Chest";

const VALID_EQUIPMENT: InventoryItemName[] = ["Basic Scarecrow", "Bale"];
const VALID_BUILDINGS: BuildingName[] = [
  "Fire Pit",
  "Compost Bin",
  "Water Well",
  "Kitchen",
  "Bakery",
  "Hen House",
  "Deli",
  "Smoothie Shack",
  "Turbo Composter",
  "Toolshed",
  "Warehouse",
  "Premium Composter",
];

export const IslandBlacksmithItems: React.FC = () => {
  const [selectedName, setSelectedName] =
    useState<InventoryItemName>("Basic Scarecrow");
  const { gameService, shortcutItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const inventory = state.inventory;

  const selectedItem = HELIOS_BLACKSMITH_ITEMS(state)[selectedName]!;
  const isAlreadyCrafted = inventory[selectedName]?.greaterThanOrEqualTo(1);

  const lessIngredients = () =>
    getKeys(selectedItem.ingredients).some((name) =>
      selectedItem.ingredients[name]?.greaterThan(inventory[name] || 0)
    );

  const craft = () => {
    gameService.send("LANDSCAPE", {
      placeable: selectedName,
      action: "collectible.crafted",
      // Not used yet
      requirements: {
        sfl: new Decimal(0),
        ingredients: {},
      },
    });

    const count = state.inventory[selectedName]?.toNumber() ?? 1;
    gameAnalytics.trackMilestone({
      event: `Crafting:Collectible:${selectedName}${count}`,
    });

    if (selectedItem.ingredients["Block Buck"]) {
      gameAnalytics.trackSink({
        currency: "Block Buck",
        amount: selectedItem.ingredients["Block Buck"].toNumber() ?? 1,
        item: selectedName,
        type: "Collectible",
      });
    }

    if (selectedItem.ingredients[getSeasonalTicket()]) {
      gameAnalytics.trackSink({
        currency: "Seasonal Ticket",
        amount: selectedItem.ingredients[getSeasonalTicket()]?.toNumber() ?? 1,
        item: selectedName,
        type: "Collectible",
      });
    }

    if (selectedItem.sfl) {
      gameAnalytics.trackSink({
        currency: "SFL",
        amount: selectedItem.sfl.toNumber(),
        item: selectedName,
        type: "Collectible",
      });
    }

    shortcutItem(selectedName);
  };

  return (
    <SplitScreenView
      panel={
        <CraftingRequirements
          gameState={state}
          details={{
            item: selectedName,
            from: selectedItem.from,
            to: selectedItem.to,
          }}
          boost={selectedItem.boost}
          requirements={{
            resources: selectedItem.ingredients,
            sfl: selectedItem.sfl,
          }}
          actionView={
            isAlreadyCrafted ? (
              <p className="text-xxs text-center mb-1">Already crafted!</p>
            ) : (
              <Button disabled={lessIngredients()} onClick={craft}>
                Craft
              </Button>
            )
          }
        />
      }
      content={
        <>
          <div className="block w-full">
            <Label type="default" icon={powerup}>
              Equipment
            </Label>
          </div>
          <div className="flex flex-wrap">
            {VALID_EQUIPMENT.map((name: InventoryItemName) => {
              return (
                <Box
                  isSelected={selectedName === name}
                  key={name}
                  onClick={() => setSelectedName(name)}
                  image={ITEM_DETAILS[name].image}
                  count={inventory[name]}
                  overlayIcon={
                    <img
                      src={SUNNYSIDE.icons.stopwatch}
                      id="confirm"
                      alt="confirm"
                      className="object-contain absolute"
                      style={{
                        width: `${PIXEL_SCALE * 8}px`,
                        top: `${PIXEL_SCALE * -4}px`,
                        right: `${PIXEL_SCALE * -4}px`,
                      }}
                    />
                  }
                />
              );
            })}
          </div>
          <div className="block w-full">
            <Label type="default" icon={SUNNYSIDE.icons.hammer}>
              Buildings
            </Label>
          </div>
          <div className="flex flex-wrap">
            {VALID_BUILDINGS.map((name: BuildingName) => {
              return (
                <Box
                  isSelected={selectedName === name}
                  key={name}
                  onClick={() => setSelectedName(name)}
                  image={ITEM_ICONS[name] ?? ITEM_DETAILS[name].image}
                  // secondaryImage={secondaryIcon}
                  // showOverlay={isLocked}
                />
              );
            })}
          </div>
        </>
      }
    />
  );
};
