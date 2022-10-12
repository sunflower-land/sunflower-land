import React from "react";

import player from "assets/icons/player.png";
import suspiciousGoblin from "assets/npcs/suspicious_goblin.gif";

export const Rules: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-center">Sunflower Land Rules</span>
      <img src={suspiciousGoblin} className="w-1/3 mt-2" />
      <div className="flex">
        <img src={player} className="w-6" />
        <p>1 account per player</p>
      </div>
      <p>No botting or automation</p>
      <p>No harrasment or discrimination</p>
      <p>This is a game. Not a financial product.</p>
    </div>
  );
};
