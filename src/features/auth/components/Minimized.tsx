import React from "react";

import humanDeath from "assets/npcs/suspicious_goblin.gif";

export const Minimized: React.FC = () => {
  return (
    <div className="flex flex-col text-center text-shadow items-center p-1">
      <p className="text-center mb-3">Full screen required!</p>
      <div className="flex mb-3 items-center">
        <img src={humanDeath} alt="Warning" className="w-full" />
      </div>
      <p className="text-center mb-4 text-xs">
        Only goblins play the game with the screen minimized. Make sure your
        browser is full screen to enjoy Sunflower Land to the fullest!
      </p>
    </div>
  );
};
