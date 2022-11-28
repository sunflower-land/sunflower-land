import React, { useEffect, useState } from "react";
import { Button } from "components/ui/Button";

import alert from "assets/icons/expression_alerted.png";
import { wallet } from "lib/blockchain/wallet";
import { useIsMobile } from "lib/utils/hooks/useIsMobile";
import { metamaskIcon } from "./WalletIcons";
import { PIXEL_SCALE } from "features/game/lib/constants";

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
      const defaultNetworkStatus = await wallet.checkDefaultNetwork();
      setIsDefaultNetwork(defaultNetworkStatus);
    };

    load();
  }, []);

  const initialiseNetwork = async () => {
    await wallet.initialiseNetwork();
  };

  return (
    <div className="flex flex-col text-center text-shadow items-center p-1">
      <div className="flex m-2 items-center">
        <img
          src={alert}
          alt="Warning"
          style={{
            width: `${PIXEL_SCALE * 4}px`,
          }}
        />
      </div>
      <p className="text-center mb-3">{`You're not connected to Polygon`}</p>

      <p className="text-center mb-4 text-xs">
        Check out this guide to help you get connected.
      </p>
      <Button
        onClick={goToPolygonSetupDocs}
        className="mb-2 py-2 text-sm relative"
      >
        <span>Go to guide</span>
      </Button>
      {/* This doesn't work on metamask browser so we won't show if on mobile */}
      {(!isDefaultNetwork || !isMobile) && (
        <Button
          onClick={initialiseNetwork}
          className="mb-2 py-2 text-sm relative"
        >
          <div className="px-8">
            {metamaskIcon}
            Add or Switch Network
          </div>
        </Button>
      )}
    </div>
  );
};
