import React from "react";
import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { InventoryItemName } from "features/game/types/game";

import classNames from "classnames";
import { useShowScrollbar } from "lib/utils/hooks/useShowScrollbar";
import { useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { Inventory, TabItems } from "./InventoryItems";
import {
  getKeys,
  LimitedItemName,
  LIMITED_ITEMS,
} from "features/game/types/craftables";
import { useMakeDefaultInventoryItem } from "components/hooks/useGetDefaultInventoryItem";
import { getChestItems } from "./utils/basket";
import Decimal from "decimal.js-light";
import { Button } from "components/ui/Button";

const ITEM_CARD_MIN_HEIGHT = "148px";

interface Props {
  selectedItem?: InventoryItemName;
  setDefaultSelectedItem: (item: InventoryItemName) => void;
  inventory: Inventory;
  onClick: (item: InventoryItemName) => void;
  isFarming?: boolean;
}

const TAB_CONTENT_HEIGHT = 400;

const isCollectible = (selectedItem: InventoryItemName) =>
  selectedItem in LIMITED_ITEMS;

export const Chest: React.FC<Props> = ({
  selectedItem,
  setDefaultSelectedItem,
  inventory,
  onClick,
  isFarming,
}: Props) => {
  const { ref: itemContainerRef, showScrollbar } =
    useShowScrollbar(TAB_CONTENT_HEIGHT);
  const [scrollIntoView] = useScrollIntoView();

  const chestMap = getChestItems(inventory);

  // useMakeDefaultInventoryItem({
  //   setDefaultSelectedItem,
  //   basketItems,
  //   inventoryCategories,
  //   isFarming,
  // });

  const handleItemClick = (item: InventoryItemName) => {
    onClick(item);

    if (item && ITEM_DETAILS[item].section) {
      scrollIntoView(ITEM_DETAILS[item].section);
    }
  };

  const basketIsEmpty = Object.values(chestMap).length === 0;
  const collectibles = getKeys(chestMap).reduce((acc, item) => {
    if (item in LIMITED_ITEMS) {
      return { ...acc, [item]: chestMap[item] };
    }
    return acc;
  }, {} as Record<LimitedItemName, Decimal>);

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
              <Button className="text-xs w-2/4 mt-2">Place on Map</Button>
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
        {Object.values(collectibles) && (
          <div className="flex flex-col pl-2" key={"Collectibles"}>
            {<p className="mb-2 underline">Seeds</p>}
            <div className="flex mb-2 flex-wrap -ml-1.5">
              {getKeys(collectibles).map((item) => (
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
