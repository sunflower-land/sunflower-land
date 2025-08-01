import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { OuterPanel } from "components/ui/Panel";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useState } from "react";
import { LandscapingDecorations } from "./LandscapingDecorations";
import { BuyBiomes } from "./BuyBiomes";
import { ITEM_DETAILS } from "features/game/types/images";
import { hasFeatureAccess } from "lib/flags";
import { useGame } from "features/game/GameProvider";

interface Props {
  show: boolean;
  onHide: () => void;
}

export const CraftDecorationsModal: React.FC<Props> = ({ show, onHide }) => {
  const [tab, setTab] = useState<number>(0);

  const { gameState } = useGame();

  return (
    <Modal show={show} onHide={onHide}>
      <CloseButtonPanel
        currentTab={tab}
        setCurrentTab={setTab}
        tabs={[
          { icon: SUNNYSIDE.decorations.bush, name: "Landscaping" },
          // Only show this option if flag enabled
          ...(hasFeatureAccess(gameState.context.state, "LANDSCAPING")
            ? [{ icon: ITEM_DETAILS["Basic Biome"].image, name: "Biomes" }]
            : []),
        ]}
        onClose={onHide}
        bumpkinParts={NPC_WEARABLES.grimtooth}
        container={OuterPanel}
      >
        {tab === 0 && <LandscapingDecorations onClose={onHide} />}
        {tab === 1 && <BuyBiomes onClose={onHide} />}
      </CloseButtonPanel>
    </Modal>
  );
};
