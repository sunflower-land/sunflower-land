import React, { useState, useMemo } from "react";
import { Button } from "components/ui/Button";
import Decimal from "decimal.js-light";
import { ITEM_DETAILS } from "features/game/types/images";
import { RecipeIngredient } from "features/game/lib/crafting";
import { Inventory, Wardrobe } from "features/game/types/game";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import fastForward from "assets/icons/fast_forward.png";
import vipIcon from "assets/icons/vip.webp";

export const CraftButton: React.FC<{
  isCrafting: boolean;
  isPending: boolean;
  isViewingReadyItem: boolean;
  handleCollect: () => void;
  handleCraft: () => void;
  handleCancelQueuedItem?: () => void;
  isCraftingBoxEmpty: boolean;
  selectedItems: (RecipeIngredient | null)[];
  inventory: Inventory;
  wardrobe: Wardrobe;
  gems: number;
  onInstantCraft: (gems: number) => void;
  isQueueFull?: boolean;
  isPreparingQueueSlot?: boolean;
  isViewingQueuedRecipe?: boolean;
  hasCraftingBoxQueuesAccess?: boolean;
}> = ({
  isCrafting,
  isPending,
  isViewingReadyItem,
  handleCollect,
  handleCraft,
  handleCancelQueuedItem,
  isCraftingBoxEmpty,
  selectedItems,
  inventory,
  wardrobe,
  gems,
  onInstantCraft,
  isQueueFull = false,
  isPreparingQueueSlot = false,
  isViewingQueuedRecipe = false,
  hasCraftingBoxQueuesAccess = false,
}) => {
  const { t } = useAppTranslation();
  const [showConfirmation, setShowConfirmation] = useState(false);

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

  const addToQueueDisabled =
    isQueueFull || isCraftingBoxEmpty || !hasRequiredIngredients;

  if (isViewingQueuedRecipe && handleCancelQueuedItem) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 mt-2">
        {hasCraftingBoxQueuesAccess && (
          <Button
            className="whitespace-nowrap relative"
            onClick={handleCraft}
            disabled={addToQueueDisabled}
          >
            <img
              src={vipIcon}
              alt="VIP"
              className="absolute w-6 sm:w-4 -top-[1px] -right-[2px]"
            />
            {t("recipes.addToQueue")}
          </Button>
        )}
        <Button onClick={handleCancelQueuedItem}>{t("remove")}</Button>
      </div>
    );
  }

  if (isCrafting || isPending) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 mt-2">
        {hasCraftingBoxQueuesAccess && (
          <Button
            className="whitespace-nowrap relative"
            onClick={handleCraft}
            disabled={addToQueueDisabled}
          >
            <img
              src={vipIcon}
              alt="VIP"
              className="absolute w-6 sm:w-4 -top-[1px] -right-[2px]"
            />
            {t("recipes.addToQueue")}
          </Button>
        )}
        {isViewingReadyItem && (
          <Button className="whitespace-nowrap" onClick={handleCollect}>
            {t("collect")}
          </Button>
        )}
        {!isPreparingQueueSlot && !isViewingReadyItem && (
          <Button
            disabled={!inventory.Gem?.gte(gems) || isPending}
            onClick={() => setShowConfirmation(true)}
          >
            <div className="flex items-center justify-center gap-1">
              <img src={fastForward} className="h-5" />
              <span className="text-sm flex items-center">{gems}</span>
              <img src={ITEM_DETAILS["Gem"].image} className="h-5" />
            </div>
          </Button>
        )}
        <ConfirmationModal
          show={showConfirmation}
          onHide={() => setShowConfirmation(false)}
          onCancel={() => setShowConfirmation(false)}
          onConfirm={() => {
            onInstantCraft(gems);
            setShowConfirmation(false);
          }}
          messages={[
            t("instantCook.confirmationMessage"),
            t("instantCook.costMessage", { gems }),
          ]}
          confirmButtonLabel={t("instantCook.finish")}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-1 mt-2">
      <Button
        className="mt-2 whitespace-nowrap"
        onClick={handleCraft}
        disabled={isCraftingBoxEmpty || !hasRequiredIngredients}
      >
        {t("craft")}
      </Button>
    </div>
  );
};
