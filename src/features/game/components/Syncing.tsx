import React from "react";

import syncingAnimation from "assets/npcs/syncing.gif";

export const Syncing: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-shadow text-center text-lg">Syncing</span>
      <img
        src={syncingAnimation}
        alt="Syncing"
        className="h-20 mt-2 mb-3 -ml-2"
      />
      <span className="text-shadow text-xs text-center">
        Please bear with us while we sync all of your data on chain.
      </span>
      <span className="text-shadow text-sm text-center mt-2">
        Do not refresh your browser!
      </span>
    </div>
  );
};
