import React, { useContext, useEffect, useRef, useState } from "react";
import { useActor } from "@xstate/react";

import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { InnerPanel, OuterPanel, Panel } from "components/ui/Panel";

import { Section, useScrollIntoView } from "lib/utils/useScrollIntoView";
import * as Auth from "features/auth/lib/Provider";
import { sync } from "features/game/actions/sync";
import { Context } from "features/game/GameProvider";

import { Withdraw } from "./Withdraw";
import { Modal } from "react-bootstrap";

import mobileMenu from "assets/icons/hamburger_menu.png";
import questionMark from "assets/icons/expression_confused.png";
import radish from "assets/icons/radish.png";
import water from "assets/icons/expression_working.png";
import token from "assets/icons/token.gif";
import timer from "assets/icons/timer.png";
import farmImg from "/farms/farm.png";
import { useTour } from "@reactour/tour";
import { TourStep } from "features/game/lib/Tour";
import { canSync } from "features/game/lib/whitelist";
import { metamask } from "lib/blockchain/metamask";

export const Menu = () => {
  const { isOpen: tourIsOpen, setCurrentStep: setCurrentTourStep } = useTour();
  const { authService } = useContext(Auth.Context);
  const { gameService } = useContext(Context);
  const [authState] = useActor(authService);
  const [gameState, send] = useActor(gameService);

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [scrollIntoView] = useScrollIntoView();

  const farmURL = `${
    window.location.href.includes("?")
      ? window.location.href.split("?")[0]
      : window.location.href
  }?farmId=${authState.context.farmId!.toString()}`;

  const [showShareModal, setShowShareModal] = React.useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = React.useState(false);
  const [showComingSoon, setShowComingSoon] = React.useState(false);

  const [tooltipMessage, setTooltipMessage] = useState(
    "Click to copy farm link (URL)"
  );
  const [showLabel, setShowLabel] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
    if (tourIsOpen) {
      setCurrentTourStep(TourStep.sync);
    }
  };

  const handleNavigationClick = (section: Section) => {
    scrollIntoView(section);
    setMenuOpen(false);
  };

  const handleAboutClick = () => {
    window.open("https://docs.sunflower-land.com/", "_blank");
    setMenuOpen(false);
  };

  const handleCopyFarmURL = (): void => {
    // copy to clipboard
    navigator.clipboard.writeText(farmURL as string);
    setTooltipMessage("Copied!");
    setShowLabel(true);
    setMenuOpen(false);
    setTimeout(() => {
      setTooltipMessage("Click to copy farm link (URL)");
      setShowLabel(false);
    }, 1500);
  };

  const handleShareClick = () => {
    setShowShareModal(true);
    setMenuOpen(false);
  };

  const handleMouseEnter = () => {
    setShowLabel(true);
  };

  const handleMouseLeave = () => {
    setShowLabel(false);
  };

  const handleClick = (e: Event) => {
    // inside click
    if (ref?.current?.contains(e.target as Node)) return;
    // outside click
    setMenuOpen(false);
  };

  const withdraw = () => {
    if (!canSync(metamask.myAccount as string)) {
      setShowComingSoon(true);
      setMenuOpen(false);
      return;
    }
    setShowWithdrawModal(true);
    setMenuOpen(false);
  };

  // TODO - Remove function when withdraw and Sync on Chain functionalities are implemnented
  const handleComingSoonModal = () => {
    setShowComingSoon(true);
    setMenuOpen(false);
  };

  // Handles closing the menu if someone clicks outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.addEventListener("touchstart", handleClick);
    };
  }, []);

  const syncOnChain = async () => {
    if (!canSync(metamask.myAccount as string)) {
      setShowComingSoon(true);
      setMenuOpen(false);
      return;
    }

    gameService.send("SYNC");
  };

  const autosave = async () => {
    gameService.send("SAVE");

    if (tourIsOpen) {
      setCurrentTourStep(TourStep.openMenu);
    }
  };

  const goBack = () => {
    authService.send("RETURN");
  };

  return (
    <div
      ref={ref}
      className="w-5/12 sm:w-auto fixed top-2 left-2 z-50 shadow-lg"
      id="menu"
    >
      <OuterPanel>
        <div className="flex justify-center p-1">
          <Button
            className="mr-2 bg-brown-200 active:bg-brown-200 open-menu"
            onClick={handleMenuClick}
          >
            <img
              className="md:hidden w-6"
              src={mobileMenu}
              alt="hamburger-menu"
            />
            <span className="hidden md:flex">Menu</span>
          </Button>
          {!gameState.matches("readonly") && (
            <Button
              onClick={autosave}
              className="save"
              disabled={gameState.matches("autosaving") ? true : false}
            >
              {gameState.matches("autosaving") ? (
                <img src={timer} className="animate-pulsate" alt="saving" />
              ) : (
                <span>Save</span>
              )}
            </Button>
          )}
          {gameState.matches("readonly") && (
            <Button onClick={goBack}>
              <span>Back</span>
            </Button>
          )}
        </div>
        <div
          className={`transition-all ease duration-200 ${
            menuOpen ? "max-h-80" : "max-h-0"
          }`}
        >
          <ul
            className={`list-none pt-1 transition-all ease duration-200 origin-top ${
              menuOpen ? "scale-y-1" : "scale-y-0"
            }`}
          >
            <li className="p-1">
              <Button onClick={handleAboutClick}>
                <span className="sm:text-sm">About</span>
                <img
                  src={questionMark}
                  className="w-3 ml-2"
                  alt="question-mark"
                />
              </Button>
            </li>
            <li className="p-1">
              <Button onClick={() => handleNavigationClick(Section.Crops)}>
                <span className="sm:text-sm">Crops</span>
                <img src={radish} className="w-4 ml-2" alt="crop" />
              </Button>
            </li>
            <li className="p-1">
              <Button onClick={() => handleNavigationClick(Section.Water)}>
                <span className="sm:text-sm">Water</span>
                <img src={water} className="w-4 ml-2" alt="water" />
              </Button>
            </li>
            <li className="p-1">
              <Button onClick={() => handleShareClick()}>
                <span className="sm:text-sm">Share</span>
              </Button>
            </li>
            {!gameState.matches("readonly") && (
              <>
                <li className="p-1">
                  <Button onClick={syncOnChain}>
                    <span className="text-sm">Sync on chain</span>
                  </Button>
                </li>
                <li className="p-1">
                  <Button onClick={withdraw}>
                    <span className="text-sm">Withdraw</span>
                    <img src={token} className="w-4 ml-2" alt="token" />
                  </Button>
                </li>
              </>
            )}
          </ul>
        </div>
      </OuterPanel>

      <Modal
        show={showShareModal}
        onHide={() => setShowShareModal(false)}
        centered
      >
        <Panel>
          <Modal.Header className="justify-content-center">
            <h1>Share Your Farm Link</h1>
          </Modal.Header>
          <Modal.Body>
            <div className="row justify-content-center align-items-center">
              <div className="flex d-none d-sm-block col-sm col justify-content-center align-items-center">
                <p className="text-sm whitespace-normal">
                  Show off to fellow farmers by sharing your farm link (URL), to
                  directly visit your farm !
                </p>
              </div>
              <div className="flex col-sm-12 col justify-content-center md-px-4 lg-px-4 align-items-center">
                <img
                  src={farmImg}
                  className="w-64 md-mt-2"
                  alt="Sunflower-Land Farm NFT Image"
                />
              </div>
            </div>
            <InnerPanel className="mt-2 hover:bg-brown-200 !p-0">
              <div
                className="p-1 cursor-pointer hover:bg-brown-200"
                onClick={handleCopyFarmURL}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <span className="text-xs hover:bg-brown-200 whitespace-normal">
                  {farmURL}
                </span>
              </div>
            </InnerPanel>
            <div
              className={`absolute mr-5 transition duration-400 pointer-events-none ${
                showLabel ? "opacity-100" : "opacity-0"
              }`}
            >
              <Label>{tooltipMessage}</Label>
            </div>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <Button className="text-s w-1/4 px-1" onClick={handleCopyFarmURL}>
              Copy
            </Button>
            <Button
              className="text-s w-1/4 px-1"
              onClick={() => window.open(farmURL, "_blank")}
            >
              Visit
            </Button>
          </Modal.Footer>
        </Panel>
      </Modal>

      <Withdraw
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
      />

      {/* TODO - To be deleted when withdraw and "Sync on chain" are implemented */}
      <Modal
        show={showComingSoon}
        onHide={() => setShowComingSoon(false)}
        centered
      >
        <Panel>Coming soon!</Panel>
      </Modal>
    </div>
  );
};
