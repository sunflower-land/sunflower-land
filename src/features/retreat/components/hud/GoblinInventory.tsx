import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

import basket from "assets/icons/basket.png";
import roundButton from "assets/ui/button/round_button.png";

import { GameState, InventoryItemName } from "features/game/types/game";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { InventoryItems } from "features/island/hud/components/inventory/InventoryItems";

interface Props {
  state: GameState;
}

export const GoblinInventory: React.FC<Props> = ({ state }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<InventoryItemName>("Sunflower"); // TODO grab first item
  return (
    <div
      className="flex flex-col items-center fixed z-50"
      style={{
        right: `${PIXEL_SCALE * 3}px`,
        top: `${PIXEL_SCALE * 25}px`,
      }}
    >
      <div
        onClick={() => setIsOpen(true)}
        className="relative flex z-50 cursor-pointer hover:img-highlight"
        style={{
          marginLeft: `${PIXEL_SCALE * 2}px`,
          marginBottom: `${PIXEL_SCALE * 25}px`,
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
          onClose={() => setIsOpen(false)}
          onSelect={setSelected}
          selected={selected}
        />
      </Modal>
    </div>
  );
};
