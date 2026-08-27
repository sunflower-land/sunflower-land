import React, {
  type Dispatch,
  type SetStateAction,
  useContext,
  useState,
} from "react";
import { useSelector } from "@xstate/react";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  COOKABLES,
  type Cookable,
  type CookableName,
} from "features/game/types/consumables";

import { InProgressInfo } from "./InProgressInfo";
import { getFoodExpBoost } from "features/game/expansion/lib/boosts";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  getCookingRequirements,
  getReadyAt,
  MAX_COOKING_SLOTS,
} from "features/game/events/landExpansion/cook";
import type { CookingBuildingName } from "features/game/types/buildings";
import {
  SKILL_RANKS,
  getSkillLevel,
  downgradeChapterCropWeekSkills,
  hasUpgradedChapterCropWeekSkill,
} from "features/game/types/bumpkinSkills";
import { BuildingOilTank } from "./BuildingOilTank";
import pumpkinSoup from "assets/food/pumpkin_soup.png";
import powerup from "assets/icons/level_up.png";
import { gameAnalytics } from "lib/gameAnalytics";
import type {
  BuildingProduct,
  InventoryItemName,
} from "features/game/types/game";
import { useVipAccess } from "lib/utils/hooks/useVipAccess";
import { Queue } from "./Queue";
import vipIcon from "assets/icons/vip.webp";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { Panel } from "components/ui/Panel";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { useNow } from "lib/utils/hooks/useNow";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import {
  CHAPTER_CROP_WEEK,
  CHAPTER_CROP_WEEK_RECIPE,
} from "features/game/types/chapterCropWeek";
import { SpecialEventPanel } from "./SpecialEventPanel";
import {
  areBoostWindowsEqual,
  getCookingBoostWindows,
} from "features/game/lib/boostWindows";
import { getPreActionDisplay } from "features/game/lib/timerDisplay";
import { resolveCookingQueueTimings } from "features/game/lib/cookingReadiness";
import {
  getBoostContributionEntries,
  getCookingBoostContributions,
} from "features/game/lib/boostContributions";
import { secondsToString } from "lib/utils/time";
import type { MachineState } from "features/game/lib/gameMachine";

const _cookingBoostWindows = (state: MachineState) =>
  getCookingBoostWindows(state.context.state);

const _buildingCrafting =
  (buildingName: CookingBuildingName, buildingId?: string) =>
  (state: MachineState) =>
    state.context.state.buildings[buildingName]?.find(
      (building) => building.id === buildingId,
    )?.crafting;

interface Props {
  selected: Cookable;
  setSelected: Dispatch<SetStateAction<Cookable>>;
  recipes: Cookable[];
  queue: BuildingProduct[];
  cooking?: BuildingProduct;
  buildingName: CookingBuildingName;
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
  const { gameService, showActualTime } = useContext(Context);

  // Recomputed from full state, but only re-renders when the windows actually change.
  const cookingBoostWindows = useSelector(
    gameService,
    _cookingBoostWindows,
    areBoostWindowsEqual,
  );

  // The building's raw queue, so the cooking recipe's real start can be resolved from
  // the chain. A queued recipe carries no `startedAt` of its own — its start IS the
  // ready time of the recipe ahead of it — so it cannot be read off `cooking`.
  const buildingCraftingQueue = useSelector(
    gameService,
    _buildingCrafting(buildingName, buildingId),
  );
  const { openModal } = useContext(ModalContext);
  const { t } = useAppTranslation();
  const state = useSelector(gameService, (state) => state.context.state);
  const { inventory, buildings, bumpkin } = state;
  const [showQueueInformation, setShowQueueInformation] = useState(false);
  const [showBoosts, setShowBoosts] = useState(false);
  const [showTimeBoosts, setShowTimeBoosts] = useState(false);

  const availableSlots = useVipAccess({ game: state }) ? MAX_COOKING_SLOTS : 1;
  const now = useNow({ live: true });

  // The limited-time Chapter Crop Week recipe (surfaced in its own panel).
  const eventRecipe = recipes.find(
    (recipe) => recipe.name === CHAPTER_CROP_WEEK_RECIPE,
  );

