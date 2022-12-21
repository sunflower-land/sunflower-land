import React, { useState } from "react";
import { GameState, InventoryItemName } from "features/game/types/game";

import basket from "assets/icons/basket.png";
import chest from "assets/icons/chest.png";

import Decimal from "decimal.js-light";
import { Basket } from "./Basket";
import { Chest } from "./Chest";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

interface Props {
  state: GameState;
  onClose: () => void;
  selected: InventoryItemName;
  onSelect: (name: InventoryItemName) => void;
  onPlace?: (name: InventoryItemName) => void;
}

export type TabItems = Record<string, { items: object }>;

export type Inventory = Partial<Record<InventoryItemName, Decimal>>;

export const InventoryItems: React.FC<Props> = ({
  state,
  onClose,
  selected,
  onSelect,
  onPlace,
}) => {
  const [currentTab, setCurrentTab] = useState<number>(0);

  return (
    <CloseButtonPanel
      tabs={[
        { icon: basket, name: "Basket" },
        { icon: chest, name: "Chest" },
      ]}
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      onClose={onClose}
    >
      {currentTab === 0 && (
        <Basket gameState={state} onSelect={onSelect} selected={selected} />
      )}
      {currentTab === 1 && (
        <Chest state={state} closeModal={onClose} onPlace={onPlace} />
      )}
    </CloseButtonPanel>
  );
};
