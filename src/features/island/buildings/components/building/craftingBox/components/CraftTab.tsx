/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect, useMemo, useRef } from "react";
import { useSelector } from "@xstate/react";
import {
  MachineInterpreter,
  MachineState,
} from "features/game/lib/gameMachine";
import { CraftingQueueItem, InventoryItemName } from "features/game/types/game";
import { KNOWN_IDS } from "features/game/types";
import Decimal from "decimal.js-light";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { RecipeIngredient, RECIPES } from "features/game/lib/crafting";
import {
  getRecipeIngredientsForName,
  padRecipeIngredients,
} from "./craftingBoxUtils";
import {
  findMatchingRecipe,
  getBoostedCraftingTime,
} from "features/game/events/landExpansion/startCrafting";
import { ITEM_IDS, BumpkinItem } from "features/game/types/bumpkin";
import { useSound } from "lib/utils/hooks/useSound";
import { availableWardrobe } from "features/game/events/landExpansion/equip";
import { getChestItems } from "features/island/hud/components/inventory/utils/inventory";
import { getInstantGems } from "features/game/lib/getInstantGems";
import { CraftingQueue } from "./CraftingQueue";
import { IngredientGrid } from "./IngredientGrid";
import { CraftingHeader } from "./CraftingHeader";
import { ResourceInventory } from "./ResourceInventory";
import { CraftDetails } from "./CraftDetails";
import { CraftButton } from "./CraftButton";
import { CraftTimer } from "./CraftTimer";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { gameAnalytics } from "lib/gameAnalytics";
import { hasFeatureAccess } from "lib/flags";
import { useCraftingQueue } from "./useCraftingQueue";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { Panel } from "components/ui/Panel";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import vipIcon from "assets/icons/vip.webp";

const _state = (state: MachineState) => state.context.state;
const _farmId = (state: MachineState) => state.context.farmId;

const MAX_CRAFTING_SLOTS = 4;

interface Props {
  gameService: MachineInterpreter;
  selectedItems: (RecipeIngredient | null)[];
  setSelectedItems: (items: (RecipeIngredient | null)[]) => void;
  onClose?: () => void;
  initialQueueSlot?: number | null;
  onQueueSelectionChange?: (slot: number) => void;
}

