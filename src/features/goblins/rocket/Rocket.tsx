import React, { useEffect, useState, useContext } from "react";
import { useActor, useMachine } from "@xstate/react";
import { Panel } from "components/ui/Panel";
import { Modal } from "react-bootstrap";
import { Button } from "components/ui/Button";

import { Minting } from "features/game/components/Minting";
import { ErrorMessage } from "features/auth/ErrorMessage";
import * as AuthProvider from "features/auth/lib/Provider";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Context } from "features/game/GoblinProvider";

import fixedRocket from "assets/mom/mom_fixed_rocket.png";
import launchingRocket from "assets/mom/mom_launching_rocket.gif";
import brokenRocket from "assets/mom/mom_broken_rocket.gif";
import burnMark from "assets/mom/mom_burnt_ground.png";
import close from "assets/icons/close.png";
import observatory from "assets/nfts/mom/observatory.gif";
import { melonDuskAudio } from "lib/utils/sfx";
import momNpc from "assets/mom/mom_npc.gif";

import { ErrorCode } from "lib/errors";

import { createRocketMachine } from "./lib/rocketMachine";
import { EngineCore } from "./components/EngineCore";
import { Launchpad } from "./components/Launchpad";

const ROCKET_LAUNCH_TO_DIALOG_TIMEOUT = 4000;

export const Rocket: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);
  const { goblinService } = useContext(Context);
  const [
    {
      context: { state, sessionId },
    },
  ] = useActor(goblinService);

  const [rocketState, send] = useMachine(
    createRocketMachine({
      inventory: state.inventory,
      id: authState.context.farmId as number,
      sessionId: sessionId as string,
      token: authState.context.rawToken as string,
    })
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEngineCoreModalOpen, setIsEngineCoreModalOpen] = useState(false);

  useEffect(() => {
    if (rocketState.matches("launching")) {
      melonDuskAudio.stop();

      setTimeout(() => {
        setIsDialogOpen(true);
        send("START_MISSION");

        melonDuskAudio.play();
      }, ROCKET_LAUNCH_TO_DIALOG_TIMEOUT);
    }
  }, [rocketState]);

  const handleLaunchRocket = () => {
    setIsDialogOpen(false);
    send("LAUNCH");
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);

    if (!melonDuskAudio.playing()) {
      melonDuskAudio.play();
    }
  };

  const handleFixRocket = () => {
    setIsDialogOpen(false);
    setIsEngineCoreModalOpen(true);
  };

  const handleCloseDialog = () => {
    melonDuskAudio.stop();
    setIsDialogOpen(false);
    setIsEngineCoreModalOpen(false);
  };

  const handleMintObservatory = async () => {
    send("REWARD");
  };

  const handleCraftEngineCore = () => {
    send("REPAIR");
    handleCloseDialog();
  };

  let rocketImage = burnMark;

  if (rocketState.matches("crashed")) {
    rocketImage = brokenRocket;
  }

  if (rocketState.matches("repaired")) {
    rocketImage = fixedRocket;
  }

  const content = () => {
    if (rocketState.matches("rewarded")) {
      return (
        <span className="text-shadow block my-2 text-xs sm:text-sm">
          Enjoy your new observatory captain! Go back to your farm and sync on
          chain to start using it.
        </span>
      );
    }

    if (rocketState.matches("completed")) {
      return (
        <>
          <span className="text-shadow block my-2 text-xs sm:text-sm">
            Great job on Mars Interplanetary Farmer! In exchange for your token
            received on Mars, I will give you something to remember me by. After
            this trade, go back to your farm and sync on chain to see it.t.
          </span>
          <img className="mx-auto mb-2" src={observatory} alt="Observatory" />
          <Button className="text-sm" onClick={handleMintObservatory}>
            Mint Now
          </Button>
        </>
      );
    }

    if (rocketState.matches("launched")) {
      return (
        <>
          <span className="text-shadow block my-4">
            When you complete your mission on Mars, come back and talk with me.
          </span>
          <p className="text-xs sm:text-sm text-shadow text-white p-1 mb-2">
            {/* TODO - Add MoM href link */}
            <a
              className="underline"
              href="https://milliononmars.io/sunflower"
              target="_blank"
              rel="noopener noreferrer"
            >
              Click here to continue your mission
            </a>
          </p>
        </>
      );
    }

    if (rocketState.matches("repaired")) {
      return (
        <>
          <span className="text-shadow block my-4">
            Rocket is ready to launch, whenever you&apos;re ready captain!
          </span>
          <Button className="text-sm" onClick={handleLaunchRocket}>
            Launch Rocket
          </Button>
        </>
      );
    }

    return (
      <>
        <span className="text-shadow mr-4 my-3 block">
          Help! My rocket has crash landed and needs repairs. Can you help me
          fix it?
        </span>
        <Button className="text-sm" onClick={handleFixRocket}>
          Fix rocket
        </Button>
      </>
    );
  };

  return (
    <>
      <div
        className="absolute"
        style={{
          width: `${GRID_WIDTH_PX * 5}px`,
          right: `${GRID_WIDTH_PX * 18}px`,
          top: `${GRID_WIDTH_PX * 15}px`,
        }}
        onClick={handleOpenDialog}
      >
        <div className="absolute cursor-pointer hover:img-highlight w-full">
          <img
            src={momNpc}
            style={{
              position: "absolute",
              width: `${GRID_WIDTH_PX * 1.2}px`,
              top: `${GRID_WIDTH_PX * 3.3}px`,
              right: `${GRID_WIDTH_PX * 3.92}px`,
              zIndex: 2,
            }}
          />
          <img src={rocketImage} className="w-56 relative z-10" />
          {rocketState.matches("repaired") && <Launchpad />}
        </div>
      </div>

      {rocketState.matches("launching") && (
        <img
          src={launchingRocket}
          className="absolute launching"
          style={{
            width: `${GRID_WIDTH_PX * 5}px`,
            top: `${GRID_WIDTH_PX * 14}px`,
            left: `${GRID_WIDTH_PX * 2}px`,
            zIndex: 100,
          }}
        />
      )}

      <Modal
        centered
        show={
          rocketState.matches("rewarding") || rocketState.matches("repairing")
        }
        onHide={handleCloseDialog}
      >
        <Panel className="text-shadow">
          <Minting />
        </Panel>
      </Modal>

      <Modal
        centered
        show={rocketState.matches("error")}
        onHide={handleCloseDialog}
      >
        <Panel className="text-shadow">
          <ErrorMessage
            errorCode={rocketState.context.errorCode as ErrorCode}
          />
        </Panel>
      </Modal>

      <Modal centered show={isDialogOpen} onHide={handleCloseDialog}>
        <Panel>
          <img
            src={close}
            className="h-6 top-4 right-4 absolute cursor-pointer"
            onClick={handleCloseDialog}
          />
          <div className="flex items-start">
            <img src={momNpc} className="w-16 img-highlight mr-2" />
            <div className="flex-1">
              <span className="text-shadow block">Melon Dusk</span>
              {content()}
            </div>
          </div>
        </Panel>
      </Modal>

      <Modal centered show={isEngineCoreModalOpen} onHide={handleCloseDialog}>
        <EngineCore
          onCraft={handleCraftEngineCore}
          inventory={state.inventory}
        />
      </Modal>
    </>
  );
};
