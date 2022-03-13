import React from "react";

import humanDeath from "assets/npcs/human_death.gif";

export const DuplicateUser: React.FC = () => {
  return (
    <div className="flex flex-col text-center text-shadow items-center p-1">
      <div className="flex mb-3 items-center ml-8">
        <img src={humanDeath} alt="Warning" className="w-full" />
      </div>
      <p className="text-center mb-3">Already signed up!</p>

      <p className="text-center mb-4 text-xs">
        {`It looks like you have already registered for beta testing using a different address. Only one address can be used during beta testing. `}
      </p>
    </div>
  );
};
