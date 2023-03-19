import React, { useState } from "react";
import { GameState, InventoryItemName } from "features/game/types/game";
import chest from "assets/icons/chest.png";
import sunflower from "assets/decorations/potted_sunflower.png";
import Decimal from "decimal.js-light";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "react-bootstrap";
import { Equipment } from "./Equipment";
import { Decorations } from "./Decorations";

interface Props {
  show: boolean;
  onHide: () => void;
  state: GameState;
}

export type TabItems = Record<string, { items: object }>;

export type Inventory = Partial<Record<InventoryItemName, Decimal>>;

export const CraftItemsModal: React.FC<Props> = ({ show, onHide, state }) => {
  const [currentTab, setCurrentTab] = useState<number>(1);

  return (
    <Modal size="lg" centered show={show} onHide={onHide}>
      <CloseButtonPanel
        tabs={[
          { icon: SUNNYSIDE.icons.hammer, name: "Craft" },
          { icon: sunflower, name: "Decorations" },
        ]}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onClose={onHide}
      >
        {currentTab === 0 && <Equipment onClose={onHide} />}
        {currentTab === 1 && <Decorations onClose={onHide} />}
      </CloseButtonPanel>
    </Modal>
  );
};
