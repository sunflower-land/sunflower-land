import React from "react";
import { Button } from "components/ui/Button";

import alert from "assets/icons/expression_alerted.png";

export const Web3Missing: React.FC = () => {
  const goToMetamaskSetupDocs = () => {
    window.open(
      "https://docs.sunflower-land.com/guides/getting-setup#metamask-setup",
      "_blank"
    );
  };

  return (
    <div className="flex flex-col text-center text-shadow items-center p-1">
      <div className="flex mb-3 items-center">
        <img src={alert} alt="Warning" className="w-3 mr-3" />
      </div>
      <p className="text-center mb-3">Web3 Not Found</p>

      <p className="text-center mb-4 text-xs">
        Check out this guide to help you get started.
      </p>
      <Button onClick={goToMetamaskSetupDocs} className="overflow-hidden mb-2">
        <span>Go to setup guide</span>
      </Button>
    </div>
  );
};
