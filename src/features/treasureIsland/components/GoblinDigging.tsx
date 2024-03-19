import React, { useContext, useState } from "react";

import shadow from "assets/npcs/shadow.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "components/ui/Modal";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import classNames from "classnames";
import { useActor } from "@xstate/react";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { CountdownLabel } from "components/ui/CountdownLabel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const GoblinDigging: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [showModal, setShowModal] = useState(false);

  const date = new Date();
  const secondsLeft =
    24 * 60 * 60 -
    (date.getUTCHours() * 60 * 60 +
      date.getUTCMinutes() * 60 +
      date.getUTCSeconds());

  const playing = gameState.matches("playing");

  return (
    <MapPlacement x={6} y={0} height={1} width={2}>
      <img
        src={SUNNYSIDE.soil.sand_dug}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          right: `${PIXEL_SCALE * 2}px`,
          bottom: `${PIXEL_SCALE * -4}px`,
        }}
      />
      <img
        src={shadow}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          left: `0px`,
          bottom: `0px`,
        }}
      />
      <div className="w-max h-full relative">
        <img
          src={SUNNYSIDE.npcs.goblin_treasure}
          className={classNames("relative cursor-pointer hover:img-highlight", {
            "pointer-events-none": !playing,
          })}
          style={{
            width: `${PIXEL_SCALE * 33}px`,
            left: `${PIXEL_SCALE * -7}px`,
            bottom: `${PIXEL_SCALE * 13}px`,
          }}
          onClick={() => setShowModal(true)}
        />
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel
          onClose={() => setShowModal(false)}
          bumpkinParts={{
            body: "Goblin Potion",
            hair: "Sun Spots",
            pants: "Lumberjack Overalls",
            tool: "Farmer Pitchfork",
            background: "Farm Background",
            shoes: "Black Farmer Boots",
          }}
        >
          <div className="p-2">
            <p className="mb-4 text-lg">{t("beachLuck.tryLuck")}</p>
            <p className="mb-3">{t("beachLuck.uncleFound")}</p>
            <p className="mb-3">{t("beachLuck.grabShovel")}</p>
            <div className="flex flex-wrap gap-y-1 justify-center mt-4 items-center">
              <p className="text-xxs mr-2">{t("beachLuck.refreshesIn")}</p>
              <CountdownLabel timeLeft={secondsLeft} />
            </div>
          </div>
        </CloseButtonPanel>
      </Modal>
    </MapPlacement>
  );
};
