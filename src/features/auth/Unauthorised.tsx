import React, { useContext, useEffect } from "react";
import { useActor } from "@xstate/react";

import * as Auth from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";

import questionMark from "assets/icons/expression_confused.png";

import { Web3Missing } from "./components/Web3Missing";
import { WrongChain } from "./components/WrongChain";
import { Beta } from "./components/Beta";

interface Props {}

export const Unauthorised: React.FC<Props> = () => {
  const { authService } = useContext(Auth.Context);
  const [authState, send] = useActor(authService);

  if (authState.context.errorCode === "NO_WEB3") {
    return (
      <Panel>
        {/* Instructions on how to sort out metamask */}
        <Web3Missing />
      </Panel>
    );
  }

  if (authState.context.errorCode === "WRONG_CHAIN") {
    return (
      <Panel>
        <WrongChain />
      </Panel>
    );
  }

  if (authState.context.errorCode === "NO_FARM") {
    return <Beta />;
  }

  return (
    <Panel className="text-shadow">
      Catch all other connecting errors :/
      {/* <div className="flex flex-col justify-center items-center">
        <div className="w-56">
          <Button onClick={onGetStarted}>Get Started</Button>
          <Button
            onClick={() => window.open("https://docs.sunflower-farmers.com/")}
            className="mt-2"
          >
            About
            <img className="h-4 ml-2" src={questionMark} />
          </Button>
        </div>
      </div> */}
    </Panel>
  );
};
