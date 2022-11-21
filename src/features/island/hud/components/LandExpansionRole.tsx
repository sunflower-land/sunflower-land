import React, { useContext, useState } from "react";

import { redirectOAuth } from "features/auth/actions/oauth";
import * as Auth from "features/auth/lib/Provider";

import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { addVipRole as addDiscordRole } from "features/game/actions/discordRole";
import { Context } from "features/game/GameProvider";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LandExpansionRole: React.FC<Props> = ({ isOpen, onClose }) => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [state, setState] = useState<
    "idle" | "noDiscord" | "joining" | "joined" | "error"
  >("idle");

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

  const Content = () => {
    if (state === "error") {
      return <span>Error!</span>;
    }

    if (state === "joining") {
      return <span className="loading">Joining</span>;
    }

    if (state === "joined") {
      return (
        <>
          <span className="mt-2 block text-center">Congratulations!</span>
          <span className="my-2 block text-center">
            You now have access. Go check out the channel in Discord
          </span>
        </>
      );
    }

    if (state === "noDiscord") {
      return (
        <>
          <span className="my-2 block text-sm">
            You must be connected to Discord to join a restricted channel.
          </span>
          <Button onClick={oauth}>Connect</Button>
        </>
      );
    }

    return (
      <>
        <span className="my-2 block text-sm">
          Get access to the land expansion Beta group
        </span>
        <Button onClick={() => addRole()}>Join</Button>
      </>
    );
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Panel className="p-0">{Content()}</Panel>
    </Modal>
  );
};
