import React from "react";
import lightningAnimation from "assets/npcs/human_death.gif";

export const ConnectingError: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-center">Something went wrong!</span>
      <img src={lightningAnimation} className="h-20 my-2" />
      <span className="text-xs text-center mt-2 mb-1">
        Looks like we were unable to connect. Please refresh and try again.
      </span>
    </div>
  );
};
