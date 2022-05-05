import React, { useContext, useEffect, useRef, useState } from "react";
import { useActor } from "@xstate/react";
import ReCAPTCHA from "react-google-recaptcha";

import { Button } from "components/ui/Button";
import { OuterPanel, Panel } from "components/ui/Panel";

import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import * as Auth from "features/auth/lib/Provider";
import { Context } from "features/game/GameProvider";

import { Modal } from "react-bootstrap";
import { Share } from "./Share";
import { HowToPlay } from "./howToPlay/HowToPlay";
import { Settings } from "./Settings";

import mobileMenu from "assets/icons/hamburger_menu.png";
import questionMark from "assets/icons/expression_confused.png";
import radish from "assets/icons/radish.png";
import town from "assets/icons/town.png";
import water from "assets/icons/expression_working.png";
import timer from "assets/icons/timer.png";
import wood from "assets/resources/wood.png";
import leftArrow from "assets/icons/arrow_left.png";
import close from "assets/icons/close.png";
import goblin from "assets/npcs/goblin_head.png";

import { useIsNewFarm } from "../lib/onboarding";
import { GoblinVillageModal } from "features/farming/town/components/GoblinVillageModal";

/**
 * TODO:
 * create menu level parent mapping if more than 2 levels.
 * currently only 1 level deep so setMenuLevel("ROOT") satisfies
 */

enum MENU_LEVELS {
  ROOT = "root",
  MAP = "map",
  VIEW = "view",
}

