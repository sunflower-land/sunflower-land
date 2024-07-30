import { useActor } from "@xstate/react";
import React, { useContext, useState } from "react";

import { Context } from "features/game/GameProvider";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { NPC } from "features/island/bumpkin/components/NPC";
import { AuctioneerModal } from "features/retreat/components/auctioneer/AuctioneerModal";
import { NPC_WEARABLES } from "lib/npcs";
import { SUNNYSIDE } from "assets/sunnyside";

export const HeliosAuction: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const {
    context: { state, farmId },
  } = gameState;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <MapPlacement x={2} y={-9.2} height={3} width={5}>
        <div
          className="relative w-full h-full cursor-pointer hover:img-highlight"
          onClick={() => setIsOpen(true)}
        >
          <img
            src={SUNNYSIDE.building.auction_floor}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 75}px`,
              left: `${PIXEL_SCALE * 4}px`,
              bottom: `${PIXEL_SCALE * 6}px`,
            }}
          />
          <div
            className="absolute "
            style={{
              left: `${PIXEL_SCALE * 32}px`,
              top: `${PIXEL_SCALE * -4}px`,
            }}
          >
            <NPC
              // onClick={() => setIsOpen(true)}
              parts={NPC_WEARABLES["hammerin harry"]}
            />
          </div>
        </div>
      </MapPlacement>
      <AuctioneerModal
        isOpen={isOpen}
        farmId={farmId}
        onClose={() => setIsOpen(false)}
        gameState={state}
        onUpdate={(state) => {
          gameService.send("UPDATE", { state });
        }}
        onMint={(id) => {
          setIsOpen(false);
          gameService.send("MINT", { auctionId: id });
        }}
        deviceTrackerId={gameState.context.deviceTrackerId as string}
        linkedAddress={gameState.context.linkedWallet}
      />
    </>
  );
};
