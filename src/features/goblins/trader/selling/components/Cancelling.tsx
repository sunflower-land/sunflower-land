import React from "react";

import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface ConfirmingCancelProps {
  onConfirm: () => void;
  onBack: () => void;
  listingId: number;
  resourceName: InventoryItemName;
  resourceAmount: number;
}

export const Cancelling: React.FC<ConfirmingCancelProps> = ({
  onConfirm,
  onBack,
  listingId,
  resourceName,
  resourceAmount,
}) => {
  const { t } = useAppTranslation();
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center p-2">
        <span className="mb-4">{`Cancel Listing ID #${listingId}`}</span>
        <img src={ITEM_DETAILS[resourceName].image} className="w-12" />
        <span className="py-2">{`${resourceAmount} ${resourceName}`}</span>
      </div>
      <div className="flex space-x-2 w-full">
        <Button onClick={onBack}>{t("back")}</Button>
        <Button onClick={onConfirm} className="whitespace-nowrap">
          Cancel trade
        </Button>
      </div>
    </div>
  );
};
