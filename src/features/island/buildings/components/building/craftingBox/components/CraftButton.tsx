import React, { useState, useMemo } from "react";
import { Button } from "components/ui/Button";
import Decimal from "decimal.js-light";
import { ITEM_DETAILS } from "features/game/types/images";
import { RecipeIngredient } from "features/game/lib/crafting";
import { GameState, Inventory, Wardrobe } from "features/game/types/game";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import { useSpeedUpPayment } from "features/game/lib/useSpeedUpPayment";
import { SpeedUpPaymentSelector } from "features/game/components/SpeedUpPaymentSelector";
import fastForward from "assets/icons/fast_forward.png";
import vipIcon from "assets/icons/vip.webp";

export const CraftButton: React.FC<{
  isCrafting: boolean;
  isPending: boolean;
  isViewingReadyItem: boolean;
  handleCollect: () => void;
  handleCraft: () => void;
  onAddToQueue?: () => void;
  handleCancelQueuedItem?: () => void;
  isCraftingBoxEmpty: boolean;
  selectedItems: (RecipeIngredient | null)[];
  inventory: Inventory;
  wardrobe: Wardrobe;
  state: GameState;
  readyAt: number;
  onInstantCraft: (cost: number, paymentMethod?: "gems" | "coins") => void;
  isQueueFull?: boolean;
  isPreparingQueueSlot?: boolean;
  isViewingQueuedRecipe?: boolean;
}> = ({
  isCrafting,
  isPending,
  isViewingReadyItem,
  handleCollect,
  handleCraft,
  onAddToQueue,
  handleCancelQueuedItem,
  isCraftingBoxEmpty,
  selectedItems,
  inventory,
  wardrobe,
  state,
  readyAt,
  onInstantCraft,
  isQueueFull = false,
  isPreparingQueueSlot = false,
  isViewingQueuedRecipe = false,
}) => {
  const { t } = useAppTranslation();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const payment = useSpeedUpPayment({ readyAt, game: state });
  const cost =
    payment.paymentMethod === "coins" ? payment.coinCost : payment.gemCost;
  const costIcon =
    payment.paymentMethod === "coins"
      ? SUNNYSIDE.ui.coins
      : ITEM_DETAILS["Gem"].image;
  const confirmationCostMessage =
    payment.paymentMethod === "coins"
      ? t("instantCook.coinCostMessage", { coins: cost })
      : t("instantCook.costMessage", { gems: cost });

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
  const addToQueueHandler = onAddToQueue ?? handleCraft;

  if (isViewingQueuedRecipe && handleCancelQueuedItem) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 mt-2">
        <Button
          className="relative"
          onClick={addToQueueHandler}
          disabled={addToQueueDisabled}
        >
          <img
            src={vipIcon}
            alt="VIP"
            className="absolute w-6 sm:w-4 -top-[1px] -right-[2px]"
          />
          {t("recipes.addToQueue")}
        </Button>
        <Button onClick={handleCancelQueuedItem}>{t("remove")}</Button>
      </div>
    );
  }

  if (isCrafting || isPending) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 mt-2">
        <Button
          className="relative"
          onClick={addToQueueHandler}
          disabled={addToQueueDisabled}
        >
          <img
            src={vipIcon}
            alt="VIP"
            className="absolute w-4 -top-[1px] -right-[2px]"
          />
          {t("recipes.addToQueue")}
        </Button>
        {isViewingReadyItem && (
          <Button onClick={handleCollect}>{t("collect")}</Button>
        )}
        {!isPreparingQueueSlot && !isViewingReadyItem && (
          <Button
            disabled={!payment.canAfford || isPending}
            onClick={() => setShowConfirmation(true)}
          >
            <div className="flex items-center justify-center gap-1">
              <img src={fastForward} className="h-5" />
              {!payment.canPayWithCoins && (
                <>
                  <span className="text-sm flex items-center">{cost}</span>
                  <img src={costIcon} className="h-5" />
                </>
              )}
            </div>
          </Button>
        )}
        <ConfirmationModal
          show={showConfirmation}
          onHide={() => setShowConfirmation(false)}
          onCancel={() => setShowConfirmation(false)}
          onConfirm={() => {
            onInstantCraft(cost, payment.paymentMethod);
            setShowConfirmation(false);
          }}
          messages={[
            t("instantCook.confirmationMessage"),
            confirmationCostMessage,
          ]}
          confirmButtonLabel={t("instantCook.finish")}
          bodyContent={<SpeedUpPaymentSelector payment={payment} />}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-1 mt-2">
      <Button
        className="mt-2"
        onClick={handleCraft}
        disabled={isCraftingBoxEmpty || !hasRequiredIngredients}
      >
        {t("craft")}
      </Button>
      <Button disabled>
        <div className="flex items-center justify-center gap-1">
          <img src={fastForward} className="h-5" />
          <span className="text-sm flex items-center">{0}</span>
          <img src={ITEM_DETAILS["Gem"].image} className="h-5" />
        </div>
      </Button>
    </div>
  );
};
