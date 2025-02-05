import React, { Dispatch, SetStateAction, useContext } from "react";
import { useActor } from "@xstate/react";
import Decimal from "decimal.js-light";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import { Cookable, CookableName } from "features/game/types/consumables";

import { InProgressInfo } from "../building/InProgressInfo";
import { MachineInterpreter } from "../../lib/craftingMachine";
import {
  getCookingTime,
  getFoodExpBoost,
} from "features/game/expansion/lib/boosts";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  getCookingOilBoost,
  getCookingRequirements,
} from "features/game/events/landExpansion/cook";
import { BuildingName } from "features/game/types/buildings";
import { BuildingOilTank } from "../building/BuildingOilTank";
import pumpkinSoup from "assets/food/pumpkin_soup.png";
import powerup from "assets/icons/level_up.png";
import { gameAnalytics } from "lib/gameAnalytics";
import { InventoryItemName } from "features/game/types/game";

interface Props {
  selected: Cookable;
  setSelected: Dispatch<SetStateAction<Cookable>>;
  recipes: Cookable[];
  onClose: () => void;
  onCook: (name: CookableName) => void;
  craftingService?: MachineInterpreter;
  crafting: boolean;
  buildingName: BuildingName;
  buildingId?: string;
}

/**
 * The recipes of a food producing building.
 * @selected The selected food in the interface.  This prop is set in the parent so closing the modal will not reset the selected state.
 * @setSelected Sets the selected food in the interface.  This prop is set in the parent so closing the modal will not reset the selected state.
 * @recipes The list of available recipes.
 * @onClose The close action.
 * @onCook The cook action.
 * @crafting Whether the building is in the process of crafting a food item.
 * @craftingService The crafting service.
 */

export const Recipes: React.FC<Props> = ({
  selected,
  setSelected,
  recipes,
  onClose,
  onCook,
  crafting,
  craftingService,
  buildingId,
  buildingName,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const { inventory, buildings, bumpkin, buds } = state;

  const ingredients = getCookingRequirements({
    state,
    item: selected.name,
  });

  const lessIngredients = () =>
    Object.entries(ingredients).some(([name, amount]) =>
      amount.greaterThan(inventory[name as InventoryItemName] ?? 0),
    );

  const cookingTime = getCookingTime({
    seconds: getCookingOilBoost(selected.name, state, buildingId).timeToCook,
    item: selected.name,
    game: state,
  });

  const cook = () => {
    onCook(selected.name);
    if (buildingName === "Fire Pit" || cookingTime < 60) {
      gameService.send("SAVE");
    }
  };

  const onInstantCook = (gems: number) => {
    gameService.send("recipe.spedUp", {
      buildingId,
      buildingName,
    });

    gameAnalytics.trackSink({
      currency: "Gem",
      amount: gems,
      item: "Instant Cook",
      type: "Fee",
    });

    setTimeout(() => {
      craftingService?.send({
        type: "INSTANT",
      });
    }, 100);
  };

  const isOilBoosted = buildings?.[buildingName]?.[0].crafting?.boost?.["Oil"];

  const hasDoubleNom = !!bumpkin.skills["Double Nom"];

  return (
    <SplitScreenView
      panel={
        <>
          <CraftingRequirements
            gameState={state}
            details={{
              item: selected.name,
            }}
            hideDescription
            requirements={{
              resources: ingredients,
              xp: new Decimal(
                getFoodExpBoost(selected, bumpkin, state, buds ?? {}),
              ),
              timeSeconds: cookingTime,
            }}
            actionView={
              <>
                {hasDoubleNom && (
                  <Label type="success" icon={powerup}>
                    {`Double Nom Boost: 2x Food`}
                  </Label>
                )}
                <Button
                  disabled={lessIngredients() || crafting || selected.disabled}
                  className="text-xxs sm:text-sm mt-1 whitespace-nowrap"
                  onClick={() => cook()}
                >
                  {t("cook")}
                </Button>
                {crafting && (
                  <p className="sm:text-xs text-center my-1">
                    {t("sceneDialogues.chefIsBusy")}
                  </p>
                )}
              </>
            }
          />
        </>
      }
      content={
        <>
          {craftingService && (
            <InProgressInfo
              craftingService={craftingService}
              onClose={onClose}
              isOilBoosted={!!isOilBoosted}
              onInstantCooked={onInstantCook}
              state={state}
            />
          )}
          <div className="w-full">
            <Label className="mr-3 ml-2 mb-1" icon={pumpkinSoup} type="default">
              {t("recipes")}
            </Label>
          </div>
          <div className="flex flex-wrap h-fit">
            {recipes.map((item) => (
              <Box
                isSelected={selected.name === item.name}
                key={item.name}
                onClick={() => setSelected(item)}
                image={ITEM_DETAILS[item.name].image}
                count={inventory[item.name]}
              />
            ))}
          </div>
          {buildingId && (
            <BuildingOilTank
              buildingName={buildingName}
              buildingId={buildingId}
            />
          )}
        </>
      }
    />
  );
};
