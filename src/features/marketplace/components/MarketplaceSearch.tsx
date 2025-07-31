import React, { useState, useCallback, useEffect } from "react";
import { Button } from "components/ui/Button";
import { TextInput } from "components/ui/TextInput";
import bud from "assets/icons/bud.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/images";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { Label } from "components/ui/Label";
import { translate } from "lib/i18n/translate";
import classNames from "classnames";
import { InnerPanel } from "components/ui/Panel";

interface FilterOption {
  name: string;
  image: string;
  filterType: string;
  active: boolean;
}

interface Toast {
  id: number;
  text: string;
}

// Available filter options for marketplace search
const FILTER_OPTIONS: FilterOption[] = [
  {
    name: translate("resources"),
    image: ITEM_DETAILS["Eggplant"].image,
    filterType: "resources",
    active: false,
  },
  {
    name: translate("collectibles"),
    image: ITEM_DETAILS["Basic Scarecrow"].image,
    filterType: "collectibles",
    active: false,
  },
  {
    name: translate("wearables"),
    image: new URL(
      `/src/assets/wearables/${ITEM_IDS["Sword"]}.webp`,
      import.meta.url,
    ).href,
    filterType: "wearables",
    active: false,
  },
  {
    name: "Buds",
    image: bud,
    filterType: "buds",
    active: false,
  },
  {
    name: translate("boosts"),
    image: SUNNYSIDE.icons.lightning,
    filterType: "utility",
    active: false,
  },
  {
    name: translate("marketplace.cosmetics"),
    image: SUNNYSIDE.icons.heart,
    filterType: "cosmetic",
    active: false,
  },
];

export const MarketplaceSearch: React.FC<{
  search: string;
  setSearch: (search: string) => void;
  navigated: boolean;
  setNavigated: (navigated: boolean) => void;
  setActiveFilters: (activeFilters: string) => void;
}> = ({ search, setSearch, navigated, setNavigated, setActiveFilters }) => {
  const [filterOptions, setFilterOptions] =
    useState<FilterOption[]>(FILTER_OPTIONS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Updates the active filters and notifies the parent component.
  const updateActiveFilters = useCallback(
    (newFilterOptions: FilterOption[]) => {
      const newActiveFilters = newFilterOptions
        .filter((filter) => filter.active)
        .map((filter) => filter.filterType)
        .join(",");
      setActiveFilters(newActiveFilters);
    },
    [setActiveFilters],
  );

  // Updates filter options and active filters.
  const setAndNotifyFilters = useCallback(
    (filters: FilterOption[]) => {
      setFilterOptions(filters);
      updateActiveFilters(filters);
    },
    [updateActiveFilters],
  );

  // Toggles the active state of a filter.
  const toggleFilter = (index: number) => {
    const updatedFilters = filterOptions.map((filter, i) =>
      index === i ? { ...filter, active: !filter.active } : filter,
    );
    setAndNotifyFilters(updatedFilters);
  };

  // Creates a temporary toast when a filter is activated
  const handleToast = (text: string, index: number) => {
    if (!filterOptions[index].active) {
      setToasts([]);
      const id = index;
      const newToast: Toast = { id, text };
      setToasts([newToast]);

      setTimeout(() => {
        setToasts((prevToasts) =>
          prevToasts.filter((toast) => toast.id !== id),
        );
      }, 1500);
    }
  };

  //  Resets filters to default state and hides the filter panel.
  const resetFiltersAndClose = useCallback(() => {
    setAndNotifyFilters(FILTER_OPTIONS);
    setShowFilters(false);
  }, [setAndNotifyFilters]);

  useEffect(() => {
    if (navigated) {
      resetFiltersAndClose();
    }
    setNavigated(false);
  }, [navigated, setNavigated, resetFiltersAndClose]);

  return (
    <div className="flex relative flex-col sm:flex-row lg:flex-col z-10 w-full">
      {/* Search input section */}
      <div onClick={() => setShowFilters(true)} className="w-full">
        <TextInput
          icon={SUNNYSIDE.icons.search}
          value={search}
          onValueChange={setSearch}
        />
      </div>

      <div className="flex">
        {/* SM Size */}
        <div className="hidden relative sm:flex lg:hidden mt-0.5">
          <FilterOptionsContent
            filterOptions={filterOptions}
            toggleFilter={toggleFilter}
            handleToast={handleToast}
            toast={toasts[0]}
          />
        </div>

        {/* Large screens or screens smaller than SM */}
        <InnerPanel
          className={classNames(
            "absolute sm:hidden lg:flex bottom-[95%] lg:bottom-[100%] left-[50%] lg:left-[52%] -translate-x-1/2 duration-300 ease-in-out",
            {
              "opacity-0 translate-y-7 pointer-events-none": !showFilters,
              "opacity-100 translate-y-0 pointer-events-auto": showFilters,
            },
          )}
        >
          <FilterOptionsContent
            filterOptions={filterOptions}
            toggleFilter={toggleFilter}
            handleToast={handleToast}
            onClose={resetFiltersAndClose}
            toast={toasts[0]}
          />
        </InnerPanel>
      </div>
    </div>
  );
};

const FilterOptionsContent: React.FC<{
  filterOptions: FilterOption[];
  toggleFilter: (index: number) => void;
  handleToast: (name: string, index: number) => void;
  onClose?: () => void;
  toast: Toast;
}> = ({ filterOptions, toggleFilter, handleToast, onClose, toast }) => {
  return (
    <div className="flex">
      {/* Filter buttons */}
      {filterOptions.map((filter, index) => (
        <Button
          className={classNames("relative w-11 lg:w-10 h-11 lg:h-10 p-0", {
            "ml-1": index > 0,
          })}
          onClick={() => {
            toggleFilter(index);
            handleToast(filter.name, index);
          }}
          key={filter.filterType}
        >
          <img src={filter.image} className="h-6" alt={filter.name} />

          {/* Active filter indicator */}
          {filter.active && (
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-5">
              <img className="w-5" src={SUNNYSIDE.icons.confirm} />
            </div>
          )}
        </Button>
      ))}
      {onClose && (
        <div className="flex top-1/2 ml-1 mt-1 lg:mt-0.5 cursor-pointer">
          <img
            src={SUNNYSIDE.icons.close}
            className="w-8 h-8"
            onClick={onClose}
          />
        </div>
      )}

      {/* Show Toast */}
      {toast && (
        <Label
          className="flex absolute bottom-[95%] sm:bottom-[112%] lg:bottom-[95%] left-1/2 -translate-x-1/2 z-10"
          type="default"
        >
          {toast.text}
        </Label>
      )}
    </div>
  );
};
