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
  MAX_COOKING_SLOTS,
} from "features/game/events/landExpansion/cook";
import { BuildingName } from "features/game/types/buildings";
import { BuildingOilTank } from "../building/BuildingOilTank";
import pumpkinSoup from "assets/food/pumpkin_soup.png";
import powerup from "assets/icons/level_up.png";
import { gameAnalytics } from "lib/gameAnalytics";
import { BuildingProduct, InventoryItemName } from "features/game/types/game";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  selected: Cookable;
  setSelected: Dispatch<SetStateAction<Cookable>>;
  recipes: Cookable[];
  queue: BuildingProduct[];
  onClose: () => void;
  onCook: (name: CookableName) => void;
  cooking?: BuildingProduct;
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
 * @cooking Whether the building is in the process of cooking a food item.
 */

export const Recipes: React.FC<Props> = ({
  selected,
  setSelected,
  recipes,
  onClose,
  onCook,
  cooking,
  buildingId,
  buildingName,
  queue,
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

  const collect = () => {
    gameService.send("recipes.collected", {
      buildingId,
      building: buildingName,
    });
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
  };

  const building = buildings?.[buildingName]?.[0];
  const buildingCrafting = building?.crafting ?? [];
  const isOilBoosted = buildingCrafting.find(
    (recipe) => recipe.name === selected.name && recipe.boost?.["Oil"],
  );
  const hasDoubleNom = !!bumpkin.skills["Double Nom"];

  const hasReadyRecipes = buildingCrafting.some(
    (recipe) => recipe.readyAt <= Date.now(),
  );
  const availableSlots = hasVipAccess({ game: state }) ? MAX_COOKING_SLOTS : 1;
  const hasAvailableSlots = buildingCrafting.length < availableSlots;

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
                {cooking && (
                  <p className="sm:text-xs text-center my-1">
                    {t("sceneDialogues.chefIsBusy")}
                  </p>
                )}
                <Button
                  disabled={
                    lessIngredients() || selected.disabled || !hasAvailableSlots
                  }
                  className="text-xxs sm:text-sm mt-1 whitespace-nowrap"
                  onClick={() => cook()}
                >
                  {cooking ? t("recipes.addToQueue") : t("cook")}
                </Button>
                <Button
                  disabled={!hasReadyRecipes}
                  className="text-xxs sm:text-sm mt-1 whitespace-nowrap"
                  onClick={() => collect()}
                >
                  {t("collect")}
                </Button>
              </>
            }
          />
        </>
      }
      content={
        <>
          {cooking && (
            <>
              <InProgressInfo
                cooking={cooking}
                onClose={onClose}
                isOilBoosted={!!isOilBoosted}
                onInstantCooked={onInstantCook}
                state={state}
              />
              <div className="mb-2">
                <div className="w-full">
                  <Label
                    className="mr-3 ml-2 mb-1"
                    icon={SUNNYSIDE.icons.arrow_right}
                    type="default"
                  >
                    {t("recipes.upNext")}
                  </Label>
                </div>
                <div className="flex flex-wrap h-fit">
                  {Array(3)
                    .fill(null)
                    .map((_, index) => {
                      const item = queue[index];
                      return item ? (
                        <Box
                          key={`${item.readyAt}-${item.name}`}
                          image={ITEM_DETAILS[item.name].image}
                          count={inventory[item.name]}
                        />
                      ) : (
                        <Box key={index} />
                      );
                    })}
                </div>
              </div>
            </>
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
