import React, { useContext, useEffect, useState } from "react";

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

const _farmId = (state: AuthMachineState) => state.context.user.farmId;
const _jwt = (state: AuthMachineState) => state.context.user.rawToken;

const _sessionId = (state: GameMachineState) => state.context.sessionId;
const _fingerprint = (state: GameMachineState) => state.context.fingerprint;
const _deviceTrackerId = (state: GameMachineState) =>
  state.context.deviceTrackerId;

const _isIntro = (state: PotionHouseState) => state.matches("intro");
const _isPlaying = (state: PotionHouseState) => state.matches("playing");
const _isGameOver = (state: PotionHouseState) => state.matches("gameOVer");

export const PotionHouse: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(Context);

  const farmId = useSelector(authService, _farmId);
  const jwt = useSelector(authService, _jwt);
  const sessionId = useSelector(gameService, _sessionId);
  const fingerprint = useSelector(gameService, _fingerprint);
  const deviceTrackerId = useSelector(gameService, _deviceTrackerId);

  const [showModal, setShowModal] = useState(false);

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
  const isGameOver = useSelector(potionHouseService, _isGameOver);

  useEffect(() => {
    setTimeout(() => {
      setShowModal(true);
    }, 1000);
  }, []);

  return (
    <>
      <Modal show={showModal} centered onHide={() => setShowModal(false)}>
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
                style={{
                  width: `${PIXEL_SCALE * 11}px`,
                  height: `${PIXEL_SCALE * 11}px`,
                }}
              />
              <h1 className="grow text-center text-lg">Potion Room</h1>
              <img
                src={SUNNYSIDE.icons.close}
                className="cursor-pointer"
                onClick={() => setShowModal(false)}
                style={{
                  width: `${PIXEL_SCALE * 11}px`,
                }}
              />
            </div>
            <div className="flex flex-col grow mb-1">
              {isIntro && <IntroPage machine={potionHouseService} />}
              {isPlaying && <Experiment machine={potionHouseService} />}
              {isGameOver && <ResultPage machine={potionHouseService} />}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
