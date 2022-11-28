import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

import basket from "assets/icons/basket.png";
import roundButton from "assets/ui/button/round_button.png";

import { Label } from "components/ui/Label";
import { Box } from "components/ui/Box";

import { InventoryItems } from "./InventoryItems";

import { getShortcuts } from "../features/farming/hud/lib/shortcuts";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  Inventory as InventoryType,
  InventoryItemName,
} from "features/game/types/game";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  inventory: InventoryType;
  shortcutItem?: (item: InventoryItemName) => void;
  isFarming?: boolean;
}

export const Inventory: React.FC<Props> = ({
  inventory,
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
    <div
      className="flex flex-col items-start mr-2 sm:block fixed z-50"
      style={{
        top: `${PIXEL_SCALE * 24}px`,
        right: `${PIXEL_SCALE * 2}px`,
      }}
    >
      <div
        onClick={handleInventoryClick}
        className="relative flex flex-col z-50 cursor-pointer hover:img-highlight"
        style={{
          marginBottom: `${PIXEL_SCALE * 24}px`,
          right: `${PIXEL_SCALE * 0}px`,
          width: `${PIXEL_SCALE * 22}px`,
        }}
      >
        <img
          src={roundButton}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 22}px`,
          }}
        />
        <img
          src={basket}
          className="absolute"
          style={{
            top: `${PIXEL_SCALE * 5}px`,
            left: `${PIXEL_SCALE * 5}px`,
            width: `${PIXEL_SCALE * 12}px`,
          }}
        />
      </div>
      <div className="flex flex-col items-center sm:mt-8">
        <Label type="default" className="hidden sm:block absolute">
          Items
        </Label>
      </div>

      <Modal centered scrollable show={isOpen} onHide={() => setIsOpen(false)}>
        <InventoryItems
          inventory={inventory}
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
              count={inventory[item]}
              onClick={() => handleItemClick(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
