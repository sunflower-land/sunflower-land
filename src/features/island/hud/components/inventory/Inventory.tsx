import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

import basket from "assets/icons/basket.png";
import button from "assets/ui/button/round_button.png";

import { Label } from "components/ui/Label";
import { Box } from "components/ui/Box";

import { InventoryItems } from "./InventoryItems";

import { ITEM_DETAILS } from "features/game/types/images";
import { GameState, InventoryItemName } from "features/game/types/game";
import { getShortcuts } from "features/farming/hud/lib/shortcuts";

interface Props {
  state: GameState;
  shortcutItem?: (item: InventoryItemName) => void;
  isFarming?: boolean;
}

export const Inventory: React.FC<Props> = ({
  state,
  shortcutItem,
  isFarming,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = getShortcuts();

  const handleInventoryClick = () => {
    setIsOpen(true);
  };

  const handleItemClick = (item: InventoryItemName) => {
    if (!shortcutItem) return;

    shortcutItem(item);
  };

  return (
    <div className="flex flex-col items-end mr-2 sm:block fixed top-16 right-0 z-50">
      <div
        className="w-16 h-16 sm:mx-8 mt-2 relative flex justify-center items-center shadow rounded-full cursor-pointer"
        onClick={handleInventoryClick}
      >
        <img
          src={button}
          className="absolute w-full h-full -z-10"
          alt="inventoryButton"
        />
        <img src={basket} className="w-8 mb-1" alt="inventory" />
        <Label className="hidden sm:block absolute -bottom-7">Items</Label>
      </div>

      <Modal centered scrollable show={isOpen} onHide={() => setIsOpen(false)}>
        <InventoryItems
          state={state}
          onClose={() => setIsOpen(false)}
          shortcutItem={shortcutItem}
          isFarming={isFarming}
        />
      </Modal>

      {isFarming && (
        <div className="flex flex-col items-center sm:mt-8">
          {shortcuts.map((item, index) => (
            <Box
              key={index}
              isSelected={index === 0}
              image={ITEM_DETAILS[item]?.image}
              secondaryImage={ITEM_DETAILS[item]?.secondaryImage}
              count={state.inventory[item]}
              onClick={() => handleItemClick(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
