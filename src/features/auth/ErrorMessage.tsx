import React, { useContext, useEffect } from "react";
import { useActor } from "@xstate/react";

import * as Auth from "features/auth/lib/Provider";

import { Web3Missing } from "./components/Web3Missing";
import { WrongChain } from "./components/WrongChain";
import { Beta } from "./components/Beta";
import { RejectedSignTransaction } from "./components/RejectedSignTransaction";
import { RejectedSyncOnChainTransaction } from "./components/RejectedSyncOnChainTransaction";
import { ConnectingError } from "./components/ConnectingError";
import { Blocked } from "./components/Blocked";
import { DuplicateUser } from "./components/DuplicateUser";
import { Congestion } from "./components/Congestion";
import { SessionExpired } from "./components/SessionExpired";
import { ErrorCode } from "lib/errors";


interface Props {
  errorCode: ErrorCode;
}
export const ErrorMessage: React.FC<Props> = ({ errorCode }) => {
  const { authService } = useContext(Auth.Context);
  const [_, send] = useActor(authService);

  useEffect(() => {
    const body = document.querySelector("body");

    if (body) {
      body.style.pointerEvents = "none";
    }

    return () => {
      if (body) {
        body.style.pointerEvents = "initial";
      }
    };
  }, []);

  if (errorCode === "NO_WEB3") {
    return <Web3Missing />;
  }

  if (errorCode === "WRONG_CHAIN") {
    return <WrongChain />;
  }

  if (errorCode === "REJECTED_SIGN_TRANSACTION") {
    return <RejectedSignTransaction onTryAgain={() => send("REFRESH")} />;
  }

  if (errorCode === "REJECTED_SYNC_TRANSACTION") {
    return <RejectedSyncOnChainTransaction onTryAgain={() => send("REFRESH")} />;
  }

  if (errorCode === "NO_FARM") {
    return <Beta />;
  }

  if (errorCode === "BLOCKED") {
    return <Blocked />;
  }

  if (errorCode === "DISCORD_USER_EXISTS") {
    return <DuplicateUser />;
  }

  if (errorCode === "NETWORK_CONGESTED") {
    return <Congestion />;
  }

  if (errorCode === "SESSION_EXPIRED") {
    return <SessionExpired />;
  }

  return <ConnectingError />;
};
