/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector } from "@xstate/react";
import {
  MachineInterpreter,
  MachineState,
} from "features/game/lib/gameMachine";
import { Label } from "components/ui/Label";
import { CraftingQueueItem, InventoryItemName } from "features/game/types/game";
import { KNOWN_IDS } from "features/game/types";
import { Box } from "components/ui/Box";
import Decimal from "decimal.js-light";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SquareIcon } from "components/ui/SquareIcon";
import { RecipeIngredient, RECIPES } from "features/game/lib/crafting";
import {
  findMatchingRecipe,
  getBoostedCraftingTime,
} from "features/game/events/landExpansion/startCrafting";
import { getImageUrl } from "lib/utils/getImageURLS";
import { ITEM_IDS, BumpkinItem } from "features/game/types/bumpkin";
import { useSound } from "lib/utils/hooks/useSound";
import { ButtonPanel } from "components/ui/Panel";
import { availableWardrobe } from "features/game/events/landExpansion/equip";
import { getChestItems } from "features/island/hud/components/inventory/utils/inventory";
import { getInstantGems } from "features/game/events/landExpansion/speedUpRecipe";
import { CraftingQueue } from "./CraftingQueue";
import { CraftStatus } from "./CraftStatus";
import { CraftDetails } from "./CraftDetails";
import { CraftButton } from "./CraftButton";
import { CraftTimer } from "./CraftTimer";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { gameAnalytics } from "lib/gameAnalytics";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";
import { validCraftingResourcesSorted } from "./craftingTabConstants";
import { hasFeatureAccess } from "lib/flags";

const _state = (state: MachineState) => state.context.state;
const _farmId = (state: MachineState) => state.context.farmId;

const MAX_CRAFTING_SLOTS = 4;

interface Props {
  gameService: MachineInterpreter;
  selectedItems: (RecipeIngredient | null)[];
  setSelectedItems: (items: (RecipeIngredient | null)[]) => void;
  onClose?: () => void;
  initialQueueSlot?: number | null;
}