  const { boostedExp, boostsUsed } = getFoodExpBoost({
    food: selected,
    game: state,
    createdAt: now,
  });

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
      // Sort a copy — `queue` is a prop, and sorting it in place mutates what the
      // parent handed down.
      lastRecipeInQueueReadyAt = [...queue].sort(
        (a, b) => b.readyAt - a.readyAt,
      )[0]?.readyAt;
    }

    return lastRecipeInQueueReadyAt;
  };

  const recipeStartAt = getNewRecipeStartAt() ?? now;
  const {
    reducedSecs: cookingTime,
    baseDurationMs,
    boostsUsed: timeBoostsUsed,
  } = getReadyAt({
    buildingId: buildingId ?? "",
    item: selected.name,
    createdAt: recipeStartAt,
    game: state,
  });

  const baseTimeSeconds = COOKABLES[selected.name].cookingSeconds;

  const cookingStartedAt = (() => {
    if (!cooking || !buildingCraftingQueue) return undefined;

    const index = buildingCraftingQueue.findIndex((recipe) =>
      cooking.id !== undefined
        ? recipe.id === cooking.id
        : recipe.readyAt === cooking.readyAt,
    );
    if (index === -1) return undefined;

    return resolveCookingQueueTimings({
      crafting: buildingCraftingQueue,
      windows: cookingBoostWindows,
    })[index].startedAt;
  })();

  // The windowed boosters aren't in `boostsUsed` (they apply over the cook rather
  // than being baked into it), so name them for the boost panel: their rate in the
  // speed view, the time each one actually saves in the other. Evaluated at the
  // recipe's START, so a booster that will have expired by the time a queued recipe
  // begins is correctly left out.
  const cookingWindowedBoosts =
    baseDurationMs === undefined
      ? []
      : getBoostContributionEntries({
          contributions: getCookingBoostContributions(state, recipeStartAt),
          seconds: baseDurationMs / 1000,
          at: recipeStartAt,
          showActualTime,
          formatSeconds: (seconds) =>
            secondsToString(seconds, { length: "medium" }),
          formatSpeed: (speed) => t("description.boostedSpeed", { speed }),
        });

  const allTimeBoostsUsed = [...timeBoostsUsed, ...cookingWindowedBoosts];

  // Project the preview from when this recipe would actually START — the end of the
  // current queue, not now. A boost running today may well have expired by the time
  // a recipe queued behind three others begins, and the projection has to say so.
  const timeDisplay =
    baseDurationMs === undefined
      ? undefined
      : getPreActionDisplay({
          showActualTime,
          seconds: baseDurationMs / 1000,
          baseSeconds: baseTimeSeconds,
          namedBoostCount: allTimeBoostsUsed.length,
          windows: cookingBoostWindows,
          at: recipeStartAt,
        });

  const cook = () => onCook(selected.name);

  const collect = () => {
    gameService.send("recipes.collected", {
      buildingId,
      building: buildingName,
    });
  };

  const handleInstantCook = (
    cost: number,
    paymentMethod: "gems" | "coins" = "gems",
  ) => {
    gameService.send("recipe.spedUp", {
      buildingId,
      buildingName,
      paymentMethod,
    });

    gameAnalytics.trackSink({
      currency: paymentMethod === "coins" ? "Coins" : "Gem",
      amount: cost,
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
  // Saltbite (the CHAPTER_CROP_WEEK event recipe) neutralises upgraded Cooking
  // ranks, so preview the Double Nom label at its downgraded (applied) rank and
  // surface a notice when a real upgraded rank is being suppressed.
  const isEventRecipe = selected.name === CHAPTER_CROP_WEEK_RECIPE;
  const doubleNomLevel = getSkillLevel(
    isEventRecipe
      ? downgradeChapterCropWeekSkills(bumpkin.skills)
      : bumpkin.skills,
    "Double Nom",
  );
  const showAscensionPausedNotice =
    isEventRecipe && hasUpgradedChapterCropWeekSkill(bumpkin.skills, "Cooking");
  const isVIP = useVipAccess({ game: state });
  const isQueueFull =
    [...readyRecipes, ...queue].length + (cooking ? 1 : 0) >= availableSlots;

  return (
    <>
      <SplitScreenView
        matchPanelHeight
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
                xp: boostedExp,
                baseXp: selected.experience,
                xpBoostsUsed: boostsUsed,
                timeSeconds: timeDisplay?.displaySeconds ?? cookingTime,
                timeSpeed: timeDisplay?.speed,
                baseTimeSeconds,
                timeBoostsUsed: allTimeBoostsUsed,
              }}
              showBoosts={showBoosts}
              setShowBoosts={setShowBoosts}
              showTimeBoosts={showTimeBoosts}
              setShowTimeBoosts={setShowTimeBoosts}
              actionView={
                <>
                  {showAscensionPausedNotice && (
                    <Label type="warning">
                      {t("chapterCropWeek.ascensionBoostsPaused")}
                    </Label>
                  )}
                  {doubleNomLevel > 0 && (
                    <Label type="success" icon={powerup}>
                      {`Double Nom Boost: +${
                        SKILL_RANKS["Double Nom"].food[doubleNomLevel - 1]
                      } Food (${
                        SKILL_RANKS["Double Nom"].ingredients[
                          doubleNomLevel - 1
                        ]
                      }x Ingredients)`}
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
                product={cooking}
                onClose={onClose}
                isOilBoosted={!!isOilBoosted}
                onInstantReady={handleInstantCook}
                state={state}
                startedAt={cookingStartedAt}
                windows={cookingBoostWindows}
              />
            )}

            {cooking && isVIP && (
              <Queue
                buildingName={buildingName}
                buildingId={buildingId as string}
                product={cooking}
                queue={queue}
                readyProducts={readyRecipes}
                onClose={onClose}
              />
            )}

            {buildingId &&
              hasRequiredIslandExpansion(state.island.type, "desert") && (
                <BuildingOilTank
                  buildingName={buildingName}
                  buildingId={buildingId}
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
              {recipes
                .filter((item) => item.name !== CHAPTER_CROP_WEEK_RECIPE)
                .map((item) => (
                  <Box
                    isSelected={selected.name === item.name}
                    key={item.name}
                    onClick={() => {
                      setSelected(item);
                      setShowBoosts(false);
                      setShowTimeBoosts(false);
                    }}
                    image={ITEM_DETAILS[item.name].image}
                    count={inventory[item.name]}
                  />
                ))}
            </div>
            {eventRecipe && (
              <SpecialEventPanel
                image={ITEM_DETAILS[eventRecipe.name].image}
                title={t("chapterCropWeek.specialEventRecipe")}
                endDate={CHAPTER_CROP_WEEK.endDate}
                isSelected={selected.name === eventRecipe.name}
                count={inventory[eventRecipe.name]}
                onSelect={() => {
                  setSelected(eventRecipe);
                  setShowBoosts(false);
                  setShowTimeBoosts(false);
                }}
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
