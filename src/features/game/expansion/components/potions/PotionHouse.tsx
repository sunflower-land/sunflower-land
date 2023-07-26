import React, { useState } from "react";

import { IntroPage } from "./Intro";
import { Experiment } from "./Experiment";
import { Modal } from "react-bootstrap";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelRoomBorderStyle } from "features/game/lib/style";
import { Rules } from "./Rules";
import {
  acknowledgePotionHouseIntro,
  getPotionHouseIntroRead,
} from "./lib/introStorage";

interface Props {
  onClose: () => void;
}

export const PotionHouse: React.FC<Props> = ({ onClose }) => {
  const [page, setPage] = useState<"intro" | "playing" | "rules">(
    getPotionHouseIntroRead() ? "playing" : "intro"
  );

  return (
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
              onClick={onClose}
              style={{
                width: `${PIXEL_SCALE * 11}px`,
              }}
            />
          </div>
          <div className="flex flex-col grow mb-1">
            {page === "intro" && (
              <IntroPage
                onClose={() => {
                  acknowledgePotionHouseIntro();
                  setPage("playing");
                }}
              />
            )}
            {page === "playing" && <Experiment onClose={onClose} />}
            {page === "rules" && <Rules onDone={() => setPage("playing")} />}
          </div>
        </div>
      </div>
    </Modal>
  );
};
