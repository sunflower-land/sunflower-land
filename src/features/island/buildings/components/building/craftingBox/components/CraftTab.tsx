import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "@xstate/react";
import {
  MachineInterpreter,
  MachineState,
} from "features/game/lib/gameMachine";
import { Label } from "components/ui/Label";
import {
  Inventory,
  InventoryItemName,
  Wardrobe,
} from "features/game/types/game";
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
import { useSound } from "lib/utils/hooks/useSound";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { ButtonPanel, InnerPanel } from "components/ui/Panel";

const VALID_CRAFTING_RESOURCES: InventoryItemName[] = [
  "Wood",
  "Timber",
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
  "Honey",
  "Red Pansy",
  "Blue Pansy",
  "Yellow Pansy",
  "Crimstone",
  "Merino Wool",
  "Seaweed",
  "Oil",
  "Coral",
  "Pirate Bounty",
  "Synthetic Fabric",
  "Merino Cushion",
  "Cushion",
  "Gold",
  "Basic Bed",
  "Sturdy Bed",
  "Prism Petal",
  "Celestial Frostbloom",
  "Primula Enigma",
  "Crimsteel",
  "Hardened Leather",
  "Vase",
  "Ocean's Treasure",
  "Royal Bedding",
  "Royal Ornament",
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
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [selectedIngredient, setSelectedIngredient] =
    useState<RecipeIngredient | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const isPending = craftingStatus === "pending";
  const isCrafting = craftingStatus === "crafting";
  const isIdle = craftingStatus === "idle";
  const isReady =
    craftingStatus === "crafting" &&
    remainingTime !== null &&
    remainingTime <= 0;

  const button = useSound("button");

  const selectIngredient = (ingredient: RecipeIngredient | null) => {
    button.play();
    setSelectedIngredient(ingredient);
  };

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

  const isCraftingBoxEmpty = useMemo(() => {
    return selectedItems.every((item) => item === null);
  }, [selectedItems]);

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
    const foundRecipe = findMatchingRecipe(selectedItems, recipes);

    if (foundRecipe) {
      setCurrentRecipe(foundRecipe);
    } else {
      setCurrentRecipe(null);
      setRemainingTime(null);
    }
  }, [selectedItems, recipes]);

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
    sourceIndex?: number,
  ) => {
    if (isPending || isCrafting) {
      e.preventDefault();
      return;
    }

    // If dragging from grid, check if there's an ingredient
    if (sourceIndex !== undefined && !selectedItems[sourceIndex]) {
      e.preventDefault();
      return;
    }

    // If dragging from resources, check if player has the ingredient
    if (sourceIndex === undefined && !hasIngredient(ingredient)) {
      e.preventDefault();
      return;
    }

    setSelectedIngredient(ingredient);
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ ingredient, sourceIndex }),
    );
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetIndex: number,
  ) => {
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      const { ingredient, sourceIndex } = data as {
        ingredient: RecipeIngredient;
        sourceIndex?: number;
      };

      // If dragging from resources, check if player has enough
      if (
        sourceIndex === undefined &&
        ingredient.collectible &&
        remainingInventory[ingredient.collectible]?.lessThanOrEqualTo(0)
      ) {
        return;
      }

      const newSelectedItems = [...selectedItems];

      // If dragging between grid squares, swap the ingredients
      if (sourceIndex !== undefined) {
        newSelectedItems[sourceIndex] = newSelectedItems[targetIndex];
        newSelectedItems[targetIndex] = ingredient;
      } else {
        // If dragging from resources, just place the ingredient
        newSelectedItems[targetIndex] = ingredient;
      }

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
    selectIngredient(ingredient);
  };

  const handleCraft = () => {
    setShowConfirmModal(true);
  };

  const confirmCraft = () => {
    setShowConfirmModal(false);
    if (craftingStatus === "pending") return;

    gameService.send("crafting.started", {
      ingredients: selectedItems,
    });
    if (!currentRecipe) gameService.send("SAVE");
  };

  const handleCollect = () => {
    gameService.send("crafting.collected");
  };

  const handleClearIngredients = () => {
    button.play();
    setSelectedItems(Array(9).fill(null));
    setSelectedIngredient(null);
  };

  return (
    <>
      <div className="flex pl-1 pt-1">
        <div className="flex justify-between items-center w-full mr-1">
          <CraftStatus
            isPending={isPending}
            isCrafting={isCrafting}
            isReady={isReady}
          />
          <ButtonPanel
            disabled={isPending || isCrafting || isCraftingBoxEmpty}
            onClick={handleClearIngredients}
          >
            <SquareIcon icon={SUNNYSIDE.icons.cancel} width={5} />
          </ButtonPanel>
        </div>
      </div>
      <div className="flex mb-2">
        {/** Crafting Grid */}
        <div className="grid grid-cols-3 gap-1 flex-shrink-0">
          {selectedItems.map((item, index) => (
            <div
              className="flex "
              key={`${index}-${item}`}
              draggable={!isPending && !!item}
              onDragStart={(e) =>
                handleDragStart(e, item as RecipeIngredient, index)
              }
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              <Box
                image={
                  item?.collectible
                    ? ITEM_DETAILS[item.collectible]?.image
                    : item?.wearable
                      ? getImageUrl(ITEM_IDS[item.wearable])
                      : undefined
                }
                onClick={() => handleBoxSelect(index)}
                disabled={isPending}
              />
            </div>
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
            recipe={currentRecipe}
            remainingTime={remainingTime}
            isIdle={isIdle}
            key={currentRecipe?.name}
          />
          <div>
            <CraftButton
              isCrafting={isCrafting}
              isPending={isPending}
              isReady={isReady}
              handleCollect={handleCollect}
              handleCraft={handleCraft}
              isCraftingBoxEmpty={isCraftingBoxEmpty}
              selectedItems={selectedItems}
              inventory={inventory}
              wardrobe={wardrobe}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col max-h-72 overflow-y-auto scrollable">
        <Label type="default" className="mb-1 ml-1">
          {t("resources")}
        </Label>
        <div className="flex flex-wrap">
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
        <Label type="default" className="mb-1 ml-1 mt-1">
          {t("wearables")}
        </Label>
        <div className="flex flex-wrap">
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

      <ModalOverlay
        show={showConfirmModal}
        onBackdropClick={() => setShowConfirmModal(false)}
      >
        <InnerPanel className="shadow">
          <div className="flex items-center w-full">
            <div style={{ width: `${PIXEL_SCALE * 9}px` }} />
            <span className="flex-1 text-center">{`${t("confirm")} ${t("craft")} ${currentRecipe?.name ?? ""}`}</span>
            <img
              src={SUNNYSIDE.icons.close}
              className="cursor-pointer"
              onClick={() => setShowConfirmModal(false)}
              style={{
                width: `${PIXEL_SCALE * 9}px`,
              }}
            />
          </div>

          <div className="flex justify-around">
            <div className="flex justify-center">
              <div className="grid grid-cols-3 gap-1 w-48 h-48">
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
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <CraftDetails
                recipe={currentRecipe}
                isPending={isPending}
                failedAttempt={failedAttempt}
              />
              <CraftTimer
                recipe={currentRecipe}
                remainingTime={remainingTime}
                isIdle={isIdle}
                key={currentRecipe?.name}
              />
            </div>
          </div>
          <Button className="mt-2" onClick={() => confirmCraft()}>
            {t("craft")}
          </Button>
        </InnerPanel>
      </ModalOverlay>
    </>
  );
};

const CraftStatus: React.FC<{
  isPending: boolean;
  isCrafting: boolean;
  isReady: boolean;
}> = ({ isPending, isCrafting, isReady }) => {
  const { t } = useTranslation();

  if (isReady) {
    return (
      <Label type="success" className="mb-1">
        {t("crafting.readyToCollect")}
      </Label>
    );
  }

  if (isPending || isCrafting) {
    return (
      <Label type="warning" className="mb-1">
        {t("crafting.inProgress")}
      </Label>
    );
  }

  return (
    <Label type="default" className="mb-1">
      {t("crafting.selectIngredients")}
    </Label>
  );
};

const CraftDetails: React.FC<{
  recipe: Recipe | null;
  isPending: boolean;
  failedAttempt: boolean;
}> = ({ recipe, isPending, failedAttempt }) => {
  const { t } = useTranslation();

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
          {isPending
            ? t("crafting")
            : failedAttempt
              ? t("crafting.noRecipe")
              : t("unknown")}
        </Label>
        <Box
          image={SUNNYSIDE.icons.expression_confused}
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

const RecipeLabelContent: React.FC<{ recipe: Recipe | null }> = ({
  recipe,
}) => {
  const { t } = useTranslation();

  if (!recipe) {
    return <SquareIcon icon={SUNNYSIDE.icons.expression_confused} width={7} />;
  }

  if (recipe.time === 0) {
    return <span>{t("instant")}</span>;
  }

  return (
    <span>
      {secondsToString(recipe.time / 1000, {
        length: "short",
        isShortFormat: true,
      })}
    </span>
  );
};

const InProgressLabelContent: React.FC<{ remainingTime: number | null }> = ({
  remainingTime,
}) => {
  const { t } = useTranslation();

  if (remainingTime === null) {
    return <SquareIcon icon={SUNNYSIDE.icons.expression_confused} width={7} />;
  }

  if (remainingTime === 0) {
    return <span>{t("ready")}</span>;
  }

  return (
    <span>
      {secondsToString(remainingTime / 1000, {
        length: "short",
        isShortFormat: true,
      })}
    </span>
  );
};

const CraftTimer: React.FC<{
  recipe: Recipe | null;
  remainingTime: number | null;
  isIdle: boolean;
}> = ({ recipe, remainingTime, isIdle }) => {
  if (isIdle) {
    return (
      <Label
        type="transparent"
        className="ml-3 my-1"
        icon={SUNNYSIDE.icons.stopwatch}
      >
        <RecipeLabelContent recipe={recipe} />
      </Label>
    );
  }

  return (
    <Label
      type="transparent"
      className="ml-3 my-1"
      icon={SUNNYSIDE.icons.stopwatch}
    >
      <InProgressLabelContent remainingTime={remainingTime} />
    </Label>
  );
};

const CraftButton: React.FC<{
  isCrafting: boolean;
  isPending: boolean;
  isReady: boolean;
  handleCollect: () => void;
  handleCraft: () => void;
  isCraftingBoxEmpty: boolean;
  selectedItems: (RecipeIngredient | null)[];
  inventory: Inventory;
  wardrobe: Wardrobe;
}> = ({
  isCrafting,
  isPending,
  isReady,
  handleCollect,
  handleCraft,
  isCraftingBoxEmpty,
  selectedItems,
  inventory,
  wardrobe,
}) => {
  const { t } = useTranslation();

  const hasRequiredIngredients = useMemo(() => {
    return selectedItems.every((ingredient) => {
      if (!ingredient) return true;

      if (ingredient.collectible) {
        return (inventory[ingredient.collectible] ?? new Decimal(0)).gte(1);
      }
      if (ingredient.wearable) {
        return (wardrobe[ingredient.wearable] ?? 0) >= 1;
      }
      return true;
    });
  }, [selectedItems, inventory, wardrobe]);

  if (isCrafting && isReady) {
    return (
      <Button className="mt-2 whitespace-nowrap" onClick={handleCollect}>
        {t("collect")}
      </Button>
    );
  }

  if (isCrafting || isPending) {
    return (
      <Button className="mt-2 whitespace-nowrap" disabled={true}>
        {t("crafting")}
      </Button>
    );
  }

  return (
    <Button
      className="mt-2 whitespace-nowrap"
      onClick={handleCraft}
      disabled={isCraftingBoxEmpty || !hasRequiredIngredients}
    >
      {`${t("craft")} 1`}
    </Button>
  );
};
