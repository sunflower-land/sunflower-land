import { useActor } from "@xstate/react";
import { Context } from "features/game/GoblinProvider";
import { metamask } from "lib/blockchain/metamask";
import React, { useContext, useEffect, useState } from "react";
import * as AuthProvider from "features/auth/lib/Provider";

// TODO
import npc from "assets/npcs/idle.gif";
import background from "assets/bumpkins/layer/background/cemetery.png";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Panel } from "components/ui/Panel";
import { Modal } from "react-bootstrap";
import { Button } from "components/ui/Button";
import { secondsToString } from "lib/utils/time";
import Decimal from "decimal.js-light";

const END_DATE = new Date("2022-11-03T00:00:00");
const REQUIRED_PUMPKINS = 0;

export const Necromancer: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);

  const [state, setState] = useState<
    "noCats" | "ready" | "minting" | "minted" | "error"
  >("noCats");

  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    const load = async () => {
      const hasMinted = await metamask
        .getHalloween()
        .hasMinted(authState.context.farmId as number);

      console.log({ hasMinted });
      if (hasMinted) {
        setState("minted");
        return;
      }

      if (!goblinState.context.state.inventory["Victoria Sisters"]) {
        setState("noCats");
      } else {
        setState("ready");
      }
      console.log({ hasMinted });
    };

    load();
  }, [goblinState]);

  if (state === "noCats") {
    return null;
  }

  const timeLeft = END_DATE.getTime() - Date.now();

  if (timeLeft < 0) {
    return null;
  }

  const mint = async () => {
    setState("minting");

    try {
      await metamask.getHalloween().mint(authState.context.farmId as number);

      setState("minted");
    } catch {
      setState("error");
    }
  };
  const ModalContent = () => {
    if (state === "minting") {
      return <span className="loading">Minting</span>;
    }

    if (state === "error") {
      return <span>Something went wrong</span>;
    }
    if (state === "ready") {
      return (
        <div className="flex flex-col items-center">
          <p className="text-center text-sm mb-2">Thanks for summoning me!</p>
          <img src={background} className="w-1/2 m-auto mb-2 rounded-md" />
          <p className="text-center text-sm">
            Do you want to trade 150 Jack-o-lanterns for this rare Bumpkin
            Cemetery Background?
          </p>
          <span className="bg-blue-600 border my-2 text-xxs p-1 rounded-md">
            {`${secondsToString(timeLeft / 1000)} left`}
          </span>
          <Button
            onClick={mint}
            disabled={(
              goblinState.context.state.inventory["Jack-o-lantern"] ||
              new Decimal(0)
            ).lt(REQUIRED_PUMPKINS)}
          >
            Craft
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center">
        <p className="text-center text-sm mb-2">Enjoy your Background!</p>
        <img src={background} className="w-1/2 m-auto mb-2 rounded-md" />
        <p className="text-center text-sm">
          This has been sent to your wallet.You can now equip it to your
          Bumpkin.
        </p>
        <a
          href={`https://bumpkins.io/#/my-bumpkin`}
          className="underline text-xs hover:text-blue-500 mt-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          Bumpkins.io
        </a>
      </div>
    );
  };

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Panel>{ModalContent()}</Panel>
      </Modal>
      <img
        src={npc}
        className="absolute cursor-pointer hover:img-highlight"
        style={{
          width: `${PIXEL_SCALE * 13}px`,
          bottom: `${GRID_WIDTH_PX * 0}px`,
          left: `${GRID_WIDTH_PX * 12}px`,
        }}
        onClick={setShowModal(true)}
      />
    </>
  );
};
