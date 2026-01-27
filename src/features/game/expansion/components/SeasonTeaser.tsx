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
import { LandBiomeName } from "features/island/biomes/biomes";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { useNow } from "lib/utils/hooks/useNow";
import { hasTimeBasedFeatureAccess } from "lib/flags";

interface Props {
  offset: number;
}

const _island = (state: MachineState) => state.context.state.island;

export const SeasonTeaser: React.FC<Props> = ({ offset }) => {
  const now = useNow({ live: true, intervalMs: 1000 * 60 });
  const { gameService } = useContext(Context);
  const [showModal, setShowModal] = useState(false);
  const island = useSelector(gameService, _island);
  const biome: LandBiomeName = getCurrentBiome(island);

  if (hasTimeBasedFeatureAccess("PET_CHAPTER_COMPLETE", now)) {
    return null;
  }

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <VIPGift onClose={() => setShowModal(false)} />
      </Modal>
      <MapPlacement x={0} y={-6 - offset} width={6}>
        <img
          src={VIP_ISLAND_VARIANTS[biome]}
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
