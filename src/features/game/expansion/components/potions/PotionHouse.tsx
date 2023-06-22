import React, { useContext, useState } from "react";

import { Context } from "features/game/GameProvider";

import { IntroPage } from "./Intro";
import { Experiment } from "./Experiment";
import { Modal } from "react-bootstrap";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelRoomBorderStyle } from "features/game/lib/style";
import { MachineState as PotionHouseState } from "./lib/potionHouseMachine";
import { Rules } from "./Rules";
import { getPotionHouseIntroRead } from "./lib/introStorage";

const _isIntro = (state: PotionHouseState) => state.matches("intro");
const _isExperimenting = (state: PotionHouseState) =>
  !state.matches("intro") && !state.matches("finished");
const _isPlaying = (state: PotionHouseState) => state.matches("playing");
const _isRules = (state: PotionHouseState) => state.matches("rules");
const _isGameOver = (state: PotionHouseState) => state.matches("gameOVer");
const _isRevealing = (state: PotionHouseState) => state.matches("revealing");

export const PotionHouse: React.FC = () => {
  const { gameService } = useContext(Context);

  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState<"intro" | "playing" | "rules">(
    getPotionHouseIntroRead() ? "playing" : "intro"
  );

  if (!isOpen) {
    return <button onClick={() => setIsOpen(true)}>Potion House</button>;
  }

  return (
    <Modal show={isOpen} centered onHide={() => setIsOpen(false)}>
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
              onClick={() => setPage("rules")}
              style={{
                height: `${PIXEL_SCALE * 11}px`,
                width: `${PIXEL_SCALE * 11}px`,
              }}
            >
              {true && (
                <img
                  src={SUNNYSIDE.icons.expression_confused}
                  className="cursor-pointer h-full"
                />
              )}
            </div>
            <h1 className="grow text-center text-lg">
              {page === "rules" ? "How to play" : "Potion Room"}
            </h1>
            <img
              src={SUNNYSIDE.icons.close}
              className="cursor-pointer"
              onClick={() => setIsOpen(false)}
              style={{
                width: `${PIXEL_SCALE * 11}px`,
              }}
            />
          </div>
          <div className="flex flex-col grow mb-1">
            {page === "intro" && (
              <IntroPage onClose={() => setPage("playing")} />
            )}
            {page === "playing" && (
              <Experiment onClose={() => setIsOpen(false)} />
            )}
            {page === "rules" && <Rules onDone={() => setPage("playing")} />}
          </div>
        </div>
      </div>
    </Modal>
  );
};
