import { useActor } from "@xstate/react";
import React, { useContext, useState } from "react";

import island from "assets/land/vip_island.png";
import vipGift from "assets/decorations/vip_gift.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";

import { MapPlacement } from "./MapPlacement";
import { Modal } from "components/ui/Modal";
import { VIPGift } from "features/world/ui/VIPGift";

interface Props {
  offset: number;
}

export const SeasonTeaser: React.FC<Props> = ({ offset }) => {
  const [showModal, setShowModal] = useState(false);
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  return (
    <>
      <Modal show={showModal}>
        <VIPGift onClose={() => setShowModal(false)} />
      </Modal>
      <MapPlacement x={0} y={-6 - offset} width={6}>
        <img
          src={island}
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