export const CraftTab: React.FC<Props> = ({
  gameService,
  selectedItems,
  setSelectedItems,
  onClose = () => {},
  initialQueueSlot,
}) => {
  const { t } = useAppTranslation();

  const state = useSelector(gameService, _state);
  const farmId = useSelector(gameService, _farmId);
  const { inventory, wardrobe, craftingBox } = state;
  const {
    status: craftingStatus,
    readyAt: craftingReadyAt,
    recipes,
    queue: rawQueue,
    item: legacyItem,
    startedAt: craftingStartedAt,
  } = craftingBox;

  const craftingQueue: CraftingQueueItem[] =
    rawQueue ??
    (legacyItem && craftingStatus === "crafting"
      ? [
          {
            name: legacyItem.collectible ?? legacyItem.wearable,
            readyAt: craftingReadyAt,
            startedAt: craftingStartedAt,
            type: legacyItem.collectible ? "collectible" : "wearable",
          },
        ]
      : []);

  const effectiveReadyAt =
    craftingQueue.length > 0
      ? Math.max(...craftingQueue.map((i) => i.readyAt))
      : craftingReadyAt;

  const needsLiveTime =
    craftingStatus === "crafting" &&
    effectiveReadyAt != null &&
    Number.isFinite(effectiveReadyAt);
  const now = useNow({
    live: needsLiveTime,
    autoEndAt: needsLiveTime ? effectiveReadyAt : undefined,
  });
  const inProgress = craftingQueue.filter((item) => item.readyAt > now);
  const cooking = inProgress[0];
  const queue = inProgress.slice(1);
  const readyProducts = craftingQueue.filter((item) => item.readyAt <= now);
  const hasCraftingBoxQueuesAccess = hasFeatureAccess(
    state,
    "CRAFTING_BOX_QUEUES",
  );

  const isVIP = hasVipAccess({ game: state }) && hasCraftingBoxQueuesAccess;
  const availableSlots = isVIP ? MAX_CRAFTING_SLOTS : 1;
  const isQueueFull = craftingQueue.length >= availableSlots;

  const [failedAttempt, setFailedAttempt] = useState(false);
  const prevSelectedItemsRef = useRef(selectedItems);
  const [selectedIngredient, setSelectedIngredient] =
    useState<RecipeIngredient | null>(null);
  const defaultQueueItem: CraftingQueueItem = cooking ??
    craftingQueue[0] ?? {
      name: "Sunflower",
      readyAt: 0,
      startedAt: 0,
      type: "collectible",
    };
  const isPending = craftingStatus === "pending";
  const isCrafting = craftingStatus === "crafting";
  const isIdle = craftingStatus === "idle";
  const canAddToQueue = isCrafting && isVIP && !isQueueFull;

  const [queueSelection, setQueueSelection] = useState<{
    slot: number;
    item: CraftingQueueItem;
    viewedSlotIndex: number;
  }>(() => {
    if (initialQueueSlot != null && !(initialQueueSlot > 0 && !canAddToQueue)) {
      return {
        slot: initialQueueSlot,
        item: cooking ?? defaultQueueItem,
        viewedSlotIndex: initialQueueSlot === 0 ? 0 : -1,
      };
    }

    if (readyProducts.length > 0) {
      const firstReadySlotIndex = (cooking ? 1 : 0) + queue.length;
      return {
        slot: 0,
        item: readyProducts[0],
        viewedSlotIndex: firstReadySlotIndex,
      };
    }

    return {
      slot: 0,
      item: defaultQueueItem,
      viewedSlotIndex: 0,
    };
  });

  const autoSelectedReadyRef = useRef(
    initialQueueSlot == null && readyProducts.length > 0,
  );
  useEffect(() => {
    if (autoSelectedReadyRef.current && readyProducts.length > 0) {
      const recipeName = readyProducts[0].name;
      const recipe =
        recipes[recipeName as keyof typeof recipes] ??
        RECIPES[recipeName as keyof typeof RECIPES];
      if (recipe?.ingredients) {
        const padded = [...recipe.ingredients, ...Array(9).fill(null)].slice(
          0,
          9,
        ) as (RecipeIngredient | null)[];
        setSelectedItems(padded);
      }
      autoSelectedReadyRef.current = false;
    }
  }, []);

  const liveDisplayItems = [cooking, ...queue, ...readyProducts].filter(
    Boolean,
  );
  const viewedItem =
    liveDisplayItems[queueSelection.viewedSlotIndex] ?? queueSelection.item;

  const viewedReadyAt = viewedItem.readyAt || effectiveReadyAt;
  const remainingTime = useMemo(() => {
    if (
      craftingStatus !== "crafting" ||
      viewedReadyAt == null ||
      typeof viewedReadyAt !== "number" ||
      !Number.isFinite(viewedReadyAt)
    ) {
      return null;
    }
    return Math.max(0, viewedReadyAt - now);
  }, [craftingStatus, viewedReadyAt, now]);

  const button = useSound("button");

  const selectIngredient = (ingredient: RecipeIngredient | null) => {
    button.play();
    setSelectedIngredient(ingredient);
  };

  const remainingInventory = useMemo(() => {
    // Get available items (excluding placed items) and spread with inventory for any missing items
    const chestItems = getChestItems(state);
    const updatedInventory = { ...inventory, ...chestItems };

    // Subtract selected items
    return selectedItems.reduce((acc, item) => {
      const collectible = item?.collectible;
      if (collectible && acc[collectible]) {
        acc[collectible] = acc[collectible].minus(1);
      }
      return acc;
    }, updatedInventory);
  }, [inventory, selectedItems, state]);

  const remainingWardrobe = useMemo(() => {
    const updatedWardrobe = availableWardrobe(state);

    selectedItems.forEach((item) => {
      const wearable = item?.wearable;
      if (wearable && updatedWardrobe[wearable]) {
        updatedWardrobe[wearable] = updatedWardrobe[wearable] - 1;
      }
    });
    return updatedWardrobe;
  }, [wardrobe, selectedItems, state]);

  const isCraftingBoxEmpty = useMemo(() => {
    return selectedItems.every((item) => item === null);
  }, [selectedItems]);

  /** Failed attempt: set on pending, reset on crafting or when ingredients change */
  useEffect(() => {
    const selectedItemsChanged = prevSelectedItemsRef.current !== selectedItems;
    prevSelectedItemsRef.current = selectedItems;

    if (craftingStatus !== "pending" || selectedItemsChanged) {
      setFailedAttempt(false);
    } else {
      setFailedAttempt(true);
    }
  }, [craftingStatus, selectedItems]);

  /**
   * Find the recipe that matches the selected items.
   * Use RECIPES (full set) to match - same as API startCrafting - so we find
   * all valid recipes, not just those in craftingBox.recipes.
   */
  const recipesToMatch = useMemo(() => ({ ...RECIPES, ...recipes }), [recipes]);
  const currentRecipe = useMemo(
    () => findMatchingRecipe(selectedItems, recipesToMatch) ?? null,
    [selectedItems, recipesToMatch],
  );

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
    if (isViewingMode || isPending || (isCrafting && !canAddToQueue)) {
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
    if (isPending || (isCrafting && !canAddToQueue)) return;

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
    if (craftingStatus === "pending") return;

    const wasAddingToQueue = queueSelection.slot > 0;

    gameService.send("crafting.started", { ingredients: selectedItems });
    if (!currentRecipe) gameService.send("SAVE");

    if (wasAddingToQueue && currentRecipe) {
      const recipeStartAt =
        queue.length > 0
          ? queue[queue.length - 1].readyAt
          : (cooking?.readyAt ?? now);

      const { seconds: recipeTime } = getBoostedCraftingTime({
        game: state,
        time: currentRecipe.time,
        prngArgs: {
          farmId,
          itemId:
            currentRecipe.type === "collectible"
              ? KNOWN_IDS[currentRecipe.name as InventoryItemName]
              : ITEM_IDS[currentRecipe.name as BumpkinItem],
          counter: state.farmActivity[`${currentRecipe.name} Crafted`] ?? 0,
        },
      });

      const isInstant = recipeTime === 0;
      const newItem: CraftingQueueItem = {
        name: currentRecipe.name,
        type: currentRecipe.type,
        startedAt: isInstant ? now : recipeStartAt,
        readyAt: isInstant ? now : recipeStartAt + recipeTime,
      };

      const addedSlotIndex = queueSelection.slot;
      setQueueSelection({
        slot: 0,
        item: newItem,
        viewedSlotIndex: addedSlotIndex,
      });
      setSelectedItems(getRecipeIngredients(newItem.name));
      setSelectedIngredient(null);
    } else if (wasAddingToQueue) {
      setQueueSelection({
        slot: 0,
        item: cooking ?? defaultQueueItem,
        viewedSlotIndex: 0,
      });
      setSelectedItems(getCurrentCraftingRecipeIngredients());
      setSelectedIngredient(null);
    }
  };

  const handleCollect = () => {
    const nextCooking = queue[0] ?? cooking;
    gameService.send("crafting.collected");
    setQueueSelection({
      slot: 0,
      item: nextCooking ?? defaultQueueItem,
      viewedSlotIndex: 0,
    });
    setSelectedItems(
      nextCooking
        ? getRecipeIngredients(nextCooking.name)
        : Array(9).fill(null),
    );
  };

  const handleClearIngredients = () => {
    button.play();
    const defaultItem = cooking ?? craftingQueue[0] ?? defaultQueueItem;
    setQueueSelection({ slot: 0, item: defaultItem, viewedSlotIndex: 0 });
    if (queueSelection.slot > 0 && canAddToQueue) {
      setSelectedItems(getCurrentCraftingRecipeIngredients());
    } else {
      setSelectedItems(Array(9).fill(null));
    }
    setSelectedIngredient(null);
  };

  const getRecipeIngredients = (
    recipeName: string,
  ): (RecipeIngredient | null)[] => {
    const recipe =
      recipes[recipeName as keyof typeof recipes] ??
      RECIPES[recipeName as keyof typeof RECIPES];
    if (!recipe?.ingredients) return Array(9).fill(null);
    const padded = [...recipe.ingredients, ...Array(9).fill(null)].slice(0, 9);
    return padded as (RecipeIngredient | null)[];
  };

  const getCurrentCraftingRecipeIngredients =
    (): (RecipeIngredient | null)[] =>
      cooking ? getRecipeIngredients(cooking.name) : Array(9).fill(null);

  const getRecipeIngredientsForItem = (item: CraftingQueueItem) =>
    getRecipeIngredients(item.name);

  const handleQueueSlotSelect = (
    slotIndex: number,
    isEmpty: boolean,
    item?: CraftingQueueItem,
  ) => {
    // If clicking the same slot that's already selected, do nothing
    const isSameSlotSelected =
      (isEmpty && queueSelection.slot === slotIndex) ||
      (!isEmpty &&
        item &&
        queueSelection.viewedSlotIndex === slotIndex &&
        queueSelection.item.name === item.name &&
        queueSelection.item.readyAt === item.readyAt &&
        queueSelection.item.type === item.type);
    if (isSameSlotSelected) return;

    if (isEmpty) {
      if (!canAddToQueue) return;
      setQueueSelection({
        slot: slotIndex,
        item: cooking ?? defaultQueueItem,
        viewedSlotIndex: -1,
      });
      setSelectedItems(Array(9).fill(null));
      setSelectedIngredient(null);
    } else if (item) {
      // Clicked on an item - show recipe; allow cancel only for queued (not in-progress)
      setQueueSelection({ slot: 0, item, viewedSlotIndex: slotIndex });
      setSelectedItems(getRecipeIngredientsForItem(item));
      setSelectedIngredient(null);
    } else {
      setQueueSelection({
        slot: 0,
        item: cooking ?? defaultQueueItem,
        viewedSlotIndex: 0,
      });
      setSelectedItems(getCurrentCraftingRecipeIngredients());
      setSelectedIngredient(null);
    }
  };

  const handleCancelQueuedItem = () => {
    button.play();
    gameService.send("crafting.cancelled", {
      queueItem: queueSelection.item,
    });
    if (cooking) {
      setQueueSelection({ slot: 0, item: cooking, viewedSlotIndex: 0 });
    }
    setSelectedItems(getCurrentCraftingRecipeIngredients());
    setSelectedIngredient(null);
  };

  const handleInstantCraft = (gems: number) => {
    gameService.send("crafting.spedUp");
    gameAnalytics.trackSink({
      currency: "Gem",
      amount: gems,
      item: "Instant Craft",
      type: "Fee",
    });

    const nextCooking = queue[0];
    setQueueSelection({
      slot: 0,
      item: nextCooking ?? defaultQueueItem,
      viewedSlotIndex: 0,
    });
    setSelectedItems(
      nextCooking
        ? getRecipeIngredients(nextCooking.name)
        : getCurrentCraftingRecipeIngredients(),
    );
    setSelectedIngredient(null);
  };

  const canEditGrid = cooking == null || queueSelection.slot > 0;
  const isViewingMode = cooking != null && queueSelection.slot === 0;
  const isViewingInProgressRecipe = isViewingMode;

  const isViewingInProgressItem =
    isViewingMode && queueSelection.viewedSlotIndex === 0;

  const isViewingQueuedRecipe =
    queueSelection.slot === 0 &&
    !isViewingInProgressItem &&
    queueSelection.viewedSlotIndex > 0;

  const isViewingReadyItem =
    viewedItem.readyAt > 0 && viewedItem.readyAt <= now;

  const isDisabled =
    isPending ||
    (isCrafting && !canAddToQueue) ||
    isCraftingBoxEmpty ||
    isViewingInProgressRecipe ||
    isViewingQueuedRecipe;

  const gems = getInstantGems({
    readyAt: cooking?.readyAt ?? craftingReadyAt,
    game: state,
  });

  return (
    <>
      <div className="flex pl-1 pt-1">
        <div className="flex justify-between items-center w-full mr-1">
          <CraftStatus
            isPending={isPending}
            isCrafting={isCrafting}
            isViewingReadyItem={isViewingReadyItem}
            isViewingQueuedRecipe={isViewingQueuedRecipe}
            isPreparingQueueSlot={queueSelection.slot > 0}
          />
          <ButtonPanel
            disabled={isDisabled}
            onClick={isDisabled ? undefined : handleClearIngredients}
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
              draggable={canEditGrid && !isPending && !!item}
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
                disabled={
                  isViewingMode || isPending || (isCrafting && !canAddToQueue)
                }
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
            state={state}
            recipe={currentRecipe}
            remainingTime={remainingTime}
            isIdle={isIdle}
            showRecipeContext={!isViewingInProgressItem && !isViewingReadyItem}
            key={`${currentRecipe?.name}-${queueSelection.slot}-${queueSelection.item?.name ?? ""}`}
            farmId={farmId}
          />
          <CraftButton
            isCrafting={isCrafting}
            isPending={isPending}
            isViewingReadyItem={isViewingReadyItem}
            handleCollect={handleCollect}
            handleCraft={handleCraft}
            handleCancelQueuedItem={
              isViewingReadyItem ? undefined : handleCancelQueuedItem
            }
            isCraftingBoxEmpty={isCraftingBoxEmpty}
            selectedItems={selectedItems}
            inventory={inventory}
            wardrobe={wardrobe}
            gems={gems}
            onInstantCraft={handleInstantCraft}
            isQueueFull={isQueueFull}
            isPreparingQueueSlot={
              queueSelection.slot > 0 && !isViewingInProgressItem
            }
            isViewingQueuedRecipe={isViewingQueuedRecipe}
            hasCraftingBoxQueuesAccess={hasFeatureAccess(
              state,
              "CRAFTING_BOX_QUEUES",
            )}
          />
        </div>
      </div>

      {isVIP && (
        <CraftingQueue
          product={cooking}
          queue={queue}
          readyProducts={readyProducts}
          onClose={onClose}
          selectedQueueSlot={queueSelection.slot}
          selectedQueuedItemSlot={
            queueSelection.slot > 0 ? -1 : queueSelection.viewedSlotIndex
          }
          onSlotSelect={handleQueueSlotSelect}
        />
      )}

      <div className="flex space-x-3 mb-1 ml-1 mr-2">
        {selectedIngredient && (
          <Label
            type="formula"
            className="ml-1"
            icon={
              selectedIngredient.collectible
                ? ITEM_DETAILS[selectedIngredient.collectible].image
                : undefined
            }
          >
            {selectedIngredient.collectible ?? selectedIngredient.wearable}
          </Label>
        )}
      </div>
      <div className="flex flex-col max-h-72 overflow-y-auto scrollable pr-1">
        <div className="flex flex-wrap">
          {validCraftingResourcesSorted()
            // If it is a doll, but they haven't discovered it yet, don't show it.
            .filter(
              (itemName) =>
                !(itemName in RECIPES) ||
                (itemName in RECIPES && itemName in state.craftingBox.recipes),
            )
            .map((itemName) => {
              const amount = remainingInventory[itemName] || new Decimal(0);
              return (
                <div
                  key={itemName}
                  draggable={canEditGrid && !isPending && amount.greaterThan(0)}
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
                      isViewingMode ||
                      isPending ||
                      (isCrafting && !canAddToQueue)
                    }
                  />
                </div>
              );
            })}
          <Box image={SUNNYSIDE.icons.expression_confused} />
        </div>
        <div className="flex items-center  mt-1 mx-1">
          <img src={SUNNYSIDE.icons.expression_confused} className="h-4 mr-1" />
          <p className="text-xs">{t("crafting.undiscovered")}</p>
        </div>
      </div>
    </>
  );
};
