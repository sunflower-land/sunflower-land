import React, { useContext, useEffect } from "react";
import { useActor } from "@xstate/react";

import * as Auth from "features/auth/lib/Provider";

import { Web3Missing } from "./components/Web3Missing";
import { WrongChain } from "./components/WrongChain";
import { Beta } from "./components/Beta";
import { RejectedSignTransaction } from "./components/RejectedSignTransaction";
import { ConnectingError } from "./components/ConnectingError";
import { Blocked } from "./components/Blocked";
import { DuplicateUser } from "./components/DuplicateUser";
import { Congestion } from "./components/Congestion";
import { SessionExpired } from "./components/SessionExpired";
import { ErrorCode, ERRORS } from "lib/errors";
import { TooManyRequests } from "./components/TooManyRequests";
import { Maintenance } from "./components/Maintenance";
import { MultipleDevices } from "./components/MultipleDevices";

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

  console.log({ errorCode });
  if (errorCode === ERRORS.NO_WEB3) {
    return <Web3Missing />;
  }

  if (errorCode === ERRORS.WRONG_CHAIN) {
    return <WrongChain />;
  }

  if (errorCode === ERRORS.REJECTED_TRANSACTION) {
    return <RejectedSignTransaction onTryAgain={() => send("REFRESH")} />;
  }

  if (errorCode === ERRORS.NO_FARM) {
    return <Beta />;
  }

  if (errorCode === ERRORS.BLOCKED) {
    return <Blocked />;
  }

  if (errorCode === ERRORS.DISCORD_USER_EXISTS) {
    return <DuplicateUser />;
  }

  if (errorCode === ERRORS.NETWORK_CONGESTED) {
    return <Congestion />;
  }

  if (errorCode === ERRORS.SESSION_EXPIRED) {
    return <SessionExpired />;
  }

  if (errorCode === ERRORS.TOO_MANY_REQUESTS) {
    return <TooManyRequests />;
  }

  if (errorCode === ERRORS.MAINTENANCE) {
    return <Maintenance />;
  }

  if (errorCode === ERRORS.MULTIPLE_DEVICES_OPEN) {
    return <MultipleDevices />;
  }

  return <ConnectingError />;
};
