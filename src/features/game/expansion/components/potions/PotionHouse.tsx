import React, { useEffect, useState } from "react";

import { IntroPage } from "./Intro";
import { ResultPage } from "./Result";
import { Experiment } from "./Experiment";
import { Modal } from "react-bootstrap";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelRoomBorderStyle } from "features/game/lib/style";

export const PotionHouse: React.FC = () => {
  const [page, setPage] = useState<"intro" | "game" | "result">("game");
  const [score, setScore] = useState(0);
  const [showModal, setShowModal] = useState(false);

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
              {page === "intro" && (
                <IntroPage onComplete={() => setPage("game")} />
              )}
              {page === "game" && (
                <Experiment
                  score={score}
                  onScoreChange={setScore}
                  onComplete={() => setPage("result")}
                />
              )}
              {page === "result" && <ResultPage score={score} />}
            </div>
          </div>
        </div>
        {/* <ExpandingRoom roomName="Potion Room"> */}
      </Modal>
    </>
  );
};
