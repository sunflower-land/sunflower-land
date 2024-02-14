import React from "react";

import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import kuebiko from "assets/sfts/kuebiko.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onClose: () => void;
  onRemove: () => void;
}

export const RemoveKuebikoModal: React.FC<Props> = ({ onClose, onRemove }) => {
  const { t } = useAppTranslation();
  return (
    <Modal show={true} onHide={onClose} centered={true}>
      <CloseButtonPanel title={t("removeKuebiko.title")} onClose={onClose}>
        <div className="flex flex-col items-center p-2 w-full text-center text-sm">
          <img
            src={kuebiko}
            className="mb-2"
            style={{
              width: `${PIXEL_SCALE * 30}px`,
            }}
          />
          <span>{t("removeKuebiko.description")}</span>
        </div>

        <Button onClick={onRemove} className="mt-2">
          {t("removeKuebiko.removeSeeds")}
        </Button>
      </CloseButtonPanel>
    </Modal>
  );
};
