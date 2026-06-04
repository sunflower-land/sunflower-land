import React from "react";
import { TextInput } from "components/ui/TextInput";
import { Dropdown } from "components/ui/Dropdown";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { InnerPanel } from "components/ui/Panel";

export type InventorySortKey = "default" | "amount" | "name";

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
  sort: InventorySortKey;
  onSortChange: (sort: InventorySortKey) => void;
}

const SORT_KEYS: InventorySortKey[] = ["default", "amount", "name"];

/**
 * Search field, sort dropdown and category filter chips shared by the Basket
 * and Chest. Multiple chips can be selected at once to narrow the grid to a
 * union of categories so the player no longer has to scroll through every
 * section. Selecting none (or "All") shows everything.
 */
export const InventoryFilters: React.FC<Props> = ({
  search,
  onSearchChange,
  categories,
  activeCategories,
  onToggleCategory,
  onClearCategories,
  sort,
  onSortChange,
}) => {
  const { t } = useAppTranslation();

  const sortLabels: Record<InventorySortKey, string> = {
    default: t("inventory.sort.default"),
    amount: t("inventory.sort.amount"),
    name: t("inventory.sort.name"),
  };

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
        <div className="w-28 sm:w-36 shrink-0">
          <Dropdown
            options={SORT_KEYS}
            value={sort}
            onChange={(value) => onSortChange(value as InventorySortKey)}
            getOptionLabel={(value) => sortLabels[value as InventorySortKey]}
            maxHeight={12}
          />
        </div>
      </div>
      <div className="flex overflow-x-auto scrollable sm:flex-wrap gap-1">
        <Label
          type={activeCategories.length === 0 ? "warning" : "default"}
          onClick={onClearCategories}
          className="whitespace-nowrap sm:whitespace-normal mb-1 sm:mb-0"
        >
          {t("inventory.all")}
        </Label>
        {categories.map((category) => (
          <Label
            key={category.id}
            type={
              activeCategories.includes(category.id) ? "warning" : "default"
            }
            icon={category.icon}
            onClick={() => onToggleCategory(category.id)}
            className="whitespace-nowrap sm:whitespace-normal mb-1 sm:mb-0"
          >
            {category.label}
          </Label>
        ))}
      </div>
    </InnerPanel>
  );
};
