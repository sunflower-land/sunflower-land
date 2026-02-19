import React, { SyntheticEvent, useState } from "react";

import { ITEM_DETAILS } from "features/game/types/images";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Tools } from "./Tools";
import { NPC_WEARABLES } from "lib/npcs";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { OuterPanel } from "components/ui/Panel";

interface Props {
  onClose: (e?: SyntheticEvent) => void;
}

export const WorkbenchModal: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState<"Tools" | "Guide">("Tools");
  const { t } = useAppTranslation();

  return (
    <CloseButtonPanel
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES.blacksmith}
      tabs={[
        { icon: ITEM_DETAILS.Pickaxe.image, name: t("tools"), id: "Tools" },
      ]}
      currentTab={tab}
      setCurrentTab={setTab}
      container={OuterPanel}
    >
      {tab === "Tools" && <Tools />}
    </CloseButtonPanel>
  );
};
