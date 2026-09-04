import React from "react";

import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  /** Save commits the draft; discard throws it away. */
  mode: "save" | "discard";
  onClose: () => void;
  onConfirm: () => void;
}

/** Confirm leaving landscaping with draft edits, either way. */
export const LandscapingConfirmation: React.FC<Props> = ({
  mode,
  onClose,
  onConfirm,
}) => {
  const { t } = useAppTranslation();
  const isSave = mode === "save";

  return (
    <Modal show={true} onHide={onClose}>
      <CloseButtonPanel
        title={t(isSave ? "landscaping.saveTitle" : "landscaping.discardTitle")}
        onClose={onClose}
      >
        <div className="flex flex-col items-center p-2 w-full text-center text-sm">
          <img
            src={isSave ? SUNNYSIDE.icons.confirm : SUNNYSIDE.icons.cancel}
            className="mb-4"
            style={{
              width: `${PIXEL_SCALE * 12}px`,
            }}
          />
          <span>
            {t(
              isSave
                ? "landscaping.saveDescription"
                : "landscaping.discardDescription",
            )}
          </span>
        </div>
        <div className="flex justify-center gap-1">
          <Button onClick={onClose} className="mt-2">
            {t("cancel")}
          </Button>
          <Button onClick={onConfirm} className="mt-2">
            {t(isSave ? "save" : "landscaping.discard")}
          </Button>
        </div>
      </CloseButtonPanel>
    </Modal>
  );
};
