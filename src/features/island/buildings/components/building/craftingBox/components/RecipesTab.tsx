import React, { useState, useMemo } from "react";
import { useSelector } from "@xstate/react";
import {
  MachineInterpreter,
  MachineState,
} from "features/game/lib/gameMachine";
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
  RecipeIngredient,
  RecipeItemName,
  RECIPES,
  Recipes,
} from "features/game/lib/crafting";
import { getImageUrl } from "lib/utils/getImageURLS";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import Decimal from "decimal.js-light";
import { IngredientsInfoPanel } from "features/world/ui/IngredientsInfoPanel";
import { getKeys } from "features/game/types/decorations";
import { CollectibleName } from "features/game/types/craftables";
import { availableWardrobe } from "features/game/events/landExpansion/equip";

const _craftingBoxRecipes = (state: MachineState) =>
  state.context.state.craftingBox.recipes;
const _craftingStatus = (state: MachineState) =>
  state.context.state.craftingBox.status;
const _inventory = (state: MachineState) => state.context.state.inventory;
const _wardrobe = (state: MachineState) => state.context.state.wardrobe;

interface Props {
  gameService: MachineInterpreter;
  handleSetupRecipe: (recipe: Recipe) => void;
}

export const RecipesTab: React.FC<Props> = ({
  gameService,
  handleSetupRecipe,
}) => {
  const { t } = useTranslation();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const recipes = useSelector(gameService, _craftingBoxRecipes);

  const craftingStatus = useSelector(gameService, _craftingStatus);
  const isPending = craftingStatus === "pending";
  const isCrafting = craftingStatus === "crafting";

  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecipes = useMemo(() => {
    if (!searchTerm.trim()) return recipes;
    return Object.entries(recipes || {}).reduce((acc, [name, recipe]) => {
      if (name.toLowerCase().includes(searchTerm.toLowerCase())) {
        acc[name as RecipeItemName] = recipe;
      }
      return acc;
    }, {} as Recipes);
  }, [recipes, searchTerm]);

  const sillhouetteRecipes = useMemo(() => {
    return Object.entries(RECIPES).reduce((acc, [name, recipe]) => {
      if (!recipes[name as RecipeItemName]) {
        acc[name as RecipeItemName] = recipe;
      }
      return acc;
    }, {} as Recipes);
  }, [recipes, searchTerm]);

  const inventory = useSelector(gameService, _inventory);
  const wardrobe = useSelector(gameService, _wardrobe);

  const remainingInventory = useMemo(() => {
    const updatedInventory = { ...inventory };

    // Removed placed items
    getKeys(updatedInventory).forEach((itemName) => {
      const placedCount =
        (gameService.state.context.state.collectibles[
          itemName as CollectibleName
        ]?.length ?? 0) +
        (gameService.state.context.state.home?.collectibles[
          itemName as CollectibleName
        ]?.length ?? 0);

      updatedInventory[itemName] = (
        updatedInventory[itemName] ?? new Decimal(0)
      ).minus(placedCount);
    });

    return updatedInventory;
  }, [inventory]);

  const remainingWardrobe = useMemo(() => {
    const updatedWardrobe = availableWardrobe(gameService.state.context.state);

    return updatedWardrobe;
  }, [wardrobe]);

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

            return (
              <div
                onClick={() => setSelectedRecipe(recipe)}
                key={recipe.name}
                className="relative flex flex-col p-2 bg-brown-200 rounded-lg border border-brown-400 cursor-pointer"
              >
                <IngredientsInfoPanel
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
                      </ButtonPanel>
                    </div>
                    <div className="flex mt-1">
                      <img
                        src={SUNNYSIDE.icons.stopwatch}
                        className="w-3 h-3 mr-1"
                        alt="Crafting time"
                      />
                      <span className="text-xxs">
                        {recipe.time
                          ? secondsToString(recipe.time / 1000, {
                              length: "short",
                              isShortFormat: true,
                            })
                          : "Instant"}
                      </span>
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

        {!searchTerm.trim() && (
          <>
            <Label type="default" className="my-2">
              {t("Undiscovered")}
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.values(sillhouetteRecipes || {}).map((recipe) => (
                <div
                  key={recipe.name}
                  className="flex flex-col p-2 bg-brown-200 rounded-lg border border-brown-400"
                >
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
                        <img
                          src={SUNNYSIDE.icons.stopwatch}
                          className="w-3 h-3 mr-1"
                          alt="Crafting time"
                        />
                        <SquareIcon
                          icon={SUNNYSIDE.icons.expression_confused}
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
                                    ITEM_DETAILS[ingredient.collectible]?.image
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