export const CraftTab: React.FC<Props> = ({
  gameService,
  selectedItems,
  setSelectedItems,
  onClose = () => {},
  initialQueueSlot,
  onQueueSelectionChange,
}) => {
  const { openModal } = useContext(ModalContext);
  const { t } = useAppTranslation();
  const state = useSelector(gameService, _state);
  const farmId = useSelector(gameService, _farmId);
  const { inventory, wardrobe, craftingBox } = state;
  const { recipes } = craftingBox;
  const {
    craftingQueue,
    cooking,
    queue,
    readyProducts,
    liveDisplayItems,
    defaultQueueItem,
    effectiveReadyAt,
    craftingStatus,
    craftingReadyAt,
    now,
  } = useCraftingQueue(craftingBox);
  const hasCraftingBoxQueuesAccess = hasFeatureAccess(
    state,
    "CRAFTING_BOX_QUEUES",
  );

  const isVIP = hasVipAccess({ game: state }) && hasCraftingBoxQueuesAccess;
  const availableSlots = isVIP ? MAX_CRAFTING_SLOTS : 1;
  const isQueueFull = craftingQueue.length >= availableSlots;

  const [failedAttempt, setFailedAttempt] = useState(false);
  const [showCraftingQueueVipModal, setShowCraftingQueueVipModal] =
    useState(false);
  const prevSelectedItemsRef = useRef(selectedItems);
  const [selectedIngredient, setSelectedIngredient] =
    useState<RecipeIngredient | null>(null);
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
      const padded = getRecipeIngredientsForName(
        readyProducts[0].name,
        recipes,
      );
      if (padded.some((i) => i != null)) {
        setSelectedItems(padded);
      }
      autoSelectedReadyRef.current = false;
    }
  }, [readyProducts, recipes, setSelectedItems]);

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

      // New item is always appended to the queue, so it appears at the end of liveDisplayItems
      const newItemSlotIndex = liveDisplayItems.length;
      setQueueSelection({
        slot: 0,
        item: newItem,
        viewedSlotIndex: newItemSlotIndex,
      });
      onQueueSelectionChange?.(0);
      setSelectedItems(getRecipeIngredientsForName(newItem.name, recipes));
      setSelectedIngredient(null);
    } else if (wasAddingToQueue) {
      setQueueSelection({
        slot: 0,
        item: cooking ?? defaultQueueItem,
        viewedSlotIndex: 0,
      });
      onQueueSelectionChange?.(0);
      setSelectedItems(getCurrentCraftingRecipeIngredients());
      setSelectedIngredient(null);
    }
  };

  const handleAddToQueue = () => {
    if (!isVIP) {
      setShowCraftingQueueVipModal(true);
      return;
    }
    handleCraft();
  };

  const handleCollect = () => {
    const nextCooking = queue[0] ?? cooking;
    gameService.send("crafting.collected");
    setQueueSelection({
      slot: 0,
      item: nextCooking ?? defaultQueueItem,
      viewedSlotIndex: 0,
    });
    onQueueSelectionChange?.(0);
    if (nextCooking) {
      setSelectedItems(getRecipeIngredientsForName(nextCooking.name, recipes));
    }
    // When no next item: keep selectedItems as-is so the collected recipe stays in the grid for re-crafting
  };

  const handleClearIngredients = () => {
    button.play();
    const defaultItem = cooking ?? craftingQueue[0] ?? defaultQueueItem;
    setQueueSelection({ slot: 0, item: defaultItem, viewedSlotIndex: 0 });
    onQueueSelectionChange?.(0);
    if (queueSelection.slot > 0 && canAddToQueue) {
      setSelectedItems(getCurrentCraftingRecipeIngredients());
    } else {
      setSelectedItems(padRecipeIngredients(null));
    }
    setSelectedIngredient(null);
  };

  const getRecipeIngredientsForItem = (item: CraftingQueueItem) =>
    getRecipeIngredientsForName(item.name, recipes);
  const getCurrentCraftingRecipeIngredients = () =>
    cooking
      ? getRecipeIngredientsForName(cooking.name, recipes)
      : padRecipeIngredients(null);

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
      if (!canAddToQueue) {
        if (!isVIP) setShowCraftingQueueVipModal(true);
        return;
      }
      setQueueSelection({
        slot: slotIndex,
        item: cooking ?? defaultQueueItem,
        viewedSlotIndex: -1,
      });
      onQueueSelectionChange?.(slotIndex);
      setSelectedItems(padRecipeIngredients(null));
      setSelectedIngredient(null);
    } else if (item) {
      // Clicked on an item - show recipe; allow cancel only for queued (not in-progress)
      setQueueSelection({ slot: 0, item, viewedSlotIndex: slotIndex });
      onQueueSelectionChange?.(0);
      setSelectedItems(getRecipeIngredientsForItem(item));
      setSelectedIngredient(null);
    } else {
      setQueueSelection({
        slot: 0,
        item: cooking ?? defaultQueueItem,
        viewedSlotIndex: 0,
      });
      onQueueSelectionChange?.(0);
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
      onQueueSelectionChange?.(0);
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
    onQueueSelectionChange?.(0);
    setSelectedItems(
      nextCooking
        ? getRecipeIngredientsForName(nextCooking.name, recipes)
        : getCurrentCraftingRecipeIngredients(),
    );
    setSelectedIngredient(null);
  };

  const canEditGrid = cooking == null || queueSelection.slot > 0;
  const viewingState = useMemo(() => {
    const isViewingMode = cooking != null && queueSelection.slot === 0;
    return {
      isViewingMode,
      isViewingInProgressItem:
        isViewingMode && queueSelection.viewedSlotIndex === 0,
      isViewingQueuedRecipe:
        queueSelection.slot === 0 &&
        !(isViewingMode && queueSelection.viewedSlotIndex === 0) &&
        queueSelection.viewedSlotIndex > 0,
      isViewingReadyItem:
        craftingStatus === "crafting" &&
        viewedItem.readyAt > 0 &&
        viewedItem.readyAt <= now,
      isViewingInProgressRecipe: isViewingMode,
    };
  }, [
    cooking,
    queueSelection.slot,
    queueSelection.viewedSlotIndex,
    craftingStatus,
    viewedItem.readyAt,
    now,
  ]);

  const {
    isViewingMode,
    isViewingInProgressItem,
    isViewingQueuedRecipe,
    isViewingReadyItem,
    isViewingInProgressRecipe,
  } = viewingState;

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
      <CraftingHeader
        isPending={isPending}
        isCrafting={isCrafting}
        isViewingReadyItem={isViewingReadyItem}
        isViewingQueuedRecipe={isViewingQueuedRecipe}
        isPreparingQueueSlot={queueSelection.slot > 0}
        isDisabled={isDisabled}
        onClearIngredients={handleClearIngredients}
      />
      <div className="flex mb-2">
        <IngredientGrid
          selectedItems={selectedItems}
          onBoxSelect={handleBoxSelect}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          canEditGrid={canEditGrid}
          isPending={isPending}
          disabled={
            isViewingMode || isPending || (isCrafting && !canAddToQueue)
          }
        />

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
            onAddToQueue={handleAddToQueue}
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

      {hasCraftingBoxQueuesAccess && (
        <CraftingQueue
          readyProducts={readyProducts}
          displayItems={liveDisplayItems}
          onClose={onClose}
          selectedQueueSlot={queueSelection.slot}
          selectedQueuedItemSlot={
            queueSelection.slot > 0 ? -1 : queueSelection.viewedSlotIndex
          }
          onSlotSelect={handleQueueSlotSelect}
        />
      )}

      <ResourceInventory
        remainingInventory={remainingInventory}
        selectedIngredient={selectedIngredient}
        onIngredientSelect={handleIngredientSelect}
        onDragStart={handleDragStart}
        canEditGrid={canEditGrid}
        isPending={isPending}
        disabled={isViewingMode || isPending || (isCrafting && !canAddToQueue)}
        discoveredRecipes={state.craftingBox.recipes}
      />

      <ModalOverlay
        show={showCraftingQueueVipModal}
        onBackdropClick={() => setShowCraftingQueueVipModal(false)}
      >
        <Panel>
          <div className="p-2 text-sm">
            <p className="mb-1.5">{t("crafting.vipCraftingQueue")}</p>
          </div>
          <div className="flex space-x-1 justify-end">
            <Button onClick={() => setShowCraftingQueueVipModal(false)}>
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
