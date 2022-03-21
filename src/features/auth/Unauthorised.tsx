import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import * as Auth from "features/auth/lib/Provider";

import { Web3Missing } from "./components/Web3Missing";
import { WrongChain } from "./components/WrongChain";
import { Beta } from "./components/Beta";
import { RejectedSignTransaction } from "./components/RejectedSignTransaction";
import { ConnectingError } from "./components/ConnectingError";
import { Blocked } from "./components/Blocked";

export const Unauthorised: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const [authState, send] = useActor(authService);

  if (authState.context.errorCode === "NO_WEB3") {
    return <Web3Missing />;
  }

  if (authState.context.errorCode === "WRONG_CHAIN") {
    return <WrongChain />;
  }

  if (authState.context.errorCode === "REJECTED_TRANSACTION") {
    return <RejectedSignTransaction onTryAgain={() => send("REFRESH")} />;
  }

  if (authState.context.errorCode === "NO_FARM") {
    return <Beta />;
  }

  if (authState.context.errorCode === "BLOCKED") {
    return <Blocked />;
  }

  return <ConnectingError />;
};
