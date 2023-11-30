import React, { useContext, useState } from "react";
import { Button } from "components/ui/Button";
import * as AuthProvider from "features/auth/lib/Provider";
import { portal } from "../community/actions/portal";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { wallet } from "lib/blockchain/wallet";

const PORTAL_IDS = ["infected"];

export const Portals: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);
  const [loading, setLoading] = useState(false);

  const travel = async (portalId: string) => {
    setLoading(true);

    const { token } = await portal({
      portalId,
      token: authState.context.user.rawToken as string,
      farmId: gameState.context.farmId,
      address: wallet.myAccount as string,
    });

    // Change route
    window.location.href = `https://${portalId}.sunflower-land.com?jwt=${token}`;
  };

  if (loading) {
    return <span className="loading">Loading</span>;
  }

  return (
    <>
      {PORTAL_IDS.map((id) => (
        <Button key={id} onClick={() => travel(id)}>
          {id}
        </Button>
      ))}
    </>
  );
};
