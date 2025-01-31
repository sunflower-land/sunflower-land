import React, { useContext, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";

const _island = (state: MachineState) => state.context.state.island.type;

export const HeliosSunflower: React.FC = () => {
  const { gameService } = useContext(Context);

  const island = useSelector(gameService, _island);

  const { t } = useAppTranslation();
  const [showModal, setShowModal] = useState(false);
  return (
    <MapPlacement x={0} y={12} height={1} width={1}>
      <div
        className="relative w-full h-full cursor-pointer hover:img-highlight"
        onClick={() => setShowModal(true)}
      >
        <img
          src={CROP_LIFECYCLE[island].Sunflower.ready}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
        />
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
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
          <div className="p-2">
            <p>{t("heliosSunflower.title")}</p>
            <p className="mt-2">{t("heliosSunflower.description")}</p>
          </div>
        </Panel>
      </Modal>
    </MapPlacement>
  );
};
