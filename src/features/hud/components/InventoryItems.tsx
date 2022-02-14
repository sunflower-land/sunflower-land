import { useActor } from "@xstate/react";
import { Box } from "components/ui/Box";
import { OuterPanel, Panel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { InventoryItemName } from "features/game/types/game";
import { KNOWN_IDS, CATEGORY_ID, CATEGORY } from "features/game/types";
import React, { useContext, useState, useRef } from "react";
import { Tab } from "components/ui/Tab";

import close from "assets/icons/close.png";

interface Props {
  onClose: () => void;
}

export const categories: CATEGORY[] = [
  {
    id: 1,
    name: "Seeds"
  },
  {
    id: 2,
    name: "Crops"
  },
  {
    id: 3,
    name: "Tools"
  },
  {
    id: 4,
    name: "NFTs"
  },
  {
    id: 5,
    name: "Foods"
  },
  {
    id: 6,
    name: "Resources"
  },
];

export const InventoryItems: React.FC<Props> = ({ onClose }) => {
  const { gameService, selectedItem, shortcutItem } = useContext(Context);
  const scrollDiv = useRef<any>(null);

  const [tab, setTab] = useState<CATEGORY_ID>(1);
  // states for drag to scroll
  const [isMouseDown, setIsMouseDown] = useState<Boolean>(false);
  const [startx, setStartx] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);

  const [game] = useActor(gameService);
  const inventory = game.context.state.inventory;

  const items = Object.keys(inventory) as InventoryItemName[];
  const validItems = items.filter((itemName) => !!inventory[itemName]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsMouseDown(true);
    setStartx(e.pageX - scrollDiv.current.offsetLeft) // initial click
    setScrollLeft(scrollDiv.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown) return;
    e.preventDefault();
    // calculate everytime we move the mouse
    const x = e.pageX - scrollDiv.current.offsetLeft;
    const dragDistance = x - startx;
    scrollDiv.current.scrollLeft = scrollLeft - dragDistance;
  }

  const handleOnScroll = (e: React.WheelEvent) => {
    e.preventDefault();
    scrollDiv.current.scrollLeft += e.deltaY;
  }

  return (
    <Panel className="pt-5 relative">
      <div 
        ref={scrollDiv}
        // horizontal drag to scroll
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setIsMouseDown(false)}
        onMouseUp={() => setIsMouseDown(false)}
        // using scroll wheel
        onWheel={handleOnScroll}
        className="cursor-drag overflow-hidden flex justify-between absolute top-1.5 left-0.5 right-0 items-center"
      >
        <div className="flex">
          {categories.map((category) => (
            <Tab isActive={tab === category.id} onClick={() => setTab(category.id)}>
              <span className="text-sm text-shadow">{category.name}</span>
            </Tab>
          ))}
        </div>
        <img
          src={close}
          className="h-6 cursor-pointer mr-2 mb-1"
          onClick={onClose}
        />
      </div>

      <div className="flex">
        <div className="w-3/5 flex flex-wrap h-fit">
          {validItems.length === 0 && (
            <span className="text-white text-shadow">
              You have no items in your inventory.
            </span>
          )}
          {validItems.map((itemName) => {
            if (Number(String(KNOWN_IDS[itemName]).charAt(0)) === tab) {
              return (
                <Box
                  count={inventory[itemName]}
                  isSelected={selectedItem === itemName}
                  key={itemName}
                  onClick={() => shortcutItem(itemName)}
                  image={ITEM_DETAILS[itemName].image}
                />
              )
            } 
            return null;
          })}
        </div>

        <OuterPanel className="flex-1">
          {selectedItem && (
            <div className="flex flex-col justify-center items-center p-2 ">
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
