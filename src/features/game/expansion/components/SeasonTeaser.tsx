import React, { useState } from "react";

import island from "assets/land/vip_island.png";
import vipGift from "assets/decorations/vip_gift.png";

import { PIXEL_SCALE } from "features/game/lib/constants";

import { MapPlacement } from "./MapPlacement";
import { Modal } from "components/ui/Modal";
import { VIPGift } from "features/world/ui/VIPGift";

interface Props {
  offset: number;
}

export const SeasonTeaser: React.FC<Props> = ({ offset }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
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
