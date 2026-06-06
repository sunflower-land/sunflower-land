import React, { type SyntheticEvent, useState } from "react";

import { ITEM_DETAILS } from "features/game/types/images";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Tools } from "./Tools";
import { ToolsGuide } from "./ToolsGuide";
import { NPC_WEARABLES } from "lib/npcs";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { OuterPanel } from "components/ui/Panel";
import { Modal } from "components/ui/Modal";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { IslandBlacksmithItems } from "features/helios/components/blacksmith/component/IslandBlacksmithItems";
import { Buildings } from "features/island/hud/components/buildings/Buildings";

interface Props {
  onClose: (e?: SyntheticEvent) => void;
  show: boolean;
}

type WorkbenchTab = "Tools" | "boosts" | "build" | "guide";

export const WorkbenchModal: React.FC<Props> = ({ onClose, show }) => {
  const [tab, setTab] = useState<WorkbenchTab>("Tools");
  const { t } = useAppTranslation();

  return (
    <Modal show={show} onHide={onClose} size="lg">
      {tab !== "guide" && (
        <div className="flex flex-row gap-2 items-center justify-end">
          <WorkbenchGuideButton onShow={() => setTab("guide")} />
        </div>
      )}
      <CloseButtonPanel
        onClose={onClose}
        bumpkinParts={NPC_WEARABLES.blacksmith}
        currentTab={tab}
        setCurrentTab={setTab}
        tabs={[
          { icon: ITEM_DETAILS.Pickaxe.image, name: t("tools"), id: "Tools" },
          { icon: SUNNYSIDE.icons.lightning, name: t("boosts"), id: "boosts" },
          { icon: SUNNYSIDE.icons.hammer, name: t("build"), id: "build" },
        ]}
        container={OuterPanel}
      >
        {tab === "Tools" && <Tools />}
        {tab === "boosts" && <IslandBlacksmithItems />}
        {tab === "build" && <Buildings onClose={onClose} />}
        {tab === "guide" && <ToolsGuide />}
      </CloseButtonPanel>
    </Modal>
  );
};

const WorkbenchGuideButton: React.FC<{ onShow: () => void }> = ({ onShow }) => {
  const { t } = useAppTranslation();
  return (
    <div>
      <Button onClick={onShow}>
        <div className="flex justify-between items-center text-xs -m-1 space-x-1">
          <img src={SUNNYSIDE.icons.expression_confused} className="w-3" />
          <p>{t("guide")}</p>
        </div>
      </Button>
    </div>
  );
};
