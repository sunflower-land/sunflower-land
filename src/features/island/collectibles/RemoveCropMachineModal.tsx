import React from "react";

import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ITEM_DETAILS } from "features/game/types/images";

interface Props {
  onClose: () => void;
  onRemove: () => void;
}

export const RemoveCropMachineModal: React.FC<Props> = ({
  onClose,
  onRemove,
}) => {
  const { t } = useAppTranslation();
  return (
    <Modal show={true} onHide={onClose}>
      <CloseButtonPanel title={t("removeCropMachine.title")} onClose={onClose}>
        <div className="flex flex-col items-center p-2 w-full text-center text-sm">
          <img
            src={ITEM_DETAILS["Crop Machine"].image}
            className="mb-2 -mt-2.5"
            style={{
              width: `${PIXEL_SCALE * 30}px`,
            }}
          />
          <span>{t("removeCropMachine.description")}</span>
        </div>

        <Button onClick={onRemove} className="mt-2">
          {t("remove")}
        </Button>
      </CloseButtonPanel>
    </Modal>
  );
};
