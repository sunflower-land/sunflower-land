import React from "react";

// import death from "assets/npcs/skeleton_death.gif";
import alert from "assets/icons/expression_alerted.png";

export const Offline: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-2">
      {/* <img src={death} className="w-1/2" /> */}
      <img src={alert} className="w-3" />
      <p className="text-center my-3">OFFLINE! :(</p>
      <p className="text-shadow text-xs text-center mb-2">
        Uh oh, looks like you are disconnected, so the goblins detected that you
        are OFFLINE.
      </p>
      <p className="text-shadow text-xs text-center mt-2">
        Please connect to the internet (or) reload this page :)
      </p>
    </div>
  );
};
