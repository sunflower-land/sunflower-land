import React, { useContext } from "react";

import auctioneer from "assets/npcs/trivia.gif";
import shadow from "assets/npcs/shadow.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Action } from "components/ui/Action";
import { AuctioneerModal } from "./AuctioneerModal";
import { Context } from "features/game/GoblinProvider";
import { useActor } from "@xstate/react";
import { Item } from "./actions/auctioneerItems";
import { ITEM_DETAILS } from "features/game/types/images";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { setImageWidth } from "lib/images";
import { SUNNYSIDE } from "assets/sunnyside";

export const Auctioneer: React.FC = () => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);

  const upcomingItem: Item | undefined = goblinState.context.auctioneerItems
    .filter((item) => item.releases.some(({ endDate }) => endDate > Date.now()))
    .sort((a, b) => a.releases[0].endDate - b.releases[0].endDate)[0];

  const isPlaying = goblinState.matches("auctioneer");

  const openAuctioneer = () => {
    goblinService.send("OPEN_AUCTIONEER");
  };

  const closeAuctioneer = () => {
    goblinService.send("CLOSE_AUCTIONEER");
  };

  return (
    <MapPlacement x={-5} y={-6} height={6} width={5}>
      <div
        className="relative w-full h-full cursor-pointer hover:img-highlight"
        onClick={openAuctioneer}
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
        {upcomingItem && (
          <img
            className="absolute"
            src={ITEM_DETAILS[upcomingItem.name].image}
            onLoad={(e) => {
              const img = e.currentTarget;
              if (
                !img ||
                !img.complete ||
                !img.naturalWidth ||
                !img.naturalHeight
              ) {
                return;
              }

              const left = Math.floor((80 - img.naturalWidth) / 2);
              const bottom = Math.floor((80 - img.naturalHeight) / 2);
              img.style.left = `${PIXEL_SCALE * left}px`;
              img.style.bottom = `${PIXEL_SCALE * bottom}px`;
              setImageWidth(img);
            }}
            style={{
              opacity: 0,
            }}
          />
        )}
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
      {isPlaying && (
        <AuctioneerModal isOpen={isPlaying} onClose={closeAuctioneer} />
      )}

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
        className="absolute animate-float z-20"
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
