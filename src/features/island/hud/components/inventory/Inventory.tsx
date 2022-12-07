import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

import basket from "assets/icons/basket.png";
import roundButton from "assets/ui/button/round_button.png";

import { Box } from "components/ui/Box";

import { InventoryItems } from "./InventoryItems";

import { ITEM_DETAILS } from "features/game/types/images";
import { GameState, InventoryItemName } from "features/game/types/game";
import { getShortcuts } from "features/farming/hud/lib/shortcuts";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleName } from "features/game/types/craftables";
import { GoblinState } from "features/game/lib/goblinMachine";

interface Props {
  state: GameState | GoblinState;
  shortcutItem: (item: InventoryItemName) => void;
  selectedItem: InventoryItemName;
  isFarming?: boolean;
  onPlace?: (selected: InventoryItemName) => void;
  showPlaceButton?: boolean;
}

export const Inventory: React.FC<Props> = ({
  state,
  shortcutItem,
  isFarming,
  onPlace,
  showPlaceButton,
  selectedItem,
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
      className="flex flex-col items-center fixed z-50"
      style={{
        right: `${PIXEL_SCALE * 3}px`,
        top: `${PIXEL_SCALE * 50.2}px`,
      }}
    >
      <div
        onClick={handleInventoryClick}
        className="relative flex z-50 cursor-pointer hover:img-highlight"
        style={{
          marginLeft: `${PIXEL_SCALE * 2}px`,
          marginBottom: `${PIXEL_SCALE * 24}px`,
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

      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <InventoryItems
          state={state}
          onPlace={onPlace}
          onClose={() => setIsOpen(false)}
          shortcutItem={shortcutItem}
          showPlaceButton={showPlaceButton}
          selectedItem={selectedItem}
        />
      </Modal>

      {isFarming && (
        <div className="flex flex-col-reverse items-center">
          {shortcuts.map((item, index) => (
            <Box
              key={index}
              isSelected={index === 0}
              image={ITEM_DETAILS[item]?.image}
              secondaryImage={ITEM_DETAILS[item]?.secondaryImage}
              count={state.inventory[item]?.sub(
                state.collectibles[item as CollectibleName]?.length ?? 0
              )}
              onClick={() => handleItemClick(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
