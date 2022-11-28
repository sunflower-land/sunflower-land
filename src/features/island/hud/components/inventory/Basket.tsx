import React, { useContext, useRef } from "react";
import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  InventoryItemName,
  FERTILISERS,
  COUPONS,
} from "features/game/types/game";

import { CROP_SEEDS, CropName, CROPS } from "features/game/types/crops";

import timer from "assets/icons/timer.png";
import lightning from "assets/icons/lightning.png";
import basket from "assets/icons/basket.png";

import { secondsToString } from "lib/utils/time";
import { useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { getCropTime } from "features/game/events/plant";
import { getKeys, SHOVELS, TOOLS } from "features/game/types/craftables";
import { useHasBoostForItem } from "components/hooks/useHasBoostForItem";
import { getBasketItems } from "./utils/inventory";
import { RESOURCES } from "features/game/types/resources";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { CONSUMABLES } from "features/game/types/consumables";
import { KNOWN_IDS } from "features/game/types";
import { BEANS } from "features/game/types/beans";

export const ITEM_CARD_MIN_HEIGHT = "148px";
export const TAB_CONTENT_HEIGHT = 400;

const isSeed = (selectedItem: InventoryItemName) =>
  selectedItem in CROP_SEEDS();

export const Basket: React.FC = () => {
  const [scrollIntoView] = useScrollIntoView();

  const { gameService, shortcutItem, selectedItem } = useContext(Context);
  const [gameState] = useActor(gameService);

  const divRef = useRef<HTMLDivElement>(null);

  const { inventory } = gameState.context.state;
  const basketMap = getBasketItems(inventory);
  const isTimeBoosted = useHasBoostForItem({ selectedItem, inventory });

  const getCropHarvestTime = (seedName = "") => {
    const crop = seedName.split(" ")[0] as CropName;

    return secondsToString(getCropTime(crop, inventory), { length: "medium" });
  };

  const handleItemClick = (item: InventoryItemName) => {
    shortcutItem(item);

    if (item && ITEM_DETAILS[item].section) {
      scrollIntoView(ITEM_DETAILS[item].section);
    }
  };

  const basketIsEmpty = Object.values(basketMap).length === 0;

  if (basketIsEmpty) {
    return (
      <div
        style={{ minHeight: ITEM_CARD_MIN_HEIGHT }}
        className="flex flex-col justify-evenly items-center p-2"
      >
        <img src={basket} className="h-12" alt="Empty Chest" />
        <span className="text-xs text-center mt-2 w-80">
          Your basket is empty!
        </span>
      </div>
    );
  }

  const getItems = <T extends string | number | symbol, K>(
    items: Record<T, K>
  ) => {
    return getKeys(items).filter((item) => item in basketMap);
  };

  const seeds = getItems(CROP_SEEDS());
  const crops = getItems(CROPS());
  const tools = getItems(TOOLS);
  const exotic = getItems(BEANS());
  const shovels = getItems(SHOVELS);
  const resources = getItems(RESOURCES);
  const consumables = getItems(CONSUMABLES);
  const fertilisers = getItems(FERTILISERS);
  const coupons = getItems(COUPONS);

  const allTools = [...tools, ...shovels];

  return (
    <div className="flex flex-col">
      {!basketIsEmpty && (
        <OuterPanel className="flex-1 mb-3">
          {selectedItem && (
            <div
              style={{ minHeight: ITEM_CARD_MIN_HEIGHT }}
              className="flex flex-col justify-evenly text-center items-center p-2"
            >
              <span>{selectedItem}</span>
              <img
                src={ITEM_DETAILS[selectedItem].image}
                className="h-12 mt-2"
                alt={selectedItem}
              />
              <span className="text-xs mt-2 w-80">
                {ITEM_DETAILS[selectedItem].description}
              </span>
              {!!isSeed(selectedItem) && (
                <div className="w-full pt-1">
                  <div className="flex justify-center items-end">
                    <img src={timer} className="h-5 me-2" />
                    {isTimeBoosted && (
                      <img src={lightning} className="h-6 me-2" />
                    )}
                    <span className="text-xs mt-2 ">
                      {getCropHarvestTime(selectedItem)}
                    </span>
                  </div>
                </div>
              )}
              <div className="flex flex-col items-center justify-center">
                <a
                  href={`https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/${KNOWN_IDS[selectedItem]}`}
                  className="underline text-xxs hover:text-blue-500 p-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OpenSea
                </a>
              </div>
            </div>
          )}
        </OuterPanel>
      )}
      <div
        ref={divRef}
        style={{ maxHeight: TAB_CONTENT_HEIGHT }}
        className="overflow-y-auto scrollable overflow-x-hidden"
      >
        {!!seeds.length && (
          <div className="flex flex-col pl-2 mb-2" key={"Seeds"}>
            {<p className="mb-2">Seeds</p>}
            <div className="flex mb-2 flex-wrap -ml-1.5">
              {seeds.map((item) => (
                <Box
                  count={inventory[item]}
                  isSelected={selectedItem === item}
                  key={item}
                  onClick={() => handleItemClick(item)}
                  image={ITEM_DETAILS[item].image}
                  parentDivRef={divRef}
                />
              ))}
            </div>
          </div>
        )}
        {!!allTools.length && (
          <div className="flex flex-col pl-2 mb-2" key={"Tools"}>
            {<p className="mb-2">Tools</p>}
            <div className="flex mb-2 flex-wrap -ml-1.5">
              {allTools.map((item) => (
                <Box
                  count={inventory[item]}
                  isSelected={selectedItem === item}
                  key={item}
                  onClick={() => handleItemClick(item)}
                  image={ITEM_DETAILS[item].image}
                  parentDivRef={divRef}
                />
              ))}
            </div>
          </div>
        )}
        {!!resources.length && (
          <div className="flex flex-col pl-2 mb-2" key={"Resources"}>
            {<p className="mb-2">Resources</p>}
            <div className="flex mb-2 flex-wrap -ml-1.5">
              {resources.map((item) => (
                <Box
                  count={inventory[item]}
                  isSelected={selectedItem === item}
                  key={item}
                  onClick={() => handleItemClick(item)}
                  image={ITEM_DETAILS[item].image}
                  parentDivRef={divRef}
                />
              ))}
            </div>
          </div>
        )}
        {!!crops.length && (
          <div className="flex flex-col pl-2 mb-2" key={"Crops"}>
            {<p className="mb-2">Crops</p>}
            <div className="flex mb-2 flex-wrap -ml-1.5">
              {crops.map((item) => (
                <Box
                  count={inventory[item]}
                  isSelected={selectedItem === item}
                  key={item}
                  onClick={() => handleItemClick(item)}
                  image={ITEM_DETAILS[item].image}
                  parentDivRef={divRef}
                />
              ))}
            </div>
          </div>
        )}
        {!!exotic.length && (
          <div className="flex flex-col pl-2 mb-2" key={"Exotic"}>
            {<p className="mb-2">Exotic</p>}
            <div className="flex mb-2 flex-wrap -ml-1.5">
              {exotic.map((item) => (
                <Box
                  count={inventory[item]}
                  isSelected={selectedItem === item}
                  key={item}
                  onClick={() => handleItemClick(item)}
                  image={ITEM_DETAILS[item].image}
                  parentDivRef={divRef}
                />
              ))}
            </div>
          </div>
        )}
        {!!consumables.length && (
          <div className="flex flex-col pl-2 mb-2" key={"foods"}>
            {<p className="mb-2">Foods</p>}
            <div className="flex mb-2 flex-wrap -ml-1.5">
              {consumables.map((item) => (
                <Box
                  count={inventory[item]}
                  isSelected={selectedItem === item}
                  key={item}
                  onClick={() => handleItemClick(item)}
                  image={ITEM_DETAILS[item].image}
                  parentDivRef={divRef}
                />
              ))}
            </div>
          </div>
        )}
        {!!fertilisers.length && (
          <div className="flex flex-col pl-2 mb-2" key={"fertilisers"}>
            {<p className="mb-2">Fertilisers</p>}
            <div className="flex mb-2 flex-wrap -ml-1.5">
              {fertilisers.map((item) => (
                <Box
                  count={inventory[item]}
                  isSelected={selectedItem === item}
                  key={item}
                  onClick={() => handleItemClick(item)}
                  image={ITEM_DETAILS[item].image}
                  parentDivRef={divRef}
                />
              ))}
            </div>
          </div>
        )}
        {!!coupons.length && (
          <div className="flex flex-col pl-2 mb-2" key={"coupons"}>
            {<p className="mb-2">Coupons</p>}
            <div className="flex mb-2 flex-wrap -ml-1.5">
              {coupons.map((item) => (
                <Box
                  count={inventory[item]}
                  isSelected={selectedItem === item}
                  key={item}
                  onClick={() => handleItemClick(item)}
                  image={ITEM_DETAILS[item].image}
                  parentDivRef={divRef}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
