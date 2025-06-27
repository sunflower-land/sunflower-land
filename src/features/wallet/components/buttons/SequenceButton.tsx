import React from "react";

import { Button } from "components/ui/Button";
import { SEQUENCE_ICON } from "features/wallet/lib/getWalletIcon";
import { sequenceConnector } from "features/wallet/WalletProvider";
import { Connector, CreateConnectorFn } from "wagmi";

export const SequenceButton = ({
  onConnect,
}: {
  onConnect: (connector: Connector | CreateConnectorFn) => void;
}) => {
  return (
    <Button
      className="mb-1 py-2 text-sm relative"
      onClick={() => {
        onConnect(sequenceConnector);
      }}
    >
      <div className="px-8">
        <img
          src={SEQUENCE_ICON}
          className="w-7 h-7 mobile:w-6 mobile:h-6  ml-2 mr-6 absolute left-0 top-1"
        />
        {`Sequence`}
      </div>
    </Button>
  );
};
