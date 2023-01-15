import { SUNNYSIDE } from "assets/sunnyside";
import React from "react";

export const Expanding: React.FC = () => (
  <div className="flex flex-col items-center p-2">
    <span className="text-shadow text-center loading">Minting Land NFT</span>
    <img src={SUNNYSIDE.npcs.goblin_hammering} className="w-1/2 mb-3" />

    <span className="text-sm">
      Please wait while your land is being minted on the Blockchain
    </span>
  </div>
);
