import React, { useContext, useEffect } from "react";
import { useActor } from "@xstate/react";

import * as Auth from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";

import questionMark from "assets/icons/expression_confused.png";

import { Web3Missing } from "./components/Web3Missing";
import { WrongChain } from "./components/WrongChain";
import { Beta } from "./components/Beta";
import { GameError } from "features/game/components/GameError";

interface Props {}

export const Unauthorised: React.FC<Props> = () => {
  const { authService } = useContext(Auth.Context);
  const [authState, send] = useActor(authService);

  if (authState.context.errorCode === "NO_WEB3") {
    return <Web3Missing />;
  }

  if (authState.context.errorCode === "WRONG_CHAIN") {
    return <WrongChain />;
  }

  if (authState.context.errorCode === "NO_FARM") {
    return <Beta />;
  }

  return <GameError />;
};
