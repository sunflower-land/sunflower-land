import React, { useState, useContext } from "react";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { Label } from "components/ui/Label";
import { useTranslation } from "react-i18next";
import { TextInput } from "components/ui/TextInput";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import { ButtonPanel } from "components/ui/Panel";
import classNames from "classnames";
import { SquareIcon } from "components/ui/SquareIcon";
import {
  CHAPTER_CRAFTING_ITEMS,
  Recipe,
  RecipeCollectibleName,
  RecipeIngredient,
  RECIPES,
  Recipes,
} from "features/game/lib/crafting";
import {
  getCurrentChapter,
  secondsLeftInChapter,
} from "features/game/types/chapters";
import { getImageUrl } from "lib/utils/getImageURLS";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { RecipeInfoPanel } from "./RecipeInfoPanel";
import { CollectibleName } from "features/game/types/craftables";
import { availableWardrobe } from "features/game/events/landExpansion/equip";
import { getBoostedCraftingTime } from "features/game/events/landExpansion/startCrafting";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import lightningIcon from "assets/icons/lightning.png";
import { CraftingQueueItem, InventoryItemName } from "features/game/types/game";
import { useVipAccess } from "lib/utils/hooks/useVipAccess";
import { getChestItems } from "features/island/hud/components/inventory/utils/inventory";
import { getObjectEntries } from "lib/object";
import Decimal from "decimal.js-light";
import { Context } from "features/game/GameProvider";
import { BoostsDisplay } from "components/ui/layouts/BoostsDisplay";
import { randomID } from "lib/utils/random";
import { padRecipeIngredients } from "./craftingBoxUtils";

const _state = (state: MachineState) => state.context.state;

const MAX_CRAFTING_SLOTS = 4;

interface Props {
  handleSetupRecipe: (recipe: Recipe, targetSlot?: number) => void;
}

const _remainingInventory = (state: MachineState) => {
  const game = state.context.state;
  const chestItems = getChestItems(game);
  const updatedInventory = { ...game.inventory, ...chestItems };

  return updatedInventory;
};

const _remainingWardrobe = (state: MachineState) => {
  const game = state.context.state;
  const updatedWardrobe = availableWardrobe(game);

  return updatedWardrobe;
};

