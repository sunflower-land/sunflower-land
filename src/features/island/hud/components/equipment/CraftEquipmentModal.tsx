import React from "react";
import { InventoryItemName } from "features/game/types/game";
import lightning from "assets/icons/lightning.png";
import Decimal from "decimal.js-light";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Modal } from "react-bootstrap";
import { Equipment } from "./Equipment";
import { NPC_WEARABLES } from "lib/npcs";

interface Props {
  show: boolean;
  onHide: () => void;
}

export type TabItems = Record<string, { items: object }>;

export type Inventory = Partial<Record<InventoryItemName, Decimal>>;

export const CraftEquipmentModal: React.FC<Props> = ({ show, onHide }) => {
  return (
    <Modal size="lg" centered show={show} onHide={onHide}>
      <CloseButtonPanel
        tabs={[{ icon: lightning, name: "Equipment" }]}
        onClose={onHide}
        bumpkinParts={NPC_WEARABLES.grimtooth}
      >
        <Equipment onClose={onHide} />
      </CloseButtonPanel>
    </Modal>
  );
};
