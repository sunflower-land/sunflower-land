import React from "react";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const CraftStatus: React.FC<{
  isPending: boolean;
  isCrafting: boolean;
  isReady: boolean;
  isViewingQueuedRecipe: boolean;
}> = ({ isPending, isCrafting, isReady, isViewingQueuedRecipe }) => {
  const { t } = useAppTranslation();

  if (isReady) {
    return (
      <Label type="success" className="mb-1">
        {t("crafting.readyToCollect")}
      </Label>
    );
  }

  if (isViewingQueuedRecipe) {
    return (
      <Label type="default" className="mb-1">
        {t("crafting.inQueue")}
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
