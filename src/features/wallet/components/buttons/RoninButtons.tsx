import { SUNNYSIDE } from "assets/sunnyside";

import { Button } from "components/ui/Button";
import {
  walletConnectConnector,
  waypointConnector,
} from "features/wallet/WalletProvider";
import { useIsPWA } from "lib/utils/hooks/useIsPWA";
import { Connector, CreateConnectorFn, useConnect } from "wagmi";

export const RoninButtons: React.FC<{
  onConnect: (connector: Connector | CreateConnectorFn) => void;
}> = ({ onConnect }) => {
  const { connectors } = useConnect();
  const isPWA = useIsPWA();

  const eip6963Connectors = connectors
    .filter((connector) => connector.type === "injected" && !!connector.icon)
    .filter((connector) => connector.name === "Ronin Wallet");

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
          <Button
            className="mb-1 py-2 text-sm relative"
            onClick={() => onConnect(waypointConnector)}
          >
            <div className="px-8">
              <img
                src={SUNNYSIDE.icons.roninIcon}
                className="h-7 ml-2.5 mr-6 absolute left-0 top-1"
              />
              {"Ronin Waypoint"}
            </div>
          </Button>
        </>
      )}
    </>
  );
};
