import React from "react";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  onTryAgain: () => void;
}

export const RejectedSignTransaction: React.FC<Props> = ({ onTryAgain }) => {
  return (
    <>
      <div className="flex flex-col text-shadow items-center p-2">
        <div className="flex mb-3 items-center">
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            alt="Warning"
            className="w-3 mr-3"
          />
        </div>
        <p className="mb-3 text-center">Transaction Rejected!</p>

        <p className="mb-4 text-xs">
          {`You need to accept the transaction in the metamask popup to continue`}{" "}
          <a
            className="underline"
            href="https://docs.sunflower-land.com/support/terms-of-service"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </a>
          .
        </p>
        <p className="mb-4 text-xs">
          This request will not trigger a blockchain transaction or cost any gas
          fees.
        </p>
      </div>
      <Button onClick={onTryAgain}>Try Again</Button>
    </>
  );
};
