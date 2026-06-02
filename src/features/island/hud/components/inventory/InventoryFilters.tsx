import React from "react";
import { TextInput } from "components/ui/TextInput";
import { Dropdown } from "components/ui/Dropdown";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export type InventorySortKey = "default" | "amount" | "name";

export const ALL_CATEGORY = "all";

export interface InventoryFilterCategory {
  id: string;
  label: string;
  icon?: string;
}

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  categories: InventoryFilterCategory[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  sort: InventorySortKey;
  onSortChange: (sort: InventorySortKey) => void;
}

const SORT_KEYS: InventorySortKey[] = ["default", "amount", "name"];

/**
 * Search field, sort dropdown and category filter chips shared by the Basket
 * and Chest. Selecting a chip narrows the grid to a single category so the
 * player no longer has to scroll through every section.
 */
export const InventoryFilters: React.FC<Props> = ({
  search,
  onSearchChange,
  categories,
  activeCategory,
  onCategoryChange,
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
    <div className="flex flex-col gap-1 px-1 pb-1">
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
      <div className="flex flex-wrap gap-1">
        <Label
          type={activeCategory === ALL_CATEGORY ? "warning" : "default"}
          onClick={() => onCategoryChange(ALL_CATEGORY)}
        >
          {t("inventory.all")}
        </Label>
        {categories.map((category) => (
          <Label
            key={category.id}
            type={activeCategory === category.id ? "warning" : "default"}
            icon={category.icon}
            onClick={() => onCategoryChange(category.id)}
          >
            {category.label}
          </Label>
        ))}
      </div>
    </div>
  );
};
