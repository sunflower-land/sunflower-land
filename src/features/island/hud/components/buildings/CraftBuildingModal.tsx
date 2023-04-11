import React from "react";
import { GameState, InventoryItemName } from "features/game/types/game";
import Decimal from "decimal.js-light";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Modal } from "react-bootstrap";
import { Buildings } from "./Buildings";
import { ITEM_DETAILS } from "features/game/types/images";

interface Props {
  show: boolean;
  onHide: () => void;
  state: GameState;
}

export type TabItems = Record<string, { items: object }>;

export type Inventory = Partial<Record<InventoryItemName, Decimal>>;

export const CraftBuildingModal: React.FC<Props> = ({
  show,
  onHide,
  state,
}) => {
  return (
    <Modal size="lg" centered show={show} onHide={onHide}>
      <CloseButtonPanel
        tabs={[{ icon: ITEM_DETAILS["Water Well"].image, name: "Buildings" }]}
        onClose={onHide}
      >
        <Buildings />
      </CloseButtonPanel>
    </Modal>
  );
};
