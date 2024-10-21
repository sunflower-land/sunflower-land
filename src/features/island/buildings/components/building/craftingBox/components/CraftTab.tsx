import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "@xstate/react";
import {
  MachineInterpreter,
  MachineState,
} from "features/game/lib/gameMachine";
import { Label } from "components/ui/Label";
import { InventoryItemName } from "features/game/types/game";
import { Button } from "components/ui/Button";
import { useTranslation } from "react-i18next";
import { Box } from "components/ui/Box";
import Decimal from "decimal.js-light";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SquareIcon } from "components/ui/SquareIcon";
import { Recipe, RecipeIngredient } from "features/game/lib/crafting";
import { findMatchingRecipe } from "features/game/events/landExpansion/startCrafting";
import { getImageUrl } from "lib/utils/getImageURLS";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";

const VALID_CRAFTING_RESOURCES: InventoryItemName[] = [
  "Wood",
  "Stone",
  "Wild Mushroom",
  "White Pansy",
  "Sunflower",
  "Potato",
  "Pumpkin",
  "Wool",
  "Iron",
  "Feather",
  "Carrot",
  "Radish",
  "Leather",
];
const VALID_CRAFTING_WEARABLES: BumpkinItem[] = ["Basic Hair", "Farmer Pants"];

const _inventory = (state: MachineState) => state.context.state.inventory;
const _craftingStatus = (state: MachineState) =>
  state.context.state.craftingBox.status;
const _craftingReadyAt = (state: MachineState) =>
  state.context.state.craftingBox.readyAt;
const _craftingBoxRecipes = (state: MachineState) =>
  state.context.state.craftingBox.recipes;
const _wardrobe = (state: MachineState) => state.context.state.wardrobe;
interface Props {
  gameService: MachineInterpreter;
  selectedItems: (RecipeIngredient | null)[];
  setSelectedItems: (items: (RecipeIngredient | null)[]) => void;
}

