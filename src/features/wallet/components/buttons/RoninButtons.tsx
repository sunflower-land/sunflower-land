import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { roninStashConnector } from "features/wallet/WalletProvider";
import {
  walletConnectConnector,
  waypointConnector,
} from "features/wallet/WalletProvider";
import { useIsPWA } from "lib/utils/hooks/useIsPWA";
import { type Connector, type CreateConnectorFn, useConnectors } from "wagmi";
import { useTimeBasedFeatureAccess } from "lib/utils/hooks/useTimeBasedFeatureAccess";
import { INITIAL_FARM } from "features/game/lib/constants";

export const RoninButtons: React.FC<{
  onConnect: (connector: Connector | CreateConnectorFn) => void;
}> = ({ onConnect }) => {
  const connectors = useConnectors();

  const isPWA = useIsPWA();

  const eip6963Connectors = connectors
    .filter((connector) => connector.type === "injected" && !!connector.icon)
    .filter((connector) => connector.name === "Ronin Wallet");

  const isRoninWaypointDeprecated = useTimeBasedFeatureAccess({
    featureName: "RONIN_WAYPOINT_DEPRECATION",
    game: INITIAL_FARM,
  });

  return (
    <>
      {eip6963Connectors.length > 0 && (
        <Button
          className="mb-1 py-2 text-sm relative"
          onClick={() => onConnect(eip6963Connectors[0])}
        >
          <div className="px-8">
            <img
              src={SUNNYSIDE.icons.roninIcon}
              className="h-7 ml-2.5 mr-6 absolute left-0 top-1"
            />
            <span className="whitespace-nowrap">{`Ronin Browser Extension`}</span>
          </div>
        </Button>
      )}
      <Button
        className="mb-1 py-2 text-sm relative"
        onClick={() => onConnect(walletConnectConnector)}
      >
        <div className="px-8">
          <img
            src={SUNNYSIDE.icons.roninIcon}
            className="h-7 ml-2.5 mr-6 absolute left-0 top-1"
          />
          {"Ronin Mobile"}
        </div>
      </Button>
      {!isPWA && (
        <>
          {isRoninWaypointDeprecated && (
            <Button
              className="mb-1 py-2 text-sm relative"
              onClick={() => onConnect(waypointConnector)}
            >
              <div className="px-8 flex items-center justify-between">
                <div className="flex items-center w-full">
                  <img
                    src={SUNNYSIDE.icons.roninIcon}
                    className="h-7 ml-2.5 mr-6 absolute left-0 top-1"
                  />
                  {"Ronin Waypoint"}
                </div>
                <Label type="info">{"Deprecated"}</Label>
              </div>
            </Button>
          )}
          <Button
            className="mb-1 py-2 text-sm relative"
            onClick={() => onConnect(roninStashConnector())}
          >
            <div className="px-8">
              <img
                src={SUNNYSIDE.icons.roninIcon}
                className="h-7 ml-2.5 mr-6 absolute left-0 top-1"
              />
              {"Ronin Stash"}
            </div>
          </Button>
        </>
      )}
    </>
  );
};
