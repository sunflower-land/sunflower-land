import React, { useEffect, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import fin from "assets/decorations/fin_sheet.png";
import bumpkin from "assets/npcs/shark.png";
import close from "assets/icons/close.png";

import Spritesheet from "components/animation/SpriteAnimator";

import { MapPlacement } from "../MapPlacement";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";

export const LAND_WIDTH = 6;

interface Props {
  level: number;
}

export const SharkBumpkin: React.FC<Props> = ({ level }) => {
  const [showModal, setShowModal] = useState(false);
  // As the land gets bigger, push the water decorations out
  const offset = Math.floor(Math.sqrt(level)) * LAND_WIDTH;

  const [showFin, setShowFin] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowFin(true);
    }, 45 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width: `${24 * PIXEL_SCALE}px`,
      }}
    >
      <Modal show={showModal} centered onHide={() => setShowModal(false)}>
        <img className="absolute w-64 left-4 -top-44 -z-10" src={bumpkin} />

        <Panel>
          <img
            src={close}
            className="absolute cursor-pointer z-20"
            onClick={() => setShowModal(false)}
            style={{
              top: `${PIXEL_SCALE * 6}px`,
              right: `${PIXEL_SCALE * 6}px`,
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
          <div className="py-2 px-1">
            <p>Shhhh!</p>
            <p className="mt-2">{`I'm trying to scare the Goblins`}</p>
          </div>
        </Panel>
      </Modal>
      <MapPlacement x={-8} y={offset + 5} width={8}>
        {showFin && (
          <Spritesheet
            onClick={() => setShowModal(true)}
            className="relative hover:img-highlight cursor-pointer z-10 swimming"
            style={{
              imageRendering: "pixelated",
              width: `${PIXEL_SCALE * 13}px`,
            }}
            image={fin}
            widthFrame={13}
            heightFrame={11}
            fps={8}
            endAt={55}
            steps={55}
            direction={`forward`}
            autoplay={true}
            loop={true}
            onLoopComplete={(spritesheet) => {
              spritesheet.goToAndPause(0);

              setTimeout(() => setShowFin(false), 500);
            }}
          />
        )}
      </MapPlacement>
    </div>
  );
};
