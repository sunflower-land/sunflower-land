import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import ReCAPTCHA from "react-google-recaptcha";
import { CONFIG } from "lib/config";

import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";

import * as Auth from "features/auth/lib/Provider";
import { Context } from "features/game/GameProvider";

import { Share } from "components/Share";

import disc from "assets/icons/disc.png";
import questionMark from "assets/icons/expression_confused.png";
import leftArrow from "assets/icons/arrow_left.png";
import close from "assets/icons/close.png";

import { GoblinVillageModal } from "features/farming/town/components/GoblinVillageModal";
import { DEV_BurnLandButton } from "./DEV_BurnLandButton";
import { useIsNewFarm } from "features/farming/hud/lib/onboarding";
import { HowToPlay } from "features/farming/hud/components/howToPlay/HowToPlay";
import { Settings } from "features/farming/hud/components/Settings";
import { Label } from "components/ui/Label";

enum MENU_LEVELS {
  ROOT = "root",
  VIEW = "view",
}

export const Menu = () => {
  const { authService } = useContext(Auth.Context);
  const { gameService } = useContext(Context);

  const [menuOpen, setMenuOpen] = useState(false);

  const [showShareModal, setShowShareModal] = useState(false);
  const [showLogoutModal, setShowSettings] = useState(false);
  const [showGoblinModal, setShowGoblinModal] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(useIsNewFarm());
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [farmURL, setFarmURL] = useState("");
  const [menuLevel, setMenuLevel] = useState(MENU_LEVELS.ROOT);

  const ref = useRef<HTMLDivElement>(null);

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

  const syncOnChain = async () => {
    setShowCaptcha(true);
    setMenuOpen(false);
  };

  const onCaptchaSolved = async (captcha: string | null) => {
    await new Promise((res) => setTimeout(res, 1000));

    gameService.send("SYNC", { captcha });
    setMenuOpen(false);
    setShowCaptcha(false);
  };

  const visitFarm = () => {
    authService.send("EXPLORE");
  };

  // Handles closing the menu if someone clicks outside
  useEffect(() => {
    const _farmURL = window.location.href.replace("/farm", "/visit");

    setFarmURL(_farmURL);
  }, []);

  return (
    <>
      {!gameService.state.matches("editing") && (
        <div
          ref={ref}
          className="fixed bottom-2 left-2 z-50 cursor-pointer hover:img-highlight"
          onClick={() => setMenuOpen(true)}
        >
          <div className="relative w-16 h-16 flex items-center justify-center">
            <img src={disc} className="w-full absolute inset-0" />
            <img src={questionMark} className="w-6 mb-1 z-10" />
          </div>
          <Label className="mt-1 hidden sm:block">Settings</Label>
        </div>
      )}

      <Modal show={menuOpen} centered onHide={() => setMenuOpen(false)}>
        <Panel>
          <ul
            className={`list-none pt-1 transition-all ease duration-200 origin-top ${
              menuOpen ? "scale-y-1" : "scale-y-0"
            }`}
          >
            {CONFIG.NETWORK === "mumbai" && (
              <li className="p-1">
                <DEV_BurnLandButton />
              </li>
            )}

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

            {/* View menu */}
            {menuLevel === MENU_LEVELS.VIEW && (
              <>
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
        </Panel>
      </Modal>

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
              sitekey={CONFIG.RECAPTCHA_SITEKEY}
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
        <GoblinVillageModal onClose={() => setShowGoblinModal(false)} />
      </Modal>
    </>
  );
};
