import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { OuterPanel } from "components/ui/Panel";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useContext, useState } from "react";
import { LandscapingDecorations } from "./LandscapingDecorations";
import { BuyBiomes } from "./BuyBiomes";
import { ITEM_DETAILS } from "features/game/types/images";
import { IslandBlacksmithItems } from "features/helios/components/blacksmith/component/IslandBlacksmithItems";
import { Buildings } from "../buildings/Buildings";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";

const needsHelp = (state: MachineState) => {
  const missingScarecrow =
    !state.context.state.inventory["Basic Scarecrow"] &&
    (state.context.state.farmActivity?.["Sunflower Planted"] ?? 0) >= 6;

  if (missingScarecrow) {
    return true;
  }

  return false;
};

interface Props {
  show: boolean;
  onHide: () => void;
}

export const CraftDecorationsModal: React.FC<Props> = ({ show, onHide }) => {
  const { gameService } = useContext(Context);
  type Tab = "landscaping" | "biomes" | "craft" | "build";
  const showCrafting = useSelector(gameService, needsHelp);

  const [tab, setTab] = useState<Tab>(showCrafting ? "craft" : "landscaping");

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
            id: "craft",
            icon: SUNNYSIDE.icons.hammer,
            name: "Craft",
          },
          {
            id: "build",
            icon: SUNNYSIDE.icons.hammer,
            name: "Build",
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
        {tab === "craft" && <IslandBlacksmithItems />}
        {tab === "build" && <Buildings onClose={onHide} />}
        {tab === "biomes" && <BuyBiomes onClose={onHide} />}
      </CloseButtonPanel>
    </Modal>
  );
};
