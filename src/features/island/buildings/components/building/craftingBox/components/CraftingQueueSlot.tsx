import React, { useContext, useState } from "react";
import { CraftingQueueItem } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { Box } from "components/ui/Box";
import { SUNNYSIDE } from "assets/sunnyside";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { useTranslation } from "react-i18next";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { Panel } from "components/ui/Panel";
import { getImageUrl } from "lib/utils/getImageURLS";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { InventoryItemName } from "features/game/types/game";

interface CraftingQueueSlotProps {
  item?: CraftingQueueItem;
  readyProducts: CraftingQueueItem[];
  slotIndex?: number;
  isSelected?: boolean;
  onSelect?: (slotIndex: number, isEmpty: boolean) => void;
}

export const CraftingQueueSlot: React.FC<CraftingQueueSlotProps> = ({
  item,
  readyProducts,
  slotIndex = 0,
  isSelected = false,
  onSelect,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useTranslation();
  const [showConfirm, setShowConfirm] = useState(false);

  if (!item) {
    return (
      <Box
        onClick={onSelect ? () => onSelect(slotIndex, true) : undefined}
        isSelected={isSelected}
        className={onSelect ? "cursor-pointer" : undefined}
      />
    );
  }

  const isReady = readyProducts.some(
    (product) =>
      product.name === item.name &&
      product.readyAt === item.readyAt &&
      product.type === item.type,
  );

  const handleCancel = () => {
    gameService.send("crafting.cancelled", { queueItem: item });
  };

  const image =
    item.type === "collectible"
      ? ITEM_DETAILS[item.name as InventoryItemName]?.image
      : getImageUrl(ITEM_IDS[item.name as BumpkinItem]);

  return (
    <>
      <div className="relative">
        {isReady && (
          <img
            className="absolute top-1 right-1 w-4 z-10"
            src={SUNNYSIDE.icons.confirm}
          />
        )}
        {!isReady && (
          <img
            className="absolute top-1 right-1 w-4 z-10"
            src={SUNNYSIDE.icons.cancel}
          />
        )}
        <div
          className={!isReady ? "cursor-pointer" : ""}
          onClick={!isReady ? () => setShowConfirm(true) : undefined}
        >
          <Box image={image} />
        </div>
      </div>
      <ModalOverlay
        show={showConfirm}
        onBackdropClick={() => setShowConfirm(false)}
      >
        <Panel>
          <p className="p-1.5 mb-1.5">
            {t("recipes.confirmCancel", { recipe: item.name })}
          </p>
          <div className="flex space-x-1 justify-end">
            <Button onClick={() => setShowConfirm(false)}>{t("cancel")}</Button>
            <Button
              onClick={() => {
                setShowConfirm(false);
                handleCancel();
              }}
            >
              {t("confirm")}
            </Button>
          </div>
        </Panel>
      </ModalOverlay>
    </>
  );
};
