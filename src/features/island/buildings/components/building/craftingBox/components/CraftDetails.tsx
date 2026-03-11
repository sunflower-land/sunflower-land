import React from "react";
import { Label } from "components/ui/Label";
import { Box } from "components/ui/Box";
import Decimal from "decimal.js-light";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { Recipe } from "features/game/lib/crafting";
import { getImageUrl } from "lib/utils/getImageURLS";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { InventoryItemName } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const CraftDetails: React.FC<{
  recipe: Recipe | null;
  isPending: boolean;
  failedAttempt: boolean;
}> = ({ recipe, isPending, failedAttempt }) => {
  const { t } = useAppTranslation();

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
