import React, { useState } from "react";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { SUNNYSIDE } from "assets/sunnyside";
import { FlowerBedGuide } from "./FlowerBedGuide";
import { FlowerBedContent } from "./FlowerBedContent";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  id: string;
  onClose: () => void;
}

export const FlowerBedModal: React.FC<Props> = ({ onClose, id }) => {
  const { t } = useAppTranslation();
  type Tab = "plant" | "guide";
  const [tab, setTab] = useState<Tab>("plant");

  return (
    <CloseButtonPanel
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES["poppy"]}
      tabs={[
        { id: "plant", icon: SUNNYSIDE.icons.seedling, name: t("plant") },
        {
          id: "guide",
          icon: SUNNYSIDE.icons.expression_confused,
          name: t("guide"),
        },
      ]}
      currentTab={tab}
      setCurrentTab={setTab}
    >
      {tab === "plant" && <FlowerBedContent id={id} onClose={onClose} />}

      {tab === "guide" && <FlowerBedGuide onClose={() => setTab("plant")} />}
    </CloseButtonPanel>
  );
};
