import React, { SyntheticEvent, useState } from "react";

import { ITEM_DETAILS } from "features/game/types/images";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Tools } from "./Tools";
import { ToolsGuide } from "./ToolsGuide";
import { NPC_WEARABLES } from "lib/npcs";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { OuterPanel } from "components/ui/Panel";
import book from "assets/icons/tier1_book.webp";
import { Modal } from "components/ui/Modal";

interface Props {
  onClose: (e?: SyntheticEvent) => void;
  show: boolean;
}

export const WorkbenchModal: React.FC<Props> = ({ onClose, show }) => {
  const [tab, setTab] = useState<"Tools" | "Guide">("Tools");
  const { t } = useAppTranslation();

  return (
    <Modal
      show={show}
      onHide={onClose}
      dialogClassName={`${tab === "Guide" ? "sm:max-w-2xl" : ""}`}
    >
      <CloseButtonPanel
        onClose={onClose}
        bumpkinParts={NPC_WEARABLES.blacksmith}
        tabs={[
          { icon: ITEM_DETAILS.Pickaxe.image, name: t("tools"), id: "Tools" },
          { icon: book, name: t("guide"), id: "Guide" },
        ]}
        currentTab={tab}
        setCurrentTab={setTab}
        container={OuterPanel}
      >
        {tab === "Tools" && <Tools />}
        {tab === "Guide" && <ToolsGuide />}
      </CloseButtonPanel>
    </Modal>
  );
};
