import React, { useContext, useState } from "react";

import auctioneer from "assets/npcs/trivia.gif";
import shadow from "assets/npcs/shadow.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Action } from "components/ui/Action";
import { Context } from "features/game/GameProvider";
//import { useActor } from "@xstate/react";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { SUNNYSIDE } from "assets/sunnyside";

export const Auctioneer: React.FC = () => {
  const { showAnimations } = useContext(Context);
  //const { goblinService } = useContext(Context);
  //const [goblinState] = useActor(goblinService);

  const [showModal, setShowModal] = useState(false);

  // Show their current bid item, or the upcoming item
  // goblinState.context.state.auctioneer.bid?.item ??
  // getValidAuctionItems(goblinState.context.auctioneerItems)[0]?.name;

  // const openAuctioneer = () => {
  //   goblinService.send({ type: "OPEN_AUCTIONEER" });
  // };

  // const closeAuctioneer = () => {
  //   goblinService.send({ type: "CLOSE_AUCTIONEER" });
  // };

  return (
    <MapPlacement x={-5} y={-6} height={6} width={5}>
      <div
        className="relative w-full h-full cursor-pointer hover:img-highlight"
        onClick={() => setShowModal(true)}
      >
        <img
          src={auctioneer}
          alt="Auctioneer"
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 33}px`,
            top: `${PIXEL_SCALE * 6}px`,
            left: `${PIXEL_SCALE * 23}px`,
          }}
        />
        <div
          className="flex justify-center absolute w-full pointer-events-none"
          style={{
            bottom: `${PIXEL_SCALE * 3}px`,
          }}
        >
          <Action
            className="pointer-events-none"
            text="Auctioneer"
            icon={SUNNYSIDE.icons.player}
          />
        </div>
      </div>
      {/* <AuctioneerModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        gameState={goblinState.context.state}
        onUpdate={(state) => {}}
      /> */}

      {/* Interested Goblins */}
      <img
        src={SUNNYSIDE.npcs.goblin}
        className="absolute z-10"
        style={{
          width: `${PIXEL_SCALE * 18}px`,
          left: `${PIXEL_SCALE * -5}px`,
          bottom: `${PIXEL_SCALE * 20}px`,
        }}
      />
      <img
        src={shadow}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          left: `${PIXEL_SCALE * -4}px`,
          bottom: `${PIXEL_SCALE * 18}px`,
        }}
      />
      <img
        src={SUNNYSIDE.icons.heart}
        className={"absolute z-20" + (showAnimations ? " animate-float" : "")}
        style={{
          width: `${PIXEL_SCALE * 10}px`,
          left: `${PIXEL_SCALE * 0}px`,
          bottom: `${PIXEL_SCALE * 40}px`,
        }}
      />

      <img
        src={SUNNYSIDE.npcs.goblin}
        className="absolute z-10"
        style={{
          width: `${PIXEL_SCALE * 18}px`,
          right: `${PIXEL_SCALE * 0}px`,
          bottom: `${PIXEL_SCALE * 40}px`,
          transform: "scaleX(-1)",
        }}
      />
      <img
        src={shadow}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          right: `${PIXEL_SCALE * 1}px`,
          bottom: `${PIXEL_SCALE * 38}px`,
        }}
      />
    </MapPlacement>
  );
};
