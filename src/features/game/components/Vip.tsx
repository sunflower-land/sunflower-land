import React, { useContext, useState } from "react";

import doorway from "assets/decorations/doorway.png";
import closeIcon from "assets/icons/close.png";

import { redirectOAuth } from "features/auth/actions/oauth";
import * as Auth from "features/auth/lib/Provider";

import { Inventory, InventoryItemName } from "../types/game";
import { GRID_WIDTH_PX } from "../lib/constants";
import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { addVipRole } from "../actions/vip";

interface Props {
  inventory: Inventory;
}

const VIP_ITEMS: InventoryItemName[] = [
  "Foreman Beaver",
  "Kuebiko",
  "Nugget",
  "Golden Cauliflower",
];
export const VipArea: React.FC<Props> = ({ inventory }) => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);

  const [state, setState] = useState<
    "idle" | "noAccess" | "noDiscord" | "welcome" | "joining" | "joined"
  >("idle");

  const oauth = () => {
    redirectOAuth();
  };

  const open = () => {
    const hasAccess = (Object.keys(inventory) as InventoryItemName[]).some(
      (name) => VIP_ITEMS.includes(name)
    );

    if (!hasAccess) {
      setState("noAccess");
      return;
    }

    if (!authState.context.token?.discordId) {
      setState("noDiscord");
      return;
    }

    setState("welcome");
  };

  const close = () => {
    setState("idle");
  };

  const joinVIP = async () => {
    setState("joining");

    await addVipRole({
      farmId: authState.context.farmId as number,
      token: authState.context.rawToken as string,
    });

    setState("joined");
  };

  const Content = () => {
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
            You now have VIP access. Go check out the VIP room in Discord
          </span>
        </>
      );
    }

    if (state === "noAccess") {
      return (
        <span className="text-shadow my-2 block text-center">
          VIP members only!
        </span>
      );
    }

    if (state === "noDiscord") {
      return (
        <>
          <span className="text-shadow my-2 block text-center">
            You must be connected to Discord to access the VIP area.
          </span>
          <Button onClick={oauth}>Connect</Button>
        </>
      );
    }

    if (state === "welcome") {
      return (
        <>
          <span className="text-shadow my-2 block text-center">
            It looks like you are a special player. Come join our VIP chat on
            Discord
          </span>
          <Button onClick={joinVIP}>Add VIP role</Button>
        </>
      );
    }

    return null;
  };

  const showModal = state !== "idle";

  return (
    <>
      <img
        src={doorway}
        className="absolute hover:img-highlight cursor-pointer"
        style={{
          top: `${GRID_WIDTH_PX * 2.1}px`,
          left: `${GRID_WIDTH_PX * 20}px`,
          width: `${GRID_WIDTH_PX * 2}px`,
        }}
        onClick={open}
      />
      <Modal centered show={showModal} onHide={close}>
        <Panel>
          <img
            src={closeIcon}
            className="h-6 top-4 right-4 absolute cursor-pointer"
            onClick={close}
          />
          <div className="flex flex-col items-center justify-center">
            {Content()}
          </div>
        </Panel>
      </Modal>
    </>
  );
};
