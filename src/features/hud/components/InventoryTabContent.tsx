import React, { useEffect } from "react";
import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { InventoryItemName } from "features/game/types/game";

import { SEEDS, CROPS, CropName } from "features/game/types/crops";

import timer from "assets/icons/timer.png";

import { secondsToString } from "lib/utils/time";
import classNames from "classnames";
import { useShowScrollbar } from "lib/utils/hooks/useShowScrollbar";
import { Inventory, TabItems } from "./InventoryItems";

const ITEM_CARD_MIN_HEIGHT = "148px";

interface Props {
  tabItems: TabItems;
  selectedItem?: InventoryItemName;
  setDefaultSelectedItem: (item: InventoryItemName) => void;
  inventory: Inventory;
  inventoryItems: InventoryItemName[];
  onClick: (item: InventoryItemName) => void;
}

const TAB_CONTENT_HEIGHT = 384;

const isSeed = (selectedItem: InventoryItemName) => selectedItem in SEEDS();

export const InventoryTabContent = ({
  tabItems,
  selectedItem,
  setDefaultSelectedItem,
  inventory,
  inventoryItems,
  onClick,
}: Props) => {
  const { ref: itemContainerRef, showScrollbar } =
    useShowScrollbar(TAB_CONTENT_HEIGHT);
  const categories = Object.keys(tabItems) as InventoryItemName[];

  useEffect(() => {
    const firstCategoryWithItem = categories.find(
      (category) => !!inventoryMapping[category]?.length
    );

    const defaultSelectedItem =
      firstCategoryWithItem && inventoryMapping[firstCategoryWithItem][0];

    if (defaultSelectedItem) {
      setDefaultSelectedItem(defaultSelectedItem);
    }
  }, []);

  const inventoryMapping = inventoryItems.reduce((acc, curr) => {
    const category = categories.find(
      (category) => curr in tabItems[category].items
    );

    if (category) {
      const currentItems = acc[category] || [];

      acc[category] = [...currentItems, curr];
    }

    return acc;
  }, {} as Record<string, InventoryItemName[]>);

  const findIfItemsExistForCategory = (category: string) => {
    return Object.keys(inventoryMapping).includes(category);
  };

  const getCropHarvestTime = (crop = "") =>
    secondsToString(CROPS()[crop.split(" ")[0] as CropName].harvestSeconds);

  return (
    <div className="flex flex-col">
      <OuterPanel className="flex-1 mb-3">
        {selectedItem && (
          <div
            style={{ minHeight: ITEM_CARD_MIN_HEIGHT }}
            className="flex flex-col justify-evenly items-center p-2"
          >
            <span className="text-base text-center text-shadow">
              {selectedItem}
            </span>
            <img
              src={ITEM_DETAILS[selectedItem].image}
              className="h-12 w-12"
              alt={selectedItem}
            />
            <span className="text-xs text-shadow text-center mt-2">
              {ITEM_DETAILS[selectedItem].description}
            </span>
            {isSeed(selectedItem) && (
              <div className="w-full pt-1">
                <div className="flex justify-center items-end">
                  <img src={timer} className="h-5 me-2" />
                  <span className="text-xs text-shadow text-center mt-2 ">
                    {getCropHarvestTime(selectedItem)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </OuterPanel>
      <div
        ref={itemContainerRef}
        className={classNames("h-96 overflow-y-scroll", {
          scrollable: showScrollbar,
        })}
      >
        {categories.map((category) => (
          <div className="flex flex-col" key={category}>
            {<p className="mb-2 underline">{category}</p>}
            {findIfItemsExistForCategory(category) ? (
              <div className="flex mb-2 flex-wrap">
                {inventoryMapping[category].map((item) => (
                  <Box
                    count={inventory[item]}
                    isSelected={selectedItem === item}
                    key={item}
                    onClick={() => {
                      onClick(item);
                    }}
                    image={ITEM_DETAILS[item].image}
                  />
                ))}
              </div>
            ) : (
              <p className="text-white text-xs text-shadow mb-2">
                {`No ${category} in inventory`}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
