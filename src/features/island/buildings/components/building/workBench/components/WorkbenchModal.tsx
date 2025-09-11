import React, { SyntheticEvent, useContext, useState } from "react";

import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Tools } from "./Tools";
import { IslandBlacksmithItems } from "features/helios/components/blacksmith/component/IslandBlacksmithItems";
import { Buildings } from "features/island/hud/components/buildings/Buildings";
import { NPC_WEARABLES } from "lib/npcs";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { OuterPanel } from "components/ui/Panel";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";

const needsHelp = (state: MachineState) => {
  const missingScarecrow =
    !state.context.state.inventory["Basic Scarecrow"] &&
    (state.context.state.bumpkin?.activity?.["Sunflower Planted"] ?? 0) >= 1;

  if (missingScarecrow) {
    return true;
  }

  return false;
};

interface Props {
  onClose: (e?: SyntheticEvent) => void;
}

export const WorkbenchModal: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const showCrafting = useSelector(gameService, needsHelp);
  const [tab, setTab] = useState<"Tools" | "Craft" | "Build" | "Upgrade">(
    showCrafting ? "Craft" : "Tools",
  );
  const { t } = useAppTranslation();

  return (
    <CloseButtonPanel
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES.blacksmith}
      tabs={[
        { icon: ITEM_DETAILS.Pickaxe.image, name: t("tools"), id: "Tools" },
        { icon: SUNNYSIDE.icons.hammer, name: t("craft"), id: "Craft" },
        { icon: SUNNYSIDE.icons.hammer, name: t("build"), id: "Build" },
      ]}
      currentTab={tab}
      setCurrentTab={setTab}
      container={OuterPanel}
    >
      {tab === "Tools" && <Tools />}
      {tab === "Craft" && <IslandBlacksmithItems />}
      {tab === "Build" && <Buildings onClose={onClose} />}
    </CloseButtonPanel>
  );
};
