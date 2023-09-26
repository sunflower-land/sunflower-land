import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { CONFIG } from "lib/config";

import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";

import { Context as GameContext } from "features/game/GameProvider";

import { Share } from "features/island/hud/components/settings-menu/Share";

import { DEV_GenerateLandButton } from "./DEV_GenerateLandButton";
import { useIsNewFarm } from "features/farming/hud/lib/onboarding";
import { HowToPlay } from "./howToPlay/HowToPlay";
import { SubSettings } from "./sub-settings/SubSettings";
import { CloudFlareCaptcha } from "components/ui/CloudFlareCaptcha";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Discord } from "./DiscordModal";
import { AddSFL } from "../AddSFL";
import { SUNNYSIDE } from "assets/sunnyside";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { PokoOnRamp } from "../PokoOnRamp";
import { createPortal } from "react-dom";
import { DEV_TimeMachine } from "./DEV_TimeMachine";
import { Label } from "components/ui/Label";

enum MENU_LEVELS {
  ROOT = "root",
  COMMUNITY = "community",
  ON_RAMP_MATIC = "on-ramp-matic",
  ON_RAMP_SFL = "on-ramp-sfl",
}

interface Props {
  show: boolean;
  onClose: () => void;
  isFarming: boolean;
}

export const SettingsMenu: React.FC<Props> = ({ show, onClose, isFarming }) => {
  const { gameService } = useContext(GameContext);

  const [showShareModal, setShowShareModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAddSFLModal, setShowAddSFLModal] = useState(false);
  const [showDiscordModal, setShowDiscordModal] = useState(false);
  const [showCommunityGardenModal, setShowCommunityGardenModal] =
    useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(useIsNewFarm());
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [showTimeMachine, setShowTimeMachine] = useState(false);
  const [menuLevel, setMenuLevel] = useState(MENU_LEVELS.ROOT);
  const { openModal } = useContext(ModalContext);

  const isFullUser = gameService?.state?.value === "playingFullGame";

  const handleHowToPlay = () => {
    setShowHowToPlay(true);
    onClose();
  };

  const handleCommunityGardenClick = () => {
    setShowCommunityGardenModal(true);
    onClose();
    setMenuLevel(MENU_LEVELS.ROOT);
  };

  const handleShareClick = () => {
    setShowShareModal(true);
    onClose();
    setMenuLevel(MENU_LEVELS.ROOT);
  };

  const handleAddMatic = async () => {
    setMenuLevel(MENU_LEVELS.ON_RAMP_MATIC);
  };

  const handleAddSFL = async () => {
    setMenuLevel(MENU_LEVELS.ON_RAMP_SFL);
  };

  const handleSwapSFL = () => {
    setShowAddSFLModal(true);
    onClose();
  };

  const handleSettingsClick = () => {
    setShowSettingsModal(true);
    onClose();
  };

  const handleDiscordClick = () => {
    setShowDiscordModal(true);
    onClose();
  };

  const storeOnChain = async () => {
    openModal("STORE_ON_CHAIN");
    onClose();
  };

  const onCaptchaSolved = async (captcha: string | null) => {
    await new Promise((res) => setTimeout(res, 1000));

    gameService.send("SYNC", { captcha, blockBucks: 0 });
    onClose();
    setShowCaptcha(false);
  };

  const onHide = () => {
    onClose();
    setMenuLevel(MENU_LEVELS.ROOT);
  };

  return (
    <>
      <Modal show={show} centered onHide={onHide}>
        <Panel>
          <ul className="list-none">
            {/* Root menu */}
            {menuLevel === MENU_LEVELS.ROOT && (
              <>
                {CONFIG.NETWORK === "mumbai" && (
                  <>
                    <li className="p-1">
                      <Button
                        onClick={() => setShowTimeMachine(!showTimeMachine)}
                      >
                        Time Machine
                      </Button>
                    </li>
                    <li className="p-1">
                      <DEV_GenerateLandButton />
                    </li>
                  </>
                )}
                {isFullUser && (
                  <li className="p-1">
                    <Button onClick={storeOnChain}>
                      <span>Store progress on chain</span>
                    </Button>
                  </li>
                )}
                <li className="p-1">
                  <Button onClick={handleHowToPlay}>
                    <div className="flex items-center justify-center">
                      <span>How to play</span>
                      <img
                        src={SUNNYSIDE.icons.expression_confused}
                        className="w-3 ml-2"
                        alt="question-mark"
                      />
                    </div>
                  </Button>
                </li>
                {isFullUser && (
                  <>
                    <li className="p-1">
                      <Button
                        onClick={() => setMenuLevel(MENU_LEVELS.COMMUNITY)}
                      >
                        <span>Community</span>
                      </Button>
                    </li>

                    <li className="p-1">
                      <Button onClick={handleDiscordClick}>
                        <span>Discord</span>
                      </Button>
                    </li>

                    <li className="p-1">
                      <Button onClick={handleAddMatic} disabled={true}>
                        <span>Buy Matic </span>
                        <Label type="info" className="mb-1">
                          Temporarily Disabled
                        </Label>
                      </Button>
                    </li>

                    <li className="p-1">
                      <Button onClick={handleAddSFL} disabled={true}>
                        <span>Buy SFL 🇧🇷🇵🇭🇮🇳 </span>
                        <Label type="info" className="mb-1">
                          Temporarily Disabled
                        </Label>
                      </Button>
                    </li>

                    <li className="p-1">
                      <Button onClick={handleSwapSFL}>
                        <span>Swap MATIC for SFL</span>
                      </Button>
                    </li>
                  </>
                )}
                <li className="p-1">
                  <Button onClick={handleSettingsClick}>
                    <span>Settings</span>
                  </Button>
                </li>
              </>
            )}

            {/* Community menu */}
            {menuLevel === MENU_LEVELS.COMMUNITY && (
              <>
                <li className="p-1">
                  <Button onClick={() => setMenuLevel(MENU_LEVELS.ROOT)}>
                    <img
                      src={SUNNYSIDE.icons.arrow_left}
                      className="w-4 mr-2"
                      alt="left"
                    />
                  </Button>
                </li>
                <li className="p-1">
                  <Button onClick={handleCommunityGardenClick}>
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

            {menuLevel === MENU_LEVELS.ON_RAMP_MATIC && (
              <PokoOnRamp
                crypto="MATIC-polygon"
                onClose={() => setMenuLevel(MENU_LEVELS.ROOT)}
              />
            )}
            {menuLevel === MENU_LEVELS.ON_RAMP_SFL && (
              <PokoOnRamp
                crypto="SFL-polygon"
                onClose={() => setMenuLevel(MENU_LEVELS.ROOT)}
              />
            )}
          </ul>
        </Panel>
      </Modal>
      <Share isOpen={showShareModal} onClose={() => setShowShareModal(false)} />
      <HowToPlay
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />
      {isFarming && (
        <Discord
          isOpen={showDiscordModal}
          onClose={() => setShowDiscordModal(false)}
        />
      )}
      <SubSettings
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
      <AddSFL
        isOpen={showAddSFLModal}
        onClose={() => setShowAddSFLModal(false)}
      />

      {showCaptcha && (
        <Modal show={showCaptcha} onHide={() => setShowCaptcha(false)} centered>
          <Panel>
            <img
              src={SUNNYSIDE.icons.close}
              className="absolute cursor-pointer z-20"
              alt="Close Logout Confirmation Modal"
              onClick={() => setShowCaptcha(false)}
              style={{
                top: `${PIXEL_SCALE * 6}px`,
                right: `${PIXEL_SCALE * 6}px`,
                width: `${PIXEL_SCALE * 11}px`,
              }}
            />

            <CloudFlareCaptcha onDone={onCaptchaSolved} action="sync" />
          </Panel>
        </Modal>
      )}
      {showTimeMachine && createPortal(<DEV_TimeMachine />, document.body)}
    </>
  );
};
