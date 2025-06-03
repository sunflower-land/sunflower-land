import { Button } from "components/ui/Button";
import metamaskIcon from "assets/icons/metamask_pixel.png";
import { Connector, CreateConnectorFn } from "wagmi";
import { metaMaskConnector } from "features/wallet/WalletProvider";

export const MetaMaskButton = ({
  onConnect,
}: {
  onConnect: (connector: Connector | CreateConnectorFn) => void;
}) => {
  return (
    <Button
      className="mb-1 py-2 text-sm relative justify-start"
      onClick={() => onConnect(metaMaskConnector)}
    >
      <div className="px-8 mr-2 flex">
        <img
          src={metamaskIcon}
          className="h-7 ml-2.5 mr-6 absolute left-0 top-1"
        />
        {"Metamask"}
      </div>
    </Button>
  );
};
