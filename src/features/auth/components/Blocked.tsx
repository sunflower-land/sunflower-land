import React from "react";
import { Button } from "components/ui/Button";

import alert from "assets/icons/expression_alerted.png";

export const Blocked: React.FC = () => {
  const readMore = () => {
    window.open(
      "https://docs.sunflower-land.com/fundamentals/roadmap",
      "_blank"
    );
  };

  return (
    <div className="flex flex-col text-center text-shadow items-center p-1">
      <div className="flex mb-3 items-center">
        <img src={alert} alt="Warning" className="w-3 mr-3" />
      </div>
      <p className="text-center mb-3">Beta testers only!</p>

      <p className="text-center mb-4 text-xs">
        {`We are launching soon. Join us on Discord so you don't miss the launch!`}
      </p>
      <Button onClick={readMore} className="overflow-hidden mb-2">
        <span>Go to guide</span>
      </Button>
    </div>
  );
};
