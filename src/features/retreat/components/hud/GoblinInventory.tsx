import React, { useState } from "react";
import { GameState, InventoryItemName } from "features/game/types/game";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { InventoryItemsModal } from "features/island/hud/components/inventory/InventoryItemsModal";
import { getKeys } from "features/game/types/craftables";
import { KNOWN_IDS } from "features/game/types";
import {
  getBasketItems,
  getChestItems,
} from "features/island/hud/components/inventory/utils/inventory";
import { SUNNYSIDE } from "assets/sunnyside";
import { BudName } from "features/game/types/buds";

interface Props {
  state: GameState;
  onDepositClick: () => void;
}

export const GoblinInventory: React.FC<Props> = ({ state, onDepositClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { inventory } = state;

  const buds = getKeys(state.buds ?? {}).map(
    (budId) => `Bud-${budId}` as BudName
  );

  const [selectedBasketItem, setSelectedBasketItem] =
    useState<InventoryItemName>(
      getKeys(getBasketItems(inventory)).sort(
        (a, b) => KNOWN_IDS[a] - KNOWN_IDS[b]
      )[0]
    );
  const [selectedChestItem, setSelectedChestItem] = useState<
    InventoryItemName | BudName
  >(
    [
      ...buds,
      ...getKeys(getChestItems(state)).sort(
        (a, b) => KNOWN_IDS[a] - KNOWN_IDS[b]
      ),
    ][0]
  );

  return (
    <div
      className="flex flex-col items-center absolute z-50"
      style={{
        right: `${PIXEL_SCALE * 3}px`,
        top: `${PIXEL_SCALE * 33}px`,
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
          src={SUNNYSIDE.ui.round_button}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 22}px`,
          }}
        />
        <img
          src={SUNNYSIDE.icons.basket}
          className="absolute"
          style={{
            top: `${PIXEL_SCALE * 5}px`,
            left: `${PIXEL_SCALE * 5}px`,
            width: `${PIXEL_SCALE * 12}px`,
          }}
        />
      </div>

      <InventoryItemsModal
        show={isOpen}
        onHide={() => setIsOpen(false)}
        state={state}
        selectedBasketItem={selectedBasketItem}
        onSelectBasketItem={setSelectedBasketItem}
        selectedChestItem={selectedChestItem}
        onSelectChestItem={setSelectedChestItem}
        onDepositClick={onDepositClick}
        isFarming={false}
        isFullUser={true}
      />
    </div>
  );
};
