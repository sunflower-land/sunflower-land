import React, { useState } from "react";
import { InventoryItemName } from "features/game/types/game";
import sunflower from "assets/decorations/potted_sunflower.png";
import Decimal from "decimal.js-light";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Modal } from "react-bootstrap";
import { Decorations } from "./Decorations";
import { NPC_WEARABLES } from "lib/npcs";
import { SUNNYSIDE } from "assets/sunnyside";
import { SeasonalDecorations } from "./SeasonalDecorations";

interface Props {
  show: boolean;
  onHide: () => void;
}

export type TabItems = Record<string, { items: object }>;

export type Inventory = Partial<Record<InventoryItemName, Decimal>>;

export const CraftDecorationsModal: React.FC<Props> = ({ show, onHide }) => {
  const [tab, setTab] = useState(0);
  return (
    <Modal size="lg" centered show={show} onHide={onHide}>
      <CloseButtonPanel
        tabs={[
          { icon: sunflower, name: "Decorations" },
          { icon: SUNNYSIDE.icons.timer, name: "Limited" },
        ]}
        setCurrentTab={setTab}
        currentTab={tab}
        onClose={onHide}
        bumpkinParts={NPC_WEARABLES.grimtooth}
      >
        {tab === 0 && <Decorations onClose={onHide} />}
        {tab === 1 && <SeasonalDecorations onClose={onHide} />}
      </CloseButtonPanel>
    </Modal>
  );
};
