/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useState } from "react";

import * as Auth from "features/auth/lib/Provider";

import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { reset } from "../actions/reset";

import { MasterVolumeControls } from "../types/settings";
import { useVolumeControls } from "features/hud/lib/volumeControls";
import { cacheSettings, getSettings } from "features/hud/lib/settings";

import alert from "assets/icons/expression_alerted.png";
import close from "assets/icons/close.png";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const Settings: React.FC<Props> = ({ isOpen, onClose }) => {
  // const [settings, setSettings] = useState<MasterVolumeControls>(getSettings());
  const settings: MasterVolumeControls = getSettings();
  // {TODO: Add More Settings and refactor for Generic props}

  const { authService } = useContext(Auth.Context);
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  // {Todo: Modify gameState and authMachine for Logout event}

  const [resetSessionConfirmation, setResetSessionConfirmation] =
    useState(false);

  const [toggleAllSFX] = useVolumeControls();

  const saveSettings = () => cacheSettings(settings);

  const handleToggleBgMusic = async () => {
    settings.bgMusicPaused = !settings.bgMusicPaused;
    saveSettings();
  };

  const handleToggleSFX = async () => {
    settings.sfxMuted = !settings.sfxMuted;
    saveSettings();
    // toggleAllSFX(settings.sfxMuted);
  };

  const onLogout = () => {
    onClose();
    authService.send("ACCOUNT_CHANGED"); // hack used to avoid redundancy
  };

  const onResetSession = () => setResetSessionConfirmation(true);

  const onConfirmResetSession = () => {
    onClose();
    gameService.send("RESET");
  };

  useEffect(() => {
    saveSettings();
  }, [settings.bgMusicPaused, settings.sfxMuted]);

  const Content = () => {
    return (
      <>
        <img
          src={close}
          className="h-6 cursor-pointer top-3 right-4 absolute"
          onClick={() => onClose()}
        />
        <div className="flex-col px-2 mt-3 py-2">
          <div className="row mt-3 items-center">
            <div className="col-8">Background Music</div>
            <div className="col-4 flex justify-center items-center">
              <div className="form-check form-switch">
                <input
                  className="form-check-input form-check-input-md brown-400 bg-brown-200 cursor-pointer checked:bg-brown-400 checked:brown-200 checked:border-brown-400 focus:shadow-[0_0_0_0.25rem_rgb(231,168,115,0.5)] focus:border-brown-400 focus:brown-400 focus:!bg-[url('data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'><circle r='3' fill='rgba%280, 0, 0, 0.25%29'/></svg>')]"
                  style={{ width: "3.5rem", height: "1.75rem" }}
                  type="checkbox"
                  role="switch"
                  id="bgMusicSwitch"
                  value={1}
                  checked={!settings.bgMusicPaused}
                  onChange={(_evt) => handleToggleBgMusic()}
                />
              </div>
            </div>
          </div>
          <div className="row mt-4 items-center">
            <div className="col-8">SFX</div>
            <div className="col-4 flex justify-center items-center">
              <div className="form-check form-switch">
                <input
                  className="form-check-input form-check-input-md brown-400 bg-brown-200 cursor-pointer checked:bg-brown-400 checked:brown-200 checked:border-brown-400 focus:shadow-[0_0_0_0.25rem_rgb(231,168,115,0.5)] focus:border-brown-400 focus:brown-400 focus:!bg-[url('data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'><circle r='3' fill='rgba%280, 0, 0, 0.25%29'/></svg>')]"
                  style={{ width: "3.5rem", height: "1.75rem" }}
                  type="checkbox"
                  role="switch"
                  id="sfxSwitch"
                  checked={!settings.sfxMuted}
                  value={1}
                  onChange={(_evt) => handleToggleSFX()}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col mt-3">
            <Button className="col p-1" onClick={onLogout}>
              Logout
            </Button>
            <Button className="col p-1 mt-2" onClick={onResetSession}>
              Reset Session
            </Button>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <Modal show={isOpen} onHide={() => onClose()} centered>
        <Panel className="relative py-0">{Content()}</Panel>
      </Modal>
      <Modal
        centered
        show={resetSessionConfirmation}
        onHide={() => setResetSessionConfirmation(false)}
      >
        <Panel className="md:w-4/5 m-auto">
          <div className="m-auto flex flex-col">
            <span className="text-sm text-center text-shadow">
              Are you sure to <br className="hidden md:block" />
              &quot;Reset&quot; the current session?
            </span>
            <div className="flex items-center border-2 rounded-md border-black p-2 mt-2 mb-2 bg-[#e43b44]">
              <img src={alert} alt="alert" className="mr-2 w-5 h-5/6" />
              <span className="text-xs">
                YOUR FARM WILL BE RESET TO THE LAST TIME YOU SYNCED ON CHAIN.
                YOU WILL LOSE ANY NON SYNCED PROGRESS.
              </span>
            </div>
          </div>
          <div className="flex justify-content-around p-1">
            <Button
              className="col m-1"
              onClick={() => setResetSessionConfirmation(false)}
            >
              No
            </Button>
            <Button className="col m-1" onClick={onConfirmResetSession}>
              Yes
            </Button>
          </div>
        </Panel>
      </Modal>
    </>
  );
};
