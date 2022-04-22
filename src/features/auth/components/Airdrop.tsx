import React, { useContext } from "react";

import * as AuthProvider from "features/auth/lib/Provider";
import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { ErrorMessage } from "../ErrorMessage";
import { ErrorCode } from "lib/errors";

export const Airdrop: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState, send] = useActor(authService);

  const farmId = authState.context.farmId;

  if (authState.matches({ airdropping: "idle" })) {
    return (
      <div>
        <span>{`Airdrop to #${farmId}`}</span>

        <span>
          If you played Sunflower Farmers before January 9th, you may be elible
          to send resources from an account into your existing farm.
        </span>

        <span>Swap your wallet to the address</span>
      </div>
    );
  }

  if (authState.matches({ airdropping: "confirmation" })) {
    return (
      <div>
        <span>{`The airdrop will be sent to farm #${farmId}`}</span>

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
    return <span>Already migrated!</span>;
  }

  if (authState.matches({ airdropping: "noFarm" })) {
    return (
      <div>
        <span>No farm tokens or farm found from Sunflower Farmers</span>
        <span>Did you own assets from V1?</span>
      </div>
    );
  }

  if (authState.matches({ airdropping: "success" })) {
    return (
      <>
        <span>Succesfully airdropped!</span>
        <span>
          Refresh your page and sync your farm before trying to airdrop another
          address
        </span>
      </>
    );
  }

  return <ErrorMessage errorCode={authState.context.errorCode as ErrorCode} />;
};
