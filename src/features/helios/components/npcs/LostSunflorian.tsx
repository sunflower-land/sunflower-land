import React, { useState } from "react";

import sunflorian from "assets/npcs/lost_sunflorian.gif";
import shadow from "assets/npcs/shadow.png";
import close from "assets/icons/close.png";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";

export const LostSunflorian: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <img
        src={shadow}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 14}px`,
          top: `${GRID_WIDTH_PX * 12.3}px`,
          left: `${GRID_WIDTH_PX * 17.35}px`,
        }}
      />
      <img
        src={sunflorian}
        onClick={() => setShowModal(true)}
        className="absolute cursor-pointer hover:img-highlight"
        style={{
          width: `${PIXEL_SCALE * 14}px`,
          top: `${GRID_WIDTH_PX * 11.5}px`,
          left: `${GRID_WIDTH_PX * 17.35}px`,
        }}
      />
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Panel
          bumpkinParts={{
            body: "Light Brown Farmer Potion",
            hair: "Buzz Cut",
            pants: "Fancy Pants",
            shirt: "Fancy Top",
            tool: "Farmer Pitchfork",
            background: "Farm Background",
            shoes: "Black Farmer Boots",
          }}
        >
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
          <div className="p-2">
            <p className="mb-4">My father sent me here to rule over Helios.</p>
            <p className="mb-4">
              {`Unfortunately, these Bumpkins don't like me watching them.`}
            </p>
            <p>{`I can't wait to return to Sunfloria.`}</p>
          </div>
        </Panel>
      </Modal>
    </>
  );
};
