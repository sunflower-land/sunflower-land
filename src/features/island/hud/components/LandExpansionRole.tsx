import React, { useContext, useState } from "react";

import { redirectOAuth } from "features/auth/actions/oauth";
import * as Auth from "features/auth/lib/Provider";

import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { addVipRole as addDiscordRole } from "features/game/actions/discordRole";
import { Context } from "features/game/GameProvider";

export const LandExpansionRole: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [state, setState] = useState<
    "idle" | "noDiscord" | "joining" | "joined" | "error"
  >("idle");

  const inventory = gameState.context.state.inventory;
  const oauth = () => {
    redirectOAuth();
  };

  const addRole = async () => {
    if (!authState.context.token?.discordId) {
      setState("noDiscord");
      return;
    }

    setState("joining");

    try {
      await addDiscordRole({
        farmId: authState.context.farmId as number,
        token: authState.context.rawToken as string,
        role: "land expansion",
      });
      setState("joined");
    } catch (e) {
      console.error(e);
      setState("error");
    }
  };

  if (state === "error") {
    return <span className="text-shadow">Error!</span>;
  }

  if (state === "joining") {
    return <span className="text-shadow loading">Joining</span>;
  }

  if (state === "joined") {
    return (
      <>
        <span className="text-shadow mt-2 block text-center">
          Congratulations!
        </span>
        <span className="text-shadow my-2 block text-center">
          You now have access. Go check out the channel in Discord
        </span>
      </>
    );
  }

  if (state === "noDiscord") {
    return (
      <>
        <span className="text-shadow my-2 block text-sm">
          You must be connected to Discord to join a restricted channel.
        </span>
        <Button onClick={oauth}>Connect</Button>
      </>
    );
  }

  return (
    <span className="text-shadow my-2 block text-sm">
      Get access to the land expansion Beta group
      <Button className="text-xs h-8 w-20" onClick={() => addRole()}>
        Join
      </Button>
    </span>
  );
};
