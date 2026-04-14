import React, { useContext, useState } from "react";

import boat from "assets/decorations/isle_boat.gif";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { NPC_WEARABLES } from "lib/npcs";
import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Label } from "components/ui/Label";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import classNames from "classnames";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const TeaserAnimal: React.FC<{ onClose: () => void }> = () => {
  const { t } = useAppTranslation();

  return (
    <>
      <div className="p-2">
        <p className="text-sm mb-2"></p>
      </div>
    </>
  );
};

const _expansions = (state: MachineState) =>
  state.context.state.inventory["Basic Land"]?.toNumber() ?? 0;

export const AnimalTeaser: React.FC = () => {
  const { t } = useAppTranslation();

  const [showModal, setShowModal] = useState(false);
  const { gameService } = useContext(Context);
  const expansions = useSelector(gameService, _expansions);
  const { showAnimations } = useContext(Context);

  let yOffset = 1.5;
  if (expansions >= 12) {
    yOffset = -2;
  }

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel
          bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
          onClose={() => setShowModal(false)}
        >
          <TeaserAnimal onClose={() => setShowModal(false)} />
        </CloseButtonPanel>
      </Modal>

      <div
        className={classNames("absolute cursor-pointer  left-0", {
          tease_boat: showAnimations,
        })}
        onClick={() => setShowModal(true)}
        style={{
          top: `${GRID_WIDTH_PX * yOffset}px`,
          width: `${PIXEL_SCALE * 104}px`,
          transform: `translateX(650px)`,
        }}
      >
        <img src={boat} className="absolute top-0 right-0 w-full" />
        <img
          src={SUNNYSIDE.animals.cowReady}
          style={{
            top: `${PIXEL_SCALE * 7}px`,
            right: `${PIXEL_SCALE * 15}px`,
            width: `${PIXEL_SCALE * 25}px`,
          }}
          className="absolute"
        />

        <div
          className="absolute"
          style={{
            top: `${PIXEL_SCALE * 0}px`,
            right: `${PIXEL_SCALE * 15}px`,
          }}
        >
          <Label
            type="vibrant"
            icon={SUNNYSIDE.icons.expression_alerted}
            style={{}}
          >
            {t("coming.soon")}
          </Label>
        </div>
      </div>
    </>
  );
};
