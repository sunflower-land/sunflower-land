import React, { useEffect, useState } from "react";
import { Panel } from "components/ui/Panel";
import { Modal } from "react-bootstrap";
import { Button } from "components/ui/Button";
import { ItemsModal } from "./ItemsModal";

import brokenRocket from "assets/buildings/mom_broken_rocket.gif";
import fixedRocket from "assets/buildings/mom_fixed_rocket.png";
import launchingRocket from "assets/buildings/mom_launching_rocket.gif";
import burnMark from "assets/buildings/mom_burnt_ground.png";
import momNpc from "assets/npcs/mom_npc.gif";
import close from "assets/icons/close.png";
import { melonDuskAudio } from "lib/utils/sfx";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

const ROCKET_LAUNCH_TO_DIALOG_TIMEOUT = 4000;

export const Rocket: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRocketFixed, setIsRocketFixed] = useState(false);
  const [isRocketLaunching, setIsRocketLaunching] = useState(false);
  const [isRocketLaunchComplete, setIsRocketLaunchComplete] = useState(false);
  const [isItemsOpen, setIsItemsOpen] = React.useState(false);

  useEffect(() => {
    if (!isRocketLaunching) {
      return;
    }
    setTimeout(() => {
      setIsRocketLaunching(false);
      setIsRocketLaunchComplete(true);
      setIsDialogOpen(true);
    }, ROCKET_LAUNCH_TO_DIALOG_TIMEOUT);
  }, [isRocketLaunching]);

  const handleLaunchRocket = () => {
    setIsDialogOpen(false);
    if (isRocketLaunching) {
      // Don't launch again if it's already launching
      return;
    }
    setIsRocketLaunching(true);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    if (!melonDuskAudio.playing()) {
      melonDuskAudio.play();
    }
  };

  const handleCloseDialog = () => {
    setIsItemsOpen(false);
    melonDuskAudio.stop();
    setIsDialogOpen(false);
  };

  const handleOpenItemsDialog = () => {
    handleOpenDialog();
    setIsItemsOpen(true);
  };

  const currentRocketImage =
    isRocketLaunching || isRocketLaunchComplete
      ? burnMark
      : isRocketFixed
      ? fixedRocket
      : brokenRocket;

  // These represent different states of the quest, and dialogs which should show and when.
  const shouldShowFixDialog = !isRocketFixed && !isItemsOpen;
  const shouldShowItemsDialog = shouldShowFixDialog && isItemsOpen;
  const shouldShowLaunchDialog = isRocketFixed && !isRocketLaunchComplete;
  const shouldShowContinueMissionDialog =
    isRocketFixed && isRocketLaunchComplete;

  return (
    <>
      <div
        className="absolute"
        style={{
          width: `${GRID_WIDTH_PX * 5}px`,
          right: `${GRID_WIDTH_PX * 9.75}px`,
          top: `${GRID_WIDTH_PX * 20}px`,
        }}
      >
        <div className="absolute cursor-pointer hover:img-highlight w-full">
          <img
            src={momNpc}
            style={{
              position: "absolute",
              width: `${GRID_WIDTH_PX * 1.3}px`,
              top: `${GRID_WIDTH_PX * 2.5}px`,
              right: `${GRID_WIDTH_PX * 3.75}px`,
            }}
            onClick={handleOpenDialog}
          />
          <img
            src={currentRocketImage}
            className="w-56"
            onClick={handleOpenDialog}
          />
        </div>
      </div>
      {isRocketLaunching && (
        <img
          src={launchingRocket}
          className="absolute launching"
          style={{
            width: `${GRID_WIDTH_PX * 5}px`,
            right: `${GRID_WIDTH_PX * 9.75}px`,
            top: `${GRID_WIDTH_PX * 20}px`,
          }}
        />
      )}
      <Modal centered show={isDialogOpen} onHide={handleCloseDialog}>
        <Panel>
          <img
            src={close}
            className="h-6 top-4 right-4 absolute cursor-pointer"
            onClick={handleCloseDialog}
          />
          <div className="flex items-start pr-6">
            <img src={momNpc} className="w-16 img-highlight mr-2" />
            <div className="flex-1">
              <span className="text-shadow block">Melon Dusk</span>
              {shouldShowFixDialog && (
                <>
                  <span className="text-shadow mr-4 block">
                    Help! My rocket has crash landed and needs repairs. Can you
                    help me fix it?
                  </span>
                  <Button className="text-sm" onClick={handleOpenItemsDialog}>
                    Fix rocket
                  </Button>
                </>
              )}
              {shouldShowItemsDialog && (
                <ItemsModal isOpen={isDialogOpen} onClose={handleCloseDialog} />
              )}
              {shouldShowLaunchDialog && (
                <>
                  <span className="text-shadow block my-4">
                    Rocket is ready to launch, whenever you&apos;re ready
                    captain!
                  </span>
                  <Button className="text-sm" onClick={handleLaunchRocket}>
                    Launch Rocket
                  </Button>
                </>
              )}
              {shouldShowContinueMissionDialog && (
                <>
                  <span className="text-shadow block my-4">
                    When you complete your mission on Mars, come back and talk
                    with me.
                  </span>
                  <p className="text-xs sm:text-sm text-shadow text-white p-1 mb-2">
                    {/* TODO - Add MoM href link */}
                    <a
                      className="underline"
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Click here to continue your mission
                    </a>
                  </p>
                </>
              )}
            </div>
          </div>
        </Panel>
      </Modal>
    </>
  );
};
