import React, { useContext, useState } from "react";

import vipGift from "assets/decorations/vip_gift.png";

import { PIXEL_SCALE } from "features/game/lib/constants";

import { MapPlacement } from "./MapPlacement";
import { Modal } from "components/ui/Modal";
import { VIPGift } from "features/world/ui/VIPGift";
import { VIP_ISLAND_VARIANTS } from "features/island/lib/alternateArt";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";

interface Props {
  offset: number;
}

const _island = (state: MachineState) => state.context.state.island.type;

export const SeasonTeaser: React.FC<Props> = ({ offset }) => {
  const { gameService } = useContext(Context);
  const [showModal, setShowModal] = useState(false);
  const island = useSelector(gameService, _island);

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <VIPGift onClose={() => setShowModal(false)} />
      </Modal>
      <MapPlacement x={0} y={-6 - offset} width={6}>
        <img
          src={VIP_ISLAND_VARIANTS[island]}
          style={{
            width: `${PIXEL_SCALE * 62}px`,
          }}
        />

        <img
          src={vipGift}
          className="absolute cursor-pointer hover:img-highlight"
          onClick={() => setShowModal(true)}
          style={{
            width: `${PIXEL_SCALE * 18}px`,
            bottom: `${PIXEL_SCALE * 10}px`,
            right: `${PIXEL_SCALE * 57}px`,
          }}
        />
      </MapPlacement>
    </>
  );
};
