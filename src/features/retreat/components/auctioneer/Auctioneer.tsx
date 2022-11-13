import React, { useState } from "react";

import auctioneer from "assets/npcs/trivia.gif";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Action } from "components/ui/Action";
import player from "assets/icons/player.png";
import { tailorAudio } from "lib/utils/sfx";
import { AuctioneerModal } from "./AuctioneerModal";

export const Auctioneer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openAuctioneer = () => {
    setIsOpen(true);
    //Checks if tailorAudio is playing, if false, plays the sound
    if (!tailorAudio.playing()) {
      tailorAudio.play();
    }
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
        <Action
          className="absolute -left-10 -bottom-40"
          text="Auctioneer"
          icon={player}
          onClick={openAuctioneer}
        />
      </div>
      {isOpen && (
        <AuctioneerModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
};
