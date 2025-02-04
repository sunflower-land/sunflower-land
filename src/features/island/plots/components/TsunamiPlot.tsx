import React, { useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "components/ui/Modal";
import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { InnerPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { GameState } from "features/game/types/game";

import tsunamiIcon from "assets/icons/tsunami.webp";
import { Label } from "components/ui/Label";
import { secondsToString } from "lib/utils/time";
import { SOIL_IMAGES } from "../lib/plant";

const TsunamiPlotComponent: React.FC<{ game: GameState }> = ({ game }) => {
  const [showModal, setShowModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { t } = useAppTranslation();
  const handleHover = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const soilImage = SOIL_IMAGES[game.island.type].dry;

  return (
    <>
      <div
        className="w-full h-full relative cursor-pointer hover:img-highlight"
        onMouseEnter={handleHover}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={soilImage}
          alt="soil image"
          className="absolute"
          style={{
            top: `${PIXEL_SCALE * 2}px`,
            width: `${PIXEL_SCALE * 16}px`,
          }}
          onClick={() => setShowModal(true)}
        />

        <img
          src={tsunamiIcon}
          alt="tsunami"
          className="absolute top-0 right-0 pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 12}px`,
            top: `${PIXEL_SCALE * -4}px`,
          }}
        />
      </div>

      {/* Warning */}
      {showTooltip && (
        <div
          className="flex justify-center absolute w-full pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * -14}px`,
          }}
        >
          <InnerPanel className="absolute whitespace-nowrap w-fit z-50">
            <div className="text-xxs mx-1 p-1">
              <span>{t("tsunami.crops.destroyed")}</span>
            </div>
          </InnerPanel>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel onClose={() => setShowModal(false)}>
          <div className="p-2">
            <Label icon={tsunamiIcon} type="danger" className="mb-1 -ml-1">
              {t("tsunami")}
            </Label>
            <p className="text-sm mb-3">
              {t("tsunami.crops.destroyed.description")}
            </p>
            <Label
              icon={SUNNYSIDE.icons.stopwatch}
              type="transparent"
              className="mt-2 ml-1"
            >
              {`${t("ready.in")}: ${secondsToString(
                24 * 60 * 60 -
                  (Date.now() - game.calendar.tsunami!.startedAt) / 1000,
                {
                  length: "medium",
                },
              )}`}
            </Label>
            <p className="text-xs"></p>
          </div>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};

export const TsunamiPlot = React.memo(TsunamiPlotComponent);
