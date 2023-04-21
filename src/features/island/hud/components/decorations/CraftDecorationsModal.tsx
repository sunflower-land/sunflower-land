import React from "react";
import { GameState, InventoryItemName } from "features/game/types/game";
import sunflower from "assets/decorations/potted_sunflower.png";
import Decimal from "decimal.js-light";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Modal } from "react-bootstrap";
import { Decorations } from "./Decorations";
import { NPC_WEARABLES } from "lib/npcs";

interface Props {
  show: boolean;
  onHide: () => void;
  state: GameState;
}

export type TabItems = Record<string, { items: object }>;

export type Inventory = Partial<Record<InventoryItemName, Decimal>>;

export const CraftDecorationsModal: React.FC<Props> = ({
  show,
  onHide,
  state,
}) => {
  return (
    <Modal size="lg" centered show={show} onHide={onHide}>
      <CloseButtonPanel
        tabs={[{ icon: sunflower, name: "Decorations" }]}
        onClose={onHide}
        bumpkinParts={NPC_WEARABLES.grimtooth}
      >
        <Decorations onClose={onHide} />
      </CloseButtonPanel>
    </Modal>
  );
};
