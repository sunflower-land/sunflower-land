import React from "react";
import { Button } from "components/ui/Button";

import alert from "assets/icons/expression_alerted.png";

interface Props {
  onTryAgain: () => void;
}

export const RejectedSignTransaction: React.FC<Props> = ({ onTryAgain }) => {
  return (
    <div className="flex flex-col text-center text-shadow items-center p-1">
      <div className="flex mb-3 items-center">
        <img src={alert} alt="Warning" className="w-3 mr-3" />
      </div>
      <p className="text-center mb-3">Transaction Rejected!</p>

      <p className="text-center mb-4 text-xs">
        {`You need to accept the transaction in the metamask popup to continue`}{" "}
        <a
          className="underline"
          href="https://docs.sunflower-land.com/support/terms-of-service"
        >
          Terms of Service
        </a>
        .
      </p>
      <p className="text-center mb-4 text-xs">
        This request will not trigger a blockchain transaction or cost any gas
        fees.
      </p>
      <Button onClick={onTryAgain} className="overflow-hidden mb-2">
        <span>Try Again</span>
      </Button>
    </div>
  );
};
