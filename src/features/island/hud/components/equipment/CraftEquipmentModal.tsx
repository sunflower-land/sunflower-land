import React from "react";
import { GameState, InventoryItemName } from "features/game/types/game";
import lightning from "assets/icons/lightning.png";
import Decimal from "decimal.js-light";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Modal } from "react-bootstrap";
import { Equipment } from "./Equipment";

interface Props {
  show: boolean;
  onHide: () => void;
  state: GameState;
}

export type TabItems = Record<string, { items: object }>;

export type Inventory = Partial<Record<InventoryItemName, Decimal>>;

export const CraftEquipmentModal: React.FC<Props> = ({
  show,
  onHide,
  state,
}) => {
  return (
    <Modal size="lg" centered show={show} onHide={onHide}>
      <CloseButtonPanel
        tabs={[{ icon: lightning, name: "Equipment" }]}
        onClose={onHide}
      >
        <Equipment onClose={onHide} />
      </CloseButtonPanel>
    </Modal>
  );
};
