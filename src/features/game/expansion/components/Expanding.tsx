import React from "react";

import goblinHammering from "src/assets/npcs/goblin_hammering.gif";

export const Expanding: React.FC = () => (
  <div className="flex flex-col items-center p-2">
    <span className="text-shadow text-center loading">Minting Land NFT</span>
    <img src={goblinHammering} className="w-1/2 mb-3" />

    <span className="text-sm">
      Please wait while your land is being minted on the Blockchain
    </span>
  </div>
);
