import React, { useState } from "react";
import { GameState, InventoryItemName } from "features/game/types/game";
import chest from "assets/icons/chest.png";
import Decimal from "decimal.js-light";
import { Basket } from "./Basket";
import { Chest } from "./Chest";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "react-bootstrap";
import { Buildings } from "features/island/buildings/Buildings";

interface Props {
  show: boolean;
  onHide: () => void;
  state: GameState;
  selectedBasketItem?: InventoryItemName;
  onSelectBasketItem: (name: InventoryItemName) => void;
  selectedChestItem: InventoryItemName;
  onSelectChestItem: (name: InventoryItemName) => void;
  onPlace?: (name: InventoryItemName) => void;
  onDepositClick?: () => void;
  isSaving?: boolean;
  isFarming: boolean;
}

export type TabItems = Record<string, { items: object }>;

export type Inventory = Partial<Record<InventoryItemName, Decimal>>;

export const InventoryItemsModal: React.FC<Props> = ({
  show,
  onHide,
  state,
  selectedBasketItem,
  onSelectBasketItem,
  selectedChestItem,
  onSelectChestItem,
  onDepositClick,
  onPlace,
  isSaving,
  isFarming,
}) => {
  const [currentTab, setCurrentTab] = useState<number>(0);

  return (
    <Modal size="lg" centered show={show} onHide={onHide}>
      <CloseButtonPanel
        tabs={[
          { icon: SUNNYSIDE.icons.basket, name: "Basket" },
          { icon: chest, name: "Chest" },
          ...(isFarming
            ? [{ icon: SUNNYSIDE.icons.hammer, name: "Buildings" }]
            : []),
        ]}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onClose={onHide}
      >
        {currentTab === 0 && (
          <Basket
            gameState={state}
            selected={selectedBasketItem}
            onSelect={onSelectBasketItem}
          />
        )}
        {currentTab === 1 && (
          <Chest
            state={state}
            selected={selectedChestItem}
            onSelect={onSelectChestItem}
            closeModal={onHide}
            onPlace={isFarming ? onPlace : undefined}
            onDepositClick={onDepositClick}
            isSaving={isSaving}
          />
        )}
        {currentTab === 2 && <Buildings onClose={onHide} />}
      </CloseButtonPanel>
    </Modal>
  );
};
