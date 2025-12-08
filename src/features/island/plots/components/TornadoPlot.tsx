import React, { useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { InnerPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { GameState } from "features/game/types/game";

import tornadoIcon from "assets/icons/tornado.webp";
import { SOIL_IMAGES } from "../lib/plant";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { WeatherAffectedModal } from "./AffectedModal";

export const TornadoPlot: React.FC<{ game: GameState }> = ({ game }) => {
  const [showModal, setShowModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { t } = useAppTranslation();
  const handleHover = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const soilImage = SOIL_IMAGES[getCurrentBiome(game.island)].dry;

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
          src={tornadoIcon}
          alt="tornado"
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
              <span>{t("tornado.crops.destroyed")}</span>
            </div>
          </InnerPanel>
        </div>
      )}

      <WeatherAffectedModal
        showModal={showModal}
        setShowModal={setShowModal}
        icon={tornadoIcon}
        title={t("tornado")}
        description={t("tornado.crops.destroyed.description")}
        startedAt={game.calendar.tornado!.startedAt}
      />
    </>
  );
};