export const Menu = () => {
  const { authService } = useContext(Auth.Context);
  const { gameService } = useContext(Context);
  const [authState] = useActor(authService);
  const [gameState] = useActor(gameService);

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollIntoView] = useScrollIntoView();

  const [showShareModal, setShowShareModal] = useState(false);
  const [showLogoutModal, setShowSettings] = useState(false);
  const [showGoblinModal, setShowGoblinModal] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(useIsNewFarm());
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [farmURL, setFarmURL] = useState("");
  const [menuLevel, setMenuLevel] = useState(MENU_LEVELS.ROOT);

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

  const handleSettingsClick = () => {
    setShowSettings(true);
    setMenuOpen(false);
  };

  const handleClick = (e: Event) => {
    // inside click
    if (ref?.current?.contains(e.target as Node)) return;
    // outside click
    setMenuOpen(false);
  };

  const syncOnChain = async () => {
    setShowCaptcha(true);
  };

  const onCaptchaSolved = async (captcha: string | null) => {
    await new Promise((res) => setTimeout(res, 1000));

    gameService.send("SYNC", { captcha });
    setMenuOpen(false);
    setShowCaptcha(false);
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

  // Handles closing the menu if someone clicks outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, []);

  useEffect(() => {
    const _farmURL = authState.context.farmId
      ? `${
          window.location.href.includes("?")
            ? window.location.href.split("?")[0]
            : window.location.href
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        }?farmId=${authState.context.farmId!.toString()}`
      : "https://sunflower-land.com/play/";

    setFarmURL(_farmURL);
  }, [authState.context.farmId]);

  return (
    <div ref={ref} className="w-5/12 sm:w-60 fixed top-2 left-2 z-50 shadow-lg">
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
            {/* Root menu */}
            {menuLevel === MENU_LEVELS.ROOT && (
              <>
                {!gameState.matches("readonly") && (
                  <li className="p-1">
                    <Button onClick={syncOnChain}>
                      <span className="sm:text-sm">Sync on chain</span>
                    </Button>
                  </li>
                )}
                <li className="p-1 flex">
                  <Button onClick={handleHowToPlay}>
                    <span className="sm:text-sm flex-1">How to play</span>
                    <img
                      src={questionMark}
                      className="w-3 ml-2"
                      alt="question-mark"
                    />
                  </Button>
                </li>
                <li className="p-1">
                  <Button
                    className="flex justify-between"
                    onClick={() => setMenuLevel(MENU_LEVELS.MAP)}
                  >
                    <span className="sm:text-sm flex-1">Map</span>
                  </Button>
                </li>
                <li className="p-1">
                  <Button
                    className="flex justify-between"
                    onClick={() => setMenuLevel(MENU_LEVELS.VIEW)}
                  >
                    <span className="sm:text-sm flex-1">Community</span>
                  </Button>
                </li>
                <li className="p-1">
                  <Button
                    className="flex justify-between"
                    onClick={handleSettingsClick}
                  >
                    <span className="sm:text-sm flex-1">Settings</span>
                  </Button>
                </li>
              </>
            )}

            {/* Back button when not Root */}
            {menuLevel !== MENU_LEVELS.ROOT && (
              <li className="p-1">
                <Button onClick={() => setMenuLevel(MENU_LEVELS.ROOT)}>
                  <img src={leftArrow} className="w-4 mr-2" alt="left" />
                </Button>
              </li>
            )}

            {/* Map menu */}
            {menuLevel === MENU_LEVELS.MAP && (
              <>
                <li className="p-1">
                  <Button
                    className="flex justify-between"
                    onClick={() => setShowGoblinModal(true)}
                  >
                    <span className="sm:text-sm flex-1">Goblin Village</span>
                    <img src={goblin} className="w-6 ml-2" alt="town" />
                  </Button>
                </li>
                <li className="p-1">
                  <Button
                    className="flex justify-between"
                    onClick={() => handleNavigationClick(Section.Town)}
                  >
                    <span className="sm:text-sm flex-1">Town</span>
                    <img src={town} className="w-6 ml-2" alt="town" />
                  </Button>
                </li>
                <li className="p-1">
                  <Button
                    className="flex justify-between"
                    onClick={() => handleNavigationClick(Section.Crops)}
                  >
                    <span className="sm:text-sm flex-1">Crops</span>
                    <img src={radish} className="w-4 ml-2" alt="crop" />
                  </Button>
                </li>
                <li className="p-1">
                  <Button
                    className="flex justify-between"
                    onClick={() => handleNavigationClick(Section.Water)}
                  >
                    <span className="sm:text-sm flex-1">Water</span>
                    <img src={water} className="w-4 ml-2" alt="water" />
                  </Button>
                </li>
                <li className="p-1">
                  <Button
                    className="flex justify-between"
                    onClick={() => handleNavigationClick(Section.Forest)}
                  >
                    <span className="sm:text-sm flex-1">Forest</span>
                    <img src={wood} className="w-4 ml-2" alt="wood" />
                  </Button>
                </li>
              </>
            )}

            {/* View menu */}
            {menuLevel === MENU_LEVELS.VIEW && (
              <>
                <li className="p-1">
                  <Button onClick={handleShareClick}>
                    <span className="sm:text-sm">Share</span>
                  </Button>
                </li>
                {!gameState.matches("readonly") && (
                  <li className="p-1">
                    <Button onClick={visitFarm}>
                      <span className="sm:text-sm">Visit Farm</span>
                    </Button>
                  </li>
                )}
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

      <Settings
        isOpen={showLogoutModal}
        onClose={() => setShowSettings(false)}
      />

      {showCaptcha && (
        <Modal show={showCaptcha} onHide={() => setShowCaptcha(false)} centered>
          <Panel>
            <img
              src={close}
              className="h-6 top-3 right-4 absolute cursor-pointer"
              alt="Close Logout Confirmation Modal"
              onClick={() => setShowCaptcha(false)}
            />
            <ReCAPTCHA
              sitekey="6Lfqm6MeAAAAAFS5a0vwAfTGUwnlNoHziyIlOl1s"
              onChange={onCaptchaSolved}
              onExpired={() => setShowCaptcha(false)}
              className="w-full m-4 flex items-center justify-center"
            />
          </Panel>
        </Modal>
      )}

      <Modal
        centered
        show={showGoblinModal}
        onHide={() => setShowGoblinModal(false)}
      >
        <GoblinVillageModal />
      </Modal>
    </div>
  );
};
