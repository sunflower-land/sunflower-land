import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

import basket from "assets/icons/basket.png";
import roundButton from "assets/ui/button/round_button.png";

import { GameState, InventoryItemName } from "features/game/types/game";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { InventoryItems } from "features/island/hud/components/inventory/InventoryItems";
import { CollectibleName, getKeys } from "features/game/types/craftables";
import Decimal from "decimal.js-light";
import { setPrecision } from "lib/utils/formatNumber";
import { KNOWN_IDS } from "features/game/types";
import { getBasketItems } from "features/island/hud/components/inventory/utils/inventory";

interface Props {
  state: GameState;
}

export const GoblinInventory: React.FC<Props> = ({ state }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { inventory, collectibles: placedItems } = state;

  const getItemCount = (item: InventoryItemName) => {
    const count =
      inventory[item]?.sub(placedItems[item as CollectibleName]?.length ?? 0) ??
      new Decimal(0);

    return setPrecision(count);
  };

  const [selected, setSelected] = useState<InventoryItemName>(
    getKeys(getBasketItems(inventory)).sort(
      (a, b) => KNOWN_IDS[a] - KNOWN_IDS[b]
    )[0]
  );
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
