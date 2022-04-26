import React, { useContext } from "react";

import * as AuthProvider from "features/auth/lib/Provider";
import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { ErrorMessage } from "../ErrorMessage";
import { ErrorCode } from "lib/errors";
import alert from "assets/icons/expression_alerted.png";

export const Airdrop: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState, send] = useActor(authService);

  const farmId = authState.context.farmId;

  if (authState.matches({ airdropping: "idle" })) {
    return (
      <div className="p-2">
        <span>{`Airdrop to #${farmId}`}</span>

        <p className="text-sm py-2">
          If you played Sunflower Farmers before January 9th, you may be
          eligible to send resources from an account into your existing farm.
        </p>

        <p className="underline">
          To receive an airdrop, keep this screen open and swap to your Metamask
          account that you wish to migrate.
        </p>
      </div>
    );
  }

  if (authState.matches({ airdropping: "confirmation" })) {
    return (
      <div>
        <span>{`Progress from this account will be airdropped to farm #${farmId}`}</span>

        <Button onClick={() => send("CONFIRM")}>Sign & Airdrop</Button>
      </div>
    );
  }

  if (authState.matches({ airdropping: "signing" })) {
    return <span className="loading">Airdropping</span>;
  }

  if (authState.matches({ airdropping: "checking" })) {
    return <span className="loading">Looking for farm</span>;
  }

  if (authState.matches({ airdropping: "duplicate" })) {
    return (
      <div className="flex items-center border-2 rounded-md border-black p-2 mt-2 mb-2 bg-[#e43b44]">
        <img src={alert} alt="alert" className="mr-2 w-5 h-5/6" />
        <span className="text-xs">ALREADY AIRDROPPED</span>
      </div>
    );
  }

  if (authState.matches({ airdropping: "noFarm" })) {
    return (
      <div className="flex items-center border-2 rounded-md border-black p-2 mt-2 mb-2 bg-[#e43b44]">
        <img src={alert} alt="alert" className="mr-2 w-5 h-5/6" />
        <span className="text-xs">NO SFF TOKENS OR FARM FOUND ON ACCOUNT</span>
      </div>
    );
  }

  if (authState.matches({ airdropping: "success" })) {
    return (
      <>
        <span>Succesfully airdropped!</span>
        <div className="flex items-center border-2 rounded-md border-black p-2 mt-2 mb-2 bg-[#e43b44]">
          <img src={alert} alt="alert" className="mr-2 w-5 h-5/6" />
          <span className="text-xs">
            YOU MUST SYNC YOUR FARM #{farmId} TO THE BLOCKCHAIN BEFORE MAY 4TH
            TO APPLY THE AIRDROP
          </span>
        </div>
      </>
    );
  }

  return <ErrorMessage errorCode={authState.context.errorCode as ErrorCode} />;
};
