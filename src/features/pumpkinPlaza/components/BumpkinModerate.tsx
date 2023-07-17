import { Button } from "components/ui/Button";
import React, { useContext, useState } from "react";
import { kickPlayer } from "../actions/kickPlayer";
import * as AuthProvider from "features/auth/lib/Provider";
import { useActor } from "@xstate/react";

interface Props {
  accountId: number;
}
export const BumpkinModerate: React.FC<Props> = ({ accountId }) => {
  const { authService } = useContext(AuthProvider.Context);
  const authState = useActor(authService)[0];

  const [kicked, setKicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const kick = async () => {
    setIsLoading(true);

    await kickPlayer({
      token: authState.context.user.rawToken as string,
      farmId: accountId,
    });

    setKicked(true);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="p-2">
        <p className="text-xs loading">Loading</p>
      </div>
    );
  }

  if (kicked) {
    return (
      <div className="p-2">
        <p className="text-xs">Player has been removed</p>
      </div>
    );
  }

  return (
    <div>
      <div className="p-2">
        <p className="text-xs">
          Kicking a player will remove them from the Plaza for the remainder of
          the session
        </p>
      </div>
      <Button onClick={kick}>Kick Player</Button>
    </div>
  );
};
