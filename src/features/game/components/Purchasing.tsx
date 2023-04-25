import React from "react";

import syncingAnimation from "assets/npcs/syncing.gif";

export const Purchasing: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-shadow text-center text-lg">Purchasing</span>
      <img
        src={syncingAnimation}
        alt="Purchasing"
        className="h-20 mt-2 mb-3 -ml-2"
      />

      <span className="text-shadow text-sm text-center mt-2">
        Do not refresh your browser!
      </span>
    </div>
  );
};
