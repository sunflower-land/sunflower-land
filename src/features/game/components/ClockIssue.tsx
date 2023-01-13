import React from "react";
import suspiciousGoblin from "assets/npcs/suspicious_goblin.gif";

export const ClockIssue = () => {
  return (
    <div className="flex flex-col items-center text-center p-2">
      <span>Clock not in sync</span>
      <img src={suspiciousGoblin} alt="Warning" className="w-16 m-2" />
      <span className="text-xs">
        Uh oh, it looks like your clock is not in sync with the game. Set date
        and time to automatic to avoid disruptions
      </span>
    </div>
  );
};
