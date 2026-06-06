import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { OuterPanel } from "components/ui/Panel";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useContext, useState } from "react";
import { LandscapingDecorations } from "./LandscapingDecorations";
import { BuyBiomes } from "./BuyBiomes";
import { ITEM_DETAILS } from "features/game/types/images";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";

const _islandType = (state: MachineState) => state.context.state.island.type;

interface Props {
  show: boolean;
  onHide: () => void;
}

export const CraftDecorationsModal: React.FC<Props> = ({ show, onHide }) => {
  const { gameService } = useContext(Context);
  type Tab = "landscaping" | "biomes";
  const islandType = useSelector(gameService, _islandType);

  const [tab, setTab] = useState<Tab>("landscaping");

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <CloseButtonPanel
        currentTab={tab}
        setCurrentTab={setTab}
        tabs={[
          {
            id: "landscaping",
            icon: SUNNYSIDE.decorations.bush,
            name: "Landscaping",
          },
          ...(islandType !== "basic"
            ? [
                {
                  id: "biomes" as Tab,
                  icon: ITEM_DETAILS["Basic Biome"].image,
                  name: "Biomes",
                },
              ]
            : []),
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
