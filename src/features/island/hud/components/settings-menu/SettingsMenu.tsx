import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { CONFIG } from "lib/config";

import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";

import { Context as AuthContext } from "features/auth/lib/Provider";
import { Context as GameContext } from "features/game/GameProvider";

import { Share } from "features/island/hud/components/settings-menu/Share";

import { DEV_GenerateLandButton } from "./DEV_GenerateLandButton";
import { useIsNewFarm } from "features/farming/hud/lib/onboarding";
import { HowToPlay } from "./howToPlay/HowToPlay";
import { SubSettings } from "./sub-settings/SubSettings";
import { CloudFlareCaptcha } from "components/ui/CloudFlareCaptcha";
import { CommunityGardenModal } from "features/community/components/CommunityGardenModal";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Loading } from "features/auth/components";
import { sequence } from "0xsequence";
import { OpenWalletIntent } from "0xsequence/dist/declarations/src/provider";
import { SEQUENCE_CONNECT_OPTIONS } from "features/auth/lib/sequence";
import { Discord } from "./DiscordModal";
import { AddSFL } from "../AddSFL";
import { SUNNYSIDE } from "assets/sunnyside";
import { ModalContext } from "features/game/components/modal/ModalProvider";

enum MENU_LEVELS {
  ROOT = "root",
  COMMUNITY = "community",
}

interface Props {
  show: boolean;
  onClose: () => void;
  isFarming: boolean;
}

export const SettingsMenu: React.FC<Props> = ({ show, onClose, isFarming }) => {
  const { authService } = useContext(AuthContext);
  const { gameService } = useContext(GameContext);

  const [showShareModal, setShowShareModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAddSFLModal, setShowAddSFLModal] = useState(false);
  const [showDiscordModal, setShowDiscordModal] = useState(false);
  const [showCommunityGardenModal, setShowCommunityGardenModal] =
    useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(useIsNewFarm());
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [menuLevel, setMenuLevel] = useState(MENU_LEVELS.ROOT);
  const [loadingOnRamp, setLoadingOnRamp] = useState(false);
  const { openModal } = useContext(ModalContext);

  const { user } = authService.state.context;
  const isFullUser = user.type === "FULL";

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
    setLoadingOnRamp(true);

    // Temporarily link to sequence when adding funds. Until Wyre is ready.
    if (authService.state.context.user.web3?.wallet === "SEQUENCE") {
      const network = CONFIG.NETWORK === "mainnet" ? "polygon" : "mumbai";

      const sequenceWallet = await sequence.initWallet(network);

      const intent: OpenWalletIntent = {
        type: "openWithOptions",
        options: SEQUENCE_CONNECT_OPTIONS,
      };

      const path = "wallet/add-funds";
      sequenceWallet.openWallet(path, intent);
    } else {
      window.open(
        "https://docs.sunflower-land.com/getting-started/web3-wallets#usdmatic",
        "_blank"
      );
    }

    // await onramp({
    //   token: authService.state.context.rawToken as string,
    //   transactionId: randomID(),
    // });

    onClose();

    // Wait for the closing animation to finish
    await new Promise((res) => setTimeout(res, 150));
    setLoadingOnRamp(false);
  };

  const handleAddSFL = () => {
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
          {loadingOnRamp && <Loading />}
          {!loadingOnRamp && (
            <ul className="list-none pt-1">
              {/* Root menu */}
              {menuLevel === MENU_LEVELS.ROOT && (
                <>
                  {CONFIG.NETWORK === "mumbai" && (
                    <>
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
                        <Button onClick={handleAddMatic}>
                          <span>Add Matic</span>
                        </Button>
                      </li>

                      <li className="p-1">
                        <Button onClick={handleAddSFL}>
                          <span>Add SFL</span>
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

              {/* Back button when not Root */}
              {menuLevel !== MENU_LEVELS.ROOT && (
                <li className="p-1">
                  <Button onClick={() => setMenuLevel(MENU_LEVELS.ROOT)}>
                    <img
                      src={SUNNYSIDE.icons.arrow_left}
                      className="w-4 mr-2"
                      alt="left"
                    />
                  </Button>
                </li>
              )}

              {/* Community menu */}
              {menuLevel === MENU_LEVELS.COMMUNITY && (
                <>
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
            </ul>
          )}
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

            <CloudFlareCaptcha
              onDone={onCaptchaSolved}
              onError={() => setShowCaptcha(false)}
              onExpire={() => setShowCaptcha(false)}
              action="sync"
            />
          </Panel>
        </Modal>
      )}
      <CommunityGardenModal
        isOpen={showCommunityGardenModal}
        onClose={() => setShowCommunityGardenModal(false)}
      />
    </>
  );
};
