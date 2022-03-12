import React from "react";
import { Button } from "components/ui/Button";

import alert from "assets/icons/expression_alerted.png";
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

      <p className="text-center mb-4 text-xs">
        {`You don't have access to this feature yet. You can follow the Discord announcements for when this will become publicly available.`}
      </p>
      <Button onClick={readMore} className="overflow-hidden mb-2">
        <span>View roadmap</span>
      </Button>
    </div>
  );
};
