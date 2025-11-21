import React, { useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { InnerPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { GameState } from "features/game/types/game";

import greatFreezeIcon from "assets/icons/great-freeze.webp";
import { SOIL_IMAGES } from "../lib/plant";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { WeatherAffectedModal } from "./AffectedModal";

export const GreatFreezePlot: React.FC<{ game: GameState }> = ({ game }) => {
  const [showModal, setShowModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { t } = useAppTranslation();
  const handleHover = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };
  const currentBiome = getCurrentBiome(game.island);
  const soilImage = SOIL_IMAGES[currentBiome].dry;

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

      <WeatherAffectedModal
        showModal={showModal}
        setShowModal={setShowModal}
        icon={greatFreezeIcon}
        title={t("calendar.events.greatFreeze.title")}
        description={t("calendar.events.greatFreeze.description")}
        startedAt={game.calendar.greatFreeze!.startedAt}
      />
    </>
  );
};
