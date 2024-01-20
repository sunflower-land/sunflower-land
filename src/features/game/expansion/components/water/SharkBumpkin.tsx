import React, { useContext, useEffect, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import fin from "assets/decorations/fin_sheet.png";
import bumpkin from "assets/npcs/shark.png";

import Spritesheet from "components/animation/SpriteAnimator";

import { MapPlacement } from "../MapPlacement";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { ZoomContext } from "components/ZoomProvider";
import { translate } from "lib/i18n/translate";

interface Props {
  x: number;
  y: number;
}

export const SharkBumpkin: React.FC<Props> = ({ x, y }) => {
  const { scale } = useContext(ZoomContext);
  const [showModal, setShowModal] = useState(false);
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
            src={SUNNYSIDE.icons.close}
            className="absolute cursor-pointer z-20"
            onClick={() => setShowModal(false)}
            style={{
              top: `${PIXEL_SCALE * 6}px`,
              right: `${PIXEL_SCALE * 6}px`,
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
          <div className="py-2 px-1">
            <p>{translate("sharkBumpkin.dialogue.shhhh")}</p>
            <p className="mt-2">
              {translate("sharkBumpkin.dialogue.scareGoblins")}
            </p>
          </div>
        </Panel>
      </Modal>
      <MapPlacement x={x} y={y} width={8}>
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
            zoomScale={scale}
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
