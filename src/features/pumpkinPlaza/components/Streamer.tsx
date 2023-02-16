import React, { useState } from "react";

import adam from "assets/npcs/adam.gif";
import shadow from "assets/npcs/shadow.png";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Modal } from "react-bootstrap";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";

export const Streamer: React.FC = () => {
  const [showModal, setShowModal] = useState(true);
  return (
    <>
      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel
          title={
            <div className="flex justify-center">
              <p>Meet the team</p>
              <img src={SUNNYSIDE.icons.expression_chat} className="h-6 ml-2" />
            </div>
          }
          onClose={() => setShowModal(false)}
        >
          <div className="flex flex-col items-center">
            <Label type="info" className="mb-2">
              Team is live!
            </Label>
            <Button className="w-60">Listen on Discord</Button>

            <p>Upcoming events</p>
            <div className="flex">
              <img src={SUNNYSIDE.icons.expression_chat} className="h-6 mr-2" />
              <div></div>
            </div>
          </div>
        </CloseButtonPanel>
      </Modal>
      <div
        className="absolute"
        style={{
          left: `${GRID_WIDTH_PX * 29}px`,
          top: `${GRID_WIDTH_PX * 36}px`,
          width: `${GRID_WIDTH_PX * 1}px`,
        }}
      >
        <img
          src={adam}
          className="cursor-pointer hover:img-highlight z-20 absolute"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: 0,
            left: 0,
          }}
        />
        <img
          src={shadow}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * -2}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
        />
        <img
          src={SUNNYSIDE.icons.expression_chat}
          className="absolute animate-float"
          style={{
            width: `${PIXEL_SCALE * 10}px`,
            bottom: `${PIXEL_SCALE * 20}px`,
            left: `${PIXEL_SCALE * 4}px`,
          }}
        />
      </div>
    </>
  );
};
