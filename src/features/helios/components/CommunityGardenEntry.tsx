import React, { useState } from "react";

import shadow from "assets/npcs/shadow.png";
import npc from "assets/npcs/community_garden.gif";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { merchantAudio } from "lib/utils/sfx";
import { CommunityGardenModal } from "features/farming/town/components/CommunityGardenModal";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";

export const CommunityGardenEntry: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const openMerchant = () => {
    setShowModal(true);
    //Checks if merchantAudio is playing, if false, plays the sound
    if (!merchantAudio.playing()) {
      merchantAudio.play();
    }
  };

  return (
    <MapPlacement x={-8} y={-11} height={3} width={2}>
      <div
        className="relative w-full h-full cursor-pointer hover:img-highlight"
        onClick={openMerchant}
      >
        <img
          src={shadow}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            right: `${PIXEL_SCALE * 1}px`,
            top: `${PIXEL_SCALE * 9}px`,
          }}
        />
        <div
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 39}px`,
            right: `${PIXEL_SCALE * 0}px`,
            top: `${PIXEL_SCALE * -3}px`,
          }}
        >
          <img
            src={npc}
            style={{
              width: `${PIXEL_SCALE * 39}px`,
            }}
          />
        </div>
      </div>
      <CommunityGardenModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </MapPlacement>
  );
};
