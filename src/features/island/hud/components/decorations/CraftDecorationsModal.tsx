import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { OuterPanel } from "components/ui/Panel";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useState } from "react";
import { LandscapingDecorations } from "./LandscapingDecorations";
import { BuyBiomes } from "./BuyBiomes";
import { ITEM_DETAILS } from "features/game/types/images";

interface Props {
  show: boolean;
  onHide: () => void;
}

export const CraftDecorationsModal: React.FC<Props> = ({ show, onHide }) => {
  type Tab = "landscaping" | "biomes";
  const [tab, setTab] = useState<Tab>("landscaping");

  return (
    <Modal show={show} onHide={onHide}>
      <CloseButtonPanel
        currentTab={tab}
        setCurrentTab={setTab}
        tabs={[
          {
            id: "landscaping",
            icon: SUNNYSIDE.decorations.bush,
            name: "Landscaping",
          },
          {
            id: "biomes",
            icon: ITEM_DETAILS["Basic Biome"].image,
            name: "Biomes",
          },
        ]}
        onClose={onHide}
        bumpkinParts={NPC_WEARABLES.grimtooth}
        container={OuterPanel}
      >
        {tab === "landscaping" && <LandscapingDecorations onClose={onHide} />}
        {tab === "biomes" && <BuyBiomes onClose={onHide} />}
      </CloseButtonPanel>
    </Modal>
  );
};
