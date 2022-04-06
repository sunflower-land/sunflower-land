import React from "react";

import humanDeath from "assets/npcs/human_death.gif";

export const SupplyReached: React.FC = () => {
  return (
    <div className="flex flex-col text-center text-shadow items-center p-1">
      <div className="flex mb-3 items-center ml-8">
        <img src={humanDeath} alt="Warning" className="w-full" />
      </div>
      <p className="text-center mb-3">Supply reached!</p>

      <p className="text-center mb-4 text-xs">
        {`100,000 farms have already been minted. More spots will be opened over the coming days.`}
      </p>
    </div>
  );
};
