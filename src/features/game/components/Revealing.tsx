import React from "react";

import digging from "assets/npcs/goblin_treasure.gif";

export const Revealing: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-shadow text-center">What could it be?</span>
      <img src={digging} alt="digging" className="h-20 mt-2 mb-3 -ml-2" />
    </div>
  );
};
