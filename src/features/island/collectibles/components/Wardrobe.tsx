import React, { useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import lockIcon from "assets/icons/lock.png";

export const Wardrobe: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const { t } = useAppTranslation();

  const open = () => {
    setShowModal(true);
  };

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel>
          <div className="p-2">
            <Label type="default" icon={lockIcon} className="mb-2">
              {t("coming.soon")}
            </Label>
            <p className="text-sm">{t("crafting.coming.soon")}</p>
          </div>
          <Button onClick={() => setShowModal(false)}>{t("close")}</Button>
        </CloseButtonPanel>
      </Modal>

      <img
        src={SUNNYSIDE.decorations.wardrobe}
        style={{
          width: `${PIXEL_SCALE * 13}px`,
          bottom: `${PIXEL_SCALE * 6}px`,
          left: `${PIXEL_SCALE * 1.5}px`,
        }}
        className="absolute cursor-pointer hover:img-highlight"
        alt="Wardrobe"
        onClick={open}
      />
    </>
  );
};
