import React from "react";
import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { InventoryItemName } from "features/game/types/game";

import { SEEDS, CropName, SeedName, CROPS } from "features/game/types/crops";

import timer from "assets/icons/timer.png";
import lightning from "assets/icons/lightning.png";

import { secondsToMidString } from "lib/utils/time";
import classNames from "classnames";
import { useShowScrollbar } from "lib/utils/hooks/useShowScrollbar";
import { useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { Inventory, TabItems } from "./InventoryItems";
import { getCropTime } from "features/game/events/plant";
import { FOODS, getKeys, SHOVELS, TOOLS } from "features/game/types/craftables";
import { useHasBoostForItem } from "components/hooks/useHasBoostForItem";
import { getBasketItems } from "./utils/inventory";
import Decimal from "decimal.js-light";
import { RESOURCES } from "features/game/types/resources";

const ITEM_CARD_MIN_HEIGHT = "148px";

const BASKET_CATEGORIES: TabItems = {
  Seeds: {
    items: SEEDS(),
  },
  Tools: {
    items: {
      ...TOOLS,
      ...SHOVELS,
    },
  },
  Resources: {
    items: RESOURCES,
  },
  Crops: {
    items: CROPS(),
  },
};

interface Props {
  selectedItem?: InventoryItemName;
  setDefaultSelectedItem: (item: InventoryItemName) => void;
  inventory: Inventory;
  onClick: (item: InventoryItemName) => void;
  isFarming?: boolean;
}

const TAB_CONTENT_HEIGHT = 400;

const isSeed = (selectedItem: InventoryItemName) => selectedItem in SEEDS();

export const Basket = ({
  selectedItem,
  setDefaultSelectedItem,
  inventory,
  onClick,
  isFarming,
}: Props) => {
  const { ref: itemContainerRef, showScrollbar } =
    useShowScrollbar(TAB_CONTENT_HEIGHT);
  const [scrollIntoView] = useScrollIntoView();

  const basketMap = getBasketItems(inventory);
  const inventoryCategories = getKeys(BASKET_CATEGORIES) as InventoryItemName[];
  const isTimeBoosted = useHasBoostForItem({ selectedItem, inventory });

  const getCropHarvestTime = (seedName = "") => {
    const crop = seedName.split(" ")[0] as CropName;

    return secondsToMidString(getCropTime(crop, inventory));
  };

  const handleItemClick = (item: InventoryItemName) => {
    onClick(item);

    if (item && ITEM_DETAILS[item].section) {
      scrollIntoView(ITEM_DETAILS[item].section);
    }
  };

  const basketIsEmpty = Object.values(basketMap).length === 0;

  const getItems = <T extends string | number | symbol, K>(
    items: Record<T, K>
  ) => {
    return getKeys(basketMap).reduce((acc, item) => {
      if (item in items) {
        return { ...acc, [item]: basketMap[item] };
      }
      return acc;
    }, {} as Record<T, Decimal>);
  };

  const seeds = getKeys(basketMap).reduce((acc, item) => {
    if (item in SEEDS()) {
      return { ...acc, [item]: basketMap[item] };
    }
    return acc;
  }, {} as Record<SeedName, Decimal>);

  const crops = getItems(CROPS());
  const tools = getItems(TOOLS);
  const shovels = getItems(SHOVELS);
  const resources = getItems(RESOURCES);
  const foods = getItems(FOODS());

  const test = [
    ...getKeys(seeds),
    ...getKeys(tools),
    ...getKeys(foods),
    ...getKeys(crops),
  ];

  // useMakeDefaultInventoryItem({
  //   setDefaultSelectedItem,
  //   basketMap,
  //   test,
  //   isFarming,
  // });

  const hastools =
    !!Object.values(tools).length || !!Object.values(shovels).length;
  const allTools = { ...tools, ...shovels };
  return (
    <div className="flex flex-col">
      {!basketIsEmpty && (
        <OuterPanel className="flex-1 mb-3">
          {selectedItem && (
            <div
              style={{ minHeight: ITEM_CARD_MIN_HEIGHT }}
              className="flex flex-col justify-evenly items-center p-2"
            >
              <span className="text-center text-shadow">{selectedItem}</span>
              <img
                src={ITEM_DETAILS[selectedItem].image}
                className="h-12"
                alt={selectedItem}
              />
              <span className="text-xs text-shadow text-center mt-2 w-80">
                {ITEM_DETAILS[selectedItem].description}
              </span>
              {isSeed(selectedItem) && (
                <div className="w-full pt-1">
                  <div className="flex justify-center items-end">
                    <img src={timer} className="h-5 me-2" />
                    {isTimeBoosted && (
                      <img src={lightning} className="h-6 me-2" />
                    )}
                    <span className="text-xs text-shadow text-center mt-2 ">
                      {getCropHarvestTime(selectedItem)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </OuterPanel>
      )}
      <div
        ref={itemContainerRef}
        style={{ maxHeight: TAB_CONTENT_HEIGHT }}
        className={classNames("overflow-y-auto", {
          scrollable: showScrollbar,
        })}
      >
        {!!Object.values(resources).length && (
          <div className="flex flex-col pl-2" key={"Resources"}>
            {<p className="mb-2 underline">Resources</p>}
            <div className="flex mb-2 flex-wrap -ml-1.5">
              {getKeys(resources).map((item) => (
                <Box
                  count={inventory[item]}
                  isSelected={selectedItem === item}
                  key={item}
                  onClick={() => handleItemClick(item)}
                  image={ITEM_DETAILS[item].image}
                />
              ))}
            </div>
          </div>
        )}

        {!!Object.values(seeds).length && (
          <div className="flex flex-col pl-2" key={"Seeds"}>
            {<p className="mb-2 underline">Seeds</p>}
            <div className="flex mb-2 flex-wrap -ml-1.5">
              {getKeys(seeds).map((item) => (
                <Box
                  count={inventory[item]}
                  isSelected={selectedItem === item}
                  key={item}
                  onClick={() => handleItemClick(item)}
                  image={ITEM_DETAILS[item].image}
                />
              ))}
            </div>
          </div>
        )}
        {!!Object.values(crops).length && (
          <div className="flex flex-col pl-2" key={"Crops"}>
            {<p className="mb-2 underline">Crops</p>}
            <div className="flex mb-2 flex-wrap -ml-1.5">
              {getKeys(crops).map((item) => (
                <Box
                  count={inventory[item]}
                  isSelected={selectedItem === item}
                  key={item}
                  onClick={() => handleItemClick(item)}
                  image={ITEM_DETAILS[item].image}
                />
              ))}
            </div>
          </div>
        )}
        {hastools && (
          <div className="flex flex-col pl-2" key={"Tools"}>
            {<p className="mb-2 underline">Tools</p>}
            <div className="flex mb-2 flex-wrap -ml-1.5">
              {getKeys(allTools).map((item) => (
                <Box
                  count={inventory[item]}
                  isSelected={selectedItem === item}
                  key={item}
                  onClick={() => handleItemClick(item)}
                  image={ITEM_DETAILS[item].image}
                />
              ))}
            </div>
          </div>
        )}
        {!!Object.values(foods).length && (
          <div className="flex flex-col pl-2" key={"foods"}>
            {<p className="mb-2 underline">Foods</p>}
            <div className="flex mb-2 flex-wrap -ml-1.5">
              {getKeys(foods).map((item) => (
                <Box
                  count={inventory[item]}
                  isSelected={selectedItem === item}
                  key={item}
                  onClick={() => handleItemClick(item)}
                  image={ITEM_DETAILS[item].image}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
