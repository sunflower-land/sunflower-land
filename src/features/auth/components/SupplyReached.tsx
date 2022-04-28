import React from "react";

import humanDeath from "assets/npcs/human_death.gif";

export const SupplyReached: React.FC = () => {
  return (
    <div className="flex flex-col text-center text-shadow items-center p-1">
      <p className="text-center mb-3">Supply reached!</p>

      <p className="text-center mb-4 text-xs">
        {`100,000 farms have already been minted for open beta. Currently only people who owned V1 Sunflower Farmer assets are able to create a farm. More spots are opening soon!`}
      </p>
    </div>
  );
};
