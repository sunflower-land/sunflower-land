import React, { useContext } from "react";

import { Context } from "features/game/GameProvider";

import { IntroPage } from "./Intro";
import { Experiment } from "./Experiment";
import { Modal } from "react-bootstrap";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelRoomBorderStyle } from "features/game/lib/style";
import { useActor, useSelector } from "@xstate/react";
import {
  MachineInterpreter,
  MachineState as PotionHouseState,
} from "./lib/potionHouseMachine";
import { Rules } from "./Rules";
import classNames from "classnames";

const _isIntro = (state: PotionHouseState) => state.matches("intro");
const _isExperimenting = (state: PotionHouseState) =>
  !state.matches("intro") && !state.matches("finished");
const _isPlaying = (state: PotionHouseState) => state.matches("playing");
const _isRules = (state: PotionHouseState) => state.matches("rules");
const _isGameOver = (state: PotionHouseState) => state.matches("gameOVer");
const _isRevealing = (state: PotionHouseState) => state.matches("revealing");

export const PotionHouse: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  if (gameState.matches("potionHouse.playing")) {
    return <PotionHousePlaying />;
  }

  if (gameState.matches("potionHouse.mixing")) {
    return <>Mixing</>;
  }

  return (
    <button onClick={() => gameService.send("OPEN_POTION_HOUSE")}>
      POTION HOUSE
    </button>
  );
};

const PotionHousePlaying: React.FC = () => {
  const { gameService } = useContext(Context);

  const potionHouseService = gameService.state.children[
    "potionHouse.playing"
  ] as MachineInterpreter;

  const isIntro = useSelector(potionHouseService, _isIntro);
  const isExperimenting = useSelector(potionHouseService, _isExperimenting);
  const isRules = useSelector(potionHouseService, _isRules);

  const showRulesButton = isExperimenting && !isRules;

  const onClose = () => {
    gameService.send("CLOSE_POTION_HOUSE");
  };

  return (
    <>
      <Modal show={true} centered onHide={onClose}>
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
                onClick={() => potionHouseService.send({ type: "SHOW_RULES" })}
                style={{
                  height: `${PIXEL_SCALE * 11}px`,
                  width: `${PIXEL_SCALE * 11}px`,
                }}
              >
                {showRulesButton && (
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
              {isExperimenting && (
                // Prevents an unmount/flash when rules are displayed.
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
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
