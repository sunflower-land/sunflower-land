import React, { useContext } from "react";

import { ERRORS, ErrorCode } from "lib/errors";
import { Web3Missing } from "../../auth/components/Web3Missing";
import { MultipleWallets } from "../../auth/components/MultipleWallets";
import { RejectedSignTransaction } from "../../auth/components/RejectedSignTransaction";
import { BoundaryError } from "../../auth/components/SomethingWentWrong";
import { WalletContext } from "../WalletProvider";
import { Web3Rejected } from "./Web3Rejected";

interface Props {
  errorCode: ErrorCode;
  onRefresh: () => void;
}

export const WalletErrorMessage: React.FC<Props> = ({
  errorCode,
  onRefresh,
}) => {
  const { walletService } = useContext(WalletContext);

  const onAcknowledge = () => {
    walletService.send("CONTINUE");
  };

  if (errorCode === ERRORS.NO_WEB3_PHANTOM) {
    return <Web3Missing wallet="PHANTOM" />;
  }

  if (errorCode === ERRORS.NO_WEB3_CRYPTO_COM) {
    return <Web3Missing wallet="CRYPTO_COM" />;
  }

  if (errorCode === ERRORS.NO_WEB3_BITGET) {
    return <Web3Missing wallet="BITGET" />;
  }

  if (errorCode === ERRORS.NO_WEB3) {
    return <Web3Missing />;
  }

  if (errorCode === ERRORS.WEB3_REJECTED) {
    return <Web3Rejected />;
  }

  if (errorCode === ERRORS.WALLET_INITIALISATION_FAILED) {
    return <MultipleWallets />;
  }

  if (errorCode === ERRORS.REJECTED_TRANSACTION) {
    return <RejectedSignTransaction onTryAgain={onRefresh} />;
  }

  return <BoundaryError error={errorCode} onAcknowledge={onAcknowledge} />;
};
