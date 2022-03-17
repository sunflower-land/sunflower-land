import React, { useContext, useEffect, useRef } from "react";
import { useActor } from "@xstate/react";

import { Button } from "components/ui/Button";
import { OuterPanel, Panel } from "components/ui/Panel";

import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import * as Auth from "features/auth/lib/Provider";
import { Context } from "features/game/GameProvider";

import { Share } from "./Share";
import { HowToPlay } from "./howToPlay/HowToPlay";
import { Modal } from "react-bootstrap";

import mobileMenu from "assets/icons/hamburger_menu.png";
import questionMark from "assets/icons/expression_confused.png";
import radish from "assets/icons/radish.png";
import town from "assets/icons/town.png";
import water from "assets/icons/expression_working.png";
import timer from "assets/icons/timer.png";
import wood from "assets/resources/wood.png";

import { hasOnboarded } from "../lib/onboarding";

export const Menu = () => {
  const { authService } = useContext(Auth.Context);
  const { gameService } = useContext(Context);
  const [authState] = useActor(authService);
  const [gameState] = useActor(gameService);

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [scrollIntoView] = useScrollIntoView();

  const [showShareModal, setShowShareModal] = React.useState(false);
  const [showComingSoon, setShowComingSoon] = React.useState(false);
  const [showHowToPlay, setShowHowToPlay] = React.useState(!hasOnboarded());

  // farm link (URL)
  const farmURL = authState.context.farmId
    ? `${
        window.location.href.includes("?")
          ? window.location.href.split("?")[0]
          : window.location.href
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      }?farmId=${authState.context.farmId!.toString()}`
    : "https://sunflower-land.com/play/";

  const ref = useRef<HTMLDivElement>(null);

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavigationClick = (section: Section) => {
    scrollIntoView(section);
    setMenuOpen(false);
  };

  const handleHowToPlay = () => {
    setShowHowToPlay(true);
    setMenuOpen(false);
  };

  const handleShareClick = () => {
    setShowShareModal(true);
    setMenuOpen(false);
  };

  const handleClick = (e: Event) => {
    // inside click
    if (ref?.current?.contains(e.target as Node)) return;
    // outside click
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
    if (!authState.context.token?.userAccess.sync) {
      setShowComingSoon(true);
      return;
    }

    gameService.send("SYNC");
    setMenuOpen(false);
  };

  const autosave = async () => {
    gameService.send("SAVE");
  };

  const goBack = () => {
    authService.send("RETURN");
  };

  const visitFarm = () => {
    authService.send("EXPLORE");
  };

  return (
    <div
      ref={ref}
      className="w-5/12 sm:w-auto fixed top-2 left-2 z-50 shadow-lg"
    >
      <OuterPanel>
        <div className="flex justify-center p-1">
          <Button
            className="mr-2 bg-brown-200 active:bg-brown-200"
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
            menuOpen ? "max-h-100" : "max-h-0"
          }`}
        >
          <ul
            className={`list-none pt-1 transition-all ease duration-200 origin-top ${
              menuOpen ? "scale-y-1" : "scale-y-0"
            }`}
          >
            <li className="p-1">
              <Button onClick={handleHowToPlay}>
                <span className="sm:text-sm">How to play</span>
                <img
                  src={questionMark}
                  className="w-3 ml-2"
                  alt="question-mark"
                />
              </Button>
            </li>
            <li className="p-1">
              <Button onClick={() => handleNavigationClick(Section.Town)}>
                <span className="sm:text-sm">Town</span>
                <img src={town} className="w-6 ml-2" alt="town" />
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
              <Button onClick={() => handleNavigationClick(Section.Forest)}>
                <span className="sm:text-sm">Forest</span>
                <img src={wood} className="w-4 ml-2" alt="wood" />
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
                  <Button onClick={visitFarm}>
                    <span className="sm:text-sm">Visit Farm</span>
                  </Button>
                </li>
                <li className="p-1">
                  <Button onClick={syncOnChain}>
                    <span className="sm:text-sm">Sync on chain</span>
                  </Button>
                </li>
              </>
            )}
          </ul>
        </div>
      </OuterPanel>

      <Share
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        farmURL={farmURL}
      />

      <HowToPlay
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
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
