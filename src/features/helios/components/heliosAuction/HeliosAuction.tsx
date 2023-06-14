import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { NPC } from "features/island/bumpkin/components/NPC";
import { AuctioneerModal } from "features/retreat/components/auctioneer/AuctioneerModal";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useContext, useState } from "react";

export const HeliosAuction: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const {
    context: { state },
  } = gameState;

  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <MapPlacement x={-2} y={-11.5}>
        <NPC
          onClick={() => setIsOpen(true)}
          parts={NPC_WEARABLES["hammerin' harry"]}
        />
      </MapPlacement>
      <AuctioneerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        gameState={state}
        onUpdate={(state) => {
          console.log("Update hit!");
          gameService.send("UPDATE", { state });
        }}
        onMint={(id) => {
          console.log("Update hit!", gameState.value);
          setIsOpen(false);
          gameService.send("MINT", { auctionId: id });
        }}
        deviceTrackerId={gameState.context.deviceTrackerId as string}
      />
    </>
  );
};
