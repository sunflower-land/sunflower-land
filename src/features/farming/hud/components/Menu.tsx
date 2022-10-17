import React, { useContext, useEffect, useRef, useState } from "react";
import { useActor } from "@xstate/react";
import { CONFIG } from "lib/config";

import { Button } from "components/ui/Button";
import { OuterPanel, Panel } from "components/ui/Panel";

import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import * as Auth from "features/auth/lib/Provider";
import { Context } from "features/game/GameProvider";

import { Modal, Collapse } from "react-bootstrap";
import { Share } from "components/Share";
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
import { DEV_BurnLandButton } from "./DEV_BurnLandButton";
import { CloudFlareCaptcha } from "components/ui/CloudFlareCaptcha";
import { CommunityGardenModal } from "features/farming/town/components/CommunityGardenModal";

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
  const [gameState] = useActor(gameService);

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollIntoView] = useScrollIntoView();

  const [showShareModal, setShowShareModal] = useState(false);
  const [showLogoutModal, setShowSettings] = useState(false);
  const [showGoblinModal, setShowGoblinModal] = useState(false);
  const [showCommunityGardenModal, setShowCommunityGardenModal] =
    useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(useIsNewFarm());
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [farmURL, setFarmURL] = useState("");
  const [menuLevel, setMenuLevel] = useState(MENU_LEVELS.ROOT);

  const ref = useRef<HTMLDivElement>(null);

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  // @note: reset menu level when menu closed
  const resetMenuLevel = () => {
    setMenuLevel(MENU_LEVELS.ROOT);
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
    // setShowCaptcha(true);
    gameService.send("SYNC", { captcha: "" });
    setMenuOpen(false);
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

  const visitFarm = () => {
    authService.send("EXPLORE");
  };

  // Handles closing the menu if someone clicks outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);

    const _farmURL = window.location.href.replace("/farm", "/visit");

    setFarmURL(_farmURL);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, []);

  return (
    <div ref={ref} className="w-5/12 sm:w-60 fixed top-2 left-2 z-50 shadow-lg">
      <OuterPanel>
        <div className="flex justify-center p-1">
          <Button
            className="mr-2 bg-brown-200 active:bg-brown-200"
            onClick={handleMenuClick}
          >
            <img
              className="md:hidden w-5"
              src={mobileMenu}
              alt="hamburger-menu"
            />
            <span className="hidden md:flex">Menu</span>
          </Button>

          <Button onClick={autosave} disabled={gameState.matches("autosaving")}>
            {gameState.matches("autosaving") ? (
              <img src={timer} className="animate-pulsate" alt="saving" />
            ) : (
              <span>Save</span>
            )}
          </Button>
        </div>
        {CONFIG.NETWORK === "mumbai" && <DEV_BurnLandButton />}

        <Collapse in={menuOpen} onExited={resetMenuLevel}>
          <ul className="list-none">
            {/* Root menu */}
            {menuLevel === MENU_LEVELS.ROOT && (
              <>
                <li className="p-1">
                  <Button onClick={syncOnChain}>
                    <span className="sm:text-sm">Sync on chain</span>
                  </Button>
                </li>
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

            {/* Community menu */}
            {menuLevel === MENU_LEVELS.VIEW && (
              <>
                <li className="p-1">
                  <Button
                    className="flex justify-between"
                    onClick={() => setShowCommunityGardenModal(true)}
                  >
                    <span className="sm:text-sm flex-1">Community Garden</span>
                  </Button>
                </li>
                <li className="p-1">
                  <Button onClick={handleShareClick}>
                    <span className="sm:text-sm">Share</span>
                  </Button>
                </li>
                <li className="p-1">
                  <Button onClick={visitFarm}>
                    <span className="sm:text-sm">Visit Farm</span>
                  </Button>
                </li>
              </>
            )}
          </ul>
        </Collapse>
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
            <CloudFlareCaptcha
              onDone={onCaptchaSolved}
              onError={() => setShowCaptcha(false)}
              onExpire={() => {
                console.log("expire");
                setShowCaptcha(false);
              }}
              action="sync"
            />
          </Panel>
        </Modal>
      )}

      <GoblinVillageModal
        isOpen={showGoblinModal}
        onClose={() => setShowGoblinModal(false)}
      />
      <CommunityGardenModal
        isOpen={showCommunityGardenModal}
        onClose={() => setShowCommunityGardenModal(false)}
      />
    </div>
  );
};
