import React, { useEffect, useState } from "react";
import { Button } from "components/ui/Button";

import alert from "assets/icons/expression_alerted.png";
import metamaskIcon from "assets/icons/metamask-icon.png";
import { metamask } from "lib/blockchain/metamask";
import { useIsMobile } from "lib/utils/hooks/useIsMobile";

export const WrongChain: React.FC = () => {
  const [isDefaultNetwork, setIsDefaultNetwork] = useState(false);
  const [isMobile] = useIsMobile();
  const goToPolygonSetupDocs = () => {
    window.open(
      "https://docs.sunflower-land.com/guides/getting-setup#polygon-setup",
      "_blank"
    );
  };

  useEffect(() => {
    const load = async () => {
      const defaultNetworkStatus = await metamask.checkDefaultNetwork();
      setIsDefaultNetwork(defaultNetworkStatus);
    };

    load();
  }, []);

  const initialiseNetwork = async () => {
    await metamask.initialiseNetwork();
  };

  return (
    <div className="flex flex-col text-center text-shadow items-center p-1">
      <div className="flex mb-3 items-center">
        <img src={alert} alt="Warning" className="w-3 mr-3" />
      </div>
      <p className="text-center mb-3">{`You're not connected to Polygon`}</p>

      <p className="text-center mb-4 text-xs">
        Check out this guide to help you get connected.
      </p>
      <Button onClick={goToPolygonSetupDocs} className="overflow-hidden mb-2">
        <span>Go to guide</span>
      </Button>
      {/* This doesn't work on metamask browser so we won't show if on mobile */}
      {(!isDefaultNetwork || !isMobile) && (
        <Button onClick={initialiseNetwork} className="overflow-hidden mb-2">
          <img src={metamaskIcon} alt="Metamask Icon" className="mr-2" />
          <span>Add or Switch Network</span>
        </Button>
      )}
    </div>
  );
};
