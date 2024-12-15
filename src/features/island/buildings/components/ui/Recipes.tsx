import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import { useActor } from "@xstate/react";
import Decimal from "decimal.js-light";

import xpIcon from "assets/icons/xp.png";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "features/game/types/craftables";
import {
  ConsumableName,
  CONSUMABLES,
  Cookable,
  CookableName,
  COOKABLES,
} from "features/game/types/consumables";

import { InProgressInfo } from "../building/InProgressInfo";
import { MachineInterpreter } from "../../lib/craftingMachine";
import {
  getCookingTime,
  getFoodExpBoost,
} from "features/game/expansion/lib/boosts";
import { GameState } from "features/game/types/game";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  FLAGGED_RECIPES,
  getCookingOilBoost,
  getCookingRequirements,
} from "features/game/events/landExpansion/cook";
import { FeatureName, hasFeatureAccess } from "lib/flags";
import { BuildingName } from "features/game/types/buildings";
import { BuildingOilTank } from "../building/BuildingOilTank";
import pumpkinSoup from "assets/food/pumpkin_soup.png";
import powerup from "assets/icons/level_up.png";
import { InnerPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { ResizableBar } from "components/ui/ProgressBar";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { getInstantGems } from "features/game/events/landExpansion/speedUpRecipe";
import { gameAnalytics } from "lib/gameAnalytics";

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
  currentlyCooking?: CookableName;
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
  currentlyCooking,
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

  const [hideCooking, setHideCooking] = useState(false);

  const lessIngredients = () =>
    getKeys(selected.ingredients).some((name) =>
      selected?.ingredients[name]?.greaterThan(inventory[name] || 0),
    );

  const cook = async () => {
    onCook(selected.name);
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

    onClose();

    setTimeout(() => {
      craftingService?.send({
        type: "INSTANT",
      });
    }, 100);
  };

  const validRecipes = recipes.filter((recipes) => {
    const flag = FLAGGED_RECIPES[recipes.name];
    if (!flag) {
      return true;
    }

    return hasFeatureAccess(
      state,
      FLAGGED_RECIPES[recipes.name as ConsumableName] as FeatureName,
    );
  });

  const isOilBoosted = buildings?.[buildingName]?.[0].crafting?.boost?.["Oil"];

  const hasDoubleNom = !!bumpkin.skills["Double Nom"];

  if (!hideCooking && crafting) {
    return (
      <Cooking
        name={currentlyCooking as CookableName}
        craftingService={craftingService!}
        state={state}
        onClose={() => setHideCooking(true)}
        onInstantCooked={onInstantCook}
      />
    );
  }

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
              resources: getCookingRequirements({ state, item: selected.name }),
              xp: new Decimal(
                getFoodExpBoost(selected, bumpkin, state, buds ?? {}),
              ),
              timeSeconds: getCookingTime(
                getCookingOilBoost(selected.name, state, buildingId).timeToCook,
                selected.name,
                bumpkin,
                state,
              ),
            }}
            actionView={
              <>
                {hasDoubleNom && (
                  <Label type="info" icon={powerup}>
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
            />
          )}
          {crafting && (
            <div className="w-full">
              <Label
                className="mr-3 ml-2 mb-1"
                icon={pumpkinSoup}
                type="default"
              >
                {t("recipes")}
              </Label>
            </div>
          )}
          <div className="flex flex-wrap h-fit">
            {validRecipes.map((item) => (
              <Box
                isSelected={selected.name === item.name}
                key={item.name}
                onClick={() => setSelected(item)}
                image={ITEM_DETAILS[item.name].image}
                count={inventory[item.name]}
              />
            ))}
          </div>
          {buildingId ? (
            <BuildingOilTank
              buildingName={buildingName}
              buildingId={buildingId}
            />
          ) : null}
        </>
      }
    />
  );
};

export const Cooking: React.FC<{
  craftingService: MachineInterpreter;
  name: CookableName;
  state: GameState;
  onClose: () => void;
  onInstantCooked: (gems: number) => void;
}> = ({ name, craftingService, state, onClose, onInstantCooked }) => {
  const { t } = useAppTranslation();
  const [
    {
      context: { secondsTillReady, readyAt, buildingId },
    },
  ] = useActor(craftingService);

  const { bumpkin, buds, inventory } = state;

  const { cookingSeconds } = COOKABLES[name];

  const { days, ...ready } = useCountdown(readyAt ?? 0);

  const gems = getInstantGems({
    readyAt: readyAt as number,
    game: state,
  });

  return (
    <InnerPanel>
      <div className="p-1 flex justify-between items-center">
        <Label
          type="default"
          icon={SUNNYSIDE.icons.stopwatch}
        >{`In progress`}</Label>
        <span className="text-xs underline cursor-pointer" onClick={onClose}>
          {t("crafting.viewRecipes")}
        </span>
      </div>
      <div className="flex items-center mb-1">
        <Box image={ITEM_DETAILS[name].image} />
        <div>
          <div className="flex items-center flex-wrap">
            <p className="text-sm mb-0.5 mr-2">{name}</p>
            <div className="flex items-center">
              <img src={xpIcon} className="h-4 mr-0.5" />
              <p className="text-xs">
                {getFoodExpBoost(CONSUMABLES[name], bumpkin, state, buds ?? {})}
              </p>
            </div>
          </div>
          <div className="relative flex flex-col w-full">
            <div className="flex items-center gap-x-1">
              <ResizableBar
                percentage={(1 - secondsTillReady! / cookingSeconds) * 100}
                type="progress"
              />
              <TimerDisplay time={ready} />
            </div>
          </div>
        </div>
      </div>
      <Button
        disabled={!inventory.Gem?.gte(gems)}
        className="relative"
        onClick={() => onInstantCooked(gems)}
      >
        {t("gems.speedUp")}
        <Label
          type={inventory.Gem?.gte(gems) ? "default" : "danger"}
          icon={ITEM_DETAILS.Gem.image}
          className="flex absolute right-0 top-0.5"
        >
          {gems}
        </Label>
      </Button>
    </InnerPanel>
  );
};
