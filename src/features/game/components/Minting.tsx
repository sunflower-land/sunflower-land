import React from "react";

import mintingAnimation from "assets/npcs/minting.gif";

export const Minting: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-shadow text-center">Minting</span>
      <img src={mintingAnimation} className="w-1/2 mt-2 mb-3 ml-8" />
      <span className="text-shadow text-xs text-center">
        Please be patient while our minions mint something special for you.
      </span>
    </div>
  );
};
