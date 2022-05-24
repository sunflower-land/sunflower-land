import React from "react";

import mintingAnimation from "assets/npcs/goblin_hammering.gif";

export const Minting: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-shadow text-center loading">Minting</span>
      <img src={mintingAnimation} className="w-1/2" />
      <span className="text-sm">
        Please be patient while our minions mint something special for you.
      </span>
    </div>
  );
};
