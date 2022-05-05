import React from "react";

export const SupplyReached: React.FC = () => {
  return (
    <div className="flex flex-col text-center text-shadow items-center p-1">
      <p className="text-center mb-3">Supply reached!</p>

      <p className="text-center mb-4 text-xs">
        {`100,000 farms have already been minted for open beta. More spots are opening soon!`}
      </p>
    </div>
  );
};
