import React, { useContext } from "react";

import auctioneer from "assets/npcs/trivia.gif";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Action } from "components/ui/Action";
import player from "assets/icons/player.png";
import { AuctioneerModal } from "./AuctioneerModal";
import { Context } from "features/game/GoblinProvider";
import { useActor } from "@xstate/react";
import { Item } from "./actions/auctioneerItems";
import { ITEM_DETAILS } from "features/game/types/images";

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
    <div
      className="z-10 absolute"
      style={{
        width: `${GRID_WIDTH_PX * 5.5}px`,
        left: `${GRID_WIDTH_PX * 16.5}px`,
        top: `${GRID_WIDTH_PX * 26.5}px`,
      }}
    >
      <div
        className="cursor-pointer hover:img-highlight"
        onClick={openAuctioneer}
      >
        <img
          src={auctioneer}
          style={{
            width: `${PIXEL_SCALE * 30}px`,
          }}
        />
        <div className="flex items-center justify-center h-[100px] w-[88px]">
          {upcomingItem && (
            <img
              src={ITEM_DETAILS[upcomingItem.name].image}
              style={{
                width: `${PIXEL_SCALE * 16}px`,
              }}
            />
          )}
        </div>
        <Action
          className="absolute -left-5"
          text="Auctioneer"
          icon={player}
          onClick={openAuctioneer}
        />
      </div>
      {isPlaying && (
        <AuctioneerModal isOpen={isPlaying} onClose={closeAuctioneer} />
      )}
    </div>
  );
};
