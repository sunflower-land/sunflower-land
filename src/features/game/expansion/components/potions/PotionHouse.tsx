import React, { useContext } from "react";

import * as AuthProvider from "features/auth/lib/Provider";
import { Context } from "features/game/GameProvider";

import { IntroPage } from "./Intro";
import { ResultPage } from "./Result";
import { Experiment } from "./Experiment";
import { Modal } from "react-bootstrap";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelRoomBorderStyle } from "features/game/lib/style";
import { useInterpret, useSelector } from "@xstate/react";
import {
  MachineInterpreter,
  MachineState as PotionHouseState,
  potionHouseMachine,
} from "./lib/potionHouseMachine";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { MachineState as GameMachineState } from "features/game/lib/gameMachine";
import { Rules } from "./Rules";
import classNames from "classnames";

const _farmId = (state: AuthMachineState) => state.context.user.farmId;
const _jwt = (state: AuthMachineState) => state.context.user.rawToken;

const _sessionId = (state: GameMachineState) => state.context.sessionId;
const _fingerprint = (state: GameMachineState) => state.context.fingerprint;
const _deviceTrackerId = (state: GameMachineState) =>
  state.context.deviceTrackerId;

const _isIntro = (state: PotionHouseState) => state.matches("intro");
const _isPlaying = (state: PotionHouseState) => state.matches("playing");
const _isRules = (state: PotionHouseState) => state.matches("rules");
const _isGameOver = (state: PotionHouseState) => state.matches("gameOVer");

export const PotionHouse: React.FC<{
  showModal: boolean;
  onClose: () => void;
}> = ({ showModal, onClose }) => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(Context);

  const farmId = useSelector(authService, _farmId);
  const jwt = useSelector(authService, _jwt);
  const sessionId = useSelector(gameService, _sessionId);
  const fingerprint = useSelector(gameService, _fingerprint);
  const deviceTrackerId = useSelector(gameService, _deviceTrackerId);

  const potionHouseService = useInterpret(potionHouseMachine, {
    context: {
      farmId,
      jwt,
      sessionId,
      fingerprint,
      deviceTrackerId,
    },
  }) as unknown as MachineInterpreter;

  const isIntro = useSelector(potionHouseService, _isIntro);
  const isPlaying = useSelector(potionHouseService, _isPlaying);
  const isRules = useSelector(potionHouseService, _isRules);
  const isGameOver = useSelector(potionHouseService, _isGameOver);

  const handleShowRules = () => {
    if (!isPlaying) return;

    potionHouseService.send({ type: "SHOW_RULES" });
  };

  return (
    <>
      <Modal show={showModal} centered onHide={onClose}>
        <div
          className="bg-brown-600 text-white relative"
          style={{
            ...pixelRoomBorderStyle,
            padding: `${PIXEL_SCALE * 1}px`,
          }}
        >
          <div id="cover" />
          <div className="p-1 flex relative flex-col h-full overflow-y-auto scrollable">
            {/* Header */}
            <div className="flex mb-3 w-full justify-center">
              <div
                onClick={handleShowRules}
                style={{
                  height: `${PIXEL_SCALE * 11}px`,
                  width: `${PIXEL_SCALE * 11}px`,
                }}
              >
                {isPlaying && (
                  <img
                    src={SUNNYSIDE.icons.expression_confused}
                    className="cursor-pointer h-full"
                  />
                )}
              </div>
              <h1 className="grow text-center text-lg">
                {isRules ? "How to play" : "Potion Room"}
              </h1>
              <img
                src={SUNNYSIDE.icons.close}
                className="cursor-pointer"
                onClick={onClose}
                style={{
                  width: `${PIXEL_SCALE * 11}px`,
                }}
              />
            </div>
            <div className="flex flex-col grow mb-1">
              {isIntro && <IntroPage machine={potionHouseService} />}
              {(isPlaying || isRules) && (
                <div
                  className={classNames({
                    hidden: isRules,
                    block: !isRules,
                  })}
                >
                  <Experiment machine={potionHouseService} />
                </div>
              )}
              {isRules && (
                <Rules
                  onDone={() =>
                    potionHouseService.send({ type: "CLOSE_RULES" })
                  }
                />
              )}
              {isGameOver && <ResultPage machine={potionHouseService} />}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
