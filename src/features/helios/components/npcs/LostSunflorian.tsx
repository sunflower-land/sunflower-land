import React, { useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { SUNNYSIDE } from "assets/sunnyside";
import shadow from "assets/npcs/shadow.png";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const LostSunflorian: React.FC = () => {
  const { t } = useAppTranslation();
  const [showModal, setShowModal] = useState(false);
  return (
    <MapPlacement x={-4} y={9} height={1} width={1}>
      <div
        className="relative w-full h-full cursor-pointer hover:img-highlight"
        onClick={() => setShowModal(true)}
      >
        <img
          src={shadow}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
        />
        <img
          src={SUNNYSIDE.npcs.sunflorian}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
        />
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Panel
          bumpkinParts={{
            body: "Light Brown Farmer Potion",
            hair: "Buzz Cut",
            pants: "Fancy Pants",
            shirt: "Fancy Top",
            tool: "Farmer Pitchfork",
            background: "Farm Background",
            shoes: "Black Farmer Boots",
          }}
        >
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
          <div className="p-2">
            <p className="mb-4">{t("lostSunflorian.line1")}</p>
            <p className="mb-4">{t("lostSunflorian.line2")}</p>
            <p>{t("lostSunflorian.line3")}</p>
          </div>
        </Panel>
      </Modal>
    </MapPlacement>
  );
};