export const RecipesTab: React.FC<Props> = ({ handleSetupRecipe }) => {
  const { gameService } = useContext(Context);
  const { t } = useTranslation();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showBoostsRecipeName, setShowBoostsRecipeName] = useState<
    string | null
  >(null);

  const state = useSelector(gameService, _state);
  const remainingInventory = useSelector(gameService, _remainingInventory);
  const remainingWardrobe = useSelector(gameService, _remainingWardrobe);

  const { craftingBox } = state;
  const { recipes, status: craftingStatus, queue: rawQueue } = craftingBox;

  const craftingQueue: CraftingQueueItem[] = rawQueue ?? [];

  const isVIP = useVipAccess({ game: state });
  const availableSlots = isVIP ? MAX_CRAFTING_SLOTS : 1;
  const isQueueFull = craftingQueue.length >= availableSlots;
  const canAddToQueue = craftingStatus === "crafting" && isVIP && !isQueueFull;

  const isPending = craftingStatus === "pending";
  const isCrafting = craftingStatus === "crafting";

  const [searchTerm, setSearchTerm] = useState("");

  const [now] = useState(() => Date.now());
  const currentChapter = getCurrentChapter(now);
  const chapterSecondsLeft = secondsLeftInChapter(now);

  // Separate chapter-specific recipes from regular ones.
  // Chapter items are sourced from the global RECIPES constant so they always
  // appear regardless of whether they're in the player's craftingBox.recipes.
  const regularRecipes = getObjectEntries(recipes || {}).reduce<
    Partial<Recipes>
  >((acc, [name, recipe]) => {
    if (!CHAPTER_CRAFTING_ITEMS[name]) {
      acc[name] = recipe;
    }
    return acc;
  }, {});

  const chapterRecipes = getObjectEntries(RECIPES).reduce<Partial<Recipes>>(
    (acc, [name, recipe]) => {
      const requiredChapter = CHAPTER_CRAFTING_ITEMS[name];
      if (requiredChapter && requiredChapter === currentChapter) {
        // Prefer the player's discovered recipe data (which has actual ingredients
        // from the server) over the static recipe that has an empty ingredients array.
        const playerRecipe = recipes[name as RecipeCollectibleName];
        acc[name] = playerRecipe ?? recipe;
      }
      return acc;
    },
    {},
  );

  const filteredRecipes = !searchTerm.trim()
    ? regularRecipes
    : getObjectEntries(regularRecipes || {}).reduce<Partial<Recipes>>(
        (acc, [name, recipe]) => {
          if (name.toLowerCase().includes(searchTerm.toLowerCase())) {
            acc[name] = recipe;
          }
          return acc;
        },
        {},
      );

  const filteredChapterRecipes = !searchTerm.trim()
    ? chapterRecipes
    : getObjectEntries(chapterRecipes || {}).reduce<Partial<Recipes>>(
        (acc, [name, recipe]) => {
          if (name.toLowerCase().includes(searchTerm.toLowerCase())) {
            acc[name] = recipe;
          }
          return acc;
        },
        {},
      );

  const sillhouetteRecipes = getObjectEntries(RECIPES).reduce<Partial<Recipes>>(
    (acc, [name, recipe]) => {
      // Always exclude chapter items — they render in their own section
      if (CHAPTER_CRAFTING_ITEMS[name]) {
        return acc;
      }
      if (!recipes[name]) {
        acc[name] = recipe;
      }
      return acc;
    },
    {},
  );

  const hasRequiredIngredients = (recipe: Recipe) => {
    // Track required amounts for each ingredient
    const requiredAmounts: Record<string, number> = {};

    // Count up total required for each ingredient
    recipe.ingredients.forEach((ingredient) => {
      if (ingredient?.collectible) {
        requiredAmounts[ingredient.collectible] =
          (requiredAmounts[ingredient.collectible] || 0) + 1;
      }
      if (ingredient?.wearable) {
        requiredAmounts[ingredient.wearable] =
          (requiredAmounts[ingredient.wearable] || 0) + 1;
      }
    });

    // Check if we have enough of each required ingredient
    return Object.entries(requiredAmounts).every(([item, amount]) => {
      const inventoryAmount = remainingInventory[item as CollectibleName];
      if (inventoryAmount) {
        return inventoryAmount.gte(amount);
      }

      const wardrobeAmount = remainingWardrobe[item as BumpkinItem];
      if (wardrobeAmount) {
        return wardrobeAmount >= amount;
      }
      return false;
    });
  };

  const recipeAmount = (recipeName: RecipeCollectibleName) =>
    remainingInventory[recipeName as RecipeCollectibleName] ?? new Decimal(0);

  const targetSlot = canAddToQueue ? (craftingQueue?.length ?? 0) : 0;

  const isRecipeCraftButtonDisabled = ({
    recipe,
    canCraft,
    isDiscovered = true,
  }: {
    recipe: Recipe;
    canCraft: boolean;
    isDiscovered?: boolean;
  }) =>
    !isDiscovered ||
    isPending ||
    !canCraft ||
    (isCrafting && !canAddToQueue && recipe.time !== 0);

  const handleRecipeCraft = (recipe: Recipe, targetSlot?: number) => {
    if (recipe.time === 0) {
      gameService.send("crafting.started", {
        ingredients: padRecipeIngredients(recipe),
        queueItemId: randomID(),
      });
      return;
    }

    handleSetupRecipe(recipe, targetSlot);
  };

  return (
    <div className="flex flex-col">
      <Label type="default" className="mb-2">
        {t("recipes")}
      </Label>
      <TextInput
        placeholder={t("search")}
        value={searchTerm}
        onValueChange={(value) => setSearchTerm(value)}
        className="mb-2"
      />
      <div className="overflow-y-auto max-h-96 scrollable">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.values(filteredRecipes || {}).map((recipe) => {
            const canCraft = hasRequiredIngredients(recipe);
            const isCraftButtonDisabled = isRecipeCraftButtonDisabled({
              recipe,
              canCraft,
            });
            const { seconds: boostedCraftTime, boostsUsed } =
              getBoostedCraftingTime({
                game: state,
                time: recipe.time,
              });

            return (
              <div
                onClick={() => setSelectedRecipe(recipe)}
                key={recipe.name}
                className="relative flex flex-col p-2 bg-brown-200 rounded-lg border border-brown-400 cursor-pointer"
              >
                <RecipeInfoPanel
                  show={!!selectedRecipe && selectedRecipe.name === recipe.name}
                  ingredients={
                    selectedRecipe?.ingredients.filter(
                      (ingredient) => ingredient !== null,
                    ) as RecipeIngredient[]
                  }
                  onClick={() => setSelectedRecipe(null)}
                />
                <div className="flex justify-between">
                  <Label type="transparent" className="mb-1">
                    {recipe.name}
                  </Label>
                  <div>
                    <ButtonPanel
                      className={classNames(
                        "flex items-center relative mb-1 cursor-pointer !p-0",
                        {
                          "cursor-not-allowed": isCraftButtonDisabled,
                        },
                      )}
                      onClick={
                        isCraftButtonDisabled
                          ? undefined
                          : (e) => {
                              e.stopPropagation();
                              handleRecipeCraft(recipe, targetSlot);
                            }
                      }
                      disabled={isCraftButtonDisabled}
                    >
                      <SquareIcon icon={SUNNYSIDE.icons.hammer} width={5} />
                    </ButtonPanel>
                  </div>
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex flex-col mr-2">
                    <div className="flex">
                      <ButtonPanel
                        onClick={
                          isCraftButtonDisabled
                            ? undefined
                            : () => handleRecipeCraft(recipe, targetSlot)
                        }
                        className={classNames("!p-0", {
                          "cursor-not-allowed": isCraftButtonDisabled,
                          "opacity-50": !canCraft,
                        })}
                        disabled={isCraftButtonDisabled}
                      >
                        {recipe.type === "collectible" && (
                          <img
                            src={ITEM_DETAILS[recipe.name]?.image}
                            alt={recipe.name}
                            className="w-6 h-6 object-contain"
                          />
                        )}
                        {recipe.type === "wearable" && (
                          <img
                            src={getImageUrl(ITEM_IDS[recipe.name])}
                            className="w-6 h-6 object-contain"
                          />
                        )}
                        {recipeAmount(recipe.name as RecipeCollectibleName).gt(
                          0,
                        ) && (
                          <div className="absolute -top-4 -right-4">
                            <Label type="default">
                              <p className="text-xxs">{`${recipeAmount(recipe.name as RecipeCollectibleName)}`}</p>
                            </Label>
                          </div>
                        )}
                      </ButtonPanel>
                    </div>
                    <div className="flex flex-col mt-1">
                      {boostsUsed.length > 0 ? (
                        <div
                          className="flex flex-col items-start cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowBoostsRecipeName(
                              showBoostsRecipeName === recipe.name
                                ? null
                                : recipe.name,
                            );
                          }}
                        >
                          <div className="flex">
                            <img
                              src={SUNNYSIDE.icons.lightning}
                              className="w-3 h-3 mr-1"
                              alt="Crafting time"
                            />
                            <span className="text-xxs">
                              {boostedCraftTime
                                ? secondsToString(boostedCraftTime / 1000, {
                                    length: "medium",
                                    isShortFormat: true,
                                  })
                                : "Instant"}
                            </span>
                          </div>
                          {recipe.time > 0 && (
                            <div className="flex">
                              <img
                                src={SUNNYSIDE.icons.stopwatch}
                                className="w-3 h-3 mr-1"
                                alt="Crafting time"
                              />
                              <span className="text-xxs line-through">
                                {secondsToString(recipe.time / 1000, {
                                  length: "medium",
                                  isShortFormat: true,
                                })}
                              </span>
                            </div>
                          )}
                          <BoostsDisplay
                            boosts={boostsUsed}
                            show={showBoostsRecipeName === recipe.name}
                            state={state}
                            onClick={() =>
                              setShowBoostsRecipeName(
                                showBoostsRecipeName === recipe.name
                                  ? null
                                  : recipe.name,
                              )
                            }
                          />
                        </div>
                      ) : (
                        <div className="flex">
                          <img
                            src={SUNNYSIDE.icons.stopwatch}
                            className="w-3 h-3 mr-1"
                            alt="Crafting time"
                          />
                          <span className="text-xxs">
                            {boostedCraftTime
                              ? secondsToString(boostedCraftTime / 1000, {
                                  length: "medium",
                                  isShortFormat: true,
                                })
                              : "Instant"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-0.5">
                    {Array(9)
                      .fill(null)
                      .map((_, index) => {
                        const ingredient = recipe.ingredients[index];
                        return (
                          <div
                            key={index}
                            className="w-6 h-6 bg-brown-600 rounded border border-brown-700 flex items-center justify-center"
                          >
                            {ingredient?.collectible && (
                              <img
                                src={
                                  ITEM_DETAILS[ingredient.collectible]?.image
                                }
                                className="w-5 h-5 object-contain"
                              />
                            )}
                            {ingredient?.wearable && (
                              <img
                                src={getImageUrl(ITEM_IDS[ingredient.wearable])}
                                className="w-5 h-5 object-contain"
                              />
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!searchTerm.trim() &&
          Object.keys(sillhouetteRecipes || {}).length > 0 && (
            <>
              <Label type="default" className="my-2">
                {t("undiscovered")}
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.values(sillhouetteRecipes || {}).map((recipe) => (
                  <div
                    key={recipe.name}
                    className="flex flex-col p-2 bg-brown-200 rounded-lg border border-brown-400"
                  >
                    <Label type="transparent" className="mb-1">
                      {recipe.name}
                    </Label>
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col mr-2">
                        <div className="flex">
                          <ButtonPanel
                            className={classNames("!p-0 cursor-not-allowed")}
                            disabled={true}
                          >
                            {recipe.type === "collectible" && (
                              <img
                                src={ITEM_DETAILS[recipe.name]?.image}
                                alt={recipe.name}
                                className="w-6 h-6 object-contain silhouette"
                              />
                            )}
                            {recipe.type === "wearable" && (
                              <img
                                src={getImageUrl(ITEM_IDS[recipe.name])}
                                className="w-6 h-6 object-contain silhouette"
                              />
                            )}
                          </ButtonPanel>
                        </div>
                        <div className="flex mt-1">
                          <SquareIcon
                            icon={
                              COLLECTIBLE_BUFF_LABELS[
                                recipe.name as InventoryItemName
                              ]?.({
                                skills: state.bumpkin.skills,
                                collectibles: state.collectibles,
                              })?.length
                                ? lightningIcon
                                : SUNNYSIDE.icons.expression_confused
                            }
                            width={7}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-0.5">
                        {Array(9)
                          .fill(null)
                          .map((_, index) => {
                            const ingredient = recipe.ingredients[index];
                            return (
                              <div
                                key={index}
                                className="w-6 h-6 bg-brown-600 rounded border border-brown-700 flex items-center justify-center"
                              >
                                {ingredient?.collectible && (
                                  <img
                                    src={
                                      ITEM_DETAILS[ingredient.collectible]
                                        ?.image
                                    }
                                    className="w-5 h-5 object-contain"
                                  />
                                )}
                                {ingredient?.wearable && (
                                  <img
                                    src={getImageUrl(
                                      ITEM_IDS[ingredient.wearable],
                                    )}
                                    className="w-5 h-5 object-contain"
                                  />
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        {Object.keys(filteredChapterRecipes || {}).length > 0 && (
          <>
            <div className="flex items-center justify-between my-2">
              <Label type="vibrant">{t("chapterCrafting")}</Label>
              <Label
                type="info"
                className="flex items-center mr-0.5"
                icon={SUNNYSIDE.icons.stopwatch}
              >
                {secondsToString(chapterSecondsLeft, {
                  length: "short",
                  isShortFormat: true,
                })}{" "}
                {t("time.left")}
              </Label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
              {Object.values(filteredChapterRecipes || {}).map((recipe) => {
                const isDiscovered =
                  !!recipes[recipe.name as RecipeCollectibleName];
                const canCraft = isDiscovered && hasRequiredIngredients(recipe);
                const isCraftButtonDisabled = isRecipeCraftButtonDisabled({
                  recipe,
                  canCraft,
                  isDiscovered,
                });
                const { seconds: boostedCraftTime, boostsUsed } =
                  getBoostedCraftingTime({
                    game: state,
                    time: recipe.time,
                  });

                return (
                  <div
                    onClick={() => setSelectedRecipe(recipe)}
                    key={recipe.name}
                    className="relative flex flex-col p-2 bg-brown-200 rounded-lg border border-brown-400 cursor-pointer"
                  >
                    <RecipeInfoPanel
                      show={
                        !!selectedRecipe && selectedRecipe.name === recipe.name
                      }
                      ingredients={
                        selectedRecipe?.ingredients.filter(
                          (ingredient) => ingredient !== null,
                        ) as RecipeIngredient[]
                      }
                      onClick={() => setSelectedRecipe(null)}
                    />
                    <div className="flex justify-between">
                      <Label type="transparent" className="mb-1">
                        {recipe.name}
                      </Label>
                      <div>
                        <ButtonPanel
                          className={classNames(
                            "flex items-center relative mb-1 cursor-pointer !p-0",
                            {
                              "cursor-not-allowed": isCraftButtonDisabled,
                            },
                          )}
                          onClick={
                            isCraftButtonDisabled
                              ? undefined
                              : (e) => {
                                  e.stopPropagation();
                                  handleRecipeCraft(recipe, targetSlot);
                                }
                          }
                          disabled={isCraftButtonDisabled}
                        >
                          <SquareIcon icon={SUNNYSIDE.icons.hammer} width={5} />
                        </ButtonPanel>
                      </div>
                    </div>
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col mr-2">
                        <div className="flex">
                          <ButtonPanel
                            onClick={
                              isCraftButtonDisabled
                                ? undefined
                                : () => handleRecipeCraft(recipe, targetSlot)
                            }
                            className={classNames("!p-0", {
                              "cursor-not-allowed": isCraftButtonDisabled,
                              "opacity-50": !canCraft,
                            })}
                            disabled={isCraftButtonDisabled}
                          >
                            {recipe.type === "collectible" && (
                              <img
                                src={ITEM_DETAILS[recipe.name]?.image}
                                alt={recipe.name}
                                className={classNames(
                                  "w-6 h-6 object-contain",
                                  { silhouette: !isDiscovered },
                                )}
                              />
                            )}
                            {recipe.type === "wearable" && (
                              <img
                                src={getImageUrl(ITEM_IDS[recipe.name])}
                                className={classNames(
                                  "w-6 h-6 object-contain",
                                  { silhouette: !isDiscovered },
                                )}
                              />
                            )}
                            {recipeAmount(
                              recipe.name as RecipeCollectibleName,
                            ).gt(0) && (
                              <div className="absolute -top-4 -right-4">
                                <Label type="default">
                                  <p className="text-xxs">{`${recipeAmount(recipe.name as RecipeCollectibleName)}`}</p>
                                </Label>
                              </div>
                            )}
                          </ButtonPanel>
                        </div>
                        <div className="flex flex-col mt-1">
                          {boostsUsed.length > 0 ? (
                            <div
                              className="flex flex-col items-start cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowBoostsRecipeName(
                                  showBoostsRecipeName === recipe.name
                                    ? null
                                    : recipe.name,
                                );
                              }}
                            >
                              <div className="flex">
                                <img
                                  src={SUNNYSIDE.icons.lightning}
                                  className="w-3 h-3 mr-1"
                                  alt="Crafting time"
                                />
                                <span className="text-xxs">
                                  {boostedCraftTime
                                    ? secondsToString(boostedCraftTime / 1000, {
                                        length: "medium",
                                        isShortFormat: true,
                                      })
                                    : "Instant"}
                                </span>
                              </div>
                              {recipe.time > 0 && (
                                <div className="flex">
                                  <img
                                    src={SUNNYSIDE.icons.stopwatch}
                                    className="w-3 h-3 mr-1"
                                    alt="Crafting time"
                                  />
                                  <span className="text-xxs line-through">
                                    {secondsToString(recipe.time / 1000, {
                                      length: "medium",
                                      isShortFormat: true,
                                    })}
                                  </span>
                                </div>
                              )}
                              <BoostsDisplay
                                boosts={boostsUsed}
                                show={showBoostsRecipeName === recipe.name}
                                state={state}
                                onClick={() =>
                                  setShowBoostsRecipeName(
                                    showBoostsRecipeName === recipe.name
                                      ? null
                                      : recipe.name,
                                  )
                                }
                              />
                            </div>
                          ) : (
                            <div className="flex">
                              <img
                                src={SUNNYSIDE.icons.stopwatch}
                                className="w-3 h-3 mr-1"
                                alt="Crafting time"
                              />
                              <span className="text-xxs">
                                {boostedCraftTime
                                  ? secondsToString(boostedCraftTime / 1000, {
                                      length: "medium",
                                      isShortFormat: true,
                                    })
                                  : "Instant"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-0.5">
                        {Array(9)
                          .fill(null)
                          .map((_, index) => {
                            const ingredient = recipe.ingredients[index];
                            return (
                              <div
                                key={index}
                                className="w-6 h-6 bg-brown-600 rounded border border-brown-700 flex items-center justify-center"
                              >
                                {ingredient?.collectible && (
                                  <img
                                    src={
                                      ITEM_DETAILS[ingredient.collectible]
                                        ?.image
                                    }
                                    className="w-5 h-5 object-contain"
                                  />
                                )}
                                {ingredient?.wearable && (
                                  <img
                                    src={getImageUrl(
                                      ITEM_IDS[ingredient.wearable],
                                    )}
                                    className="w-5 h-5 object-contain"
                                  />
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
