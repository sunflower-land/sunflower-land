import React from "react";
import { Button } from "components/ui/Button";

import humanDeath from "assets/npcs/human_death.gif";

export const Blocked: React.FC = () => {
  const readMore = () => {
    window.open(
      "https://docs.sunflower-land.com/fundamentals/roadmap",
      "_blank"
    );
  };

  return (
    <div className="flex flex-col text-center text-shadow items-center p-1">
      <div className="flex mb-3 items-center ml-8">
        <img src={humanDeath} alt="Warning" className="w-full" />
      </div>
      <p className="text-center mb-3">Beta testers only!</p>

      <p className="text-center mb-2 text-xs">
        {`You don't have access to this feature yet`}
      </p>
      <p className="text-center mb-4 text-xs">
        {`Make sure you have joined the Sunflower Land Discord server and have the
        "farmer" role`}
      </p>
      <Button onClick={readMore} className="overflow-hidden mb-2">
        <span>View roadmap</span>
      </Button>
    </div>
  );
};
