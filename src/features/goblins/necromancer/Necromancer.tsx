import { useActor } from "@xstate/react";
import { Context } from "features/game/GoblinProvider";
import { metamask } from "lib/blockchain/metamask";
import React, { useContext, useEffect, useState } from "react";
import * as AuthProvider from "features/auth/lib/Provider";

// TODO
import npc from "assets/npcs/idle.gif";
import bumpkin from "assets/npcs/necromancer_preview.png";
import jackOLantern from "assets/nfts/jack-o-lantern.png";
import victoriaSisters from "assets/nfts/victoria-sisters.gif";
import background from "assets/bumpkins/layer/background/cemetery.png";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Panel } from "components/ui/Panel";
import { Modal } from "react-bootstrap";
import { Button } from "components/ui/Button";
import { secondsToString } from "lib/utils/time";
import Decimal from "decimal.js-light";
import { reset } from "features/farming/hud/actions/reset";
import classNames from "classnames";

const END_DATE = new Date("2022-11-03T00:00:00");
const REQUIRED_PUMPKINS = 150;

export const Necromancer: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);

  const [state, setState] = useState<
    "noCats" | "ready" | "minting" | "minted" | "error"
  >("noCats");

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      const hasMinted = await metamask
        .getHalloween()
        .hasMinted(authState.context.farmId as number);

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

    if (goblinState.matches("playing")) {
      load();
    }
  }, []);

  console.log({ state });
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

      await new Promise((res) => setTimeout(res, 10 * 1000));
      await reset({
        farmId: authState.context.farmId as number,
        token: authState.context.rawToken as string,
        fingerprint: "0x",
      });

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
      const pumpkinCount =
        goblinState.context.state.inventory["Jack-o-lantern"] || new Decimal(0);
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
          <div className="flex items-center mb-2">
            <img src={jackOLantern} className="h-8 mr-2" />
            <span
              className={classNames("text-sm", {
                ["text-red-500"]: pumpkinCount.lt(REQUIRED_PUMPKINS),
              })}
            >
              {`${pumpkinCount.toString()}/${REQUIRED_PUMPKINS}`}
            </span>
          </div>
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
        <img
          className="absolute w-1/2 -left-2 top-[-40%] -z-10"
          src={bumpkin}
        />
        <Panel>{ModalContent()}</Panel>
      </Modal>
      <img
        src={victoriaSisters}
        className="absolute pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 26}px`,
          bottom: `${GRID_WIDTH_PX * 0.7}px`,
          left: `${GRID_WIDTH_PX * 12}px`,
        }}
      />
      <img
        src={npc}
        className="absolute cursor-pointer hover:img-highlight z-10"
        style={{
          width: `${PIXEL_SCALE * 13}px`,
          bottom: `${GRID_WIDTH_PX * 0}px`,
          left: `${GRID_WIDTH_PX * 12}px`,
        }}
        onClick={() => setShowModal(true)}
      />
    </>
  );
};
