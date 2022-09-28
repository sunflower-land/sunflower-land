import React from "react";

import suspiciousGoblin from "assets/npcs/suspicious_goblin.gif";

export const MultipleDevices: React.FC = () => {
  return (
    <div className="flex flex-col text-center text-shadow items-center p-1">
      <p className="text-center mb-3">Multiple devices open</p>

      <img src={suspiciousGoblin} alt="Maintenance" className="w-1/3" />

      <p className="text-center mb-4 text-sm">
        Please close any other browser tabs or devices that you are operating
        on.
      </p>
    </div>
  );
};
