import React, { useContext } from "react";

import auctioneer from "assets/npcs/trivia.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Action } from "components/ui/Action";
import icon from "assets/icons/player_small.png";
import { AuctioneerModal } from "./AuctioneerModal";
import { Context } from "features/game/GoblinProvider";
import { useActor } from "@xstate/react";
import { Item } from "./actions/auctioneerItems";
import { ITEM_DETAILS } from "features/game/types/images";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { setImageWidth } from "lib/images";

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
            icon={icon}
          />
        </div>
      </div>
      {isPlaying && (
        <AuctioneerModal isOpen={isPlaying} onClose={closeAuctioneer} />
      )}
    </MapPlacement>
  );
};
