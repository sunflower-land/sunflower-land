import React from "react";

import suspiciousGoblin from "assets/npcs/suspicious_goblin.gif";

export const Blacklisted: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-center">This farm is banned</span>
      <img src={suspiciousGoblin} alt="Warning" className="w-16 m-2" />
      <span className="text-sm mt-2 mb-2">
        The anti-bot and multi-account detection system has picked up strange
        behaviour. Actions have been restricted.
      </span>
      <a
        href={`https://sunflowerland.freshdesk.com/support/tickets/new`}
        className="underline text-center text-sm hover:text-blue-500 mt-1 mb-2 block"
        target="_blank"
        rel="noopener noreferrer"
      >
        Please submit a ticket with details and we will get back to you.
      </a>
    </div>
  );
};