export const CraftTab: React.FC<Props> = ({
  gameService,
  selectedItems,
  setSelectedItems,
}) => {
  const { t } = useTranslation();

  const inventory = useSelector(gameService, _inventory);
  const wardrobe = useSelector(gameService, _wardrobe);
  const craftingStatus = useSelector(gameService, _craftingStatus);
  const craftingReadyAt = useSelector(gameService, _craftingReadyAt);
  const recipes = useSelector(gameService, _craftingBoxRecipes);

  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [failedAttempt, setFailedAttempt] = useState(false);

  const [selectedIngredient, setSelectedIngredient] =
    useState<RecipeIngredient | null>(null);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);

  const isPending = craftingStatus === "pending";
  const isCrafting = craftingStatus === "crafting";
  const isIdle = craftingStatus === "idle";
  const isReady = remainingTime !== null && remainingTime <= 0;

  const processRemainingTime = () => {
    const now = Date.now();
    const remaining = Math.max(0, craftingReadyAt - now);
    setRemainingTime(remaining);

    return remaining;
  };

  const remainingInventory = useMemo(() => {
    const updatedInventory = { ...inventory };
    selectedItems.forEach((item) => {
      const collectible = item?.collectible;
      if (collectible && updatedInventory[collectible]) {
        updatedInventory[collectible] = updatedInventory[collectible].minus(1);
      }
    });
    return updatedInventory;
  }, [inventory, selectedItems]);

  const remainingWardrobe = useMemo(() => {
    const updatedWardrobe = { ...wardrobe };
    selectedItems.forEach((item) => {
      const wearable = item?.wearable;
      if (wearable && updatedWardrobe[wearable]) {
        updatedWardrobe[wearable] = updatedWardrobe[wearable] - 1;
      }
    });
    return updatedWardrobe;
  }, [wardrobe, selectedItems]);

  /** Countdown timer */
  useEffect(() => {
    if (craftingStatus === "crafting" && craftingReadyAt) {
      processRemainingTime();

      const interval = setInterval(() => {
        const remaining = processRemainingTime();
        if (remaining <= 0) clearInterval(interval);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [craftingStatus, craftingReadyAt]);

  /** Failed attempt */
  useEffect(() => {
    if (craftingStatus === "pending") {
      setFailedAttempt(true);
    }

    if (craftingStatus === "crafting") {
      setFailedAttempt(false);
    }
  }, [craftingStatus]);

  /** Reset failed attempt */
  useEffect(() => {
    if (craftingStatus !== "pending") {
      setFailedAttempt(false);
    }
  }, [selectedItems]);

  /**
   * Find the recipe that matches the selected items
   */
  useEffect(() => {
    if (isCrafting) return;
    const foundRecipe = findMatchingRecipe(selectedItems, recipes);

    if (foundRecipe) {
      setCurrentRecipe(foundRecipe);
    } else {
      setCurrentRecipe(null);
    }
  }, [selectedItems, recipes]);

  const isCraftingBoxEmpty = useMemo(() => {
    return selectedItems.every((item) => item === null);
  }, [selectedItems]);

  const hasIngredient = (ingredient: RecipeIngredient) =>
    (ingredient.collectible &&
      (remainingInventory[ingredient.collectible] ?? new Decimal(0))?.gte(1)) ||
    (ingredient.wearable && (remainingWardrobe[ingredient.wearable] ?? 0) >= 1);

  /**
   * Drag and drop
   */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    ingredient: RecipeIngredient,
  ) => {
    if (isPending || isCrafting || !hasIngredient(ingredient)) {
      e.preventDefault();
      return;
    }

    setSelectedIngredient(ingredient);
    e.dataTransfer.setData("application/json", JSON.stringify(ingredient));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      const ingredient = data as RecipeIngredient;

      if (
        craftingStatus === "pending" &&
        ingredient.collectible &&
        remainingInventory[ingredient.collectible]?.lessThanOrEqualTo(0)
      )
        return;

      const newSelectedItems = [...selectedItems];
      newSelectedItems[index] = ingredient;
      setSelectedItems(newSelectedItems);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Invalid drag data", error);
    }
  };

  const handleBoxSelect = (index: number) => {
    if (isPending || isCrafting) return;

    const newSelectedItems = [...selectedItems];

    if (!selectedItems[index]?.collectible && !selectedItems[index]?.wearable) {
      // If the box is empty, add the selected resource
      if (selectedIngredient && !hasIngredient(selectedIngredient)) return;

      newSelectedItems[index] = selectedIngredient;
    } else if (
      selectedItems[index].collectible === selectedIngredient?.collectible &&
      selectedItems[index].wearable === selectedIngredient?.wearable
    ) {
      // If the box has the same resource, set it to null
      newSelectedItems[index] = null;
    } else {
      // If the box has a different resource, replace it
      if (selectedIngredient && !hasIngredient(selectedIngredient)) return;

      newSelectedItems[index] = selectedIngredient;
    }

    setSelectedItems(newSelectedItems);
  };

  const handleIngredientSelect = (ingredient: RecipeIngredient) => {
    setSelectedIngredient(ingredient);
  };

  const handleCraft = () => {
    if (craftingStatus === "pending") return;

    gameService.send("crafting.started", {
      ingredients: selectedItems,
    });
    if (!currentRecipe) gameService.send("SAVE");
  };

  const handleCollect = () => {
    if (isReady) {
      gameService.send("crafting.collected");
    }
  };

  return (
    <>
      <Label type="default" className="mb-1">
        {t("craft")}
      </Label>
      <div className="flex mb-2">
        {/** Crafting Grid */}
        <div className="grid grid-cols-3 gap-1 flex-shrink-0">
          {selectedItems.map((item, index) => (
            <Box
              key={`${index}-${item}`}
              image={
                item?.collectible
                  ? ITEM_DETAILS[item.collectible]?.image
                  : item?.wearable
                    ? getImageUrl(ITEM_IDS[item.wearable])
                    : undefined
              }
              onClick={() => handleBoxSelect(index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              disabled={isPending}
            />
          ))}
        </div>
        {/** Arrow */}
        <div className="flex items-center justify-center flex-grow">
          <img
            src={SUNNYSIDE.icons.arrow_right}
            className="pointer-events-none mb-2"
            style={{
              width: `${PIXEL_SCALE * 8}px`,
              height: `${PIXEL_SCALE * 8}px`,
            }}
          />
        </div>

        {/** Crafting Result */}
        <div className="flex flex-col items-center justify-center flex-grow">
          <CraftDetails
            recipe={currentRecipe}
            isPending={isPending}
            failedAttempt={failedAttempt}
          />
          <CraftTimer
            remainingTime={
              isIdle && currentRecipe ? currentRecipe.time : remainingTime
            }
            isIdle={isIdle}
          />
          <CraftButton
            isIdle={isIdle}
            isCrafting={isCrafting}
            isPending={isPending}
            isReady={isReady}
            handleCollect={handleCollect}
            handleCraft={handleCraft}
            isCraftingBoxEmpty={isCraftingBoxEmpty}
          />
        </div>
      </div>

      {/** Resources */}
      <div className="flex flex-col">
        <Label type="default" className="mb-1">
          {t("resources")}
        </Label>
        <div className="flex flex-wrap max-h-48 overflow-y-auto">
          {VALID_CRAFTING_RESOURCES.map((itemName) => {
            const amount = remainingInventory[itemName] || new Decimal(0);
            return (
              <div
                key={itemName}
                draggable={!isPending && amount.greaterThan(0)}
                onDragStart={(e) =>
                  handleDragStart(e, { collectible: itemName })
                }
                className="flex"
              >
                <Box
                  count={amount}
                  image={ITEM_DETAILS[itemName]?.image}
                  isSelected={selectedIngredient?.collectible === itemName}
                  onClick={() =>
                    handleIngredientSelect({ collectible: itemName })
                  }
                  disabled={
                    isPending || isCrafting || amount.lessThanOrEqualTo(0)
                  }
                />
              </div>
            );
          })}
        </div>
      </div>

      {/** Wearables */}
      <div className="flex flex-col">
        <Label type="default" className="mb-1">
          {t("wearables")}
        </Label>
        <div className="flex flex-wrap max-h-48 overflow-y-auto">
          {VALID_CRAFTING_WEARABLES.map((itemName) => {
            const amount = remainingWardrobe[itemName] || 0;
            return (
              <div
                key={itemName}
                draggable={!isPending && amount > 0}
                onDragStart={(e) => handleDragStart(e, { wearable: itemName })}
                className="flex"
              >
                <Box
                  count={new Decimal(amount)}
                  image={getImageUrl(ITEM_IDS[itemName])}
                  isSelected={selectedIngredient?.wearable === itemName}
                  onClick={() => handleIngredientSelect({ wearable: itemName })}
                  disabled={isPending || isCrafting || amount <= 0}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

const CraftDetails: React.FC<{
  recipe: Recipe | null;
  isPending: boolean;
  failedAttempt: boolean;
}> = ({ recipe, isPending, failedAttempt }) => {
  if (!recipe) {
    return (
      <>
        <Label
          type={!isPending && failedAttempt ? "warning" : "default"}
          icon={
            isPending
              ? SUNNYSIDE.icons.hammer
              : failedAttempt
                ? SUNNYSIDE.icons.cancel
                : SUNNYSIDE.icons.search
          }
          className="mt-2 mb-1"
        >
          {isPending ? "Pending" : failedAttempt ? "Failed" : "Unknown"}
        </Label>
        <Box
          image={isPending ? SUNNYSIDE.icons.expression_confused : undefined}
          key={`box-${isPending}`}
        />
      </>
    );
  }

  return (
    <>
      <Label type="default" className="mt-2 mb-1" icon={SUNNYSIDE.icons.hammer}>
        {recipe.name}
      </Label>
      <Box
        image={
          recipe.type === "collectible"
            ? ITEM_DETAILS[recipe.name as InventoryItemName].image
            : getImageUrl(ITEM_IDS[recipe.name as BumpkinItem])
        }
        count={new Decimal(1)}
      />
    </>
  );
};

const CraftTimer: React.FC<{
  remainingTime: number | null;
  isIdle: boolean;
}> = ({ remainingTime, isIdle }) => {
  return (
    <div className="flex items-center justify-center">
      {
        <Label
          type="transparent"
          className="ml-3 my-1"
          icon={SUNNYSIDE.icons.stopwatch}
        >
          {remainingTime === null && (
            <SquareIcon icon={SUNNYSIDE.icons.expression_confused} width={7} />
          )}
          {remainingTime !== null &&
            (remainingTime > 0
              ? secondsToString(remainingTime / 1000, {
                  length: "short",
                  isShortFormat: true,
                })
              : isIdle
                ? "Instant"
                : "Ready")}
        </Label>
      }
    </div>
  );
};

const CraftButton: React.FC<{
  isIdle: boolean;
  isCrafting: boolean;
  isPending: boolean;
  isReady: boolean;
  handleCollect: () => void;
  handleCraft: () => void;
  isCraftingBoxEmpty: boolean;
}> = ({
  isIdle,
  isCrafting,
  isPending,
  isReady,
  handleCollect,
  handleCraft,
  isCraftingBoxEmpty,
}) => {
  const { t } = useTranslation();

  return (
    <div>
      {(isCrafting || isPending) && !isReady && (
        <Button className="mt-2 whitespace-nowrap" disabled={true}>
          {t("crafting")}
        </Button>
      )}
      {isCrafting && isReady && (
        <Button className="mt-2 whitespace-nowrap" onClick={handleCollect}>
          {t("collect")}
        </Button>
      )}
      {isIdle && (
        <Button
          className="mt-2 whitespace-nowrap"
          onClick={handleCraft}
          disabled={isCraftingBoxEmpty}
        >
          {`${t("craft")} 1`}
        </Button>
      )}
    </div>
  );
};
