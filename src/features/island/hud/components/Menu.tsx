import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { CONFIG } from "lib/config";

import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";

import * as Auth from "features/auth/lib/Provider";
import { Context } from "features/game/GameProvider";

import { Share } from "components/Share";

import roundButton from "assets/ui/button/round_button.png";
import questionMark from "assets/icons/expression_confused.png";
import settings from "assets/icons/settings.png";
import leftArrow from "assets/icons/arrow_left.png";
import close from "assets/icons/close.png";

import { GoblinVillageModal } from "features/farming/town/components/GoblinVillageModal";
import { DEV_BurnLandButton } from "./DEV_BurnLandButton";
import { useIsNewFarm } from "features/farming/hud/lib/onboarding";
import { HowToPlay } from "features/farming/hud/components/howToPlay/HowToPlay";
import { Settings } from "features/farming/hud/components/Settings";
import { CloudFlareCaptcha } from "components/ui/CloudFlareCaptcha";
import { CommunityGardenModal } from "features/farming/town/components/CommunityGardenModal";
import { DEV_GenerateLandButton } from "./DEV_GenerateLandButton";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { LandExpansionRole } from "./LandExpansionRole";

enum MENU_LEVELS {
  ROOT = "root",
  VIEW = "view",
}

export const Menu = () => {
  const { authService } = useContext(Auth.Context);
  const { gameService } = useContext(Context);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLandExpansionModal, setShowLandExpansionModal] = useState(false);
  const [showGoblinModal, setShowGoblinModal] = useState(false);
  const [showCommunityGardenModal, setShowCommunityGardenModal] =
    useState(false);
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
    setShowSettingsModal(true);
    setMenuOpen(false);
  };

  const handleLandExpansionClick = () => {
    setShowLandExpansionModal(true);
    setMenuOpen(false);
  };

  const syncOnChain = async () => {
    // setShowCaptcha(true);
    // setMenuOpen(false);

    gameService.send("SYNC", { captcha: "" });
    setMenuOpen(false);
    setShowCaptcha(false);
  };

  const onCaptchaSolved = async (captcha: string | null) => {
    console.log({ captcha });
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
          onClick={() => setMenuOpen(true)}
          className="fixed z-50 cursor-pointer hover:img-highlight"
          style={{
            right: `${PIXEL_SCALE * 3}px`,
            bottom: `${PIXEL_SCALE * 76}px`,
            width: `${PIXEL_SCALE * 22}px`,
          }}
        >
          <img
            src={roundButton}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 22}px`,
            }}
          />
          <img
            src={settings}
            className="absolute"
            style={{
              top: `${PIXEL_SCALE * 4}px`,
              left: `${PIXEL_SCALE * 4}px`,
              width: `${PIXEL_SCALE * 14}px`,
            }}
          />
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
              <>
                <li className="p-1">
                  <DEV_BurnLandButton />
                </li>
                <li className="p-1">
                  <DEV_GenerateLandButton />
                </li>
              </>
            )}

            {/* Root menu */}
            {menuLevel === MENU_LEVELS.ROOT && (
              <>
                <li className="p-1">
                  <Button onClick={syncOnChain}>
                    <span>Sync on chain</span>
                  </Button>
                </li>
                <li className="p-1">
                  <Button onClick={handleHowToPlay}>
                    <div className="flex items-center justify-center">
                      <span>How to play</span>
                      <img
                        src={questionMark}
                        className="w-3 ml-2"
                        alt="question-mark"
                      />
                    </div>
                  </Button>
                </li>
                <li className="p-1">
                  <Button onClick={() => setMenuLevel(MENU_LEVELS.VIEW)}>
                    <span>Community</span>
                  </Button>
                </li>
                {CONFIG.NETWORK === "mainnet" && (
                  <li className="p-1">
                    <Button onClick={handleLandExpansionClick}>
                      <span>Discord</span>
                    </Button>
                  </li>
                )}
                <li className="p-1">
                  <Button onClick={handleSettingsClick}>
                    <span>Settings</span>
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

            {/* Community menu */}
            {menuLevel === MENU_LEVELS.VIEW && (
              <>
                <li className="p-1">
                  <Button onClick={() => setShowCommunityGardenModal(true)}>
                    <span>Community Garden</span>
                  </Button>
                </li>
                <li className="p-1">
                  <Button onClick={handleShareClick}>
                    <span>Share</span>
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
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />

      {CONFIG.NETWORK === "mainnet" && (
        <LandExpansionRole
          isOpen={showLandExpansionModal}
          onClose={() => setShowLandExpansionModal(false)}
        />
      )}

      {showCaptcha && (
        <Modal show={showCaptcha} onHide={() => setShowCaptcha(false)} centered>
          <Panel>
            <img
              src={close}
              className="absolute cursor-pointer z-20"
              alt="Close Logout Confirmation Modal"
              onClick={() => setShowCaptcha(false)}
              style={{
                top: `${PIXEL_SCALE * 6}px`,
                right: `${PIXEL_SCALE * 6}px`,
                width: `${PIXEL_SCALE * 11}px`,
              }}
            />

            <CloudFlareCaptcha
              onDone={onCaptchaSolved}
              onError={() => setShowCaptcha(false)}
              onExpire={() => setShowCaptcha(false)}
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
    </>
  );
};
