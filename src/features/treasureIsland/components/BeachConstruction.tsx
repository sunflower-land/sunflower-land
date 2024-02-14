import React, { useState } from "react";

import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { PIXEL_SCALE } from "features/game/lib/constants";

import { SUNNYSIDE } from "assets/sunnyside";
import shadow from "assets/npcs/shadow.png";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Modal } from "components/ui/Modal";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const BeachConstruction: React.FC = () => {
  const { t } = useAppTranslation();

  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <MapPlacement x={-17} y={4} height={2} width={5}>
        <img
          src={SUNNYSIDE.npcs.goblin_hammering}
          style={{
            width: `${PIXEL_SCALE * 70}px`,
          }}
          className="cursor-pointer hover:img-highlight"
          onClick={() => setShowModal(true)}
        />
        <img
          src={shadow}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            left: `${PIXEL_SCALE * 18}px`,
            bottom: 0,
          }}
        />
      </MapPlacement>
      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel
          bumpkinParts={{
            body: "Goblin Potion",
            pants: "Lumberjack Overalls",
            tool: "Hammer",
            hair: "Sun Spots",
          }}
          onClose={() => setShowModal(false)}
        >
          <div className="p-2">
            <p className="mb-2 text-sm">{t("beach.party")}</p>
            <p className="mb-2 text-sm">{t("beach.ready")}</p>
          </div>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
