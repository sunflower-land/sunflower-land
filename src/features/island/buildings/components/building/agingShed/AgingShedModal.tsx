import React, { useState } from "react";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = "agingRack" | "fermentationRack" | "spiceRack";

export const AgingShedModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useAppTranslation();
  const [currentTab, setCurrentTab] = useState<Tab>("agingRack");

  return (
    <Modal show={isOpen} onHide={onClose}>
      <CloseButtonPanel
        onClose={onClose}
        tabs={[
          {
            id: "agingRack",
            name: t("agingShed.agingRack"),
            icon: SUNNYSIDE.icons.expression_confused,
          },
          {
            id: "fermentationRack",
            name: t("agingShed.fermentationRack"),
            icon: SUNNYSIDE.icons.expression_confused,
          },
          {
            id: "spiceRack",
            name: t("agingShed.spiceRack"),
            icon: SUNNYSIDE.icons.expression_confused,
          },
        ]}
        currentTab={currentTab}
        setCurrentTab={(tab) => setCurrentTab(tab as Tab)}
      >
        <div className="p-2">
          <p className="text-sm">{t("coming.soon")}</p>
        </div>
      </CloseButtonPanel>
    </Modal>
  );
};
