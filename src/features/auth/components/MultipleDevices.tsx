import React from "react";

import suspiciousGoblin from "assets/npcs/suspicious_goblin.gif";

export const MultipleDevices: React.FC = () => {
  return (
    <div className="flex flex-col text-center items-center p-1">
      <p>Multiple devices open</p>

      <img src={suspiciousGoblin} alt="Warning" className="w-16 m-2" />

      <p className="mt-2 mb-2 text-sm">
        Please close any other browser tabs or devices that you are operating
        on.
      </p>
    </div>
  );
};
