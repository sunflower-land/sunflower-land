import React, { type SyntheticEvent, useContext, useState } from "react";

import { ITEM_DETAILS } from "features/game/types/images";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Tools } from "./Tools";
import { ToolsGuide } from "./ToolsGuide";
import { NPC_WEARABLES } from "lib/npcs";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { OuterPanel } from "components/ui/Panel";
import { Modal } from "components/ui/Modal";
import { SUNNYSIDE } from "assets/sunnyside";
import book from "assets/icons/tier1_book.webp";
import { IslandBlacksmithItems } from "features/helios/components/blacksmith/component/IslandBlacksmithItems";
import { Buildings } from "features/island/hud/components/buildings/Buildings";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import type { MachineState } from "features/game/lib/gameMachine";
import { needsBasicScarecrow, needsWaterWell } from "../lib/onboarding";

interface Props {
  onClose: (e?: SyntheticEvent) => void;
  show: boolean;
}

type WorkbenchTab = "Tools" | "boosts" | "build" | "guide";

// Mirror the Workbench building helper: only point at the Build tab once the
// player has outgrown the no-well plot limit and crops have become infertile.
const _needsWell = (state: MachineState) => needsWaterWell(state.context.state);
const _needsScarecrow = (state: MachineState) =>
  needsBasicScarecrow(state.context.state);

export const WorkbenchModal: React.FC<Props> = ({ onClose, show }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const needsWell = useSelector(gameService, _needsWell);
  const needsScarecrow = useSelector(gameService, _needsScarecrow);

  // Point new players towards the relevant tab, matching the onboarding helper
  // shown on the Workbench building. WorkBench only renders this modal while it
  // is open, so this initializer runs (and re-evaluates the default) on each
  // open without an effect-driven state reset.
  const [tab, setTab] = useState<WorkbenchTab>(
    needsWell ? "build" : needsScarecrow ? "boosts" : "Tools",
  );

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <CloseButtonPanel
        onClose={onClose}
        bumpkinParts={NPC_WEARABLES.blacksmith}
        currentTab={tab}
        setCurrentTab={setTab}
        tabs={[
          { icon: ITEM_DETAILS.Pickaxe.image, name: t("tools"), id: "Tools" },
          { icon: SUNNYSIDE.icons.lightning, name: t("boosts"), id: "boosts" },
          { icon: SUNNYSIDE.icons.hammer, name: t("build"), id: "build" },
          { icon: book, name: t("guide"), id: "guide" },
        ]}
        container={OuterPanel}
      >
        {tab === "Tools" && <Tools />}
        {tab === "boosts" && <IslandBlacksmithItems onClose={onClose} />}
        {tab === "build" && <Buildings onClose={onClose} />}
        {tab === "guide" && <ToolsGuide />}
      </CloseButtonPanel>
    </Modal>
  );
};
