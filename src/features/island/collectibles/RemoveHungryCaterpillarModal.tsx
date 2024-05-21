import React from "react";

import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import hungryCaterpillar from "assets/sfts/hungry_caterpillar.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onClose: () => void;
  onRemove: () => void;
}

export const RemoveHungryCaterpillarModal: React.FC<Props> = ({
  onClose,
  onRemove,
}) => {
  const { t } = useAppTranslation();
  return (
    <Modal show={true} onHide={onClose}>
      <CloseButtonPanel
        title={t("removeHungryCaterpillar.title")}
        onClose={onClose}
      >
        <div className="flex flex-col items-center p-2 w-full text-center text-sm">
          <img
            src={hungryCaterpillar}
            className="mb-2"
            style={{
              width: `${PIXEL_SCALE * 30}px`,
            }}
          />
          <span>{t("removeHungryCaterpillar.description")}</span>
          <span>{t("removeHungryCaterpillar.confirmation")}</span>
        </div>

        <Button onClick={onRemove} className="mt-2">
          {t("removeHungryCaterpillar.removeFlowerSeeds")}
        </Button>
      </CloseButtonPanel>
    </Modal>
  );
};
