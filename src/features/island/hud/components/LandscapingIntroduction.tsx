import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";

import bush from "assets/icons/decoration.png";
import chest from "assets/icons/chest.png";
import { NPC_WEARABLES } from "lib/npcs";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

function acknowledge() {
  localStorage.setItem("landscaping.introduction", "complete");
}

function hasSeenIntro() {
  return !!localStorage.getItem("landscaping.introduction");
}

export const LandscapingIntroduction: React.FC = () => {
  const [showModal, setShowModal] = useState(!hasSeenIntro());
  const { t } = useAppTranslation();
  const onClose = () => {
    setShowModal(false);
    acknowledge();
  };

  return (
    <Modal centered show={showModal} onHide={onClose}>
      <CloseButtonPanel
        onClose={onClose}
        bumpkinParts={NPC_WEARABLES.grimtooth}
        title={t("landscape.intro.one")}
      >
        <div className="p-2">
          <div className="flex mb-1 items-center">
            <div className="relative mr-2">
              <img
                src={SUNNYSIDE.ui.round_button}
                style={{
                  width: `${PIXEL_SCALE * 18}px`,
                }}
              />
              <img
                src={SUNNYSIDE.icons.drag}
                className="absolute"
                style={{
                  top: `${PIXEL_SCALE * 3}px`,
                  left: `${PIXEL_SCALE * 3}px`,
                  width: `${PIXEL_SCALE * 12}px`,
                }}
              />
            </div>
            <p className="text-sm flex-1">
              {t("landscape.intro.two")}
            </p>
          </div>

          <div className="flex mb-1 items-center">
            <div className="relative mr-2">
              <img
                src={SUNNYSIDE.ui.round_button}
                style={{
                  width: `${PIXEL_SCALE * 18}px`,
                }}
              />
              <img
                src={bush}
                className="absolute"
                style={{
                  top: `${PIXEL_SCALE * 4}px`,
                  left: `${PIXEL_SCALE * 3}px`,
                  width: `${PIXEL_SCALE * 12}px`,
                }}
              />
            </div>
            <p className="text-sm flex-1">{t("landscape.intro.three")}</p>
          </div>
          <div className="flex mb-1 items-center">
            <div className="relative mr-2">
              <img
                src={SUNNYSIDE.ui.round_button}
                style={{
                  width: `${PIXEL_SCALE * 18}px`,
                }}
              />
              <img
                src={chest}
                className="absolute"
                style={{
                  top: `${PIXEL_SCALE * 4}px`,
                  left: `${PIXEL_SCALE * 4}px`,
                  width: `${PIXEL_SCALE * 10}px`,
                }}
              />
            </div>
            <p className="text-sm flex-1">{t("landscape.intro.four")}</p>
          </div>
        </div>
        <Button onClick={onClose}>{t("gotIt")}</Button>
      </CloseButtonPanel>
    </Modal>
  );
};
