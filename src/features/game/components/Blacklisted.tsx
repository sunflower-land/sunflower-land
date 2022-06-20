import React from "react";

import suspiciousGoblin from "assets/npcs/suspicious_goblin.gif";

export const Blacklisted: React.FC = () => (
  <div className="flex flex-col items-center p-2">
    <span className="text-center">Something strange!</span>
    <img src={suspiciousGoblin} className="w-16 mt-2" />
    <span className="text-sm mt-2 mb-2">
      The anti-bot and multi-account detection system has picked up strange
      behaviour. Actions have been restricted.
    </span>
    <a
      href={`https://forms.gle/ajhNS6kr3c6U3YLT9`}
      className="underline text-center text-sm hover:text-blue-500 mt-1 mb-2 block"
      target="_blank"
      rel="noopener noreferrer"
    >
      Share details to help us improve our system
    </a>
  </div>
);
