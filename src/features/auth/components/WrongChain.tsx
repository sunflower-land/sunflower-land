import React from "react";
import { Button } from "components/ui/Button";

import alert from "assets/icons/expression_alerted.png";

export const WrongChain: React.FC = () => {
  const goToPolygonSetupDocs = () => {
    window.open(
      "https://docs.sunflower-farmers.com/untitled#polygon-setup",
      "_blank"
    );
  };

  return (
    <div className="flex flex-col text-center text-shadow items-center p-1">
      <div className="flex mb-3 items-center">
        <img src={alert} alt="Warning" className="w-3 mr-3" />
      </div>
      <p className="text-center mb-3">You're not connected to Polygon</p>

      <p className="text-center mb-4 text-xs">
        Check out this guide to help you get connected.
      </p>
      <Button onClick={goToPolygonSetupDocs} className="overflow-hidden mb-2">
        <span>Go to guide</span>
      </Button>
    </div>
  );
};
