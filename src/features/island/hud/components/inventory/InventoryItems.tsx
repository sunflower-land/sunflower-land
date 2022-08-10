import React, { useState } from "react";
import { GameState, InventoryItemName } from "features/game/types/game";

import basket from "assets/icons/basket.png";
import chest from "assets/icons/chest.png";
import close from "assets/icons/close.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";

import { SEEDS, CROPS } from "features/game/types/crops";
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
} from "features/game/types/craftables";
import { RESOURCES } from "features/game/types/resources";

import Decimal from "decimal.js-light";
import { Basket } from "./Basket";
import { ITEM_DETAILS } from "features/game/types/images";
import { Chest } from "./Chest";

type Tab = "basket" | "chest";

interface Props {
  state: GameState;
  shortcutItem?: (item: InventoryItemName) => void;
  onClose: () => void;
  isFarming?: boolean;
}

export type TabItems = Record<string, { items: object }>;

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
  state,
  onClose,
  shortcutItem,
  isFarming,
}) => {
  const [currentTab, setCurrentTab] = useState<Tab>("basket");
  const [inventoryItems] = useState<InventoryItemName[]>(
    makeInventoryItems(state.inventory)
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
    <Panel className="pt-5 relative">
      <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
        <div className="flex">
          <Tab
            className="flex items-center"
            isActive={currentTab === "basket"}
            onClick={() => handleTabClick("basket")}
          >
            <img src={basket} className="h-4 sm:h-5 mr-2" />
            <span className="text-xs sm:text-sm overflow-hidden text-ellipsis">
              Basket
            </span>
          </Tab>
          <Tab
            className="flex items-center"
            isActive={currentTab === "chest"}
            onClick={() => handleTabClick("chest")}
          >
            <img src={chest} className="h-4 sm:h-5 mr-2" />
            <span className="text-xs sm:text-sm overflow-hidden text-ellipsis">
              Chest
            </span>
          </Tab>
        </div>
        <img
          src={close}
          className="h-6 cursor-pointer mr-2 mb-1"
          onClick={onClose}
        />
      </div>

      {currentTab === "basket" && (
        <Basket
          selectedItem={selectedItem}
          setDefaultSelectedItem={setSelectedItem}
          inventory={state.inventory}
          onClick={handleItemSelected}
          isFarming={isFarming}
        />
      )}
      {currentTab === "chest" && (
        <Chest
          selectedItem={selectedItem}
          setDefaultSelectedItem={setSelectedItem}
          state={state}
          onClick={handleItemSelected}
          isFarming={isFarming}
        />
      )}
    </Panel>
  );
};
