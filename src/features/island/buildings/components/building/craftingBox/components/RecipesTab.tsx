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
  Recipe,
  RecipeCollectibleName,
  RecipeIngredient,
  RECIPES,
  Recipes,
} from "features/game/lib/crafting";
import { getImageUrl } from "lib/utils/getImageURLS";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { RecipeInfoPanel } from "./RecipeInfoPanel";
import { CollectibleName } from "features/game/types/craftables";
import { availableWardrobe } from "features/game/events/landExpansion/equip";
import { getBoostedCraftingTime } from "features/game/events/landExpansion/startCrafting";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import lightningIcon from "assets/icons/lightning.png";
import { InventoryItemName } from "features/game/types/game";
import { getChestItems } from "features/island/hud/components/inventory/utils/inventory";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import Decimal from "decimal.js-light";
import { Context } from "features/game/GameProvider";
import { BoostsDisplay } from "components/ui/layouts/BoostsDisplay";

const _state = (state: MachineState) => state.context.state;
const _farmId = (state: MachineState) => state.context.farmId;

interface Props {
  handleSetupRecipe: (recipe: Recipe) => void;
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
  const { recipes, status: craftingStatus } = craftingBox;

  const isPending = craftingStatus === "pending";
  const isCrafting = craftingStatus === "crafting";

  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecipes = !searchTerm.trim()
    ? recipes
    : getObjectEntries(recipes || {}).reduce<Partial<Recipes>>(
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
                          "cursor-not-allowed":
                            isPending || isCrafting || !canCraft,
                        },
                      )}
                      onClick={
                        isPending || isCrafting || !canCraft
                          ? undefined
                          : (e) => {
                              e.stopPropagation();
                              handleSetupRecipe(recipe);
                            }
                      }
                      disabled={isPending || isCrafting || !canCraft}
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
                          isPending || isCrafting || !canCraft
                            ? undefined
                            : () => handleSetupRecipe(recipe)
                        }
                        className={classNames("!p-0", {
                          "cursor-not-allowed":
                            isPending || isCrafting || !canCraft,
                          "opacity-50": !canCraft,
                        })}
                        disabled={isPending || isCrafting || !canCraft}
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
      </div>
    </div>
  );
};
