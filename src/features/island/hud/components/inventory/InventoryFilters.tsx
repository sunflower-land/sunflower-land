import React, { useState } from "react";
import { TextInput } from "components/ui/TextInput";
import { Chip } from "components/ui/Chip";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { InnerPanel } from "components/ui/Panel";

export interface InventoryFilterCategory {
  id: string;
  label: string;
  icon?: string;
}

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  categories: InventoryFilterCategory[];
  /** Selected category ids. An empty array means "All" is active. */
  activeCategories: string[];
  onToggleCategory: (id: string) => void;
  onClearCategories: () => void;
}

/**
 * Search field and collapsible category filter chips shared by the Basket and
 * Chest. The chips are hidden behind a "Show filters" toggle to keep the panel
 * compact. Multiple chips can be selected at once to narrow the grid to a union
 * of categories so the player no longer has to scroll through every section.
 * Selecting none (or "All") shows everything.
 */
export const InventoryFilters: React.FC<Props> = ({
  search,
  onSearchChange,
  categories,
  activeCategories,
  onToggleCategory,
  onClearCategories,
}) => {
  const { t } = useAppTranslation();

  // Category chips are collapsed by default to keep the panel compact; the
  // player opens them on demand via the toggle button.
  const [showFilters, setShowFilters] = useState(false);

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
              : activeCategories.length > 0
                ? `${t("inventory.showFilters")} (${activeCategories.length})`
                : t("inventory.showFilters")}
          </span>
        </Button>
      </div>
      {showFilters && (
        <div className="flex overflow-x-auto scrollable sm:flex-wrap gap-x-2 gap-y-1">
          <Chip
            selected={activeCategories.length === 0}
            onClick={onClearCategories}
            className="whitespace-nowrap sm:whitespace-normal mb-1 sm:mb-0"
          >
            {t("inventory.all")}
          </Chip>
          {categories.map((category) => (
            <Chip
              key={category.id}
              selected={activeCategories.includes(category.id)}
              icon={category.icon}
              onClick={() => onToggleCategory(category.id)}
              className="whitespace-nowrap sm:whitespace-normal mb-1 sm:mb-0"
            >
              {category.label}
            </Chip>
          ))}
        </div>
      )}
    </InnerPanel>
  );
};
