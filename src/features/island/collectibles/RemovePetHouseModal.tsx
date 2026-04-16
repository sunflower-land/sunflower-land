import React from "react";

import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onClose: () => void;
}

export const RemovePetHouseModal: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();
  return (
    <Modal show={true} onHide={onClose}>
      <CloseButtonPanel title={t("removePetHouse.title")} onClose={onClose}>
        <div className="flex flex-col items-center p-2 w-full text-center text-sm">
          <img
            src={SUNNYSIDE.building.petHouse1}
            className="mb-2"
            style={{
              width: `${PIXEL_SCALE * 30}px`,
            }}
          />
          <span>{t("removePetHouse.description")}</span>
        </div>

        <Button onClick={onClose} className="mt-2">
          {t("close")}
        </Button>
      </CloseButtonPanel>
    </Modal>
  );
};
