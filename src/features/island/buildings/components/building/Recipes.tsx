import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import { Cookable, CookableName } from "features/game/types/consumables";

import { InProgressInfo } from "./InProgressInfo";
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
import { BuildingOilTank } from "./BuildingOilTank";
import pumpkinSoup from "assets/food/pumpkin_soup.png";
import powerup from "assets/icons/level_up.png";
import { gameAnalytics } from "lib/gameAnalytics";
import { BuildingProduct, InventoryItemName } from "features/game/types/game";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { Queue } from "./Queue";
import vipIcon from "assets/icons/vip.webp";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { Panel } from "components/ui/Panel";
import { ModalOverlay } from "components/ui/ModalOverlay";

interface Props {
  selected: Cookable;
  setSelected: Dispatch<SetStateAction<Cookable>>;
  recipes: Cookable[];
  queue: BuildingProduct[];
  cooking?: BuildingProduct;
  buildingName: BuildingName;
  buildingId?: string;
  readyRecipes: BuildingProduct[];
  onClose: () => void;
  onCook: (name: CookableName) => void;
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
  readyRecipes,
}) => {
  const { gameService } = useContext(Context);
  const { openModal } = useContext(ModalContext);
  const { t } = useAppTranslation();
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const { inventory, buildings, bumpkin } = state;
  const [showQueueInformation, setShowQueueInformation] = useState(false);

  const availableSlots = hasVipAccess({ game: state }) ? MAX_COOKING_SLOTS : 1;

  const ingredients = getCookingRequirements({
    state,
    item: selected.name,
  });

  const lessIngredients = () =>
    Object.entries(ingredients).some(([name, amount]) =>
      amount.greaterThan(inventory[name as InventoryItemName] ?? 0),
    );

  const getNewRecipeStartAt = () => {
    if (!cooking) return;

    let lastRecipeInQueueReadyAt = cooking.readyAt;

    if (queue.length > 0) {
      lastRecipeInQueueReadyAt = queue.sort((a, b) => b.readyAt - a.readyAt)[0]
        ?.readyAt;
    }

    return lastRecipeInQueueReadyAt;
  };

  const { reducedSecs: cookingTime } = getCookingTime({
    seconds: getCookingOilBoost(selected.name, state, buildingId).timeToCook,
    item: selected.name,
    game: state,
    cookStartAt: getNewRecipeStartAt(),
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

  const handleInstantCook = (gems: number) => {
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

  const handleAddToQueue = () => {
    if (!isVIP) {
      setShowQueueInformation(true);
      return;
    }

    cook();
  };

  const building = buildings?.[buildingName]?.[0];
  const buildingCrafting = building?.crafting ?? [];
  const isOilBoosted = buildingCrafting.find(
    (recipe) => recipe.name === selected.name && recipe.boost?.["Oil"],
  );
  const hasDoubleNom = !!bumpkin.skills["Double Nom"];
  const isVIP = hasVipAccess({ game: state });
  const isQueueFull = [...readyRecipes, ...queue].length >= availableSlots;

  return (
    <>
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
                xp: getFoodExpBoost({
                  food: selected,
                  game: state,
                }).boostedExp,
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
                      lessIngredients() || selected.disabled || isQueueFull
                    }
                    className="text-xxs sm:text-sm mt-1 whitespace-nowrap relative"
                    onClick={!cooking ? cook : handleAddToQueue}
                  >
                    {cooking && (
                      <img
                        src={vipIcon}
                        alt="VIP"
                        className="absolute w-6 sm:w-4 -top-[1px] -right-[2px]"
                      />
                    )}
                    <span>{cooking ? t("recipes.addToQueue") : t("cook")}</span>
                  </Button>
                  <Button
                    disabled={readyRecipes.length === 0}
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
              <InProgressInfo
                cooking={cooking}
                onClose={onClose}
                isOilBoosted={!!isOilBoosted}
                onInstantCooked={handleInstantCook}
                state={state}
              />
            )}

            {cooking && isVIP && (
              <Queue
                buildingName={buildingName}
                buildingId={buildingId as string}
                cooking={cooking}
                queue={queue}
                readyRecipes={readyRecipes}
                onClose={onClose}
              />
            )}

            <div className="w-full">
              <Label
                className="mr-3 ml-2 mb-1"
                icon={pumpkinSoup}
                type="default"
              >
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
      <ModalOverlay
        show={showQueueInformation}
        onBackdropClick={() => setShowQueueInformation(false)}
      >
        <Panel>
          <div className="p-2 text-sm">
            <p className="mb-1.5">{t("recipes.vipCookingQueue")}</p>
          </div>
          <div className="flex space-x-1 justify-end">
            <Button onClick={() => setShowQueueInformation(false)}>
              {t("close")}
            </Button>
            <Button
              className="relative"
              onClick={() => {
                onClose();
                openModal("BUY_BANNER");
              }}
            >
              <img
                src={vipIcon}
                alt="VIP"
                className="absolute w-6 sm:w-4 -top-[1px] -right-[2px]"
              />
              <span>{t("upgrade")}</span>
            </Button>
          </div>
        </Panel>
      </ModalOverlay>
    </>
  );
};
