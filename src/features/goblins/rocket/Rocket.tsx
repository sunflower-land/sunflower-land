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
import burnMark from "assets/mom/mom_burnt_ground.png";
import close from "assets/icons/close.png";
import { melonDuskAudio } from "lib/utils/sfx";
import momNpc from "assets/mom/mom_npc.gif";
import telescope from "assets/nfts/mom/telescope.gif";

import { ErrorCode } from "lib/errors";

import { createRocketMachine } from "./lib/rocketMachine";
import { Telescope } from "./components/Telescope";
import { canEndMomEvent } from "./actions/canEndMomEvent";

const ROCKET_LAUNCH_TO_DIALOG_TIMEOUT = 4000;

export const Rocket: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);
  const { goblinService } = useContext(Context);
  const [{ context }] = useActor(goblinService);
  const { state, sessionId } = context;

  const [rocketState, send] = useMachine(
    createRocketMachine({
      inventory: state.inventory,
      id: authState.context.farmId as number,
      sessionId: sessionId as string,
      token: authState.context.rawToken as string,
    })
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTelescopeModalOpen, setIsTelescopeModalOpen] = useState(false);

  useEffect(() => {
    if (rocketState.matches("launching")) {
      melonDuskAudio.stop();
      // TODO - Add rocket launch sound

      setTimeout(() => {
        setIsDialogOpen(true);
        // TODO - Replace this with "END_EVENT".
        // send("START_MISSION");
      }, ROCKET_LAUNCH_TO_DIALOG_TIMEOUT);
    }
  }, [rocketState]);

  const handleLaunchRocket = () => {
    // TODO - Launch the rocket. Event should end after this.
    setIsDialogOpen(false);
    send("LAUNCH");
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);

    if (!melonDuskAudio.playing()) {
      melonDuskAudio.play();
    }
  };

  const handleCloseDialog = () => {
    melonDuskAudio.stop();
    setIsDialogOpen(false);
    setIsTelescopeModalOpen(false);
  };

  const handleCraftTelescope = () => {
    setIsDialogOpen(false);
    setIsTelescopeModalOpen(true);
  };

  const handleMintTelescope = () => {
    // TODO
    send("REWARD");
  };

  const rocketImage = canEndMomEvent(context) ? fixedRocket : burnMark;

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

      {canEndMomEvent(context) && (
        <>
          <Modal
            centered
            show={rocketState.matches("rewarding")}
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
              <div className="flex flex-col mt-2 items-center">
                <h1 className="text-lg mb-2">Melon Dusk</h1>
                <img src={momNpc} className="w-16 mb-2" />
                <div className="px-2 my-2">
                  <p className="mb-4">Thanks again for repairing my rocket!</p>
                  <p className="mb-4">
                    Unfortunately, it&apos;s time for me to go. Here&apos;s a
                    gift to remember me.
                  </p>
                  <p>Use this if you wish to see me again!</p>
                </div>
                <img src={telescope} className="w-32 mb-2" />
                <Button onClick={handleCraftTelescope}>Mint Now</Button>
              </div>
            </Panel>
          </Modal>

          <Modal
            centered
            show={isTelescopeModalOpen}
            onHide={handleCloseDialog}
          >
            <Telescope
              onCraft={handleMintTelescope}
              inventory={state.inventory}
            />
          </Modal>
        </>
      )}
    </>
  );
};
