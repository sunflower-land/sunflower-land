/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";

import { metamask } from "lib/blockchain/metamask";
import { removeSession } from "features/auth/actions/login";

import { MasterVolumeControls } from ".././types/settings";
import { useVolumeControls } from "features/hud/lib/volumeControls";
import { cacheSettings, getSettings } from "features/hud/lib/settings";

import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Modal } from "react-bootstrap";

import close from "assets/icons/close.png";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const Settings: React.FC<Props> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<MasterVolumeControls>(getSettings());
  // TODO: Add More Settings and refactor

  const [isResetConfOpen, setIsResetConfOpen] = useState(false);
  const [toggleAllSFX, toggleAllBgMusic] = useVolumeControls();

  const saveSettings = () => {
    cacheSettings(settings);
  };

  const handleToggleBgMusic = () => {
    settings.bgMusicMuted = !settings.bgMusicMuted;
    toggleAllBgMusic(settings.bgMusicMuted);
    saveSettings();
  };
  const handleToggleSFX = () => {
    settings.sfxMuted = !settings.sfxMuted;
    toggleAllSFX(settings.sfxMuted);
    saveSettings();
  };

  const address = metamask.myAccount as string;
  const handleResetSessionClick = () => {
    removeSession(address);
    window.location.reload();
  };

  const confirmResetSession = () => setIsResetConfOpen(true);

  useEffect(() => {
    saveSettings();
  }, [settings.bgMusicMuted, settings.sfxMuted]);

  return (
    <>
      <Modal show={isOpen} onHide={() => onClose()} centered>
        <Panel className="relative pt-0">
          <img
            src={close}
            className="h-6 cursor-pointer top-3 right-4 absolute"
            onClick={() => onClose()}
          />
          <div className="flex-col px-2">
            <div className="row mt-3 items-center">
              <div className="col-8">Background Music</div>
              <div className="col-4 flex justify-center items-center">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input form-check-input-md brown-400 bg-brown-200 cursor-pointer checked:bg-brown-400 checked:brown-200 checked:border-brown-400 focus:shadow-[0_0_0_0.25rem_rgb(231,168,115,0.5)] focus:border-brown-400 focus:brown-400 focus:bg-none"
                    style={{ width: "3.5rem", height: "1.75rem" }}
                    type="checkbox"
                    role="switch"
                    id="bgMusicSwitch"
                    value={1}
                    checked={settings.bgMusicMuted}
                    onChange={(evt) => handleToggleBgMusic()}
                  />
                </div>
              </div>
            </div>
            <div className="row mt-3 items-center">
              <div className="col-8">SFX</div>
              <div className="col-4 flex justify-center items-center">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input form-check-input-md brown-400 bg-brown-200 cursor-pointer checked:bg-brown-400 checked:brown-200 checked:border-brown-400 focus:shadow-[0_0_0_0.25rem_rgb(231,168,115,0.5)] focus:border-brown-400 focus:brown-400 focus:bg-none"
                    style={{ width: "3.5rem", height: "1.75rem" }}
                    type="checkbox"
                    role="switch"
                    id="sfxSwitch"
                    checked={settings.sfxMuted}
                    value={1}
                    onChange={(_evt) => handleToggleSFX()}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-3 mb-2">
              <Button
                className="text-sm w-auto px-1 mt-3"
                onClick={() => confirmResetSession()}
              >
                Reset Session
              </Button>
            </div>
          </div>
        </Panel>
      </Modal>
      <Modal
        centered
        show={isResetConfOpen}
        onHide={() => setIsResetConfOpen(false)}
      >
        <Panel className="md:w-4/5 m-auto">
          <div className="m-auto flex flex-col">
            <span className="text-sm text-center text-shadow">
              Are you sure you want to <br className="hidden md:block" />
              &quot;Reset&quot; the current session?
            </span>
            <span className="text-xs mx-1 text-shadow">
              Note: After reset, you will need to resign the request inorder to
              enter into the game.
            </span>
          </div>
          <div className="flex justify-content-around p-1">
            <Button
              className="text-xs"
              onClick={() => handleResetSessionClick()}
            >
              Yes
            </Button>
            <Button
              className="text-xs ml-2"
              onClick={() => setIsResetConfOpen(false)}
            >
              No
            </Button>
          </div>
        </Panel>
      </Modal>
    </>
  );
};
