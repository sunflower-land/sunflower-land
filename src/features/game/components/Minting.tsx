import { SUNNYSIDE } from "assets/sunnyside";
import React from "react";

export const Minting: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-shadow text-center loading">Minting</span>
      <img src={SUNNYSIDE.npcs.goblin_hammering} className="w-1/2 mt-2 mb-3" />
      <span className="text-sm">
        Please be patient while your item is minted on the Blockchain.
      </span>
    </div>
  );
};
