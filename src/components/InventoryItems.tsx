import React, { useState } from "react";
import { FERTILISERS, InventoryItemName } from "features/game/types/game";

import seeds from "assets/icons/seeds.png";
import sunflowerPlant from "assets/crops/sunflower/crop.png";
import close from "assets/icons/close.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";

import { CROP_SEEDS, CROPS } from "features/game/types/crops";
import {
  FOODS,
  TOOLS,
  FLAGS,
  BLACKSMITH_ITEMS,
  BARN_ITEMS,
  MARKET_ITEMS,
  ROCKET_ITEMS,
  getKeys,
  QUEST_ITEMS,
  MUTANT_CHICKENS,
  SHOVELS,
  SALESMAN_ITEMS,
  WAR_BANNERS,
  WAR_TENT_ITEMS,
} from "features/game/types/craftables";
import { RESOURCES } from "features/game/types/resources";

import Decimal from "decimal.js-light";
import { InventoryTabContent } from "./InventoryTabContent";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";

type Tab = "basket" | "collectibles";

interface Props {
  inventory: Inventory;
  shortcutItem?: (item: InventoryItemName) => void;
  onClose: () => void;
  isFarming?: boolean;
}

export type TabItems = Record<string, { items: object }>;

const BASKET_CATEGORIES: TabItems = {
  Seeds: {
    items: CROP_SEEDS(),
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
  Fertilisers: {
    items: FERTILISERS,
  },
  Coupons: {
    items: {
      "Trading Ticket": {},
      "War Bond": {},
      "Jack-o-lantern": {},
    },
  },
};

const COLLECTIBLE_CATEGORIES: TabItems = {
  NFTs: {
    items: {
      ...BLACKSMITH_ITEMS,
      ...BARN_ITEMS,
      ...MARKET_ITEMS,
      ...FLAGS,
      ...ROCKET_ITEMS,
      ...MUTANT_CHICKENS,
      ...SALESMAN_ITEMS,
      ...WAR_BANNERS,
      ...WAR_TENT_ITEMS,
      // TEMP
      "Chef Hat": ITEM_DETAILS["Chef Hat"],
    },
  },
  "Quest Items": {
    items: QUEST_ITEMS,
  },
  Foods: {
    items: FOODS(),
  },
  "Easter Eggs": {
    items: {
      "Pink Egg": ITEM_DETAILS["Pink Egg"],
      "Purple Egg": ITEM_DETAILS["Purple Egg"],
      "Red Egg": ITEM_DETAILS["Red Egg"],
      "Blue Egg": ITEM_DETAILS["Blue Egg"],
      "Orange Egg": ITEM_DETAILS["Orange Egg"],
      "Green Egg": ITEM_DETAILS["Green Egg"],
      "Yellow Egg": ITEM_DETAILS["Yellow Egg"],
    },
  },
};

export type Inventory = Partial<Record<InventoryItemName, Decimal>>;

const makeInventoryItems = (inventory: Inventory) => {
  const items = getKeys(inventory) as InventoryItemName[];
  return items.filter(
    (itemName) => !!inventory[itemName] && !inventory[itemName]?.equals(0)
  );
};

export const InventoryItems: React.FC<Props> = ({
  inventory,
  onClose,
  shortcutItem,
  isFarming,
}) => {
  const [currentTab, setCurrentTab] = useState<Tab>("basket");
  const [inventoryItems] = useState<InventoryItemName[]>(
    makeInventoryItems(inventory)
  );
  const [selectedItem, setSelectedItem] = useState<InventoryItemName>();

  const handleTabClick = (tab: Tab) => {
    setCurrentTab(tab);
  };

  const handleItemSelected = (item: InventoryItemName) => {
    if (shortcutItem) {
      shortcutItem(item);
    }

    setSelectedItem(item);
  };

  return (
    <Panel className="relative" hasTabs>
      <div
        className="absolute flex"
        style={{
          top: `${PIXEL_SCALE * 1}px`,
          left: `${PIXEL_SCALE * 1}px`,
          right: `${PIXEL_SCALE * 1}px`,
        }}
      >
        <Tab
          className="flex items-center"
          isActive={currentTab === "basket"}
          onClick={() => handleTabClick("basket")}
        >
          <img src={seeds} className="h-4 sm:h-5 mr-2" />
          <span className="text-xs sm:text-sm overflow-hidden text-ellipsis">
            Basket
          </span>
        </Tab>
        <Tab
          className="flex items-center"
          isActive={currentTab === "collectibles"}
          onClick={() => handleTabClick("collectibles")}
        >
          <img src={sunflowerPlant} className="h-4 sm:h-5 mr-2" />
          <span className="text-xs sm:text-sm overflow-hidden text-ellipsis">
            Collectibles
          </span>
        </Tab>
        <img
          src={close}
          className="absolute cursor-pointer z-20"
          onClick={onClose}
          style={{
            top: `${PIXEL_SCALE * 1}px`,
            right: `${PIXEL_SCALE * 1}px`,
            width: `${PIXEL_SCALE * 11}px`,
          }}
        />
      </div>

      {currentTab === "basket" && (
        <InventoryTabContent
          tabItems={BASKET_CATEGORIES}
          selectedItem={selectedItem}
          setDefaultSelectedItem={setSelectedItem}
          inventory={inventory}
          inventoryItems={inventoryItems}
          onClick={handleItemSelected}
          isFarming={isFarming}
        />
      )}
      {currentTab === "collectibles" && (
        <InventoryTabContent
          tabItems={COLLECTIBLE_CATEGORIES}
          selectedItem={selectedItem}
          setDefaultSelectedItem={setSelectedItem}
          inventory={inventory}
          inventoryItems={inventoryItems}
          onClick={handleItemSelected}
          isFarming={isFarming}
        />
      )}
    </Panel>
  );
};
