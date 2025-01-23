import React, { useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "components/ui/Modal";
import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { InnerPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { GameState } from "features/game/types/game";

import greatFreezeIcon from "assets/icons/great-freeze.webp";
import { Label } from "components/ui/Label";
import { secondsToString } from "lib/utils/time";

const GreatFreezePlotComponent: React.FC<{ game: GameState }> = ({ game }) => {
  const [showModal, setShowModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { t } = useAppTranslation();
  const handleHover = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <>
      <div
        className="w-full h-full relative cursor-pointer hover:img-highlight"
        onMouseEnter={handleHover}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={SUNNYSIDE.soil.soil_dry}
          alt="soil image"
          className="absolute"
          style={{
            top: `${PIXEL_SCALE * 2}px`,
            width: `${PIXEL_SCALE * 16}px`,
          }}
          onClick={() => setShowModal(true)}
        />

        <img
          src={greatFreezeIcon}
          alt="great freeze"
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
              <span>{t("greatFreeze.crops.frozen")}</span>
            </div>
          </InnerPanel>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel onClose={() => setShowModal(false)}>
          <div className="p-2">
            <Label icon={greatFreezeIcon} type="danger" className="mb-1 -ml-1">
              {t("calendar.events.greatFreeze.title")}
            </Label>
            <p className="text-sm mb-3">
              {t("calendar.events.greatFreeze.description")}
            </p>
            <Label
              icon={SUNNYSIDE.icons.stopwatch}
              type="transparent"
              className="mt-2 ml-1"
            >
              {`${t("ready.in")}: ${secondsToString(
                24 * 60 * 60 -
                  (Date.now() - game.calendar.greatFreeze!.startedAt) / 1000,
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

export const GreatFreezePlot = React.memo(GreatFreezePlotComponent);
