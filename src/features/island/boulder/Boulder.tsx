import React, { useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Boulder: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { t } = useAppTranslation();

  return (
    <>
      <div
        className="relative w-full h-full cursor-pointer hover:img-highlight"
        onClick={() => setShowModal(true)}
      >
        <img
          src={SUNNYSIDE.resource.boulder}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 26}px`,
            left: `${PIXEL_SCALE * 3}px`,
            top: `${PIXEL_SCALE * 1}px`,
          }}
        />
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Panel>
          <img
            src={SUNNYSIDE.icons.close}
            className="absolute cursor-pointer z-20"
            onClick={() => setShowModal(false)}
            style={{
              top: `${PIXEL_SCALE * 6}px`,
              right: `${PIXEL_SCALE * 6}px`,
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
          <div className="flex flex-col justify-center items-center">
            <p className="text-lg">{t("resources.boulder.rareMineFound")}</p>
            <img src={SUNNYSIDE.tools.iron_pickaxe} className="w-1/4 mt-2" />
            <p className="text-sm text-center mt-2">
              {t("resources.boulder.advancedMining")}
            </p>
            <p className="mt-2">
              {t("coming.soon")}
              {"..."}
            </p>
          </div>
        </Panel>
      </Modal>
    </>
  );
};
