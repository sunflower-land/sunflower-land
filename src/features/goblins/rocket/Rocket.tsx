import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { ItemsModal } from "./ItemsModal";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

import brokenRocket from "assets/mom/mom_broken_rocket.gif";
import fixedRocket from "assets/mom/mom_fixed_rocket.png";
import launchingRocket from "assets/mom/mom_launching_rocket.gif";
import burnMark from "assets/mom/mom_burnt_ground.png";
import close from "assets/icons/close.png";
import momNpc from "assets/mom/mom_npc.gif";
import scaffoldingLeft from "assets/mom/scaffolding_left.png";
import scaffoldingRight from "assets/mom/scaffolding_right.png";
import support from "assets/mom/launch-pad-material-2.png";
import platform from "assets/mom/launch-pad-material-3.png";
import woodPile from "assets/mom/launch-pad-material-4.png";
import goblinHammering from "assets/mom/goblin_mechanic_1.gif";
import goblinWelding from "assets/mom/goblin_mechanic_2.gif";
import goblinForeman from "assets/mom/goblin_mechanic_3.gif";
import metalSheetsPileFew from "assets/mom/metal-sheets-pile-few.png";
import metalSheetsPileMany from "assets/mom/metal-sheets-pile-many.png";
import { melonDuskAudio } from "lib/utils/sfx";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

const ROCKET_LAUNCH_TO_DIALOG_TIMEOUT = 4000;
const MELON_DUSK_SEEN = "isMelonDuskSeen";

export const Rocket: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isItemsOpen, setIsItemsOpen] = React.useState(false);
  const [isRocketFixed, setIsRocketFixed] = useState(false);
  const [isRocketLaunching, setIsRocketLaunching] = useState(false);
  const [isRocketLaunchComplete, setIsRocketLaunchComplete] = useState(false);

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
    melonDuskAudio.stop();
    setIsDialogOpen(false);
  };

  const handleOpenItemsDialog = () => {
    localStorage.setItem(MELON_DUSK_SEEN, JSON.stringify(true));
    setIsItemsOpen(true);
  };

  const handleMintObservatory = () => {
    // TODO
    return;
  };

  const rocketImage =
    isRocketLaunching || isRocketLaunchComplete
      ? burnMark
      : isRocketFixed
      ? fixedRocket
      : brokenRocket;

  const isMelonDuskSeen = localStorage.getItem(MELON_DUSK_SEEN);
  // const isMelonDuskSeen = false;

  const content = () => {
    if (isRocketFixed && !isRocketLaunchComplete) {
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

    if (isRocketFixed && isRocketLaunchComplete) {
      return (
        <>
          <span className="text-shadow block my-4">
            When you complete your mission on Mars, come back and talk with me.
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
      );
    }

    // TODO - add mint observatory dialog

    if (!isMelonDuskSeen) {
      return (
        <>
          <span className="text-shadow mr-4 block">
            Help! My rocket has crash landed and needs repairs. Can you help me
            fix it?
          </span>
          <Button className="text-sm" onClick={handleOpenItemsDialog}>
            Fix rocket
          </Button>
        </>
      );
    }
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

          <img
            src={scaffoldingLeft}
            style={{
              position: "absolute",
              width: `${GRID_WIDTH_PX * 2.62}px`,
              top: `${GRID_WIDTH_PX * 0.83}px`,
              left: `${GRID_WIDTH_PX * -0.48}px`,
              zIndex: 1,
              visibility: `${isMelonDuskSeen ? `visible` : `hidden`}`,
            }}
          />
          <img
            src={scaffoldingRight}
            style={{
              position: "absolute",
              width: `${GRID_WIDTH_PX * 2.5}px`,
              top: `${GRID_WIDTH_PX * 0.78}px`,
              right: `${GRID_WIDTH_PX * -1.26}px`,
              zIndex: 1,
              visibility: `${isMelonDuskSeen ? `visible` : `hidden`}`,
            }}
          />
          <img
            src={support}
            style={{
              position: "absolute",
              width: `${GRID_WIDTH_PX * 5}px`,
              top: `${GRID_WIDTH_PX * 1.38}px`,
              left: `${GRID_WIDTH_PX * 0.31}px`,
              visibility: `${isMelonDuskSeen ? `visible` : `hidden`}`,
            }}
          />
          <img
            src={platform}
            style={{
              position: "absolute",
              width: `${GRID_WIDTH_PX * 2.14}px`,
              top: `${GRID_WIDTH_PX * 1.69}px`,
              right: `${GRID_WIDTH_PX * -4.5}px`,
              visibility: `${isMelonDuskSeen ? `visible` : `hidden`}`,
            }}
          />
          <img
            src={woodPile}
            style={{
              position: "absolute",
              width: `${GRID_WIDTH_PX * 1.1}px`,
              top: `${GRID_WIDTH_PX * 4.25}px`,
              right: `${GRID_WIDTH_PX * -3}px`,
              visibility: `${isMelonDuskSeen ? `visible` : `hidden`}`,
            }}
          />
          <img
            src={goblinForeman}
            style={{
              position: "absolute",
              width: `${GRID_WIDTH_PX * 0.95}px`,
              left: `${GRID_WIDTH_PX * 5}px`,
              bottom: `${GRID_WIDTH_PX * -0.01}px`,
              visibility: `${isMelonDuskSeen ? `visible` : `hidden`}`,
            }}
          />
          <img
            src={goblinWelding}
            style={{
              position: "absolute",
              width: `${GRID_WIDTH_PX * 1.55}px`,
              right: `${GRID_WIDTH_PX * 3.6}px`,
              bottom: `${GRID_WIDTH_PX * -1}px`,
              visibility: `${isMelonDuskSeen ? `visible` : `hidden`}`,
            }}
          />
          <img
            src={goblinHammering}
            style={{
              position: "absolute",
              width: `${GRID_WIDTH_PX * 1.55}px`,
              left: `${GRID_WIDTH_PX * 3.7}px`,
              bottom: `${GRID_WIDTH_PX * -2.25}px`,
              visibility: `${isMelonDuskSeen ? `visible` : `hidden`}`,
            }}
          />
          <img
            src={metalSheetsPileMany}
            style={{
              position: "absolute",
              width: `${GRID_WIDTH_PX * 1}px`,
              right: `${GRID_WIDTH_PX * 2.7}px`,
              bottom: `${GRID_WIDTH_PX * -3}px`,
              visibility: `${isMelonDuskSeen ? `visible` : `hidden`}`,
            }}
          />
          <img
            src={metalSheetsPileFew}
            style={{
              position: "absolute",
              width: `${GRID_WIDTH_PX * 1}px`,
              right: `${GRID_WIDTH_PX * 2.1}px`,
              bottom: `${GRID_WIDTH_PX * -3.5}px`,
              visibility: `${isMelonDuskSeen ? `visible` : `hidden`}`,
            }}
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
        {isItemsOpen ? (
          <ItemsModal isOpen={isDialogOpen} onClose={handleCloseDialog} />
        ) : (
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
                {content()}
              </div>
            </div>
          </Panel>
        )}
      </Modal>
    </>
  );
};
