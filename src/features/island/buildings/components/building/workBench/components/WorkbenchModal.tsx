import React, { SyntheticEvent, useState } from "react";

import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Tools } from "./Tools";
import { IslandBlacksmithItems } from "features/helios/components/blacksmith/component/IslandBlacksmithItems";
import { Buildings } from "features/island/hud/components/buildings/Buildings";
import { NPC_WEARABLES } from "lib/npcs";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onClose: (e?: SyntheticEvent) => void;
}

export const WorkbenchModal: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState(0);
  const { t } = useAppTranslation();

  return (
    <CloseButtonPanel
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES.blacksmith}
      tabs={[
        { icon: ITEM_DETAILS.Pickaxe.image, name: t("tools") },
        { icon: SUNNYSIDE.icons.hammer, name: t("craft") },
        { icon: SUNNYSIDE.icons.hammer, name: t("build") },
      ]}
      currentTab={tab}
      setCurrentTab={setTab}
    >
      {tab === 0 && <Tools onClose={onClose} />}
      {tab === 1 && <IslandBlacksmithItems />}
      {tab === 2 && <Buildings onClose={onClose} />}
    </CloseButtonPanel>
  );
};
