import React from "react";

import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  onClose: () => void;
  onDiscard: () => void;
}

/** Leaving landscaping with unsaved draft edits. */
export const DiscardChangesConfirmation: React.FC<Props> = ({
  onClose,
  onDiscard,
}) => {
  const { t } = useAppTranslation();
  return (
    <Modal show={true} onHide={onClose}>
      <CloseButtonPanel title={t("landscaping.discardTitle")} onClose={onClose}>
        <div className="flex flex-col items-center p-2 w-full text-center text-sm">
          <img
            src={SUNNYSIDE.icons.cancel}
            className="mb-4"
            style={{
              width: `${PIXEL_SCALE * 12}px`,
            }}
          />
          <span>{t("landscaping.discardDescription")}</span>
        </div>
        <div className="flex justify-center gap-1">
          <Button onClick={onClose} className="mt-2">
            {t("cancel")}
          </Button>
          <Button onClick={onDiscard} className="mt-2">
            {t("landscaping.discard")}
          </Button>
        </div>
      </CloseButtonPanel>
    </Modal>
  );
};
