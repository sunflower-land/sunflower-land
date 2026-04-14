import React from "react";

import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import cleanBroom from "assets/icons/clean_broom.webp";
import { PlaceableLocation } from "features/game/types/collectibles";

interface Props {
  onClose: () => void;
  onRemove: () => void;
  location: PlaceableLocation;
}

export const RemoveAllConfirmation: React.FC<Props> = ({
  onClose,
  onRemove,
  location,
}) => {
  const { t } = useAppTranslation();
  return (
    <Modal show={true} onHide={onClose}>
      <CloseButtonPanel title={t("removeAll.title")} onClose={onClose}>
        <div className="flex flex-col items-center p-2 w-full text-center text-sm">
          <img
            src={cleanBroom}
            className="mb-4"
            style={{
              width: `${PIXEL_SCALE * 20}px`,
            }}
          />
          <span>{t("removeAll.description.one", { location })}</span>
          <span>{t("removeAll.description.two")}</span>
        </div>
        <div className="flex justify-center gap-1">
          <Button onClick={onClose} className="mt-2">
            {t("cancel")}
          </Button>
          <Button onClick={onRemove} className="mt-2">
            {t("remove")}
          </Button>
        </div>
      </CloseButtonPanel>
    </Modal>
  );
};
