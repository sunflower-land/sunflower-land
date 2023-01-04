import React, { useRef } from "react";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  InventoryItemName,
  FERTILISERS,
  COUPONS,
  Bumpkin,
  GameState,
} from "features/game/types/game";

import { CROP_SEEDS, CropName, CROPS } from "features/game/types/crops";

import timer from "assets/icons/timer.png";
import basket from "assets/icons/basket.png";

import { secondsToString } from "lib/utils/time";
import {
  getCropTime,
  getCropTime as getCropTimeLandExpansion,
} from "features/game/events/landExpansion/plant";
import { getKeys, SHOVELS, TOOLS } from "features/game/types/craftables";
import { getBasketItems } from "./utils/inventory";
import { RESOURCES } from "features/game/types/resources";
import { CONSUMABLES } from "features/game/types/consumables";
import { KNOWN_IDS } from "features/game/types";
import { BEANS } from "features/game/types/beans";
import { FRUIT, FRUIT_SEEDS } from "features/game/types/fruits";
import { SplitScreenView } from "features/game/components/SplitScreenView";
import { SquareIcon } from "components/ui/SquareIcon";

const isSeed = (selected: InventoryItemName) => selected in CROP_SEEDS();

interface Prop {
  gameState: GameState;
  selected: InventoryItemName;
  onSelect: (name: InventoryItemName) => void;
}

export const Basket: React.FC<Prop> = ({ gameState, selected, onSelect }) => {
  const divRef = useRef<HTMLDivElement>(null);

  const { inventory, bumpkin, collectibles } = gameState;
  const basketMap = getBasketItems(inventory);

  const getCropHarvestTime = (seedName = "") => {
    const crop = seedName.split(" ")[0] as CropName;

    if (bumpkin) {
      return secondsToString(
        getCropTimeLandExpansion(
          crop,
          inventory,
          collectibles,
          bumpkin as Bumpkin
        ),
        {
          length: "medium",
        }
      );
    }

    return secondsToString(
      getCropTime(
        crop,
        gameState.inventory,
        gameState.collectibles,
        gameState.bumpkin as Bumpkin
      ),
      {
        length: "medium",
      }
    );
  };

  const handleItemClick = (item: InventoryItemName) => {
    onSelect(item);
  };

  const basketIsEmpty = Object.values(basketMap).length === 0;

  if (basketIsEmpty) {
    return (
      <div className="flex flex-col justify-evenly items-center p-2">
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
  const fruitSeeds = getItems(FRUIT_SEEDS());
  const fruits = getItems(FRUIT());

  const allTools = [...tools, ...shovels];

  return (
    <SplitScreenView
      divRef={divRef}
      tallMobileContent={true}
      showHeader={!basketIsEmpty && !!selected}
      header={
        selected && (
          <div className="flex flex-col justify-center p-2 pb-0">
            <div className="flex space-x-2 justify-start mb-1 items-center sm:flex-col-reverse md:space-x-0">
              <div className="sm:mt-2">
                <SquareIcon icon={ITEM_DETAILS[selected].image} width={14} />
              </div>
              <span className="sm:text-center">{selected}</span>
            </div>
            <span className="text-xs sm:text-center">
              {ITEM_DETAILS[selected].description}
            </span>
            <div className="border-t border-white w-full my-2 pt-1 flex justify-between sm:flex-col sm:items-center">
              {!!isSeed(selected) && (
                <div className="flex justify-center space-x-1 items-center sm:justify-center">
                  <img src={timer} className="h-5 mr-1" />
                  <span className="text-xs">
                    {getCropHarvestTime(selected)}
                  </span>
                </div>
              )}
              <a
                href={`https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/${KNOWN_IDS[selected]}`}
                className="underline text-xxs hover:text-blue-500 p-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                OpenSea
              </a>
            </div>
          </div>
        )
      }
      content={
        <>
          {(!!seeds.length || !!fruitSeeds.length) && (
            <div className="flex flex-col pl-2 mb-2 w-full" key={"Seeds"}>
              {<p className="mb-2">Seeds</p>}
              <div className="flex mb-2 flex-wrap -ml-1.5">
                {seeds.map((item) => (
                  <Box
                    count={inventory[item]}
                    isSelected={selected === item}
                    key={item}
                    onClick={() => handleItemClick(item)}
                    image={ITEM_DETAILS[item].image}
                    parentDivRef={divRef}
                  />
                ))}
                {fruitSeeds.map((item) => (
                  <Box
                    count={inventory[item]}
                    isSelected={selected === item}
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
            <div className="flex flex-col pl-2 mb-2 w-full" key={"Tools"}>
              {<p className="mb-2">Tools</p>}
              <div className="flex mb-2 flex-wrap -ml-1.5">
                {allTools.map((item) => (
                  <Box
                    count={inventory[item]}
                    isSelected={selected === item}
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
            <div className="flex flex-col pl-2 mb-2 w-full" key={"Crops"}>
              {<p className="mb-2">Crops</p>}
              <div className="flex mb-2 flex-wrap -ml-1.5">
                {crops.map((item) => (
                  <Box
                    count={inventory[item]}
                    isSelected={selected === item}
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
            <div className="flex flex-col pl-2 mb-2 w-full" key={"Resources"}>
              {<p className="mb-2">Resources</p>}
              <div className="flex mb-2 flex-wrap -ml-1.5">
                {resources.map((item) => (
                  <Box
                    count={inventory[item]}
                    isSelected={selected === item}
                    key={item}
                    onClick={() => handleItemClick(item)}
                    image={ITEM_DETAILS[item].image}
                    parentDivRef={divRef}
                  />
                ))}
              </div>
            </div>
          )}
          {!!fruits.length && (
            <div className="flex flex-col pl-2 mb-2" key={"Fruits"}>
              {<p className="mb-2">Fruits</p>}
              <div className="flex mb-2 flex-wrap -ml-1.5">
                {fruits.map((item) => (
                  <Box
                    count={inventory[item]}
                    isSelected={selected === item}
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
            <div className="flex flex-col pl-2 mb-2 w-full" key={"Exotic"}>
              {<p className="mb-2">Exotic</p>}
              <div className="flex mb-2 flex-wrap -ml-1.5">
                {exotic.map((item) => (
                  <Box
                    count={inventory[item]}
                    isSelected={selected === item}
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
            <div className="flex flex-col pl-2 mb-2 w-full" key={"foods"}>
              {<p className="mb-2">Foods</p>}
              <div className="flex mb-2 flex-wrap -ml-1.5">
                {consumables.map((item) => (
                  <Box
                    count={inventory[item]}
                    isSelected={selected === item}
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
            <div className="flex flex-col pl-2 mb-2 w-full" key={"fertilisers"}>
              {<p className="mb-2">Fertilisers</p>}
              <div className="flex mb-2 flex-wrap -ml-1.5">
                {fertilisers.map((item) => (
                  <Box
                    count={inventory[item]}
                    isSelected={selected === item}
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
            <div className="flex flex-col pl-2 mb-2 w-full" key={"coupons"}>
              {<p className="mb-2">Coupons</p>}
              <div className="flex mb-2 flex-wrap -ml-1.5">
                {coupons.map((item) => (
                  <Box
                    count={inventory[item]}
                    isSelected={selected === item}
                    key={item}
                    onClick={() => handleItemClick(item)}
                    image={ITEM_DETAILS[item].image}
                    parentDivRef={divRef}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      }
    />
  );
};
