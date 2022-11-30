import React, { useState } from "react";

import npc from "assets/npcs/community_garden.gif";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { merchantAudio } from "lib/utils/sfx";
import { CommunityGardenModal } from "features/farming/town/components/CommunityGardenModal";

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
    <>
      <div
        className="absolute hover:img-highlight cursor-pointer z-10"
        style={{
          left: `${GRID_WIDTH_PX * 13}px`,
          top: `${GRID_WIDTH_PX * 31}px`,
        }}
        onClick={openMerchant}
      >
        <img
          src={npc}
          style={{
            width: `${PIXEL_SCALE * 39}px`,
          }}
        />
      </div>
      <CommunityGardenModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};
