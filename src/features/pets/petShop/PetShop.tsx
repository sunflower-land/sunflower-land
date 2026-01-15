import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useState } from "react";
import { PetShopModal } from "./PetShopModal";
import { OuterPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { PetGuide } from "../petGuide/PetGuide";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onClose: () => void;
}

type Tab = "petShop" | "petGuide";

export const PetShop: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState<Tab>("petShop");
  const { t } = useAppTranslation();
  return (
    <CloseButtonPanel
      tabs={[
        {
          id: "petShop",
          icon: ITEM_DETAILS.Barkley.image,
          name: t("petShop.title"),
        },
        {
          id: "petGuide",
          icon: SUNNYSIDE.icons.expression_confused,
          name: t("petGuide.title"),
        },
      ]}
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES.chase}
      container={OuterPanel}
      currentTab={tab}
      setCurrentTab={setTab}
    >
      {tab === "petShop" && <PetShopModal />}
      {tab === "petGuide" && <PetGuide />}
    </CloseButtonPanel>
  );
};
