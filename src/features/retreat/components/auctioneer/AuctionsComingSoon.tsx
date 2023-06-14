import { SUNNYSIDE } from "assets/sunnyside";
import React from "react";

export const AuctionsComingSoon: React.FC = () => {
  return (
    <div className="p-2 flex flex-col items-center">
      <p>Under construction!</p>
      <img src={SUNNYSIDE.npcs.goblin_hammering} className="w-1/3" />
      <p className="my-2 text-sm">This feature is coming soon.</p>
      <a
        href="https://docs.sunflower-land.com/player-guides/auctions"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs underline"
      >
        Read more
      </a>
    </div>
  );
};
