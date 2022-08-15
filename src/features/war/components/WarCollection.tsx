import React, { useState } from "react";

import homeBase from "assets/buildings/recruiter_base.png";
import femaleGoblin from "assets/npcs/goblin_female.gif";
import femaleHuman from "assets/npcs/human_female.gif";
import maleHuman from "assets/npcs/idle.gif";
import maleGoblin from "assets/npcs/goblin.gif";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { WarCollectionOffer } from "./WarCollectionOffer";

export const WarCollection: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const side: "goblin" | "human" = "human";

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Panel>
          <WarCollectionOffer />
        </Panel>
      </Modal>
      <div
        className="absolute z-10"
        style={{
          left: `${GRID_WIDTH_PX * 51.57}px`,
          top: `${GRID_WIDTH_PX * 32.8}px`,
        }}
      >
        <img
          src={homeBase}
          style={{
            width: `${PIXEL_SCALE * 86}px`,
          }}
        />
        {side === "goblin" && (
          <>
            <img
              src={femaleGoblin}
              className="absolute left-20 -bottom-2 cursor-pointer hover:img-highlight"
              style={{
                width: `${PIXEL_SCALE * 16}px`,
              }}
            />
            <img
              src={maleGoblin}
              className="absolute right-12 -bottom-2 cursor-pointer hover:img-highlight"
              style={{
                width: `${PIXEL_SCALE * 16}px`,
                transform: "scaleX(-1)",
              }}
            />
          </>
        )}
        {side === "human" && (
          <>
            <img
              src={femaleHuman}
              className="absolute left-20 -bottom-2 cursor-pointer hover:img-highlight"
              style={{
                width: `${PIXEL_SCALE * 13}px`,
              }}
            />
            <img
              src={maleHuman}
              className="absolute right-12 -bottom-2 cursor-pointer hover:img-highlight"
              style={{
                width: `${PIXEL_SCALE * 13}px`,
                transform: "scaleX(-1)",
              }}
            />
          </>
        )}
      </div>
    </>
  );
};
