import React, { useState } from "react";
import { Box } from "components/ui/Box";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/images";
import { FOOD_TO_DIFFICULTY } from "features/game/events/pets/feedPet";
import type { CookableName } from "features/game/types/consumables";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { PIXEL_SCALE } from "features/game/lib/constants";

const ALL_PET_FOODS = Array.from(FOOD_TO_DIFFICULTY.keys()).sort((a, b) =>
  a.localeCompare(b),
);

type Props = {
  excludedFoods: CookableName[];
  onToggle: (food: CookableName) => void;
  /** Paw Aura makes feeding free, so excluding foods to conserve inventory
   * no longer applies — the board is disabled and explains why. */
  isFreeFeeding?: boolean;
};

/**
 * Click-to-toggle Included/Excluded food board for Bulk Feed, replacing the
 * settings-gear checkbox list per Elias's review on #7417 — clicking a food
 * moves it between sections, matching the old deposit-UI pattern.
 *
 * Collapsed by default: on mobile the full food grid can push the Bulk Feed
 * button off-screen, so the board starts closed and the player opts in.
 */
export const BulkFeedFoodBoard: React.FC<Props> = ({
  excludedFoods,
  onToggle,
  isFreeFeeding = false,
}) => {
  const { t } = useAppTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const includedFoods = ALL_PET_FOODS.filter(
    (food) => !excludedFoods.includes(food),
  );
  const excluded = ALL_PET_FOODS.filter((food) => excludedFoods.includes(food));

  if (isFreeFeeding) {
    return (
      <div className="flex flex-col gap-1 p-1">
        <Label type="default">{t("pets.bulkFeedPreferences")}</Label>
        <p className="text-xs p-1">{t("pets.bulkFeedPawAuraActive")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 p-1">
      <div
        className="flex flex-row items-center justify-between cursor-pointer"
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsExpanded((prev) => !prev);
          }
        }}
      >
        <Label type="default">
          {t("pets.bulkFeedPreferences")}
          {excluded.length > 0
            ? ` (${t("pets.bulkFeedExcludedFoods")}: ${excluded.length})`
            : ""}
        </Label>
        <img
          src={
            isExpanded ? SUNNYSIDE.icons.arrow_up : SUNNYSIDE.icons.arrow_down
          }
          style={{ width: `${PIXEL_SCALE * 7}px` }}
          alt={isExpanded ? t("collapse") : t("expand")}
        />
      </div>
      {isExpanded && (
        <>
          <Label type="default">{t("pets.bulkFeedIncludedFoods")}</Label>
          <div className="flex flex-wrap">
            {includedFoods.map((food) => (
              <Box
                key={food}
                image={ITEM_DETAILS[food]?.image}
                onClick={() => onToggle(food)}
              />
            ))}
          </div>
          <Label type="default">{t("pets.bulkFeedExcludedFoods")}</Label>
          <div className="flex flex-wrap min-h-[52px]">
            {excluded.length === 0 && (
              <p className="text-xs p-1">{t("pets.bulkFeedNoExcludedFoods")}</p>
            )}
            {excluded.map((food) => (
              <Box
                key={food}
                image={ITEM_DETAILS[food]?.image}
                iconClassName="grayscale"
                onClick={() => onToggle(food)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
