import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { InventoryItemName } from "features/game/types/game";

import seeds from "assets/icons/seeds.png";
import sunflowerPlant from "assets/crops/sunflower/crop.png";
import close from "assets/icons/close.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";

import { SEEDS, CROPS } from "features/game/types/crops";
import { FOODS, TOOLS, LimitedItems } from "features/game/types/craftables";
import { RESOURCES } from "features/game/types/resources";

import seed from "assets/crops/beetroot/seed.png";
import crop from "assets/crops/sunflower/crop.png";
import tool from "assets/tools/hammer.png";
import nft from "assets/nfts/gnome.png";
import food from "assets/crops/wheat/flour.png";
import resource from "assets/resources/wood.png";

import { useTour } from "@reactour/tour";
import { TourStep } from "features/game/lib/Tour";
import Decimal from "decimal.js-light";
import { InventoryTabContent } from "./InventoryTabContent";

type Tab = "basket" | "collectibles";

interface Props {
  onClose: () => void;
}

export type TabItems = Record<string, { img: string; items: object }>;

const BASKET_CATEGORIES: TabItems = {
  Seeds: {
    img: seed,
    items: SEEDS(),
  },
  Tools: {
    img: tool,
    items: TOOLS,
  },
  Resources: {
    img: resource,
    items: RESOURCES,
  },
  Crops: {
    img: crop,
    items: CROPS(),
  },
};

const COLLECTIBLE_CATEGORIES: TabItems = {
  NFTs: {
    img: nft,
    items: LimitedItems,
  },
  Foods: {
    img: food,
    items: FOODS,
  },
};

export type Inventory = Partial<Record<InventoryItemName, Decimal>>;

const makeInventoryItems = (inventory: Inventory) => {
  const items = Object.keys(inventory) as InventoryItemName[];
  return items.filter(
    (itemName) => !!inventory[itemName] && !inventory[itemName]?.equals(0)
  );
};

export const InventoryItems: React.FC<Props> = ({ onClose }) => {
  const { gameService, shortcutItem } = useContext(Context);
  const [game] = useActor(gameService);
  const inventory = game.context.state.inventory;

  const [currentTab, setCurrentTab] = useState<Tab>("basket");
  const [inventoryItems] = useState<InventoryItemName[]>(
    makeInventoryItems(inventory)
  );
  const [selectedItem, setSelectedItem] = useState<InventoryItemName>();

  const {
    setCurrentStep: setCurrentTourStep,
    isOpen: tourIsOpen,
    currentStep: currentTourStep,
  } = useTour();

  const handleTabClick = (tab: Tab) => {
    setCurrentTab(tab);
    if (tourIsOpen) {
      currentTourStep === TourStep.openSellTab
        ? setCurrentTourStep(TourStep.sellSunflower)
        : setCurrentTourStep(TourStep.buy);
    }
  };

  const handleItemSelected = (item: InventoryItemName) => {
    shortcutItem(item);
    setSelectedItem(item);
  };

  return (
    <Panel className="pt-5 relative">
      <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
        <div className="flex">
          <Tab
            isActive={currentTab === "basket"}
            onClick={() => handleTabClick("basket")}
          >
            <img src={seeds} className="h-5 mr-2" />
            <span className="text-sm text-shadow">Basket</span>
          </Tab>
          <Tab
            isActive={currentTab === "collectibles"}
            onClick={() => handleTabClick("collectibles")}
          >
            <img src={sunflowerPlant} className="h-5 mr-2" />
            <span className="text-sm text-shadow">Collectibles</span>
          </Tab>
        </div>
        <img
          src={close}
          className="h-6 cursor-pointer mr-2 mb-1"
          onClick={tourIsOpen ? undefined : () => onClose()}
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
        />
      )}
    </Panel>
  );
};
