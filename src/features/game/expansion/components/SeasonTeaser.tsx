import { useActor } from "@xstate/react";
import React, { useContext, useState } from "react";

import island from "assets/land/spring_blossom_teaser.gif";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { NPC } from "features/island/bumpkin/components/NPC";
import { Context } from "features/game/GameProvider";

import { MapPlacement } from "./MapPlacement";
import { NPC_WEARABLES } from "lib/npcs";

interface Props {
  offset: number;
}

export const SeasonTeaser: React.FC<Props> = ({ offset }) => {
  const [showModal, setShowModal] = useState(false);
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  return (
    <>
      {/* <PromotingModal
        hasPurchased={
          !!gameState.context.state.inventory["Spring Blossom Banner"]
        }
        hasDiscount={
          !!gameState.context.state.inventory["Catch the Kraken Banner"]
        }
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      /> */}
      <MapPlacement x={0} y={-6 - offset} width={6}>
        <img
          src={island}
          style={{
            width: `${PIXEL_SCALE * 82}px`,
          }}
        />

        <div
          className="absolute"
          style={{
            left: `${GRID_WIDTH_PX * 2.3}px`,
            bottom: `${GRID_WIDTH_PX * 4}px`,
          }}
        >
          <NPC
            parts={NPC_WEARABLES.grubnuk}
            // onClick={() => setShowModal(true)}
          />
        </div>
      </MapPlacement>
    </>
  );
};
