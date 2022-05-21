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

import scaffoldingLeft from "assets/mom/scaffolding_left.png";
import scaffoldingRight from "assets/mom/scaffolding_right.png";
import support from "assets/mom/launch-pad-material-2.png";
import platform from "assets/mom/launch-pad-material-3.png";
import woodPile from "assets/mom/launch-pad-material-4.png";
import goblinHammering from "assets/npcs/goblin_mechanic_1.gif";
import goblinWelding from "assets/npcs/goblin_mechanic_2.gif";
import goblinForeman from "assets/npcs/goblin_mechanic_3.gif";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

const ROCKET_LAUNCH_TO_DIALOG_TIMEOUT = 4000;
const MELON_DUSK_SEEN = "isMelonDuskSeen";

export const Rocket: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRocketFixed, setIsRocketFixed] = useState(false);
  const [isRocketLaunching, setIsRocketLaunching] = useState(false);
  const [isRocketLaunchComplete, setIsRocketLaunchComplete] = useState(false);
  const [isItemsOpen, setIsItemsOpen] = useState(false);

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
    localStorage.setItem(MELON_DUSK_SEEN, JSON.stringify(new Date()));
  };

  const handleCloseDialog = () => {
    setIsItemsOpen(false);
    melonDuskAudio.stop();
    setIsDialogOpen(false);
  };

  const handleOpenItemsDialog = () => {
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

  const content = () => {
    if (isRocketFixed && isRocketLaunchComplete) {
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

    // TODO - Detect when MoM mission is complete
    // if (false) {
    //   return (
    //     <>
    //       <span className="text-shadow block my-2 text-xs sm:text-sm">
    //         Great job on Mars captain! In exchange for your Mars token, I will
    //         give you something to remember me by. After this trade, go back to
    //         your farm and sync on chain to see it.
    //       </span>
    //       <img className="mx-auto mb-2" src={observatory} alt="Observatory" />
    //       <Button className="text-sm" onClick={handleMintObservatory}>
    //         Mint Now
    //       </Button>
    //     </>
    //   );
    // }

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
  };

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
              width: `${GRID_WIDTH_PX * 1.205}px`,
              top: `${GRID_WIDTH_PX * 3.33}px`,
              right: `${GRID_WIDTH_PX * 3.916}px`,
              zIndex: 2,
            }}
            onClick={handleOpenDialog}
          />
          <img
            src={rocketImage}
            className="w-56 relative z-10"
            onClick={handleOpenDialog}
          />
          <img
            src={scaffoldingLeft}
            style={{
              position: "absolute",
              width: `${GRID_WIDTH_PX * 2.619}px`,
              top: `${GRID_WIDTH_PX * 0.833}px`,
              left: `${GRID_WIDTH_PX * -0.476}px`,
              zIndex: 1,
            }}
          />
          <img
            src={scaffoldingRight}
            style={{
              position: "absolute",
              width: `${GRID_WIDTH_PX * 2.5}px`,
              top: `${GRID_WIDTH_PX * 0.7857}px`,
              right: `${GRID_WIDTH_PX * -1.2619}px`,
              zIndex: 1,
            }}
          />
          <img
            src={support}
            style={{
              position: "absolute",
              width: `${GRID_WIDTH_PX * 5}px`,
              top: `${GRID_WIDTH_PX * 1.381}px`,
              left: `${GRID_WIDTH_PX * 0.3095}px`,
            }}
          />
          <img
            src={platform}
            style={{
              position: "absolute",
              width: `${GRID_WIDTH_PX * 2.143}px`,
              top: `${GRID_WIDTH_PX * 1.69}px`,
              right: `${GRID_WIDTH_PX * -4.095}px`,
            }}
          />
          <img
            src={woodPile}
            style={{
              position: "absolute",
              width: `${GRID_WIDTH_PX * 1.095}px`,
              top: `${GRID_WIDTH_PX * 4.02}px`,
              right: `${GRID_WIDTH_PX * -2.095}px`,
            }}
          />
          <img src={goblinForeman} />
          <img
            src={goblinHammering}
            style={{
              position: "absolute",
              width: `${GRID_WIDTH_PX * 1.371}px`,
              left: `${GRID_WIDTH_PX * 3.55}px`,
              bottom: `${GRID_WIDTH_PX * -2.25}px`,
            }}
          />
          <img
            src={goblinWelding}
            style={{
              position: "absolute",
              width: `${GRID_WIDTH_PX * 1.371}px`,
              left: `${GRID_WIDTH_PX * 2.306}px`,
              bottom: `${GRID_WIDTH_PX * -1.031}px`,
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
