import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import { Box } from "components/ui/Box";
import { OuterPanel, Panel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { InventoryItemName } from "features/game/types/game";
import { KNOWN_IDS, CATEGORY_ID, CATEGORY } from "features/game/types";

import { SEEDS, CROPS } from "features/game/types/crops";
import { FOODS, TOOLS, LimitedItem } from "features/game/types/craftables";
import { RESOURCES } from "features/game/types/resources";

import arrowLeft from "assets/icons/arrow_left.png";
import arrowRight from "assets/icons/arrow_right.png";
import seed from "assets/crops/beetroot/seed.png";
import crop from "assets/crops/sunflower/crop.png";
import tool from "assets/tools/hammer.png";
import nft from "assets/nfts/gnome.png";
import food from "assets/crops/wheat/flour.png";
import resource from "assets/resources/wood.png";

import close from "assets/icons/close.png";

interface Props {
  onClose: () => void;
}

// type Tab = "Seeds" | "Crops" | "Tools" | "NFTs" | "Foods" | "Resources";

export const categories: CATEGORY[] = [
  {
    id: 1,
    name: "Seeds",
    img: seed,
  },
  {
    id: 2,
    name: "Crops",
    img: crop,
  },
  {
    id: 3,
    name: "Tools",
    img: tool,
  },
  {
    id: 4,
    name: "NFTs",
    img: nft,
  },
  {
    id: 5,
    name: "Foods",
    img: food,
  },
  {
    id: 6,
    name: "Resources",
    img: resource,
  },
];

export const InventoryItems: React.FC<Props> = ({ onClose }) => {
  const { gameService, selectedItem, shortcutItem } = useContext(Context);

  const [tab, setTab] = useState<CATEGORY_ID | number>(1);

  const [game] = useActor(gameService);
  const inventory = game.context.state.inventory;
  console.log({inventory})

  const items = Object.keys(inventory) as InventoryItemName[];
  const validItems = items.filter((itemName) => !!inventory[itemName]);
  let categoryWithItems = validItems.map((itemName) =>
    Number(String(KNOWN_IDS[itemName]).charAt(0))
  ) as CATEGORY_ID[] | number[];
  categoryWithItems = [...new Set<CATEGORY_ID | number>(categoryWithItems)];

  const len = categories.length;
  const nextCategory = () => {
    setTab(tab === len ? 1 : tab + 1);
  };

  const prevCategory = () => {
    setTab(tab === 1 ? len : tab - 1);
  };

  return (
    <Panel className="pt-5 relative">
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
        {categories.map((category, idx) => (
          <div
            key={category.name}
            className={`${idx + 1 === tab ? "" : "hidden"} flex items-center justify-center`}
            style={{minWidth: "10rem"}}
          >
            <div>
              <img src={category.img} className="h-5" />
            </div>
            <span className="text-sm text-shadow ml-2">{category.name}</span>
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
          {!categoryWithItems.includes(tab) && (
            <span className="text-white text-shadow">
              You have no {categories[tab - 1].name} in your inventory.
            </span>
          )}
          {validItems.map(
            (itemName) =>
              Number(String(KNOWN_IDS[itemName]).charAt(0)) === tab && (
                <Box
                  count={inventory[itemName]}
                  isSelected={selectedItem === itemName}
                  key={itemName}
                  onClick={() => shortcutItem(itemName)}
                  image={ITEM_DETAILS[itemName].image}
                />
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
