import React, { useContext, useEffect, useState } from "react";
import { useActor } from "@xstate/react";
import { Box } from "components/ui/Box";
import { OuterPanel, Panel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { InventoryItemName } from "features/game/types/game";

import { secondsToString } from "lib/utils/time";

import { SEEDS, CROPS, CropName } from "features/game/types/crops";
import { FOODS, TOOLS, LimitedItems } from "features/game/types/craftables";
import { RESOURCES } from "features/game/types/resources";

import arrowLeft from "assets/icons/arrow_left.png";
import arrowRight from "assets/icons/arrow_right.png";
import seed from "assets/crops/beetroot/seed.png";
import crop from "assets/crops/sunflower/crop.png";
import tool from "assets/tools/hammer.png";
import nft from "assets/nfts/gnome.png";
import food from "assets/crops/wheat/flour.png";
import resource from "assets/resources/wood.png";
import timer from "assets/icons/timer.png";

import close from "assets/icons/close.png";

interface Props {
  onClose: () => void;
}

type Tab = "Seeds" | "Crops" | "Tools" | "NFTs" | "Foods" | "Resources";

export const CATEGORIES: Record<Tab, { img: string; items: object }> = {
  Seeds: {
    img: seed,
    items: SEEDS(),
  },
  Crops: {
    img: crop,
    items: CROPS(),
  },
  Tools: {
    img: tool,
    items: TOOLS,
  },
  NFTs: {
    img: nft,
    items: LimitedItems,
  },
  Foods: {
    img: food,
    items: FOODS,
  },
  Resources: {
    img: resource,
    items: RESOURCES,
  },
};

export const InventoryItems: React.FC<Props> = ({ onClose }) => {
  const { gameService, shortcutItem } = useContext(Context);
  const [currentTab, setCurrentTab] = useState<Tab>("Seeds");
  const [selectedItem, setSelectedItem] = useState<InventoryItemName>();
  const [game] = useActor(gameService);
  const inventory = game.context.state.inventory;

  const tabSequence = Object.keys(CATEGORIES) as Tab[];
  const items = Object.keys(inventory) as InventoryItemName[];
  const validItems = items.filter(
    (itemName) => !!inventory[itemName] && !inventory[itemName]?.equals(0)
  );
  const firstItem = validItems.find(
    (itemName) => itemName in CATEGORIES[currentTab].items
  );

  useEffect(() => {
    // the first valid item found in a category should be the default selected item
    // re-render when firstItem changes
    setSelectedItem(firstItem);
  }, [firstItem]);

  const len = Object.keys(CATEGORIES).length;

  const getCurrentTabIndex = () => tabSequence.indexOf(currentTab);
  const getCropHarvestTime = (crop = "") =>
    secondsToString(CROPS()[crop.split(" ")[0] as CropName].harvestSeconds);

  const nextCategory = () => {
    const index = getCurrentTabIndex();
    setCurrentTab(index === len - 1 ? tabSequence[0] : tabSequence[index + 1]);
    setSelectedItem(undefined);
  };

  const prevCategory = () => {
    const index = getCurrentTabIndex();
    setCurrentTab(index === 0 ? tabSequence[len - 1] : tabSequence[index - 1]);
    setSelectedItem(undefined);
  };

  return (
    <Panel className="pt-5 relative inventory">
      <img
        src={close}
        className="absolute h-6 cursor-pointer"
        style={{ top: "2%", right: "1%", zIndex: "1" }}
        onClick={onClose}
      />
      <div className="flex justify-center absolute mt-1 top-2 left-0.5 right-0 items-center">
        <img
          className="mr-5 hover:opacity-80 cursor-pointer h-6"
          src={arrowLeft}
          onClick={prevCategory}
        />
        {tabSequence.map((category) => (
          <div
            key={category}
            className={`${
              currentTab === category ? "" : "hidden"
            } flex items-center justify-center`}
            style={{ minWidth: "10rem" }}
          >
            <div>
              <img src={CATEGORIES[category].img} className="h-5" />
            </div>
            <span className="text-sm text-shadow ml-2">{category}</span>
          </div>
        ))}
        <img
          className="ml-5 hover:opacity-80 cursor-pointer h-6"
          src={arrowRight}
          onClick={nextCategory}
        />
      </div>

      <div className="flex">
        <div className="w-3/5 flex flex-wrap h-fit">
          {!selectedItem ? (
            <span className="text-white text-shadow">
              {`No ${currentTab} in inventory`}
            </span>
          ) : (
            validItems.map(
              (itemName) =>
                itemName in CATEGORIES[currentTab].items && (
                  <Box
                    count={inventory[itemName]}
                    isSelected={selectedItem === itemName}
                    key={itemName}
                    onClick={() => {
                      game.matches("readonly") ? null : shortcutItem(itemName);
                      setSelectedItem(itemName);
                    }}
                    image={ITEM_DETAILS[itemName].image}
                  />
                )
            )
          )}
        </div>

        <OuterPanel className="flex-1">
          {selectedItem && (
            <div className="flex flex-col justify-center items-center p-2">
              <span className="text-base text-center text-shadow">
                {selectedItem}
              </span>
              <img
                src={ITEM_DETAILS[selectedItem].image}
                className="h-12 w-12"
                alt={selectedItem}
              />
              {currentTab === "Seeds" && (
                <div className="border-t border-white w-full mt-2 pt-1">
                  <div className="flex justify-center items-end">
                    <img src={timer} className="h-5 me-2" />
                    <span className="text-xs text-shadow text-center mt-2 ">
                      {getCropHarvestTime(selectedItem)}
                    </span>
                  </div>
                </div>
              )}
              <span className="text-xs text-shadow text-center mt-2">
                {ITEM_DETAILS[selectedItem].description}
              </span>
            </div>
          )}
        </OuterPanel>
      </div>
    </Panel>
  );
};
