import React from "react";

import death from "assets/npcs/skeleton_death.gif";

export const Blacklisted: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-shadow text-center">Blacklisted</span>
      <img src={death} className="w-1/2" />
      <span className="text-shadow text-xs text-center">
        Uh oh, looks like the goblins detected some automated bots.
      </span>
      <span className="text-shadow text-xs text-center mt-2">
        This farm has been identified for using automated software to mint farms
        and play the game or banned for multi-accounting.
      </span>
    </div>
  );
};
