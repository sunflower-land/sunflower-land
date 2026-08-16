import React, { useState } from "react";
import { TextInput } from "components/ui/TextInput";
import { Chip } from "components/ui/Chip";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { InnerPanel } from "components/ui/Panel";
import lightning from "assets/icons/lightning.png";

type BoostFilterId = "withBoost" | "withoutBoost";

interface SlotCategory {
  id: string;
  label: string;
}

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  slotCategories: SlotCategory[];
  activeSlotCategories: string[];
  onToggleSlotCategory: (id: string) => void;
  onClearSlotCategories: () => void;
  boostFilter: BoostFilterId | undefined;
  onSetBoostFilter: (id: BoostFilterId | undefined) => void;
}

/**
 * Search field and filter chips for the Wardrobe tab.
 *
 * Unlike the shared InventoryFilters (Basket/Chest), the slot filters and the
 * bonus filter are two separate always-wrapping rows rather than one flat
 * list. Wardrobe has more chips than Basket/Chest, and InventoryFilters'
 * single-axis row scrolls horizontally instead of wrapping on narrow screens
 * - past a certain chip count that pushes chips out of the visible/clickable
 * area. Two short rows stay fully visible and clickable at any width.
 */
export const WardrobeFilters: React.FC<Props> = ({
  search,
  onSearchChange,
  slotCategories,
  activeSlotCategories,
  onToggleSlotCategory,
  onClearSlotCategories,
  boostFilter,
  onSetBoostFilter,
}) => {
  const { t } = useAppTranslation();

  const [showFilters, setShowFilters] = useState(false);

  const activeCount = activeSlotCategories.length + (boostFilter ? 1 : 0);

  return (
    <InnerPanel className="flex flex-col gap-1 px-1 pb-1 mb-1">
      <div className="flex gap-1 items-center">
        <div className="flex-1">
          <TextInput
            icon={SUNNYSIDE.icons.search}
            value={search}
            onValueChange={onSearchChange}
            onCancel={() => onSearchChange("")}
          />
        </div>
        <Button
          className="w-auto shrink-0"
          onClick={() => setShowFilters((show) => !show)}
        >
          <span className="text-xs sm:text-sm whitespace-nowrap">
            {showFilters
              ? t("inventory.hideFilters")
              : activeCount > 0
                ? `${t("inventory.showFilters")} (${activeCount})`
                : t("inventory.showFilters")}
          </span>
        </Button>
      </div>
      {showFilters && (
        <>
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            <Chip
              selected={activeSlotCategories.length === 0}
              onClick={onClearSlotCategories}
              className="mb-1"
            >
              {t("inventory.all")}
            </Chip>
            {slotCategories.map((category) => (
              <Chip
                key={category.id}
                selected={activeSlotCategories.includes(category.id)}
                onClick={() => onToggleSlotCategory(category.id)}
                className="mb-1"
              >
                {category.label}
              </Chip>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            <Chip
              selected={boostFilter === undefined}
              onClick={() => onSetBoostFilter(undefined)}
              className="mb-1"
            >
              {t("inventory.all")}
            </Chip>
            <Chip
              icon={lightning}
              selected={boostFilter === "withBoost"}
              onClick={() =>
                onSetBoostFilter(
                  boostFilter === "withBoost" ? undefined : "withBoost",
                )
              }
              className="mb-1"
            >
              {t("wardrobe.withBoost")}
            </Chip>
            <Chip
              selected={boostFilter === "withoutBoost"}
              onClick={() =>
                onSetBoostFilter(
                  boostFilter === "withoutBoost" ? undefined : "withoutBoost",
                )
              }
              className="mb-1"
            >
              {t("wardrobe.withoutBoost")}
            </Chip>
          </div>
        </>
      )}
    </InnerPanel>
  );
};
