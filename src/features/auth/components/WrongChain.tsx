import React, { useEffect, useState } from "react";
import { Button } from "components/ui/Button";

import { wallet } from "lib/blockchain/wallet";
import { useIsMobile } from "lib/utils/hooks/useIsMobile";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";

export const WrongChain: React.FC = () => {
  const [isDefaultNetwork, setIsDefaultNetwork] = useState(false);
  const isMobile = useIsMobile();
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
    await wallet.initialiseNetwork(wallet.web3Provider);
  };

  return (
    <>
      <div className="flex flex-col text-center text-shadow items-center p-1">
        <div className="flex m-2 items-center">
          <img
            src={SUNNYSIDE.icons.expression_alerted}
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
      </div>
      <div className="flex justify-evenly space-x-1">
        <Button
          onClick={goToPolygonSetupDocs}
          className="py-2 text-sm relative"
        >
          <span>Go to guide</span>
        </Button>
        {/* This doesn't work on metamask browser so we won't show if on mobile */}
        {(!isDefaultNetwork || !isMobile) && (
          <Button onClick={initialiseNetwork} className="py-2 text-sm relative">
            <div className="text-center whitespace-nowrap">
              Add or Switch Network
            </div>
          </Button>
        )}
      </div>
    </>
  );
};
